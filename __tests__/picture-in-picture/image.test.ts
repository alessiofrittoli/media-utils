/**
 * @vitest-environment jsdom
 */
// oxlint-disable typescript/unbound-method

import { createImageVideoStream as _createImageVideoStream, getFallbackImage } from '@/image'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { openImagePictureInPicture } from '@/picture-in-picture/image'
import { Url, type UrlInput } from '@alessiofrittoli/url-utils'
import { fetch as _fetch } from '@alessiofrittoli/fetcher'
import { Exception } from '@alessiofrittoli/exception'
import { ErrorCode } from '@/errors'

vi.mock('@alessiofrittoli/fetcher')

const fetch = _fetch as Mock<typeof _fetch>

vi.mock('@/picture-in-picture', () => ({
	requiresPictureInPictureAPI: vi.fn(),
}))

vi.mock('@/image', async importActual => ({
	...(await importActual()),
	createImageVideoStream: vi.fn(),
}))

const createImageVideoStream = _createImageVideoStream as Mock<typeof _createImageVideoStream>

describe('Image Picture-in-Picture', () => {
	describe('openImagePictureInPicture', () => {
		let mockVideo: HTMLVideoElement
		let mockRender: Mock
		let mockDestroy: Mock

		beforeEach(() => {
			mockVideo = document.createElement('video')
			mockDestroy = vi.fn()
			mockRender = vi.fn(({ video }) => ({ video }))

			mockVideo.requestPictureInPicture = vi.fn().mockResolvedValue({})
			mockVideo.addEventListener = vi.fn(mockVideo.addEventListener)

			createImageVideoStream.mockResolvedValue({
				video: mockVideo,
				render: mockRender,
				destroy: mockDestroy,
			})
		})

		it('opens image PiP from Blob', async () => {
			const media = new Blob(['test'], { type: 'image/png' })
			const result = await openImagePictureInPicture({ media })

			expect(createImageVideoStream).toHaveBeenCalled()
			expect(mockVideo.requestPictureInPicture).toHaveBeenCalled()
			expect(result.destroy).toBe(mockDestroy)
		})

		it('opens image PiP from HTMLImageElement', async () => {
			const media = document.createElement('img')
			const result = await openImagePictureInPicture({ media })

			expect(createImageVideoStream).toHaveBeenCalled()
			expect(mockVideo.requestPictureInPicture).toHaveBeenCalled()
			expect(result.destroy).toBe(mockDestroy)
		})

		it('fetch image from given URL and renders Blob in PiP', async () => {
			fetch.mockResolvedValueOnce({
				data: new Blob(['test'], { type: 'image/png' }),
				error: null,
				headers: {} as Headers,
				response: {} as Response,
			})

			const media: UrlInput = { pathname: 'path/to/image.png' }
			const result = await openImagePictureInPicture({ media })

			expect(fetch).toHaveBeenCalledWith(Url.format(media), { responseType: 'blob' })

			expect(createImageVideoStream).toHaveBeenCalled()
			expect(mockVideo.requestPictureInPicture).toHaveBeenCalled()
			expect(result.destroy).toBe(mockDestroy)
		})

		it('renders fallback image in PiP if fetch fails', async () => {
			fetch.mockResolvedValueOnce({
				data: null,
				error: new Exception({
					message: 'The given resource cannot be found in the target destination.',
					code: ErrorCode.NOT_FOUND,
				}),
				headers: {} as Headers,
				response: {} as Response,
			})
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementationOnce(() => {})

			const media: UrlInput = { pathname: 'path/to/image.png' }
			await openImagePictureInPicture({ media })

			expect(createImageVideoStream).toHaveBeenCalledWith({
				media: getFallbackImage(),
			})

			expect(createImageVideoStream).toHaveBeenCalled()
			expect(mockVideo.requestPictureInPicture).toHaveBeenCalled()

			consoleErrorSpy.mockRestore()
		})

		it('reuses createImageVideoStream resources', async () => {
			const result = await openImagePictureInPicture({
				media: new Blob(['test'], { type: 'image/png' }),
			})

			await openImagePictureInPicture({
				media: new Blob(['test'], { type: 'image/png' }),
				...result,
			})

			expect(createImageVideoStream).toHaveBeenCalledTimes(1)
		})

		it('calls onQuit callback when leaving PiP', async () => {
			const onQuit = vi.fn()
			await openImagePictureInPicture({ media: new Blob(), onQuit })

			const event = new Event('leavepictureinpicture')
			mockVideo.dispatchEvent(event)

			expect(mockDestroy).toHaveBeenCalled()
			expect(onQuit).toHaveBeenCalled()
		})

		it('register leavepictureinpicture event listener once', async () => {
			const media = new Blob(['test'], { type: 'image/png' })
			const media2 = new Blob(['test'], { type: 'image/png' })
			const result = await openImagePictureInPicture({ media })

			await openImagePictureInPicture({ media: media2, ...result })
			expect(mockVideo.addEventListener).toHaveBeenCalledTimes(1)
		})

		it("doesn't request PiP if video is already in PiP mode", async () => {
			const media = new Blob(['test'], { type: 'image/png' })
			const media2 = new Blob(['test'], { type: 'image/png' })
			const result = await openImagePictureInPicture({ media })

			// this test depends on `document.pictureInPictureElement` which doesn't get updated in vitest-jsdom environment
			Object.defineProperty(document, 'pictureInPictureElement', {
				configurable: true,
				value: mockVideo,
			})

			await openImagePictureInPicture({ media: media2, ...result })
			expect(mockVideo.requestPictureInPicture).toHaveBeenCalledTimes(1)

			Object.defineProperty(document, 'pictureInPictureElement', {
				configurable: true,
				value: undefined,
			})
		})
	})
})

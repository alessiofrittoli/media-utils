/**
 * @vitest-environment jsdom
 */
// oxlint-disable typescript/unbound-method

import { openVideoArtworkPictureInPicture } from '@/picture-in-picture/video'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { Url, type UrlInput } from '@alessiofrittoli/url-utils'

vi.mock('@/picture-in-picture', () => ({
	requiresPictureInPictureAPI: vi.fn(),
}))

describe('Video Picture-in-Picture', () => {
	describe('openVideoArtworkPictureInPicture', () => {
		let mockVideo: {
			src: string
			srcObject: null | MediaStream
			playsInline: boolean
			muted: boolean
			loop: boolean
			autoplay: boolean
			addEventListener: Mock
			setAttribute: Mock<HTMLVideoElement['setAttribute']>
			getAttribute: Mock<HTMLVideoElement['getAttribute']>
			removeAttribute: Mock<HTMLVideoElement['removeAttribute']>
			play: Mock<() => Promise<void>>
			requestPictureInPicture: Mock<HTMLVideoElement['requestPictureInPicture']>
		}

		class MockHTMLVideoElement {
			public addEventListener = mockVideo.addEventListener
			public src = mockVideo.src
			public srcObject = mockVideo.srcObject
			public playsInline = mockVideo.playsInline
			public muted = mockVideo.muted
			public loop = mockVideo.loop
			public autoplay = mockVideo.autoplay
			public setAttribute = mockVideo.setAttribute
			public getAttribute = mockVideo.getAttribute
			public removeAttribute = mockVideo.removeAttribute
			public play = mockVideo.play
			public requestPictureInPicture = mockVideo.requestPictureInPicture
		}

		beforeEach(() => {
			mockVideo = {
				src: '',
				srcObject: null,
				playsInline: false,
				muted: false,
				loop: false,
				autoplay: false,
				play: vi.fn().mockResolvedValue(undefined),
				addEventListener: vi.fn(),
				requestPictureInPicture: vi.fn(),
				setAttribute: vi.fn(function (attribute, value) {
					// @ts-expect-error idk
					this[attribute as keyof typeof this] = value
				}),
				getAttribute: vi.fn(function (attribute) {
					// @ts-expect-error idk
					return this[attribute as keyof typeof this]?.toString() || ''
				}),
				removeAttribute: vi.fn(function (attribute) {
					// @ts-expect-error idk
					delete this[attribute]
				}),
			}

			vi.stubGlobal('HTMLVideoElement', MockHTMLVideoElement)

			vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
				if (tagName === 'video') return new MockHTMLVideoElement()
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {} as any
			})
		})

		it('opens given video into a Picture-in-Picture window', async () => {
			const media = document.createElement('video')
			media.src = 'https://example.com/song-artwork-video.mp4'

			await openVideoArtworkPictureInPicture({ media })

			expect(mockVideo.requestPictureInPicture).toHaveBeenCalled()
		})

		it('configures video element with correct properties', async () => {
			const media = document.createElement('video')
			media.src = 'https://example.com/song-artwork-video.mp4'
			const { video } = await openVideoArtworkPictureInPicture({ media })

			expect(video.srcObject).toBeNull()
			expect(video.playsInline).toBe(true)
			expect(video.muted).toBe(true)
			expect(video.loop).toBe(true)
			expect(video.autoplay).toBe(true)
		})

		it('clears srcObject if set', async () => {
			const media = document.createElement('video')
			media.src = 'https://example.com/song-artwork-video.mp4'
			media.srcObject = {} as MediaStream
			const { video } = await openVideoArtworkPictureInPicture({ media })

			expect(video.srcObject).toBeNull()
		})

		it("doesn't request PiP if video is already in PiP mode", async () => {
			const media = document.createElement('video')
			media.src = 'https://example.com/song-artwork-video.mp4'
			const { video } = await openVideoArtworkPictureInPicture({ media })

			// this test depends on `document.pictureInPictureElement` which doesn't get updated in vitest-jsdom environment
			Object.defineProperty(document, 'pictureInPictureElement', {
				configurable: true,
				value: video,
			})

			media.src = 'https://example.com/song-artwork-video-2.mp4'

			await openVideoArtworkPictureInPicture({ media, video })

			expect(mockVideo.requestPictureInPicture).toHaveBeenCalledTimes(1)

			Object.defineProperty(document, 'pictureInPictureElement', {
				configurable: true,
				value: undefined,
			})
		})

		it('creates video element from URL input', async () => {
			const media: UrlInput = { pathname: '/song-artwork-video.mp4' }
			const { video } = await openVideoArtworkPictureInPicture({ media })

			expect(document.createElement).toHaveBeenCalledWith('video')
			expect(video.src).toBe(Url.format(media))
		})

		it('updates src only if new src is different', async () => {
			const media: UrlInput = { pathname: '/song-artwork-video.mp4' }
			const result = await openVideoArtworkPictureInPicture({ media })

			const { video } = await openVideoArtworkPictureInPicture({ media, ...result })

			expect(video.src).toBe(Url.format(media))
			expect(mockVideo.getAttribute).toHaveBeenCalledWith('src')
			expect(mockVideo.getAttribute).toHaveReturnedWith(video.src)
		})

		it('calls onQuit callback when leaving PiP', async () => {
			const onQuit = vi.fn()
			const media: UrlInput = { pathname: '/song-artwork-video.mp4' }

			mockVideo.addEventListener.mockImplementationOnce((event, listener) => {
				listener(new Event('leavepictureinpicture'))
			})

			await openVideoArtworkPictureInPicture({ media, onQuit })

			expect(onQuit).toHaveBeenCalled()
		})

		it('register leavepictureinpicture event listener once', async () => {
			const onQuit = vi.fn()
			const media: UrlInput = { pathname: '/song-artwork-video.mp4' }

			const result = await openVideoArtworkPictureInPicture({ media, onQuit })
			await openVideoArtworkPictureInPicture({ media, onQuit, ...result })

			expect(mockVideo.addEventListener).toHaveBeenCalledTimes(1)
		})
	})
})

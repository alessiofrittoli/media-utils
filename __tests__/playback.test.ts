import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { playMedia, pauseMedia, type PlayMediaOptions } from '@/playback'
import { updateMediaMetadataAndPosition } from '@/media-session'
import { fadeVolume as _fadeVolume } from '@/audio/utils'
import { easing } from '@alessiofrittoli/math-utils'
import { AudioEngine } from '@/audio'

vi.mock('@/media-session')
vi.mock('@/audio/utils', () => ({
	fadeVolume: vi.fn(),
}))

const fadeVolume = _fadeVolume as Mock<typeof _fadeVolume>

type MockMedia = {
	volume: number
	play: Mock
	pause: Mock
	error?: MediaError
}

describe('playback', () => {
	let media: HTMLMediaElement
	let mockError: MediaError | undefined

	const playMediaOptions: PlayMediaOptions = {
		volume: 0.8,
		data: { type: 'audio/aac' },
	} as unknown as PlayMediaOptions

	const mockMedia: MockMedia = {
		volume: 1,
		play: vi.fn().mockResolvedValue(undefined),
		pause: vi.fn(),
		error: mockError,
	}

	beforeEach(() => {
		media = mockMedia as unknown as HTMLMediaElement

		playMediaOptions.media = media

		mockError = {
			code: 4,
			message: 'Test error',
		} as MediaError
	})

	afterEach(() => {
		vi.clearAllMocks()
		mockMedia.error = undefined
	})

	describe('playMedia', () => {
		it('set volume to AudioEngine.MinVolume before playing', async () => {
			const playPromise = playMedia(playMediaOptions)
			expect(mockMedia.volume).toBe(AudioEngine.MinVolume)

			await playPromise
		})

		it('calls media.play()', async () => {
			const playPromise = playMedia(playMediaOptions)
			expect(mockMedia.play).toHaveBeenCalledTimes(1)

			await playPromise
		})

		it('updates media metadata and position on successful play', async () => {
			await playMedia(playMediaOptions)

			const { media, data } = playMediaOptions

			expect(updateMediaMetadataAndPosition).toHaveBeenCalledWith({ media, data })
		})

		it('fades volume to target value', async () => {
			await playMedia({ ...playMediaOptions, fade: 1000 })

			expect(fadeVolume).toHaveBeenCalledWith(
				mockMedia,
				expect.objectContaining({
					to: 0.8,
					duration: 1000,
					easing: easing.easeOutSine,
				}),
			)
		})

		it('uses custom easing if provided', async () => {
			await playMedia({ ...playMediaOptions, easing: easing.linear })

			expect(fadeVolume).toHaveBeenCalledWith(
				mockMedia,
				expect.objectContaining({
					easing: easing.linear,
				}),
			)
		})

		it('calls onError callback when play fails and media.error exists', async () => {
			const onError = vi.fn()
			mockMedia.error = mockError

			mockMedia.play.mockRejectedValue(new Error('Play failed'))

			await playMedia({ ...playMediaOptions, easing: easing.linear, onError })

			expect(onError).toHaveBeenCalledWith(mockError)
			expect(media.volume).toBe(1)
		})

		it('logs media.error to console when no onError callback provided', async () => {
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			mockMedia.error = mockError
			mockMedia.play.mockRejectedValue(new Error('Play failed'))

			await playMedia(playMediaOptions)

			expect(consoleSpy).toHaveBeenCalledWith(mockError)
			consoleSpy.mockRestore()
		})

		it('logs generic error to console', async () => {
			const error = new Error('Play failed')
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			mockMedia.play.mockRejectedValue(error)

			await playMedia(playMediaOptions)

			expect(consoleSpy).toHaveBeenCalledWith(error)
			consoleSpy.mockRestore()
		})
	})

	describe('pauseMedia', () => {
		it('fades volume to AudioEngine.MinVolume', () => {
			pauseMedia({ ...playMediaOptions, fade: 1000 })

			expect(fadeVolume).toHaveBeenCalledWith(
				mockMedia,
				expect.objectContaining({
					to: AudioEngine.MinVolume,
					duration: 1000,
				}),
			)
		})

		it('pauses media after fade completes', () => {
			pauseMedia(playMediaOptions)

			const [, options] = fadeVolume.mock.calls[0] || []
			options?.onEnd?.(0)

			expect(mockMedia.pause).toHaveBeenCalledTimes(1)
		})

		it('calls custom onEnd callback if provided', () => {
			const onEnd = vi.fn()

			pauseMedia({ ...playMediaOptions, onEnd })

			const [, options] = fadeVolume.mock.calls[0] || []
			options?.onEnd?.(0)

			expect(onEnd).toHaveBeenCalledWith(0)
		})

		it('uses custom easing if provided', async () => {
			pauseMedia({ ...playMediaOptions, easing: easing.linear })

			expect(fadeVolume).toHaveBeenCalledWith(
				mockMedia,
				expect.objectContaining({
					easing: easing.linear,
				}),
			)
		})
	})
})

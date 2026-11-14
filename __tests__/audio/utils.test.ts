import { getConnection as _getConnection, type Connection } from '@alessiofrittoli/web-utils'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import type { AudioEngine, FadeVolumeOptions } from '@/audio/engine'
import { getEngine as _getEngine } from '@/audio'
import { getPreloadStrategy } from '@/utils'
import { fadeVolume } from '@/audio/utils'

vi.mock('@/audio')
vi.mock('@alessiofrittoli/web-utils')

const getEngine = _getEngine as Mock<typeof _getEngine>
const getConnection = _getConnection as Mock<typeof _getConnection>

describe('Media utils', () => {
	describe('fadeVolume', () => {
		let mockMedia: HTMLMediaElement
		let mockFade: Mock

		beforeEach(() => {
			mockMedia = {} as HTMLMediaElement
			mockFade = vi.fn()

			getEngine.mockReturnValue({
				fade: mockFade,
			} as unknown as AudioEngine)
		})

		it('calls getEngine with the media element', () => {
			const options: FadeVolumeOptions = { to: 0, duration: 1000 }

			fadeVolume(mockMedia, options)

			expect(getEngine).toHaveBeenCalledWith(mockMedia)
			expect(getEngine).toHaveBeenCalledTimes(1)
		})

		it('calls fade method with provided options', () => {
			const options: FadeVolumeOptions = { to: 0, duration: 1000 }

			fadeVolume(mockMedia, options)

			expect(mockFade).toHaveBeenCalledWith(options)
			expect(mockFade).toHaveBeenCalledTimes(1)
		})
	})

	describe('getPreloadStrategy', () => {
		it('returns "auto" when network connection is unavailable', () => {
			getConnection.mockReturnValue({} as Connection)

			expect(getPreloadStrategy()).toBe('auto')
		})

		it('returns "none" when data saver mode is enabled', () => {
			getConnection.mockReturnValue({
				network: { saveData: true, effectiveType: '4g' },
			} as Connection)

			expect(getPreloadStrategy()).toBe('none')
		})

		it('returns "metadata" for slow-2g connection', () => {
			getConnection.mockReturnValue({
				network: { saveData: false, effectiveType: 'slow-2g' },
			} as Connection)

			expect(getPreloadStrategy()).toBe('metadata')
		})

		it('returns "metadata" for 2g connection', () => {
			getConnection.mockReturnValue({
				network: { saveData: false, effectiveType: '2g' },
			} as Connection)

			expect(getPreloadStrategy()).toBe('metadata')
		})

		it('returns "auto" for 3g connection', () => {
			getConnection.mockReturnValue({
				network: { saveData: false, effectiveType: '3g' },
			} as Connection)

			expect(getPreloadStrategy()).toBe('auto')
		})

		it('returns "auto" for 4g connection', () => {
			getConnection.mockReturnValue({
				network: { saveData: false, effectiveType: '4g' },
			} as Connection)

			expect(getPreloadStrategy()).toBe('auto')
		})
	})
})

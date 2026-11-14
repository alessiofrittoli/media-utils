import type { FadeVolumeOptions } from '@/audio/engine'
import { getEngine } from '@/audio'

/**
 * Fade media volume.
 *
 * @param media The HTMLMediaElement.
 * @param options An object defining customization and callbacks. See {@link FadeVolumeOptions} for more info.
 */
export const fadeVolume = (media: HTMLMediaElement, options: FadeVolumeOptions): void =>
	getEngine(media).fade(options)

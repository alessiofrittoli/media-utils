import { getEngine } from '@/audio'
import type { FadeVolumeOptions } from '@/audio/engine'


/**
 * Fade media volume.
 * 
 * @param media The HTMLMediaElement.
 * @param options An object defining customization and callbacks. See {@link FadeVolumeOptions} for more info.
 */
export const fadeVolume = ( media: HTMLMediaElement, options: FadeVolumeOptions ) => (
	getEngine( media ).fade( options )
)
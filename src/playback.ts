import { easing as ease } from '@alessiofrittoli/math-utils'
import {
	updateMediaMetadataAndPosition,
	type UpdateMediaMetadataAndPositionOptions
} from '@/media-session'

import { fadeVolume } from '@/audio/utils'
import { AudioEngine, type FadeVolumeOptions } from '@/audio'


/**
 * An object defining play options and callbacks.
 * 
 */
export interface PlayMediaOptions extends UpdateMediaMetadataAndPositionOptions, Omit<FadeVolumeOptions, 'to' | 'duration'>
{
	/**
	 * Defines the final volume to set [0-1].
	 * 
	 */
	volume: number
	/**
	 * A custom volume fade duration in milliseconds.
	 * 
	 * @default 200
	 */
	fade?: number
	/**
	 * A custom callback executed when an error occurs when playing a media.
	 * 
	 * @param error The `MediaError` interface representing the occured error.
	 */
	onError?: ( error: MediaError ) => void
}


/**
 * An object defining pause options and callbacks.
 * 
 */
export type PauseMediaOptions = Omit<PlayMediaOptions, 'data' | 'volume' | 'onError'>


/**
 * Play the given media.
 * 
 * @param options An object defining play options and callbacks. See {@link PlayMediaOptions} for more info.
 */
export const playMedia = ( options: PlayMediaOptions ) => {
	const {
		media, data, volume, fade,
		easing = ease.easeOutSine, onError, ...rest
	} = options

	// use `AudioEngine.minVolume` to ensure browser `MediaSession` keeps running.
	media.volume = AudioEngine.MinVolume

	return (
		media.play()
			.then( () => {
				updateMediaMetadataAndPosition( { media, data } )
				fadeVolume( media, {
					to		: volume,
					duration: fade,
					easing, ...rest,
				} )
			} )
			.catch( err => {
				media.volume = 1

				if ( onError && media.error ) {
					return onError( media.error )
				}
				console.error( media.error || err )
			} )
	)
}


/**
 * Pause the given media.
 * 
 * @param options An object defining pause options and callbacks. See {@link PauseMediaOptions} for more info.
 */
export const pauseMedia = ( options: PauseMediaOptions ) => {
	
	const {
		media, fade, easing = ease.easeOutSine, onEnd, ...rest
	} = options

	fadeVolume( media, {
		// use `AudioEngine.minVolume` to ensure browser `MediaSession` keeps running.
		to: AudioEngine.MinVolume,
		duration: fade,
		easing,
		...rest,
		onEnd( value ) {
			media.pause()
			onEnd?.( value )
		}
	} )

}
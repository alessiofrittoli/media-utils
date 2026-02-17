import { clamp, Tween, type TweenOptions } from '@alessiofrittoli/math-utils'

export interface FadeVolumeOptions extends Omit<TweenOptions, 'from' | 'strategy' | 'onTick'>, Pick<Partial<TweenOptions>, 'onTick'>
{
	/**
	 * Defines the final volume to set [0-1].
	 * 
	 */
	to: number
}

/**
 * Manages volume manipulation for HTML media elements.
 * 
 * Provides methods for fading volume with customizable tweening, and utilities for converting
 * between normalized volume values (0.0-1.0) and linear gain values using decibel-based calculations
 * that better match human perception of audio loudness.
 * 
 * @example
 * ```ts
 * const audio  = new Audio( ... )
 * const engine = new AudioEngine( audio )
 * 
 * audio.volume = 0
 * audio.play()
 *  .then( () => {
 *    // Fade volume to 0.5 over 2 seconds
 *    engine.fade( {
 *      to         : AudioEngine.normalize( 0.5 ),
 *      duration   : 2000,
 *    } )
 *  } )
 * ```
 */
export class AudioEngine
{
	/**
	 * The `HTMLMediaElement` associated with current `AudioEngine`.
	 * 
	 */
	private media: HTMLMediaElement
	/**
	 * The `Tween` instance associated with current `AudioEngine`.
	 * 
	 */
	private tween: Tween
	

	constructor( media: HTMLMediaElement )
	{
		this.media	= media
		this.tween	= new Tween()
	}


	/**
	 * Fade media volume.
	 * 
	 * @param options An object defining customization and callbacks. See {@link FadeVolumeOptions} for more info.
	 */
	fade( options: FadeVolumeOptions )
	{
		const { onTick, ...rest } = options

		this.tween.to( options.to, {
			...rest,
			from	: this.media.volume,
			strategy: 'timer',
			onTick	: value => {
				const safeValue		= clamp( Math.abs( value ), 0, 1 )
				this.media.volume	= safeValue
				onTick?.( safeValue )
			},
		} )
		
	}

	
	/**
	 * Converts a volume value (0.0 to 1.0) to a linear gain value.
	 * 
	 * The returned value will better match the human perceived volume.
	 *
	 * The conversion maps the input volume to a decibel (dB) range from -60 dB (minimum) to 0 dB (maximum),
	 * then converts the dB value to a linear gain using the formula: gain = 10^(dB/20).
	 * If the resulting gain is less than or equal to 0.001, the function returns 0 to effectively mute the output.
	 *
	 * @param volume The volume value, where 0 represents silence and 1 represents maximum volume.
	 * @returns The corresponding linear gain value, or 0 if the gain is effectively inaudible.
	 */
	static VolumeToGain( volume: number )
	{
		const minDb	= -60
		const maxDb	= 0
		const db	= minDb + ( maxDb - minDb ) * volume
		
		const newVolume = clamp( Math.pow( 10, db / 20 ), 0, 1 )
		
		if ( newVolume <= 0.001 || isNaN( newVolume ) ) return 0

		return newVolume
	}
	
	
	/**
	 * Converts a linear gain value to a normalized volume value between 0 and 1.
	 *
	 * The conversion maps the gain (linear scale) to decibels (dB) using the formula:
	 *   dB = 20 * log10(gain)
	 * Then, it normalizes the dB value between a minimum of -60 dB and a maximum of 0 dB.
	 *
	 * @param gain The linear gain value to convert.
	 * @returns The normalized volume value in the range [0, 1].
	 */
	static GainToVolume( gain: number )
	{
		const minDb	= -60
		const maxDb	= 0
		const db	= 20 * Math.log10( gain )

		const newVolume = clamp( ( db - minDb ) / ( maxDb - minDb ), 0, 1 )
		
		if ( isNaN( newVolume ) ) return 0

		return newVolume
	}


	/**
	 * Normalize volume using {@link AudioEngine.VolumeToGain}.
	 *
	 * @param volume	The volume value, where 0 represents silence and 1 represents maximum volume.
	 * @param normalize	(Optional) Indicates whether to apply normalization. If `false` is given, the un-modified `volume` value is returned. Default: `true`.
	 * 
	 * @returns The normalized volume (gain) if `normalize` is set to `true`.
	 */
	static normalize( volume: number, normalize: boolean = true )
	{
		return (
			normalize
				? AudioEngine.VolumeToGain( volume )
				: volume
		)
	}
	
	
	/**
	 * Denormalize volume using {@link AudioEngine.GainToVolume}.
	 *
	 * @param volume	The volume value.
	 * @param normalize	(Optional) Indicates whether normalization has been applied to the given `volume`. If `false` is given, the un-modified `volume` value is returned. Default: `true`.
	 * 
	 * @returns The denormalized volume if `normalize` is set to `true`.
	 */
	static denormalize( volume: number, normalize: boolean = true )
	{
		return (
			normalize
				? AudioEngine.GainToVolume( volume )
				: volume
		)
	}
}
import { padStart } from '@alessiofrittoli/math-utils'
import { secondsToUnit } from '@alessiofrittoli/date-utils'
import { getConnection } from '@alessiofrittoli/web-utils'


/**
 * Formats a time value in seconds into a human-readable media timing string (M:SS or H:MM:SS).
 * 
 * @param	time		The time value in seconds to format.
 * @param	showHours	(Optional) Whether to include hours in the formatted output. Default: `false`.
 * 
 * @returns A formatted time string in the format "M:SS" or "H:MM:SS" if `showHours` is `true`.
 * If the time is 0 or invalid, returns "0:00".
 * 
 * @example
 * ```ts
 * formatMediaTiming( 125 )         // Returns "2:05"
 * formatMediaTiming( 15600, true ) // Returns "4:20:00"
 * formatMediaTiming( 0 )           // Returns "0:00"
 * ```
 */
export const formatMediaTiming = ( time: number, showHours = false ) => {

	const units = secondsToUnit( time, true )

	return [
		showHours && ( units.hours || '0' ),
		padStart( units.minutes || 0, ! showHours ? 1 : 2 ),
		padStart( units.seconds || 0, 2 ),
	].filter( Boolean ).join( ':' )
	
}


/**
 * Determines the optimal preload strategy for media elements based on network conditions.
 * 
 * @returns The recommended preload attribute value ('none', 'metadata', or 'auto') based on:
 * - Returns 'auto' if network connection information is unavailable
 * - Returns 'none' if data saver mode is enabled
 * - Returns 'metadata' for slow-2g or 2g connections
 * - Returns 'auto' for faster connections (3g, 4g, etc.)
 * 
 * @example
 * ```ts
 * const videoElement   = document.createElement( 'video' )
 * videoElement.src     = 'video.mp4'
 * videoElement.preload = getPreloadStrategy()
 * ```
 */
export const getPreloadStrategy = (): HTMLMediaElement[ 'preload' ] => {

	const connection = getConnection().network

	if ( ! connection ) return 'auto'

	if ( connection.saveData ) return 'none'

	if (
		connection.effectiveType === 'slow-2g' || 
		connection.effectiveType === '2g'
	) return 'metadata'

	return 'auto'

}
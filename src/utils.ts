import { padStart } from '@alessiofrittoli/math-utils'
import { secondsToUnit } from '@alessiofrittoli/date-utils'

/**
 * Formats a time value in seconds into a human-readable media timing string (MM:SS or HH:MM:SS).
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
	].filter( Boolean ).join( ':' ) || '0:00'
	
}
import { Exception } from '@alessiofrittoli/exception'
import { ErrorCode } from '@/errors'

export * from '@/picture-in-picture/image'
export * from '@/picture-in-picture/video'


/**
 * Defines common configuration options for opening the media in Picture-in-Picture mode.
 * 
 */
export interface OpenPictureInPictureCommonOptions
{
	/**
	 * A callback to execute when Picture-in-Picture window is closed.
	 * 
	 */
	onQuit?: () => void
}


/**
 * Checks if the Picture-in-Picture API is supported by the current browser.
 * 
 * @returns `true` if Picture-in-Picture is enabled and supported, `false` otherwise.
 */
export const isPictureInPictureSupported = () => !! document.pictureInPictureEnabled


/**
 * Validates that the Picture-in-Picture API is supported in the current browser.
 * 
 * @throws {Exception} Throws a new Exception if the Picture-in-Picture API is not supported.
 */
export const requiresPictureInPictureAPI = () => {
	if ( ! isPictureInPictureSupported() ) {
		throw new Exception( 'The Picture-in-Picture API is not supported in the current browser.', { code: ErrorCode.PIP_NOT_SUPPORTED } )
	}
}
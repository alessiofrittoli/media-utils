import { Url } from '@alessiofrittoli/url-utils'
import { Exception } from '@alessiofrittoli/exception'

import { ErrorCode } from '@/errors'
import { MediaArtWork } from '@/media-session'
import type { CreateImageVideoStreamOptions } from '@/image'
import {
	openImagePictureInPicture,
	type OpenImagePictureInPictureOptions,
	type OpenImagePictureInPicture,
} from '@/picture-in-picture/image'
import {
	openVideoArtworkPictureInPicture,
	type OpenVideoArtworkPictureInPicture,
	type OpenVideoArtworkPictureInPictureOptions,
} from '@/picture-in-picture/video'

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


/**
 * Defines configuration options for opening media artwork in Picture-in-Picture window.
 * 
 */
export interface OpenArtworkPictureInPictureOptions
	extends Omit<OpenImagePictureInPictureOptions, 'media'>,
	Omit<OpenVideoArtworkPictureInPictureOptions, 'media'>
{
	/**
	 * The media to open in a Picture-in-Picture window.
	 * 
	 */
	media?: CreateImageVideoStreamOptions[ 'media' ] | HTMLVideoElement | MediaArtWork
}


/**
 * Defines the returned result of opening a media artwork into a Picture-in-Picture window.
 * 
 */
export type OpenArtworkPictureInPicture = (
	& Partial<OpenImagePictureInPicture>
	& Partial<OpenVideoArtworkPictureInPicture>
)


/**
 * Opens the given media in Picture-in-Picture window.
 * 
 * @param options Configuration options for opening the media in PiP window.
 * 	See {@link OpenArtworkPictureInPictureOptions} for more info.
 * 
 * @returns A new Promise that resolves to the Picture-in-Picture result.
 * 	See {@link OpenArtworkPictureInPicture} for more info.
 */
export const openArtworkPictureInPicture = (
	options: OpenArtworkPictureInPictureOptions
): Promise<OpenArtworkPictureInPicture> => {

	requiresPictureInPictureAPI()

	const fallbackArtwork = navigator.mediaSession.metadata?.artwork.at( -1 )

	const {
		media: rawArtwork, ...rest
	} = options

	const isImage	= rawArtwork instanceof HTMLImageElement || rawArtwork instanceof Blob
	const isVideo	= rawArtwork instanceof HTMLVideoElement
	const isUrl		= ! isImage && ! isVideo

	if ( isImage ) {
		return openImagePictureInPicture( { media: rawArtwork, ...rest } )
	}

	if ( isVideo ) {
		return openVideoArtworkPictureInPicture( { media: rawArtwork, ...rest } )
	}

	const artworkUrlObj	= isUrl ? ( rawArtwork || fallbackArtwork ) : undefined
	const artworkUrl	= artworkUrlObj ? Url.format( artworkUrlObj?.src ) : undefined

	
	if ( ! artworkUrlObj || ! artworkUrl ) {
		throw new Exception(
			'No artwork available to render in a Picture-in-Picture window.', {
				code: ErrorCode.NO_ARTWORK_AVAILABLE,
			}
		)
	}

	if ( artworkUrlObj.type?.includes( 'image' ) ) {	
		return openImagePictureInPicture( { media: artworkUrl, ...rest } )
	}
	
	return openVideoArtworkPictureInPicture( { media: artworkUrl, ...rest } )

}
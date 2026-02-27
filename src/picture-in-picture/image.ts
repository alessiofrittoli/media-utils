import { Url, type UrlInput } from '@alessiofrittoli/url-utils'
import { fetch } from '@alessiofrittoli/fetcher/fetch'
import {
	getFallbackImage,
	createImageVideoStream,
	type CreateImageVideoStreamOptions,
	type CreateImageVideoStream,
} from '@/image'
import {
	requiresPictureInPictureAPI,
	type OpenPictureInPictureCommonOptions
} from '@/picture-in-picture'


/**
 * Defines configuration options for opening the image in Picture-in-Picture mode.
 * 
 */
export interface OpenImagePictureInPictureOptions
	extends OpenPictureInPictureCommonOptions, Omit<CreateImageVideoStreamOptions, 'media'>, Partial<CreateImageVideoStream>
{
	/**
	 * The media to render in a Picture-in-Picture window.
	 * 
	 */
	media: CreateImageVideoStreamOptions[ 'media' ] | UrlInput
}


/**
 * Defines the returned result of opening a rendered image into a video Picture-in-Picture window.
 * 
 */
export type OpenImagePictureInPicture = CreateImageVideoStream


/**
 * Opens an image in Picture-in-Picture window.
 * 
 * @param options Configuration options for opening the image in PiP window.
 * 	See {@link OpenImagePictureInPictureOptions} for more info.
 * 
 * @returns A new Promise that resolves to the Picture-in-Picture result containing the video element and destroy function.
 * 	See {@link OpenImagePictureInPicture} for more info.
 * 
 * @throws {Exception} Throws a new Exception if the Picture-in-Picture API is not supported.
 */
export const openImagePictureInPicture = async (
	options: OpenImagePictureInPictureOptions
): Promise<OpenImagePictureInPicture> => {

	requiresPictureInPictureAPI()

	const {
		media, video, render, destroy: initialDestroy, onQuit, ...rest
	} = options

	const isBlob = media instanceof Blob
	const isNode = media instanceof HTMLImageElement

	if ( ! isBlob && ! isNode ) {		
		const { data, error } = await fetch<Blob>( Url.format( media ), { responseType: 'blob' } )

		if ( error ) {
			console.error( error )
			return openImagePictureInPicture( { ...options, video, media: getFallbackImage() } )
		}

		return openImagePictureInPicture( { ...options, video, media: data } )
	}

	let result: CreateImageVideoStream

	if ( render && initialDestroy ) {

		result = {
			render, destroy: initialDestroy,
			...( await render( { media, video, ...rest } ) ),
		}

	} else {
		
		result = await createImageVideoStream( {
			media, video, ...rest
		} )

	}

	const { video: currentVideo, destroy } = result

	if ( document.pictureInPictureElement !== currentVideo ) {
		await currentVideo.requestPictureInPicture()
	}

	const hasListener = currentVideo.getAttribute( 'image-pip-quit-listener' ) === 'true'

	if ( ! hasListener ) {

		currentVideo.setAttribute( 'image-pip-quit-listener', 'true' )
		currentVideo.addEventListener( 'leavepictureinpicture', () => {

			currentVideo.removeAttribute( 'image-pip-quit-listener' )
			destroy()
			onQuit?.()
	
		}, { once: true } )

	}

	return result

}
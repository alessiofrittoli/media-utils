import { Url, type UrlInput } from '@alessiofrittoli/url-utils'
import { fetch } from '@alessiofrittoli/fetcher/fetch'
import {
	createImageVideoStream, getFallbackImage,
	type CreateImageVideoStream, type CreateImageVideoStreamOptions
} from '@/image'
import {
	requiresPictureInPictureAPI,
	type OpenPictureInPictureCommonOptions
} from '@/picture-in-picture'


/**
 * Defines configuration options for opening the image in Picture-in-Picture mode.
 * 
 */
export interface OpenImagePictureInPictureOptions extends OpenPictureInPictureCommonOptions, Omit<CreateImageVideoStreamOptions, 'media'>
{
	/**
	 * The media to render.
	 * 
	 */
	media: CreateImageVideoStreamOptions[ 'media' ] | UrlInput
}


/**
 * Defines the returned result of opening a rendered image into a video Picture-in-Picture.
 * 
 */
export type OpenImagePictureInPicture = CreateImageVideoStream


/**
 * Opens an image in Picture-in-Picture mode.
 * 
 * @param options Configuration options for opening the image in PiP mode. See {@link OpenImagePictureInPictureOptions} for more info.
 * 
 * @returns A new Promise that resolves to the Picture-in-Picture result containing the video element and destroy function.
 */
export const openImagePictureInPicture = async (
	options: OpenImagePictureInPictureOptions
): Promise<OpenImagePictureInPicture> => {

	requiresPictureInPictureAPI()

	const { media, video: prevVideo, onQuit, ...rest } = options
	
	const isBlob = media instanceof Blob
	const isNode = media instanceof HTMLImageElement

	if ( ! isBlob && ! isNode ) {		
		const { data, error } = await fetch<Blob>( Url.format( media ), { responseType: 'blob' } )

		if ( error ) {
			console.error( error )
			return openImagePictureInPicture( { ...options, video: prevVideo, media: getFallbackImage() } )
		}

		return openImagePictureInPicture( { ...options, video: prevVideo, media: data } )
	}

	const result = await createImageVideoStream( {
		media, video: prevVideo, ...rest
	} )

	const { video, destroy } = result

	if ( document.pictureInPictureElement !== video ) {
		await video.requestPictureInPicture()
	}

	const hasListener = video.getAttribute( 'image-pip-quit-listener' ) === 'true'

	if ( ! hasListener ) {

		video.setAttribute( 'image-pip-quit-listener', 'true' )
		video.addEventListener( 'leavepictureinpicture', () => {

			video.removeAttribute( 'image-pip-quit-listener' )
			destroy()
			onQuit?.()
	
		}, { once: true } )

	}

	return result

}
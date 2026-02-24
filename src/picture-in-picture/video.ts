import { Url, type UrlInput } from '@alessiofrittoli/url-utils'
import {
	requiresPictureInPictureAPI,
	type OpenPictureInPictureCommonOptions
} from '@/picture-in-picture'


/**
 * Defines configuration options for opening the video in Picture-in-Picture mode.
 * 
 */
export interface OpenVideoArtworkPictureInPictureOptions extends OpenPictureInPictureCommonOptions, Partial<OpenVideoArtworkPictureInPicture>
{
	/**
	 * The media open in a Picture-in-Picture.
	 * 
	 */
	media: HTMLVideoElement | UrlInput
}


/**
 * Defines the returned result of opening a video into a Picture-in-Picture.
 * 
 */
export interface OpenVideoArtworkPictureInPicture
{
	/**
	 * The {@link HTMLVideoElement} in Picture-in-Picture.
	 * 
	 */
	video: HTMLVideoElement
}


/**
 * Opens a video artwork element in Picture-in-Picture mode.
 * 
 * This function is intended for rendering a short song artwork video.
 * This is not suitable if your're looking for a proper video Picture-in-Picture since it simple as calling `video.requestPictureInPicture()`.
 * 
 * Supports both HTMLVideoElement instances and URL inputs. When a URL is provided,
 * a video element is created and the URL is set as its source.
 * 
 * The video is configured to play inline, muted, looped, and autoplayed and should be used to display a song artwork video in PiP mode.
 * 
 * @param options Configuration options for opening the video in Picture-in-Picture. See {@link OpenVideoArtworkPictureInPictureOptions} for more info.
 * 
 * @returns A new Promise that resolves with an object containing the video element displayed in Picture-in-Picture mode.
 * 
 * @throws Will throw if the Picture-in-Picture API is not available in the browser
 * 
 * @example
 * ```ts
 * // With a URL
 * const { video } = await openVideoArtworkPictureInPicture( {
 *  media   : 'https://example.com/song-artwork-video.mp4',
 *  onQuit  : () => console.log( 'Picture-in-Picture closed' )
 * } )
 * 
 * // With an HTMLVideoElement
 * const media  = document.querySelector( 'video' )
 * media.src    = 'https://example.com/song-artwork-video.mp4'
 * 
 * const { video } = await openVideoArtworkPictureInPicture( { media } )
 * ```
 */
export const openVideoArtworkPictureInPicture = async (
	options: OpenVideoArtworkPictureInPictureOptions
): Promise<OpenVideoArtworkPictureInPicture> => {

	requiresPictureInPictureAPI()

	const { media, video: prevVideo, onQuit } = options

	const isNode = media instanceof HTMLVideoElement

	if ( ! isNode ) {
		const video		= prevVideo || document.createElement( 'video' )
		const newSrc	= Url.format( media )
		const prevSrc	= video.getAttribute( 'src' )

		if ( newSrc !== prevSrc ) {
			// update src only if new src is different. this avoids video to restart.
			video.src = newSrc
		}

		return openVideoArtworkPictureInPicture( { ...options, media: video } )
	}


	if ( media.srcObject ) {
		media.srcObject	= null
	}

	media.playsInline	= true
	media.muted			= true
	media.loop			= true
	media.autoplay		= true

	const hasListener = media.getAttribute( 'video-artwork-pip-quit-listener' ) === 'true'
	
	if ( ! hasListener && onQuit ) {

		media.setAttribute( 'video-artwork-pip-quit-listener', 'true' )
		media.addEventListener( 'leavepictureinpicture', () => {

			media.removeAttribute( 'video-artwork-pip-quit-listener' )
			onQuit()
	
		}, { once: true } )

	}

	await media.play()

	if ( document.pictureInPictureElement !== media ) {
		await media.requestPictureInPicture()
	}

	return { video: media }

}
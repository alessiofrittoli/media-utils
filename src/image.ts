import { Exception } from '@alessiofrittoli/exception'
import { Url, type UrlInput } from '@alessiofrittoli/url-utils'
import { ErrorCode } from './errors'

/**
 * 1x1 black Base64 Data URI image.
 * 
 */
export const BLACK_BASE64_DATA_URI_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+AkAAP8A+7Xdu1sAAAAASUVORK5CYII='


/**
 * Creates and returns an HTML image element with a fallback source.
 * 
 * @param src The URL or URL input for the image source. Defaults to a base64-encoded 1x1 black image.
 * @returns An `HTMLImageElement` with the specified source URL.
 * 
 * @example
 * ```ts
 * document.body.appendChild( getFallbackImage() )
 * ```
 * 
 * @example
 * ```ts
 * const customFallback = getFallbackImage( 'https://example.com/image.png' )
 * ```
 */
export const getFallbackImage = (
	src: UrlInput = BLACK_BASE64_DATA_URI_IMAGE
) => {

	const image = document.createElement( 'img' )
	image.src	= Url.format( src )

	return image
}


/**
 * Rendering options.
 * 
 */
export interface RenderOptions
{
	/**
	 * The image source to render.
	 * 
	 * It can be either a {@link Blob} or a preloaded {@link HTMLImageElement}.
	 */
	media?: HTMLImageElement | Blob
	/**
	 * A previously created `HTMLVideoElement` where image get streamed into.
	 * 
	 */
	video?: HTMLVideoElement
	/**
	 * Target aspect ratio (width / height) of the rendering area.
	 * 
	 * If omitted, the original media aspect ratio is preserved.
	 */
	aspectRatio?: number
	/**
	 * Defines how the media should fit inside the rendering area.
	 * 
	 * - `contain` (default) behaves like `object-fit: contain`
	 * - `cover` behaves like `object-fit: cover`
	 * 
	 * Only applies when `aspectRatio` is specified.
	 * 
	 * @default 'contain'
	 */
	fit?: 'contain' | 'cover'
}


/**
 * Options for rendering an image into a video stream.
 *
 * It optionally accepts a previously previously created `HTMLVideoElement` where image will get streamed into.
 */
export interface CreateImageVideoStreamOptions extends RenderOptions
{
	/**
	 * The image source to render.
	 * 
	 * It can be either a {@link Blob} or a preloaded {@link HTMLImageElement}.
	 */
	media: Blob | HTMLImageElement
}


/**
 * The rendering result.
 * 
 */
export interface RenderResult
{
	/**
	 * The `HTMLVideoElement` where image get streamed into.
	 * 
	 */
	video: HTMLVideoElement
}


/**
 * Render a new image to the video stream.
 * 
 * @param options (Optional) An object defining new rendering options. See {@link RenderOptions} for more info.
 * 
 * @returns A new Promise that resolves the `HTMLVideoElement` where image get streamed into once rendering is completed.
 */
export type RenderHandler = ( options?: RenderOptions ) => Promise<RenderResult>


/**
 * Stop stream tracks and release allocated resources.
 * 
 */
export type DestroyHandler = () => void


/**
 * Defines the returned result of rendering an image into a video.
 * 
 */
export interface CreateImageVideoStream extends RenderResult
{
	/**
	 * Render a new image to the video stream.
	 * 
	 * @param options (Optional) An object defining new rendering options. See {@link RenderOptions} for more info.
	 * 
	 * @returns A new Promise that resolves the `HTMLVideoElement` where image get streamed into once rendering is completed.
	 */
    render: RenderHandler
	/**
	 * Stop stream tracks and release allocated resources.
	 * 
	 */
	destroy: DestroyHandler
}


/**
 * Render an image into a video stream.
 * 
 * If the provided media (HTMLImageElement) fails to load, a 1x1 black frame is rendered instead and the promise does not reject.
 * 
 * @param options Rendering options. See {@link CreateImageVideoStreamOptions} for more info.
 * @returns A new Promise that resolves the allocated rendering resources. See {@link CreateImageVideoStream} for more info.
 */
export const createImageVideoStream = async (
	options: CreateImageVideoStreamOptions
): Promise<CreateImageVideoStream> => {

	const {
		media: initialMedia, video: initialVideo = document.createElement( 'video' ),
		aspectRatio: initialAspectRatio, fit: initialFit = 'contain', 
	} = options

	/**
	 * The `HTMLVideoElement` where image get streamed into.
	 * 
	 */
	let currentVideo	= initialVideo
	const canvas		= document.createElement( 'canvas' )
	const context		= canvas.getContext && canvas.getContext( '2d' )

	if ( ! context ) {
		throw new Exception(
			'No 2d context available for rendering.', {
				code: ErrorCode.RENDERING_CONTEXT_UNAVAILABLE
			}
		)
	}
	
	const stream = canvas.captureStream( 30 )

	const destroy: DestroyHandler = () => {
		currentVideo.srcObject = null
		stream.getTracks().forEach( track => track.stop() )
	}

	const render: RenderHandler = async ( options = {} ) => {

		const {
			media		= initialMedia,
			video		= currentVideo,
			aspectRatio	= initialAspectRatio,
			fit			= initialFit,
		} = options
		
		if ( currentVideo !== video ) {
			currentVideo.srcObject = null
		}

		currentVideo = video

		if ( media instanceof HTMLImageElement ) {
			if ( ! media.complete ) {
				try {
					await new Promise<void>( ( resolve, reject ) => {
						media.addEventListener( 'load', () => resolve(), { once: true } )
		
						media.addEventListener( 'error', async cause => {
							reject( new Exception( 'Couldn\'t load the given resource.', { code: ErrorCode.UNKNOWN, cause } ) )
						}, { once: true } )
					} )
				} catch ( error ) {
					console.error( error )
					return render( { media: getFallbackImage() } )
				}
			}
		}

		const bitmap = await createImageBitmap( media )

		if ( currentVideo.src ) {
			currentVideo.src = ''
		}
		if ( ! currentVideo.srcObject ) {
			currentVideo.srcObject = stream
		}

		currentVideo.playsInline	= true
		currentVideo.muted			= true
		currentVideo.loop			= false
		currentVideo.autoplay		= true


		canvas.width	= bitmap.width
		canvas.height	= bitmap.height

		if ( aspectRatio ) {

			const imageAspect = bitmap.width / bitmap.height

			if ( imageAspect >= aspectRatio ) {
				canvas.width	= bitmap.width
				canvas.height	= bitmap.width / aspectRatio
			} else {
				canvas.width	= bitmap.height * aspectRatio
				canvas.height	= bitmap.height
			}

		}


		/**
		 * Compute scaling factor to emulate CSS `object-fit` behavior.
		 *
		 * - `contain` uses the smaller ratio to ensure the entire image fits
		 *   inside the canvas (may result in empty space).
		 * - `cover` uses the larger ratio to fully cover the canvas,
		 *   possibly cropping the image.
		 *
		 * When `aspectRatio` is not provided, the canvas matches the image
		 * dimensions and `scale` is 1.
		 *
		 * This logic is independent from how the canvas size is determined,
		 * allowing future support for externally defined canvas dimensions
		 * without changing the scaling algorithm.
		 */
		const scale = (
			( fit === 'cover' ? Math.max : Math.min )( canvas.width / bitmap.width, canvas.height / bitmap.height )
		)

		const drawWidth  = bitmap.width * scale
		const drawHeight = bitmap.height * scale

		const offsetX = ( canvas.width - drawWidth ) / 2
		const offsetY = ( canvas.height - drawHeight ) / 2
		
		context.clearRect( 0, 0, canvas.width, canvas.height )
		context.drawImage( bitmap, offsetX, offsetY, drawWidth, drawHeight )
		bitmap.close()

		await currentVideo.play()

		return { video: currentVideo }
	}

	return { render, destroy, ...( await render( { media: initialMedia } ) ) }

}
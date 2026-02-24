import { Exception } from '@alessiofrittoli/exception'
import { Url, type UrlInput } from '@alessiofrittoli/url-utils'
import { ErrorCode } from './errors'

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
 * Options for rendering an image into a video stream.
 *
 * It optionally accepts a previously returned {@link CreateImageVideoStream}
 * object in order to reuse existing rendering resources.
 */
export interface CreateImageVideoStreamOptions extends Partial<Omit<CreateImageVideoStream, 'destroy'>>
{
	/**
	 * The image source to render.
	 * 
	 * It can be either a {@link Blob} or a preloaded {@link HTMLImageElement}.
	 */
	media: Blob | HTMLImageElement
	/**
	 * Target aspect ratio (width / height) of the rendering area.
	 * 
	 * If omitted, the original media aspect ratio is preserved.
	 */
	aspectRatio?: number
	/**
	 * Defines how the media should fit inside the rendering area.
	 * 
	 * - `cover` behaves like `object-fit: cover`
	 * - `contain` (default) behaves like `object-fit: contain`
	 * 
	 * Only applies when `aspectRatio` is specified.
	 * 
	 * @default 'contain'
	 */
	fit?: 'contain' | 'cover'
}


/**
 * Defines the returned result of rendering an image into a video.
 * 
 */
export interface CreateImageVideoStream
{
	/**
	 * The {@link HTMLVideoElement} streaming the rendered image.
	 * 
	 */
	video: HTMLVideoElement
	/**
	 * The `HTMLCanvasElement` used to render and stream the image into the `video`.
	 * 
	 */
	canvas: HTMLCanvasElement
	/**
	 * The `CanvasRenderingContext2D`.
	 * 
	 */
	context: CanvasRenderingContext2D
	/**
	 * Stops all media tracks and releases allocated resources.
	 * 
	 */
	stream: MediaStream
	/**
	 * A callable function that stops stream tracks and free resources.
	 * 
	 */
	destroy: () => void
}


/**
 * Renders an image into a canvas and exposes it as a video stream.
 * 
 * If the provided media (HTMLImageElement) fails to load, a 1x1 black frame is rendered instead and the promise does not reject.
 * 
 * @param options Rendering options. See {@link CreateImageVideoStreamOptions} for more info.
 * @returns A promise resolving to the allocated rendering resources. See {@link CreateImageVideoStream} for more info.
 */
export const createImageVideoStream = async (
	options: CreateImageVideoStreamOptions
): Promise<CreateImageVideoStream> => {

	const {
		media, video: prevVideo, aspectRatio, fit = 'contain', 
	} = options

	let source		= media
	const canvas	= options.canvas || document.createElement( 'canvas' )
	const context	= options.context || ( canvas.getContext && canvas.getContext( '2d' ) )

	if ( ! context ) {
		throw new Exception(
			'No 2d context available for rendering.', {
				code: ErrorCode.RENDERING_CONTEXT_UNAVAILABLE
			}
		)
	}

	const render = async () => {

		const bitmap	= await createImageBitmap( source )
		const video		= prevVideo || document.createElement( 'video' )
		const stream	= options.stream || canvas.captureStream( 30 )

		if ( video.src ) {
			video.src = ''
		}
		if ( ! video.srcObject ) {
			video.srcObject = stream
		}

		video.playsInline	= true
		video.muted			= true
		video.loop			= false
		video.autoplay		= true


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

		await video.play()

		const destroy = () => {
			stream.getTracks().forEach( track => track.stop() )
			video.srcObject = null
		}

		return { video, canvas, context, stream, destroy }
	}
	
	if ( source instanceof HTMLImageElement ) {
		const image = source
		await new Promise<void>( resolve => {
			image.addEventListener( 'load', () => {
				resolve()
			}, { once: true } )

			image.addEventListener( 'error', cause => {
				console.error( new Exception( 'Couldn\'t load the given resource.', { code: ErrorCode.UNKNOWN, cause } ) )
				source = getFallbackImage()
				resolve()
			}, { once: true } )
		} )
	}

	return render()

}
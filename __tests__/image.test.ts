/**
 * @jest-environment jsdom
 */
import { ErrorCode } from '@/errors'
import { createImageVideoStream, getFallbackImage, BLACK_BASE64_DATA_URI_IMAGE } from '@/image'

describe( 'image', () => {

	describe( 'getFallbackImage', () => {

		it( 'creates an image element with default base64 source', () => {

			const image = getFallbackImage()
			expect( image ).toBeInstanceOf( HTMLImageElement )
			expect( image.src ).toBe( BLACK_BASE64_DATA_URI_IMAGE )

		} )


		it( 'creates an image element with custom source', () => {

			const customSrc	= 'https://example.com/image.png'
			const image		= getFallbackImage( customSrc )

			expect( image.src ).toBe( customSrc )

		} )

	} )

	describe( 'createImageVideoStream', () => {

		let createElement: jest.SpyInstance<HTMLElement, [ tagName: string, options?: ElementCreationOptions | undefined ]>

		let mockCanvasRenderingContext2D: {
			clearRect: jest.Mock
			drawImage: jest.Mock<ReturnType<CanvasDrawImage[ 'drawImage' ]>, Parameters<CanvasDrawImage[ 'drawImage' ]>>
		}

		let mockMediaStream: {
			getTracks: jest.Mock
		}

		let mockCaptureStream: jest.Mock<typeof mockMediaStream, [ frames?: number ]>

		let mockCanvas: {
			width?			: number
			height?			: number
			getContext?		: jest.Mock<typeof mockCanvasRenderingContext2D>
			captureStream?	: typeof mockCaptureStream
		}

		let mockImageBitmap: {
			width	: number
			height	: number
			close	: jest.Mock
		}

		let mockCreateImageBitmap: jest.Mock<typeof mockImageBitmap>


		let mockVideo: {
			src			: string
			srcObject	: null | ReturnType<typeof mockCaptureStream>
			playsInline	: boolean
			muted		: boolean
			loop		: boolean
			autoplay	: boolean
			play		: jest.Mock<Promise<void>>
		}


		const originalHTMLImageElement = HTMLImageElement

		let mockImageAddEventListener: jest.Mock<void, [ event: keyof HTMLElementEventMap, listener: ( event: Event ) => void ]>

		class MockHTMLImageElement
		{
			complete = false
			addEventListener = mockImageAddEventListener
		}


		beforeEach( () => {

			mockCanvasRenderingContext2D = {
				clearRect: jest.fn(),
				drawImage: jest.fn(),
			}

			mockMediaStream = {
				getTracks: jest.fn( () => [] )
			}

			mockCaptureStream = jest.fn( () => mockMediaStream )

			mockCanvas = {
				width			: 0,
				height			: 0,
				getContext		: jest.fn( () => mockCanvasRenderingContext2D ),
				captureStream	: mockCaptureStream,
			}

			mockImageBitmap = {
				width	: 1920,
				height	: 1920,
				close	: jest.fn(),
			}

			mockCreateImageBitmap = jest.fn( () => mockImageBitmap )

			mockVideo = {
				src			: '',
				srcObject	: null,
				playsInline	: false,
				muted		: false,
				loop		: false,
				autoplay	: false,
				play		: jest.fn().mockResolvedValue( undefined ),
			}

			mockImageAddEventListener = jest.fn( ( event, listener ) => listener( new Event( event ) ) )


			Object.assign( global, {
				HTMLImageElement: MockHTMLImageElement,
			} )

			createElement = jest.spyOn( document, 'createElement' ).mockImplementation( ( tagName: string ) => {
				if ( tagName === 'canvas' ) return mockCanvas
				if ( tagName === 'video' ) return mockVideo
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {} as any
			} )

			global.createImageBitmap = (
				mockCreateImageBitmap as unknown as typeof createImageBitmap
			)

		} )


		afterEach( () => {

			jest.restoreAllMocks()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			delete ( global as any ).createImageBitmap

			Object.assign( global, {
				HTMLImageElement: originalHTMLImageElement,
			} )

		} )


		it( 'throws an error if CanvasRenderingContext2D is not available', async () => {

			delete mockCanvas.getContext

			expect( () => createImageVideoStream( { media: new Blob( [], { type: 'image/png' } ) } ) )
				.rejects.toThrow( expect.objectContaining( { code: ErrorCode.RENDERING_CONTEXT_UNAVAILABLE } ) )

		} )

		describe( 'Blob', () => {

			it( 'renders Blob into video stream', async () => {
	
				const media		= new Blob( [], { type: 'image/png' } )
				const result	= await createImageVideoStream( { media } )
	
				expect( result.video ).toBe( mockVideo )
				expect( result.render ).toBeInstanceOf( Function )
				expect( result.destroy ).toBeInstanceOf( Function )
	
			} )

		} )


		describe( 'HTMLImageElement', () => {

			it( 'handles HTMLImageElement that loads successfully', async () => {

				mockImageAddEventListener.mockImplementation( ( event, listener ) => {
					if ( event !== 'load' ) return
					return listener( new Event( 'load' ) )
				} )

				const media = new MockHTMLImageElement() as unknown as HTMLImageElement

				await createImageVideoStream( { media } )

				expect( mockCreateImageBitmap )
					.toHaveBeenCalledWith( media )

			} )


			it( 'uses fallback image when HTMLImageElement fails to load', async () => {

				const consoleErrorSpy = jest.spyOn( console, 'error' ).mockImplementationOnce( () => {} )

				mockImageAddEventListener.mockImplementation( ( event, listener ) => {

					if ( event !== 'error' ) return
					return listener( new Event( 'error' ) )

				} )

				const media = new MockHTMLImageElement() as unknown as HTMLImageElement

				await createImageVideoStream( { media } )

				expect( mockCreateImageBitmap )
					.not.toHaveBeenCalledWith( media )
				
				expect( mockCreateImageBitmap )
					.toHaveBeenCalledWith( { src: BLACK_BASE64_DATA_URI_IMAGE } )

				expect( consoleErrorSpy ).toHaveBeenCalled()
				consoleErrorSpy.mockRestore()
				
			} )


			it( 'doesn\'t await image load if already loaded', async () => {

				const media		= new MockHTMLImageElement()
				media.complete	= true

				await createImageVideoStream( { media: media as unknown as HTMLImageElement } )

				expect( media.addEventListener )
					.not.toHaveBeenCalled()

			} )

		} )


		it( 'follows rendering process correctly', async () => {

			const media = new Blob( [], { type: 'image/png' } )

			await createImageVideoStream( { media } )
			
			expect( mockCreateImageBitmap ).toHaveBeenCalled()
			expect( mockCanvas.captureStream ).toHaveBeenCalledWith( 30 )

			expect( mockVideo.play ).toHaveBeenCalled()

			expect( mockCanvasRenderingContext2D.clearRect )
				.toHaveBeenCalled()
			expect( mockCanvasRenderingContext2D.drawImage )
				.toHaveBeenCalled()
			
			expect( mockImageBitmap.close ).toHaveBeenCalled()

		} )


		describe( 'Aspect Ratio', () => {

			it( 'applies aspect ratio with fit contain', async () => {

				// 9 / 16 original aspect ratio
				mockImageBitmap.width	= 1080
				mockImageBitmap.height	= 1920

				// renderer aspect ratio
				const aspectRatio	= 16 / 9
				const media			= new Blob( [], { type: 'image/png' } )
				
				await createImageVideoStream( { media, aspectRatio, fit: 'contain' } )

				expect( mockCanvas.width ).toBe( 3413.333333333333 )
				expect( mockCanvas.height ).toBe( 1920 )

				expect( mockCanvasRenderingContext2D.clearRect )
					.toHaveBeenCalledWith( 0, 0, mockCanvas.width, mockCanvas.height )

				expect( mockCanvasRenderingContext2D.drawImage )
					.toHaveBeenCalledWith( mockImageBitmap, 1166.6666666666665, 0, 1080, 1920 )

			} )


			it( 'applies aspect ratio with fit cover - scale to fit', async () => {

				// 9 / 16 original aspect ratio
				mockImageBitmap.width	= 1920
				mockImageBitmap.height	= 1080

				// renderer aspect ratio
				const aspectRatio	= 9 / 16
				const media			= new Blob( [], { type: 'image/png' } )
				
				await createImageVideoStream( { media, aspectRatio, fit: 'cover' } )

				expect( mockCanvas.width ).toBe( 1920 )
				expect( mockCanvas.height ).toBe( 3413.3333333333335 )

				expect( mockCanvasRenderingContext2D.clearRect )
					.toHaveBeenCalledWith( 0, 0, mockCanvas.width, mockCanvas.height )

				expect( mockCanvasRenderingContext2D.drawImage )
					.toHaveBeenCalledWith( mockImageBitmap, -2074.0740740740744, 0, 6068.148148148149, 3413.3333333333335 )
				
			} )
			
		} )


		describe( 'Resources allocation', () => {

			it( 'render method doesn\'t allocate new resources', async () => {
	
				const media		= new Blob( [], { type: 'image/png' } )
				const media2	= new Blob( [], { type: 'image/png' } )
				const result	= await createImageVideoStream( { media } )
				
				await result.render( { media: media2 } )
	
				expect( createElement ).toHaveBeenNthCalledWith( 1, 'video' )
				expect( createElement ).toHaveBeenNthCalledWith( 2, 'canvas' )
				expect( mockCanvas.getContext ).toHaveBeenCalledTimes( 1 )
	
			} )


			it( 'resets correct properties to the video element', async () => {

				mockVideo.src	= 'https://example.com/previous-video-running.mp4'
				const media		= new Blob( [], { type: 'image/png' } )
				const result	= await createImageVideoStream( {
					media, video: mockVideo as unknown as HTMLVideoElement
				} )

				expect( result.video.src ).toBe( '' ) // reset video src to ''
				expect( result.video.srcObject ).toBe( mockMediaStream )
				expect( result.video.playsInline ).toBe( true )
				expect( result.video.muted ).toBe( true )
				expect( result.video.loop ).toBe( false )
				expect( result.video.autoplay ).toBe( true )

			} )

	
			it( 'returned destroy function allows to stop tracks and clear resources', async () => {
	
				const mockTrack = { stop: jest.fn() }
				mockMediaStream.getTracks.mockReturnValue( [ mockTrack ] )
	
				const media		= new Blob( [], { type: 'image/png' } )
				const result	= await createImageVideoStream( { media } )
	
				result.destroy()
	
				expect( mockTrack.stop ).toHaveBeenCalled()
				expect( result.video.srcObject ).toBeNull()
	
			} )

		} )


		describe( 'Subsequent renderings', () => {

			it( 'updates rendered content inheriting initial options', async () => {
	
				const media	= document.createElement( 'img' )
				media.src	= '/image-1.png'

				const { render } = await createImageVideoStream( { media } )
				
				media.src = '/image-2.png'
				await render()

				expect( createImageBitmap )
					.toHaveBeenNthCalledWith( 1, media )

				expect( createImageBitmap )
					.toHaveBeenNthCalledWith( 2, media )
	
			} )


			it( 'detach stream from old video elements', async () => {

				const media				= new Blob( [], { type: 'image/png' } )
				const { video, render }	= await createImageVideoStream( { media } )
				const newVideo			= { ...mockVideo } as unknown as HTMLVideoElement

				await render( { video: newVideo } )

				expect( video.srcObject ).toBeNull()
				expect( newVideo.srcObject ).toBe( mockMediaStream )

			} )

		} )

	} )

} )
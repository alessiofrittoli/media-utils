/**
 * @jest-environment jsdom
 */
import { openVideoArtworkPictureInPicture } from '@/picture-in-picture/video'
import { Url, type UrlInput } from '@alessiofrittoli/url-utils'

jest.mock( '@/picture-in-picture', () => ( {
	requiresPictureInPictureAPI: jest.fn()
} ) )


describe( 'Video Picture-in-Picture', () => {

	describe( 'openVideoArtworkPictureInPicture', () => {

		let mockVideo: {
			src			: string
			srcObject	: null | MediaStream
			playsInline	: boolean
			muted		: boolean
			loop		: boolean
			autoplay	: boolean
			addEventListener: jest.Mock
			setAttribute: jest.Mock<ReturnType<HTMLVideoElement[ 'setAttribute' ]>, Parameters<HTMLVideoElement[ 'setAttribute' ]>>
			getAttribute: jest.Mock<ReturnType<HTMLVideoElement[ 'getAttribute' ]>, Parameters<HTMLVideoElement[ 'getAttribute' ]>>
			removeAttribute: jest.Mock<ReturnType<HTMLVideoElement[ 'removeAttribute' ]>, Parameters<HTMLVideoElement[ 'removeAttribute' ]>>
			play		: jest.Mock<Promise<void>>
			requestPictureInPicture: jest.Mock<ReturnType<HTMLVideoElement[ 'requestPictureInPicture' ]>, Parameters<HTMLVideoElement[ 'requestPictureInPicture' ]>>
		}

		const originalHTMLVideoElement = HTMLVideoElement

		class MockHTMLVideoElement
		{
			addEventListener = mockVideo.addEventListener
			src				= mockVideo.src
			srcObject		= mockVideo.srcObject
			playsInline		= mockVideo.playsInline
			muted			= mockVideo.muted
			loop			= mockVideo.loop
			autoplay		= mockVideo.autoplay
			setAttribute	= mockVideo.setAttribute
			getAttribute	= mockVideo.getAttribute
			removeAttribute	= mockVideo.removeAttribute
			play			= mockVideo.play
			requestPictureInPicture = mockVideo.requestPictureInPicture
		}


		beforeEach( () => {

			mockVideo = {
				src			: '',
				srcObject	: null,
				playsInline	: false,
				muted		: false,
				loop		: false,
				autoplay	: false,
				play		: jest.fn().mockResolvedValue( undefined ),
				addEventListener: jest.fn(),
				requestPictureInPicture: jest.fn(),
				setAttribute: jest.fn( function( attribute, value ) {
					this[ attribute as keyof typeof this ] = value
				} ),
				getAttribute: jest.fn( function( attribute ) {
					return (
						this[ attribute as keyof typeof this ]?.toString() || ''
					)
				} ),
				removeAttribute: jest.fn( function( attribute ) {
					delete this[ attribute ]
				} )
			}

			Object.assign( global, {
				HTMLVideoElement: MockHTMLVideoElement,
			} )

			jest.spyOn( document, 'createElement' ).mockImplementation( ( tagName: string ) => {
				if ( tagName === 'video' ) return new MockHTMLVideoElement()
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return {} as any
			} )

		} )

		afterEach( () => {
			
			jest.restoreAllMocks()

			Object.assign( global, {
				HTMLImageElement: originalHTMLVideoElement,
			} )

		} )


		it( 'opens given video into a Picture-in-Picture window', async () => {

			const media	= document.createElement( 'video' )
			media.src	= 'https://example.com/song-artwork-video.mp4'
			
			await openVideoArtworkPictureInPicture( { media } )

			expect( mockVideo.requestPictureInPicture )
				.toHaveBeenCalled()

		} )
		
		
		it( 'configures video element with correct properties', async () => {

			const media		= document.createElement( 'video' )
			media.src		= 'https://example.com/song-artwork-video.mp4'
			const { video }	= await openVideoArtworkPictureInPicture( { media } )

			expect( video.srcObject ).toBeNull()
			expect( video.playsInline ).toBe( true )
			expect( video.muted ).toBe( true )
			expect( video.loop ).toBe( true )
			expect( video.autoplay ).toBe( true )

		} )


		it( 'clears srcObject if set', async () => {
			
			const media		= document.createElement( 'video' )
			media.src		= 'https://example.com/song-artwork-video.mp4'
			media.srcObject	= {} as MediaStream
			const { video }	= await openVideoArtworkPictureInPicture( { media } )

			expect( video.srcObject ).toBeNull()

		} )


		it( 'doesn\'t request PiP if video is already in PiP mode', async () => {

			const media		= document.createElement( 'video' )
			media.src		= 'https://example.com/song-artwork-video.mp4'
			const { video }	= await openVideoArtworkPictureInPicture( { media } )

			// this test depends on `document.pictureInPictureElement` which doesn't get updated in jest-jsdom environment
			Object.defineProperty( document, 'pictureInPictureElement', {
				configurable	: true,
				value			: video,
			} )

			media.src = 'https://example.com/song-artwork-video-2.mp4'

			await openVideoArtworkPictureInPicture( { media, video } )

			expect( mockVideo.requestPictureInPicture )
				.toHaveBeenCalledTimes( 1 )
			
			Object.defineProperty( document, 'pictureInPictureElement', {
				configurable	: true,
				value			: undefined,
			} )

		} )

		
		it( 'creates video element from URL input', async () => {
	
			const media: UrlInput = { pathname: '/song-artwork-video.mp4' }
			const { video } = await openVideoArtworkPictureInPicture( { media } )
		
			expect( document.createElement ).toHaveBeenCalledWith( 'video' )
			expect( video.src ).toBe( Url.format( media ) )
				
		} )
		
		
		it( 'updates src only if new src is different', async () => {
	
			const media: UrlInput = { pathname: '/song-artwork-video.mp4' }
			const result = await openVideoArtworkPictureInPicture( { media } )
			
			const { video } = await openVideoArtworkPictureInPicture( { media, ...result } )

			expect( video.src ).toBe( Url.format( media ) )
			expect( mockVideo.getAttribute ).toHaveBeenCalledWith( 'src' )
			expect( mockVideo.getAttribute ).toHaveReturnedWith( video.src )

		} )


		it( 'calls onQuit callback when leaving PiP', async () => {

			const onQuit = jest.fn()
			const media: UrlInput = { pathname: '/song-artwork-video.mp4' }
			
			mockVideo.addEventListener.mockImplementationOnce( ( event, listener ) => {
				listener( new Event( 'leavepictureinpicture' ) )
			} )

			await openVideoArtworkPictureInPicture( { media, onQuit } )

			expect( onQuit ).toHaveBeenCalled()

		} )

		
		it( 'register leavepictureinpicture event listener once', async () => {

			const onQuit = jest.fn()
			const media: UrlInput = { pathname: '/song-artwork-video.mp4' }
			
			const result = await openVideoArtworkPictureInPicture( { media, onQuit } )
			await openVideoArtworkPictureInPicture( { media, onQuit, ...result } )

			expect( mockVideo.addEventListener )
				.toHaveBeenCalledTimes( 1 )

		} )

	} )

} )
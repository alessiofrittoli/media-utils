/**
 * @jest-environment jsdom
 */
import { ErrorCode } from '@/errors'
import {
	openImagePictureInPicture as _openImagePictureInPicture,
	type OpenImagePictureInPicture,
	type OpenImagePictureInPictureOptions,
} from '@/picture-in-picture/image'
import {
	openVideoArtworkPictureInPicture as _openVideoArtworkPictureInPicture,
	type OpenVideoArtworkPictureInPicture,
	type OpenVideoArtworkPictureInPictureOptions,
} from '@/picture-in-picture/video'
import {
	isPictureInPictureSupported,
	openArtworkPictureInPicture,
	requiresPictureInPictureAPI,
} from '@/picture-in-picture'
import { MediaArtWork } from '@/media-session'

jest.mock( '@/picture-in-picture/image' )
jest.mock( '@/picture-in-picture/video' )

const openImagePictureInPicture = (
	_openImagePictureInPicture
) as jest.Mock<Promise<OpenImagePictureInPicture>, [ options: OpenImagePictureInPictureOptions ]>

const openVideoArtworkPictureInPicture = (
	_openVideoArtworkPictureInPicture
) as jest.Mock<Promise<OpenVideoArtworkPictureInPicture>, [ options: OpenVideoArtworkPictureInPictureOptions ]>


describe( 'Picture-in-Picture', () => {

	const originalpPctureInPictureEnabled = document.pictureInPictureEnabled
	let mockPictureInPictureEnabled: jest.Mock

	beforeEach( () => {

		mockPictureInPictureEnabled = jest.fn( () => true )

		Object.defineProperty( document, 'pictureInPictureEnabled', {
			configurable: true,
			get			: mockPictureInPictureEnabled,
		} )

	} )


	afterEach( () => {
		jest.clearAllMocks()
		mockPictureInPictureEnabled.mockImplementation( () => originalpPctureInPictureEnabled )
	} )


	describe( 'isPictureInPictureSupported', () => {
		
		it( 'returns true if Picture-in-Picture API is available', () => {

			expect( isPictureInPictureSupported() ).toBe( true )

		} )


		it( 'returns false if Picture-in-Picture API is not available', () => {

			mockPictureInPictureEnabled.mockReturnValue( false )
			expect( isPictureInPictureSupported() ).toBe( false )

		} )

	} )
	
	
	describe( 'requiresPictureInPictureAPI', () => {
		
		it( 'throws an Exception if Picture-in-Picture is not supported', () => {

			mockPictureInPictureEnabled.mockReturnValue( false )
			
			expect( requiresPictureInPictureAPI )
				.toThrow( expect.objectContaining( { code: ErrorCode.PIP_NOT_SUPPORTED } ) )

		} )


		it( 'doesn\'t throw any Exception if Picture-in-Picture is supported', () => {

			expect( requiresPictureInPictureAPI ).not.toThrow()

		} )

	} )


	describe( 'openArtworkPictureInPicture', () => {

		it( 'throws a new Exception if no artwork to render has been found', async () => {

			expect( async () => openArtworkPictureInPicture() )
				.rejects.toThrow( expect.objectContaining( { code: ErrorCode.NO_ARTWORK_AVAILABLE } ) )

		} )

		
		describe( 'Image Artwork', () => {

			it( 'calls openImagePictureInPicture if HTMLImageElement is given', async () => {

				const media	= document.createElement( 'img' )
				media.src	= '/path-to/artwork-image.png'

				await openArtworkPictureInPicture( { media } )

				expect( openImagePictureInPicture )
					.toHaveBeenCalledWith( { media } )

			} )
			
			
			it( 'calls openImagePictureInPicture if Blob is given', async () => {

				const media	= new Blob( [], { type: 'image/png' } )

				await openArtworkPictureInPicture( { media } )

				expect( openImagePictureInPicture )
					.toHaveBeenCalledWith( { media } )

			} )


			it( 'calls openImagePictureInPicture if image MediaArtWork object is given', async () => {

				const media: MediaArtWork = { src: '/path-to/artwork-image.png', type: 'image/png' }

				await openArtworkPictureInPicture( { media } )

				expect( openImagePictureInPicture )
					.toHaveBeenCalledWith( { media: media.src } )

			} )
			
			
			it( 'calls openImagePictureInPicture with MediaSession artwork if no media is given', async () => {

				Object.defineProperty( navigator, 'mediaSession', {
					configurable	: true,
					value			: {
						metadata: {
							title: 'Playing song',
							album: 'Song album',
							artist: 'Song artist',
							artwork: [ {
								src: '/path-to/artwork-image.png',
							} ],
						}
					} as Partial<MediaSession>
				} )

				await openArtworkPictureInPicture()

				expect( openImagePictureInPicture )
					.toHaveBeenCalledWith( { media: '/path-to/artwork-image.png' } )

				Object.defineProperty( navigator, 'mediaSession', {
					configurable	: true,
					value			: undefined,
				} )
			} )

		} )
		
		
		describe( 'Video Artwork', () => {

			it( 'calls openVideoArtworkPictureInPicture if HTMLVideoElement is given', async () => {
	
				const media	= document.createElement( 'video' )
				media.src	= '/path-to/artwork-video.mp4'
	
				await openArtworkPictureInPicture( { media } )
	
				expect( openVideoArtworkPictureInPicture )
					.toHaveBeenCalledWith( { media } )
	
			} )
	
	
			it( 'calls openVideoArtworkPictureInPicture if video MediaArtWork is given', async () => {
	
				const media: MediaArtWork = { src: '/path-to/artwork-video.mp4', type: 'video/mp4' }
	
				await openArtworkPictureInPicture( { media } )
	
				expect( openVideoArtworkPictureInPicture )
					.toHaveBeenCalledWith( { media: media.src } )
	
			} )

		} )

	} )

} )
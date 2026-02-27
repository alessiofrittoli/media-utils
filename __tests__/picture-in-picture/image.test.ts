/**
 * @jest-environment jsdom
 */
import { Exception } from '@alessiofrittoli/exception'
import { fetch as _fetch } from '@alessiofrittoli/fetcher/fetch'
import { Url, type UrlInput } from '@alessiofrittoli/url-utils'

import { ErrorCode } from '@/errors'
import {
	createImageVideoStream as _createImageVideoStream,
	getFallbackImage,
	type CreateImageVideoStream,
	type CreateImageVideoStreamOptions,
} from '@/image'
import { openImagePictureInPicture } from '@/picture-in-picture/image'

jest.mock( '@alessiofrittoli/fetcher/fetch' )
const fetch = _fetch as jest.Mock<ReturnType<typeof _fetch>, Parameters<typeof _fetch>>


jest.mock( '@/picture-in-picture', () => ( {
	requiresPictureInPictureAPI: jest.fn()
} ) )

jest.mock( '@/image', () => ( {
	...jest.requireActual( '@/image' ),
	createImageVideoStream: jest.fn(),
} ) )

const createImageVideoStream = (
	_createImageVideoStream
) as jest.Mock<Promise<Partial<CreateImageVideoStream>>, [ options: CreateImageVideoStreamOptions ]>


describe( 'Image Picture-in-Picture', () => {

	afterEach( () => {
		jest.clearAllMocks()
	} )


	describe( 'openImagePictureInPicture', () => {

		let mockVideo: HTMLVideoElement
		let mockRender: jest.Mock
		let mockDestroy: jest.Mock

		beforeEach( () => {
			mockVideo	= document.createElement( 'video' )
			mockDestroy	= jest.fn()
			mockRender	= jest.fn( ( { video } ) => ( { video } ) )

			mockVideo.requestPictureInPicture = jest.fn().mockResolvedValue( {} )
			mockVideo.addEventListener = jest.fn( mockVideo.addEventListener )

			createImageVideoStream.mockResolvedValue( {
				video	: mockVideo,
				render	: mockRender,
				destroy	: mockDestroy,
			} )

		} )


		it( 'opens image PiP from Blob', async () => {

			const media		= new Blob( [ 'test' ], { type: 'image/png' } )
			const result	= await openImagePictureInPicture( { media } )

			expect( createImageVideoStream ).toHaveBeenCalled()
			expect( mockVideo.requestPictureInPicture ).toHaveBeenCalled()
			expect( result.destroy ).toBe( mockDestroy )

		} )


		it( 'opens image PiP from HTMLImageElement', async () => {

			const media		= document.createElement( 'img' )
			const result	= await openImagePictureInPicture( { media } )

			expect( createImageVideoStream ).toHaveBeenCalled()
			expect( mockVideo.requestPictureInPicture ).toHaveBeenCalled()
			expect( result.destroy ).toBe( mockDestroy )

		} )


		it( 'fetch image from given URL and renders Blob in PiP', async () => {

			fetch.mockResolvedValueOnce( {
				data		: new Blob( [ 'test' ], { type: 'image/png' } ),
				error		: null,
				headers		: {} as Headers,
				response	: {} as Response,
			} )

			const media: UrlInput = { pathname: 'path/to/image.png' }
			const result = await openImagePictureInPicture( { media } )

			expect( fetch ).toHaveBeenCalledWith( Url.format( media ), { responseType: 'blob' } )

			expect( createImageVideoStream ).toHaveBeenCalled()
			expect( mockVideo.requestPictureInPicture ).toHaveBeenCalled()
			expect( result.destroy ).toBe( mockDestroy )

		} )


		it( 'renders fallback image in PiP if fetch fails', async () => {

			fetch.mockResolvedValueOnce( {
				data		: null,
				error		: new Exception( 'The given resource cannot be found in the target destination.', { code: ErrorCode.NOT_FOUND } ),
				headers		: {} as Headers,
				response	: {} as Response,
			} )
			const consoleErrorSpy = jest.spyOn( console, 'error' ).mockImplementationOnce( () => {} )

			const media: UrlInput = { pathname: 'path/to/image.png' }
			await openImagePictureInPicture( { media } )

			expect( createImageVideoStream )
				.toHaveBeenCalledWith( {
					media: getFallbackImage()
				} )
			
			expect( createImageVideoStream ).toHaveBeenCalled()
			expect( mockVideo.requestPictureInPicture ).toHaveBeenCalled()

			consoleErrorSpy.mockRestore()
			
		} )


		it( 'reuses createImageVideoStream resources', async () => {

			const result = await openImagePictureInPicture( {
				media: new Blob( [ 'test' ], { type: 'image/png' } )
			} )

			await openImagePictureInPicture( {
				media: new Blob( [ 'test' ], { type: 'image/png' } ),
				...result,
			} )

			expect( createImageVideoStream ).toHaveBeenCalledTimes( 1 )

		} )


		it( 'calls onQuit callback when leaving PiP', async () => {

			const onQuit = jest.fn()
			await openImagePictureInPicture( { media: new Blob(), onQuit } )

			const event = new Event( 'leavepictureinpicture' )
			mockVideo.dispatchEvent( event )

			expect( mockDestroy ).toHaveBeenCalled()
			expect( onQuit ).toHaveBeenCalled()

		} )


		it( 'register leavepictureinpicture event listener once', async () => {

			const media		= new Blob( [ 'test' ], { type: 'image/png' } )
			const media2	= new Blob( [ 'test' ], { type: 'image/png' } )
			const result	= await openImagePictureInPicture( { media } )
			
			await openImagePictureInPicture( { media: media2, ...result } )
			expect( mockVideo.addEventListener ).toHaveBeenCalledTimes( 1 )

		} )


		it( 'doesn\'t request PiP if video is already in PiP mode', async () => {

			const media		= new Blob( [ 'test' ], { type: 'image/png' } )
			const media2	= new Blob( [ 'test' ], { type: 'image/png' } )
			const result	= await openImagePictureInPicture( { media } )
			
			// this test depends on `document.pictureInPictureElement` which doesn't get updated in jest-jsdom environment
			Object.defineProperty( document, 'pictureInPictureElement', {
				configurable	: true,
				value			: mockVideo,
			} )
			
			await openImagePictureInPicture( { media: media2, ...result } )
			expect( mockVideo.requestPictureInPicture ).toHaveBeenCalledTimes( 1 )
			
			Object.defineProperty( document, 'pictureInPictureElement', {
				configurable	: true,
				value			: undefined,
			} )

		} )

	} )

} )
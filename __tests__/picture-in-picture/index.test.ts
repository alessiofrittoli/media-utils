/**
 * @jest-environment jsdom
 */
import { ErrorCode } from '@/errors'
import {
	isPictureInPictureSupported,
	requiresPictureInPictureAPI,
} from '@/picture-in-picture'


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

} )
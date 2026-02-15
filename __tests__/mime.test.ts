import { AUDIO_MIME_TYPES, getAllowedMimeTypes, getFileExtension, getMimeType, IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from '@/mime'
import { arrayUnique } from '@alessiofrittoli/web-utils'

describe( 'MIME type', () => {

	describe( 'getFileExtension', () => {

		it( 'retrieves the file extension from a string', () => {

			expect( getFileExtension( 'file.txt' ) ).toBe( 'txt' )
			expect( getFileExtension( 'archive.tar.gz' ) ).toBe( 'gz' )
			expect( getFileExtension( 'photo.JPG' ) ).toBe( 'jpg' )
			expect( getFileExtension( 'noextension' ) ).toBe( 'noextension' )
			expect( getFileExtension( '.hiddenfile' ) ).toBe( 'hiddenfile' )
			expect( getFileExtension( 'complex.name.with.dots.mp3' ) ).toBe( 'mp3' )

		} )


		it( 'returns undefined if file extension could not be retrived', () => {

			expect( getFileExtension( '' ) ).toBeUndefined()

		} )

	} )


	describe( 'getMimeType', () => {

		it( 'returns the correct MIME type for known extensions', () => {

			expect( getMimeType( 'file.txt' ) ).toBe( 'text/plain' )
			expect( getMimeType( 'image.jpeg' ) ).toBe( 'image/jpeg' )
			expect( getMimeType( 'song.mp3' ) ).toBe( 'audio/mpeg' )
			expect( getMimeType( 'movie.mp4' ) ).toBe( 'video/mp4' )
			expect( getMimeType( 'font.woff2' ) ).toBe( 'font/woff2' )
			expect( getMimeType( 'model.wrl' ) ).toBe( 'model/vrml' )
			expect( getMimeType( 'document.pdf' ) ).toBe( 'application/pdf' )

		} )


		it( 'returns the correct MIME type when type is specified', () => {

			expect( getMimeType( 'song.mp4', 'audio' ) ).toBe( 'audio/mp4' )

		} )


		it( 'skips given media type if invalid', () => {

			// @ts-expect-error negative testing
			expect( getMimeType( '.mp3', 'invalid' ) ).toBe( 'audio/mpeg' )

		} )


		it( 'returns undefined for unknown extensions', () => {

			expect( getMimeType( 'file.unknown' ) ).toBeUndefined()
			expect( getMimeType( 'file.unknown', 'text' ) ).toBeUndefined()

		} )


		it( 'returns undefined if an invalid extension is given', () => {

			expect( getMimeType( 'file' ) ).toBeUndefined()

		} )


		it( 'returns undefined no extension could be found', () => {

			expect( getMimeType( '' ) ).toBeUndefined()

		} )

	} )


	describe( 'getAllowedMimeTypes', () => {

		it( 'returns ["*"] for undefined or "*" input', () => {
			expect( getAllowedMimeTypes() ).toEqual( [ '*' ] )
			expect( getAllowedMimeTypes( '*' ) ).toEqual( [ '*' ] )
		} )


		it( 'returns all MIME types for a given type', () => {

			expect( getAllowedMimeTypes( 'image' ) )
				.toEqual( arrayUnique( Object.values( IMAGE_MIME_TYPES ) ) )

		} )


		it( 'returns all MIME types for a given type/*', () => {

			expect( getAllowedMimeTypes( 'audio/*' ) )
				.toEqual( arrayUnique( Object.values( AUDIO_MIME_TYPES ) ) )

		} )


		it( 'returns all MIME types for multiple types', () => {

			const expectedResult = arrayUnique(
				( Object.values( IMAGE_MIME_TYPES ) as string[] )
					.concat( Object.values( VIDEO_MIME_TYPES ) as string[] )
			)

			expect( getAllowedMimeTypes( 'image,video' ) )
				.toEqual( expectedResult )
			
			expect( getAllowedMimeTypes( 'image/*,video/*' ) )
				.toEqual( expectedResult )

		} )


		it( 'returns the correct MIME type for extension', () => {

			expect( getAllowedMimeTypes( '.mp3' ) ).toEqual( [ 'audio/mpeg' ] )
			expect( getAllowedMimeTypes( '.pdf' ) ).toEqual( [ 'application/pdf' ] )

		} )


		it( 'returns correct MIME types for multiple extensions', () => {

			expect( getAllowedMimeTypes( '.mp3,mp4' ) )
				.toEqual( [ 'audio/mpeg', 'video/mp4' ] )

		} )


		it( 'returns the correct MIME type for explicit MIME type', () => {

			expect( getAllowedMimeTypes( 'image/jpeg' ) ).toEqual( [ 'image/jpeg' ] )
			expect( getAllowedMimeTypes( 'application/pdf' ) ).toEqual( [ 'application/pdf' ] )

		} )


		it( 'handles spaces and dots in accept string', () => {

			expect( getAllowedMimeTypes( '.jpg, .png' ) )
				.toEqual( [ 'image/jpeg', 'image/png' ] )

		} )


		it( 'removes duplicates', () => {

			expect( getAllowedMimeTypes( 'image/jpeg,.jpg' ) ).toEqual( [ 'image/jpeg' ] )

		} )


		it( 'returns an empty array if an invalid type and a wildcard subtype is given', () => {

			expect( getAllowedMimeTypes( 'invalid/*' ) ).toEqual( [] )

		} )
		

		it( 'ignores the given type if the given subtype is valid', () => {

			expect( getAllowedMimeTypes( 'invalid/jpeg' ) ).toEqual( [ 'image/jpeg' ] )

		} )

	} )

} )
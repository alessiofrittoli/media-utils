import { formatMediaTiming } from '@/utils'

describe( 'utils', () => {

	describe( 'formatMediaTiming', () => {
	
		it( 'formats seconds without hours', () => {

			expect( formatMediaTiming( 125 ) ).toBe( '2:05' )
			expect( formatMediaTiming( 45 ) ).toBe( '0:45' )
			expect( formatMediaTiming( 90 ) ).toBe( '1:30' )

		} )

	
		it( 'formats seconds with hours when showHours is true', () => {

			expect( formatMediaTiming( 15600, true ) ).toBe( '4:20:00' )
			expect( formatMediaTiming( 3661, true ) ).toBe( '1:01:01' )
			expect( formatMediaTiming( 7200, true ) ).toBe( '2:00:00' )

		} )

	
		it( 'returns "0:00" for zero or invalid time', () => {

			expect( formatMediaTiming( 0 ) ).toBe( '0:00' )
			expect( formatMediaTiming( -NaN ) ).toBe( '0:00' )
			expect( formatMediaTiming( NaN ) ).toBe( '0:00' )
			expect( formatMediaTiming( -Infinity ) ).toBe( '0:00' )
			expect( formatMediaTiming( Infinity ) ).toBe( '0:00' )

		} )


		it( 'returns "0:00:00" for zero or invalid time if showHours is true', () => {

			expect( formatMediaTiming( 0, true ) ).toBe( '0:00:00' )
			expect( formatMediaTiming( -NaN, true ) ).toBe( '0:00:00' )
			expect( formatMediaTiming( NaN, true ) ).toBe( '0:00:00' )
			expect( formatMediaTiming( -Infinity, true ) ).toBe( '0:00:00' )
			expect( formatMediaTiming( Infinity, true ) ).toBe( '0:00:00' )

		} )

	
		it( 'handles edge cases', () => {

			expect( formatMediaTiming( 59 ) ).toBe( '0:59' )
			expect( formatMediaTiming( 60 ) ).toBe( '1:00' )
			expect( formatMediaTiming( 3599 ) ).toBe( '59:59' )
			expect( formatMediaTiming( 3600, true ) ).toBe( '1:00:00' )

		} )

	
		it( 'pads minutes and seconds correctly', () => {

			expect( formatMediaTiming( 5 ) ).toBe( '0:05' )
			expect( formatMediaTiming( 65 ) ).toBe( '1:05' )
			expect( formatMediaTiming( 3605, true ) ).toBe( '1:00:05' )

		} )
	
	} )

} )

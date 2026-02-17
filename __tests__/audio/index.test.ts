import { getEngine, destroyEngine } from '@/audio'
import { AudioEngine } from '@/audio/engine'

describe( 'AudioEngine', () => {

	describe( 'getEngine', () => {

		it( 'creates a new AudioEngine instance for a media element', () => {
			
			const engine	= getEngine( {} as HTMLMediaElement )
			const engine2	= getEngine( {} as HTMLMediaElement )
			
			expect( engine ).toBeInstanceOf( AudioEngine )
			expect( engine2 ).toBeInstanceOf( AudioEngine )
			expect( engine ).not.toBe( engine2 )

		} )


		it( 'returns the same AudioEngine instance for the same media element', () => {
			
			const media = {} as HTMLMediaElement
			
			expect( getEngine( media ) )
				.toBe( getEngine( media ) )

		} )

	} )


	describe( 'destroyEngine', () => {

		it( 'returns true when destroying an existing engine', () => {

			const media = {} as HTMLMediaElement

			getEngine( media )

		 	expect( destroyEngine( media ) ).toBe( true )

		} )


		it( 'returns false when destroying a non-existent engine', () => {

			expect( destroyEngine( {} as HTMLMediaElement ) ).toBe( false )

		} )


		it( 'removes the engine so a new one is created on next getEngine call', () => {

			const media		= {} as HTMLMediaElement
			const engine1	= getEngine( media )
			
			destroyEngine( media )

			expect( engine1 )
				.not.toBe( getEngine( media ) )

		} )

	} )

} )
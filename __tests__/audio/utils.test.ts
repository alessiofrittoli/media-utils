import { getEngine } from '@/audio'
import { fadeVolume } from '@/audio/utils'
import type { AudioEngine, FadeVolumeOptions } from '@/audio/engine'

jest.mock( '@/audio' )

describe( 'Audio utils', () => {

	describe( 'fadeVolume', () => {
		
		let mockMedia: HTMLMediaElement
		let mockFade: jest.Mock
		let mockGetEngine: jest.MockedFunction<typeof getEngine>
	
		beforeEach( () => {
			mockMedia		= {} as HTMLMediaElement
			mockFade		= jest.fn()
			mockGetEngine	= getEngine as jest.MockedFunction<typeof getEngine>
	
			mockGetEngine.mockReturnValue( {
				fade: mockFade,
			} as unknown as AudioEngine )
		} )
	
		
		afterEach( () => {
			jest.clearAllMocks()
		} )
	
	
		it( 'calls getEngine with the media element', () => {
	
			const options: FadeVolumeOptions = { to: 0, duration: 1000 }
	
			fadeVolume( mockMedia, options )
	
			expect( mockGetEngine ).toHaveBeenCalledWith( mockMedia )
			expect( mockGetEngine ).toHaveBeenCalledTimes( 1 )
	
		} )
	
	
		it( 'calls fade method with provided options', () => {
	
			const options: FadeVolumeOptions = { to: 0, duration: 1000 }
	
			fadeVolume( mockMedia, options )
	
			expect( mockFade ).toHaveBeenCalledWith( options )
			expect( mockFade ).toHaveBeenCalledTimes( 1 )
	
		} )
		
	} )

} )
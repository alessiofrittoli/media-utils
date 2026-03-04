import { getConnection, type Connection } from '@alessiofrittoli/web-utils'
import { getEngine } from '@/audio'
import { fadeVolume } from '@/audio/utils'
import type { AudioEngine, FadeVolumeOptions } from '@/audio/engine'
import { getPreloadStrategy } from '@/utils'

jest.mock( '@/audio' )
jest.mock( '@alessiofrittoli/web-utils' )


describe( 'Media utils', () => {

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


	describe( 'getPreloadStrategy', () => {

		let mockGetConnection: jest.MockedFunction<typeof getConnection>

		beforeEach( () => {
			mockGetConnection = getConnection as jest.MockedFunction<typeof getConnection>
		} )

		afterEach( () => {
			jest.clearAllMocks()
		} )


		it( 'returns "auto" when network connection is unavailable', () => {

			mockGetConnection.mockReturnValue( {} as Connection )

			expect( getPreloadStrategy() ).toBe( 'auto' )

		} )


		it( 'returns "none" when data saver mode is enabled', () => {

			mockGetConnection.mockReturnValue( {
				network: { saveData: true, effectiveType: '4g' }
			} as Connection )

			expect( getPreloadStrategy() ).toBe( 'none' )

		} )


		it( 'returns "metadata" for slow-2g connection', () => {

			mockGetConnection.mockReturnValue( {
				network: { saveData: false, effectiveType: 'slow-2g' },
			} as Connection )

			expect( getPreloadStrategy() ).toBe( 'metadata' )

		} )


		it( 'returns "metadata" for 2g connection', () => {

			mockGetConnection.mockReturnValue( {
				network: { saveData: false, effectiveType: '2g' },
			} as Connection )

			expect( getPreloadStrategy() ).toBe( 'metadata' )

		} )


		it( 'returns "auto" for 3g connection', () => {

			mockGetConnection.mockReturnValue( {
				network: { saveData: false, effectiveType: '3g' },
			} as Connection )

			expect( getPreloadStrategy() ).toBe( 'auto' )

		} )


		it( 'returns "auto" for 4g connection', () => {

			mockGetConnection.mockReturnValue( {
				network: { saveData: false, effectiveType: '4g' },
			} as Connection )

			expect( getPreloadStrategy() ).toBe( 'auto' )

		} )

	} )

} )
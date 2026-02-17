import { AudioEngine } from '@/audio/engine'

describe( 'AudioEngine', () => {

	describe( 'AudioEngine.VolumeToGain()', () => {

		it( 'converts 0 volume to 0 gain', () => {
			expect( AudioEngine.VolumeToGain( 0 ) ).toBe( 0 )
		} )


		it( 'converts 1 volume to 1 gain', () => {
			expect( AudioEngine.VolumeToGain( 1 ) ).toBe( 1 )
		} )


		it( 'converts 0.5 volume to expected gain', () => {
			expect( AudioEngine.VolumeToGain( 0.5 ) ).toBeCloseTo( 0.03, 0.04 )
		} )


		it( 'returns 0 gain if below threshold', () => {
			expect( AudioEngine.VolumeToGain( 0.000000000000000001 ) ).toBe( 0 )
		} )


		it( 'clamps volume between 0 and 1', () => {
			expect( AudioEngine.VolumeToGain( -1 ) ).toBe( 0 )
			expect( AudioEngine.VolumeToGain( 2 ) ).toBe( 1 )
		} )

	} )


	describe( 'AudioEngine.GainToVolume()', () => {

		it( 'converts 0 gain to 0 volume', () => {
			expect( AudioEngine.GainToVolume( 0 ) ).toBe( 0 )
		} )


		it( 'converts gain close to 1 to volume close to 1', () => {
			expect( AudioEngine.GainToVolume( 0.9 ) ).toBeCloseTo( 0.98, 0.99 )
		} )


		it( 'converts intermediate gain to intermediate volume', () => {
			expect( AudioEngine.GainToVolume( 0.5 ) ).toBeCloseTo( 0.89, 0.90 )
		} )


		it( 'clamps volume between 0 and 1', () => {
			expect( AudioEngine.GainToVolume( -1 ) ).toBe( 0 )
			expect( AudioEngine.GainToVolume( 2 ) ).toBe( 1 )
		} )

	} )

	
	describe( 'AudioEngine.normalize()', () => {

		it( 'normalizes volume when normalize is not set or set to true', () => {
			expect( AudioEngine.normalize( 0.5 ) )
				.toBe( AudioEngine.VolumeToGain( 0.5 ) )
		} )


		it( 'returns original volume when normalize is set to false', () => {
			expect( AudioEngine.normalize( 0.5, false ) ).toBe( 0.5 )
		} )

	} )


	describe( 'AudioEngine.denormalize()', () => {

		it( 'denormalizes gain when normalize is not set or set to true', () => {
			expect( AudioEngine.denormalize( 0.5 ) )
				.toBe( AudioEngine.GainToVolume( 0.5 ) )
		} )


		it( 'returns original gain when normalize is set to false', () => {
			expect( AudioEngine.denormalize( 0.5, false ) ).toBe( 0.5 )
		} )

	} )


	describe( 'AudioEngine.fadeVolume()', () => {

		it( 'calls Tween.to with correct parameters', () => {

			const media			= { volume: 0.5 } as HTMLMediaElement
			const engine		= new AudioEngine( media )
			const tweenToMock	= (
				jest.spyOn( engine[ 'tween' ], 'to' )
					.mockImplementation( () => {} )
			)

			const onTick = jest.fn()
			engine.fade( { to: 0.8, duration: 100, onTick } )

			expect( tweenToMock ).toHaveBeenCalledWith( 0.8, expect.objectContaining( {
				from	: 0.5,
				strategy: 'timer',
				onTick	: expect.any( Function )
			} ) )

			tweenToMock.mockRestore()

		} )


		it( 'updates media volume and call onTick', () => {

			const media			= { volume: 0.5 } as HTMLMediaElement
			const engine		= new AudioEngine(media)
			const tweenToMock	= jest.spyOn( engine[ 'tween' ], 'to' ).mockImplementation( ( to, opts ) => {
				// Simulate onTick callback
				opts.onTick?.( to )
			} )

			const onTick = jest.fn()
			engine.fade( { to: 0.8, duration: 100, onTick } )

			expect( media.volume ).toBeCloseTo( 0.8, 0.9 )
			expect( onTick ).toHaveBeenCalledWith( expect.any( Number ) )

			tweenToMock.mockRestore()

		} )

	} )

} )
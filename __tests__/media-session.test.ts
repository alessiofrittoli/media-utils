/**
 * @jest-environment jsdom
 */

import {
	updatePositionState,
	updateMediaMetadata,
	updateMediaMetadataAndPosition,
	Media,
} from '@/media-session'


describe( 'MediaSession', () => {

	let originalMediaSession: MediaSession
	let originalMediaMetadata: typeof window.MediaMetadata

	beforeEach( () => {

		originalMediaSession	= navigator.mediaSession
		originalMediaMetadata	= window.MediaMetadata

		Object.defineProperty( navigator, 'mediaSession', {
			configurable	: true,
			writable		: true,
			value			: {
				setPositionState	: jest.fn(),
				metadata			: undefined,
			},
		} )

		window.MediaMetadata = jest.fn().mockImplementation( data => data )

	} )


	afterEach( () => {

		Object.defineProperty( navigator, 'mediaSession', {
			configurable	: true,
			writable		: true,
			value			: originalMediaSession,
		} )

		window.MediaMetadata = originalMediaMetadata

		jest.clearAllMocks()

	} )

	describe( 'updatePositionState', () => {

		it( 'calls setPositionState with correct values', () => {

			const media = {
				duration		: 120,
				playbackRate	: 1,
				currentTime		: 30,
			} as HTMLMediaElement

			updatePositionState( media )

			expect( navigator.mediaSession.setPositionState ).toHaveBeenCalledWith( {
				duration		: 120,
				playbackRate	: 1,
				position		: 30,
			} )

		} )


		it( 'handles NaN duration - unloaded media', () => {

			const media = {
				duration		: NaN,
				playbackRate	: 1,
				currentTime		: 10,
			} as HTMLMediaElement

			updatePositionState( media )

			expect( navigator.mediaSession.setPositionState ).toHaveBeenCalledWith( {
				duration		: undefined,
				playbackRate	: 1,
				position		: 10,
			} )

		} )


		it( 'outputs warning if mediaSession or setPositionState is unavailable', () => {

			const warnSpy = (
				jest.spyOn( console, 'warn' ).mockImplementation( () => {} )
			)
			
			Object.defineProperty( navigator, 'mediaSession', {
				configurable	: true,
				writable		: true,
				value			: undefined,
			} )

			const media = {} as HTMLMediaElement
			
			updatePositionState( media )

			expect( warnSpy ).toHaveBeenCalledWith(
				"Couldn't update media session position state. The API is currently unavailable."
			)

			warnSpy.mockRestore()

		} )

	} )


	describe( 'updateMediaMetadata', () => {

		it( 'sets mediaSession.metadata with formatted artwork data', () => {

			const data: Media = {
				src		: 'media.mp3',
				type	: 'audio',
				title	: 'Test Song',
				artist	: 'Test Artist',
				album	: 'Test Album',
				artwork	: [
					{ src: { hostname: 'example.com', pathname: 'art.png' }, size: 128, type: 'image/png' },
				],
			}

			updateMediaMetadata( data )

			const formatted = {
				...data,
				artwork: [
					{
						sizes	: '128x128',
						type	: 'image/png',
						src		: 'http://example.com/art.png',
					},
				],
			}

			expect( window.MediaMetadata ).toHaveBeenCalledWith( formatted )
			expect( navigator.mediaSession.metadata ).toEqual( formatted )

		} )


		it( 'handles missing artwork', () => {
			
			const data: Media = {
				type	: 'audio',
				title	: 'No Artwork',
				src		: '',
			}

			updateMediaMetadata( data )

			expect( window.MediaMetadata ).toHaveBeenCalledWith( {
				...data,
				artwork: undefined,
			} )

		} )


		it( 'outputs warning if mediaSession or MediaMetadata is unavailable', () => {
			
			const warnSpy = (
				jest.spyOn( console, 'warn' ).mockImplementation( () => {} )
			)

			Object.defineProperty( navigator, 'mediaSession', {
				configurable	: true,
				writable		: true,
				value			: undefined,
			} )

			updateMediaMetadata( { type: 'audio' } )

			expect( warnSpy ).toHaveBeenCalledWith(
				"Couldn't update MediaSession metadata. The API is currently unavailable."
			)

			warnSpy.mockRestore()

		} )

	} )


	describe( 'updateMediaMetadataAndPosition', () => {

		it( 'calls updateMediaMetadata and updatePositionState', () => {

			const media = {
				duration		: 120,
				playbackRate	: 1,
				currentTime		: 30,
			} as HTMLMediaElement

			const data: Media = {
				src		: 'media.mp3',
				type	: 'audio',
				title	: 'Test Song',
				artist	: 'Test Artist',
				album	: 'Test Album',
				artwork	: [
					{ src: { hostname: 'example.com', pathname: 'art.png' }, size: 128, type: 'image/png' },
				],
			}

			updateMediaMetadataAndPosition( { media, data } )

			expect( navigator.mediaSession.setPositionState ).toHaveBeenCalledWith( {
				duration		: 120,
				playbackRate	: 1,
				position		: 30,
			} )

			const formatted = {
				...data,
				artwork: [
					{
						sizes	: '128x128',
						type	: 'image/png',
						src		: 'http://example.com/art.png',
					},
				],
			}

			expect( window.MediaMetadata ).toHaveBeenCalledWith( formatted )
			expect( navigator.mediaSession.metadata ).toEqual( formatted )

		} )

	} )

} )
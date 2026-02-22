import { Url, type UrlInput } from '@alessiofrittoli/url-utils'
import type { MediaType, MIMEType } from '@/mime'

/**
 * The Media Artwork.
 * 
 * Compatible type with {@link MediaImage}.
 */
export interface MediaArtWork
{
	/**
	 * The Media Artwork image URL.
	 * 
	 */
	src: UrlInput
	/**
	 * The Media Artwork image size.
	 * 
	 * Common values are:
	 * - 96
	 * - 128
	 * - 192
	 * - 256
	 * - 384
	 * - 512
	 */
	sizes?: number | [ number ] | [ number, number ]
	/**
	 * The Media Artwork image MIME type.
	 * 
	 */
	type?: MIMEType
}


/**
 * Defines the media.
 * 
 */
export interface Media extends Partial<Omit<MediaMetadata, 'artwork'>>
{
	/**
	 * The media URL.
	 * 
	 */
	src: UrlInput
	/**
	 * The media type.
	 * 
	 */
	type: MediaType
	/**
	 * The title of the media.
	 * 
	 */
	title?: string
	/**
	 * The media artwork.
	 * 
	 */
	artwork?: MediaArtWork[] | readonly MediaArtWork[]
	/**
	 * The media video artwork.
	 * 
	 */
	videoArtwork?: MediaArtWork[] | readonly MediaArtWork[]
	/**
	 * The artist of the media.
	 * 
	 */
	artist?: string
	/**
	 * The album of the media.
	 * 
	 */
	album?: string
}


export type MediaSessionMetadata = Omit<Media, 'src' | 'type'>


/**
 * Defines the MediaSession update options.
 * 
 */
export interface UpdateMediaMetadataAndPositionOptions
{
	/**
	 * The HTMLMediaElement.
	 * 
	 */
	media: HTMLMediaElement
	/**
	 * The playing media data.
	 * 
	 */
	data: MediaSessionMetadata
}


/**
 * Update `MediaSession` position state.
 * 
 * @param media The HTMLMediaElement.
 */
export const updatePositionState = ( media: HTMLMediaElement ) => {
	
	if ( ! navigator.mediaSession || ! ( 'setPositionState' in navigator.mediaSession ) ) {
		return console.warn( 'Couldn\'t update media session position state. The API is currently unavailable.' )
	}
	
	navigator.mediaSession.setPositionState( {
		duration	: ! isNaN( media.duration ) ? media.duration : undefined,
		playbackRate: media.playbackRate,
		position	: media.currentTime,
	} )
	
}


/**
 * Update `MediaSession` metadata.
 * 
 * @param data The playing media data.
 */
export const updateMediaMetadata = ( data: MediaSessionMetadata ) => {

	if ( ! navigator.mediaSession || typeof MediaMetadata === 'undefined' ) {
		return console.warn( 'Couldn\'t update MediaSession metadata. The API is currently unavailable.' )
	}

	const { title, album, artist, artwork } = data

	navigator.mediaSession.metadata = new MediaMetadata( {
		title, album, artist,
		artwork	: artwork?.map( ( { src, type, sizes: inputSizes = [] } ) => {

			const sizes = (
				Array.isArray( inputSizes )
					? [ inputSizes.at( 0 ) || inputSizes.at( 1 ), inputSizes.at( 1 ) || inputSizes.at( 0 ) ]
					: [ inputSizes, inputSizes ]
			)
			.filter( n => typeof n === 'number' && ! isNaN( n ) )
			.join( 'x' )

			return {
				sizes, src: Url.format( src ), type
			}

		} ),
	} )

}


/**
 * Update `MediaSession` metadata and position state.
 * 
 * @param options An object defining `media` HTMLMediaElement and associated data. See {@link UpdateMediaMetadataAndPositionOptions} for more info.
 */
export const updateMediaMetadataAndPosition = ( options: UpdateMediaMetadataAndPositionOptions ) => {

	const { media, data } = options

	updateMediaMetadata( data )
	updatePositionState( media )

}
import { Url, type UrlInput } from '@alessiofrittoli/url-utils'
import type { MIMEType } from '@/mime'

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
	size?: number
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
	 * The media MIME type.
	 * 
	 */
	type: MIMEType
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
	data: Omit<Media, 'src'>
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
export const updateMediaMetadata = ( data: Omit<Media, 'src'> ) => {

	if ( ! navigator.mediaSession || typeof MediaMetadata === 'undefined' ) {
		return console.warn( 'Couldn\'t update MediaSession metadata. The API is currently unavailable.' )
	}
	
	navigator.mediaSession.metadata = new MediaMetadata( {
		...data,
		artwork	: data.artwork?.map( ( { src, size, ...rest } ) => ( {
			sizes: [ size, size ].join( 'x' ),
			...rest, src: Url.format( src ),
		} ) ),
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
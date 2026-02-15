import { arrayUnique } from '@alessiofrittoli/web-utils'

/**
 * Represents `text/*` MIME types.
 * 
 */
export const TEXT_MIME_TYPES = {
	body	: 'text/html',
	css		: 'text/css',
	csv		: 'text/csv',
	etx		: 'text/x-setext',
	htc		: 'text/x-component',
	htm		: 'text/html',
	html	: 'text/html',
	ics		: 'text/calendar',
	jad		: 'text/vnd.sun.j2me.app-descriptor',
	java	: 'text/x-java-source',
	jsf		: 'text/plain',
	jspf	: 'text/plain',
	man		: 'text/troff',
	me		: 'text/troff',
	mjs		: 'text/javascript',
	roff	: 'text/troff',
	rtx		: 'text/richtext',
	t		: 'text/troff',
	tr		: 'text/troff',
	tsv		: 'text/tab-separated-values',
	txt		: 'text/plain',
	wml		: 'text/vnd.wap.wml',
	wmls	: 'text/vnd.wap.wmlsc',
	md		: 'text/markdown',
} as const


/**
 * Represents `image/*` MIME types.
 * 
 */
export const IMAGE_MIME_TYPES = {
	art		: 'image/x-jg',
	avif	: 'image/avif',
	bmp		: 'image/bmp',
	dib		: 'image/bmp',
	gif		: 'image/gif',
	ico		: 'image/vnd.microsoft.icon',
	ief		: 'image/ief',
	jpe		: 'image/jpeg',
	jpeg	: 'image/jpeg',
	jpg		: 'image/jpeg',
	mac		: 'image/x-macpaint',
	pbm		: 'image/x-portable-bitmap',
	pct		: 'image/pict',
	pgm		: 'image/x-portable-graymap',
	pic		: 'image/pict',
	pict	: 'image/pict',
	png		: 'image/png',
	apng	: 'image/apng',
	pnm		: 'image/x-portable-anymap',
	pnt		: 'image/x-macpaint',
	ppm		: 'image/x-portable-pixmap',
	psd		: 'image/vnd.adobe.photoshop',
	qti		: 'image/x-quicktime',
	qtif	: 'image/x-quicktime',
	ras		: 'image/x-cmu-raster',
	rgb		: 'image/x-rgb',
	svg		: 'image/svg+xml',
	svgz	: 'image/svg+xml',
	tif		: 'image/tiff',
	tiff	: 'image/tiff',
	xbm		: 'image/x-xbitmap',
	xpm		: 'image/x-xpixmap',
	xwd		: 'image/x-xwindowdump',
	webp	: 'image/webp',
	wbmp	: 'image/vnd.wap.wbmp',
} as const


/**
 * Represents `audio/*` MIME types.
 * 
 */
export const AUDIO_MIME_TYPES = {
	aac		: 'audio/aac',
	abs		: 'audio/x-mpeg',
	aif		: 'audio/x-aiff',
	aifc	: 'audio/x-aiff',
	aiff	: 'audio/x-aiff',
	au		: 'audio/basic',
	kar		: 'audio/midi',
	m3u		: 'audio/x-mpegurl',
	mid		: 'audio/midi',
	midi	: 'audio/midi',
	m4a		: 'audio/x-m4a',
	mp1		: 'audio/mpeg',
	mp2		: 'audio/mpeg',
	mp3		: 'audio/mpeg',
	mpa		: 'audio/mpeg',
	mp4		: 'audio/mp4',
	mpega	: 'audio/x-mpeg',
	oga		: 'audio/ogg',
	ogg		: 'audio/ogg',
	opus	: 'audio/ogg',
	spx		: 'audio/ogg',
	flac	: 'audio/flac',
	axa		: 'audio/annodex',
	snd		: 'audio/basic',
	pls		: 'audio/x-scpls',
	ulw		: 'audio/basic',
	wav		: 'audio/wav',
	weba	: 'audio/webm',
	wma		: 'audio/x-ms-wma',
	'3gp'	: 'audio/3gpp',
	'3g2'	: 'audio/3gpp2',
} as const


/**
 * Represents `video/*` MIME types.
 * 
 */
export const VIDEO_MIME_TYPES = {
	asf		: 'video/x-ms-asf',
	asx		: 'video/x-ms-asf',
	avi		: 'video/x-msvideo',
	avx		: 'video/x-rad-screenplay',
	dv		: 'video/x-dv',
	mov		: 'video/quicktime',
	movie	: 'video/x-sgi-movie',
	mp4		: 'video/mp4',
	mpe		: 'video/mpeg',
	mpeg	: 'video/mpeg',
	mpg		: 'video/mpeg',
	mpv2	: 'video/mpeg2',
	ogv		: 'video/ogg',
	axv		: 'video/annodex',
	qt		: 'video/quicktime',
	ts		: 'video/mp2t',
	webm	: 'video/webm',
	wmv		: 'video/x-ms-wmv',
	'3gp'	: 'video/3gpp',
	'3g2'	: 'video/3gpp2',
} as const


/**
 * Represents `font/*` MIME types.
 * 
 */
export const FONT_MIME_TYPES = {
	ttf		: 'font/ttf',
	otf		: 'font/otf',
	woff	: 'font/woff',
	woff2	: 'font/woff2',
} as const


/**
 * Represents `model/*` MIME types.
 * 
 */
export const MODEL_MIME_TYPES = {
	wrl: 'model/vrml',
} as const


/**
 * Represents `application/*` MIME types.
 * 
 */
export const APPLICATION_MIME_TYPES = {
	abw			: 'application/x-abiword',
	ai			: 'application/postscript',
	aim			: 'application/x-aim',
	arc			: 'application/x-freearc',
	azw			: 'application/vnd.amazon.ebook',
	bcpio		: 'application/x-bcpio',
	bin			: 'application/octet-stream',
	bz			: 'application/x-bzip',
	bz2			: 'application/x-bzip2',
	cda			: 'application/x-cdf',
	cdf			: 'application/x-cdf',
	cer			: 'application/pkix-cert',
	class		: 'application/java',
	cpio		: 'application/x-cpio',
	csh			: 'application/x-csh',
	dll			: 'application/x-msdownload',
	doc			: 'application/msword',
	docx		: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	dtd			: 'application/xml-dtd',
	dvi			: 'application/x-dvi',
	eot			: 'application/vnd.ms-fontobject',
	eps			: 'application/postscript',
	epub		: 'application/epub+zip',
	exe			: 'application/octet-stream',
	gtar		: 'application/x-gtar',
	gz			: 'application/gzip', // Note, Windows and macOS upload .gz files with the non-standard MIME type application/x-gzip.
	hdf			: 'application/x-hdf',
	hqx			: 'application/mac-binhex40',
	jar			: 'application/java-archive',
	jnlp		: 'application/x-java-jnlp-file',
	js			: 'application/javascript',
	json		: 'application/json',
	jsonld		: 'application/ld+json',
	jsx			: 'application/javascript',
	latex		: 'application/x-latex',
	mathml		: 'application/mathml+xml',
	mif			: 'application/x-mif',
	mpkg		: 'application/vnd.apple.installer+xml',
	ms			: 'application/x-wais-source',
	nc			: 'application/x-netcdf',
	oda			: 'application/oda',
	odb			: 'application/vnd.oasis.opendocument.database',
	odc			: 'application/vnd.oasis.opendocument.chart',
	odf			: 'application/vnd.oasis.opendocument.formula',
	odg			: 'application/vnd.oasis.opendocument.graphics',
	odi			: 'application/vnd.oasis.opendocument.image',
	odm			: 'application/vnd.oasis.opendocument.text-master',
	odp			: 'application/vnd.oasis.opendocument.presentation',
	ods			: 'application/vnd.oasis.opendocument.spreadsheet',
	odt			: 'application/vnd.oasis.opendocument.text',
	otg			: 'application/vnd.oasis.opendocument.graphics-template',
	oth			: 'application/vnd.oasis.opendocument.text-web',
	otp			: 'application/vnd.oasis.opendocument.presentation-template',
	ots			: 'application/vnd.oasis.opendocument.spreadsheet-template',
	ott			: 'application/vnd.oasis.opendocument.text-template',
	ogx			: 'application/ogg',
	otf			: 'application/x-font-opentype',
	anx			: 'application/annodex',
	xspf		: 'application/xspf+xml',
	pdf			: 'application/pdf',
	php			: 'application/x-httpd-php',
	ppt			: 'application/vnd.ms-powerpoint',
	pptx		: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	pps			: 'application/vnd.ms-powerpoint',
	ps			: 'application/postscript',
	rar			: 'application/vnd.rar',
	rdf			: 'application/rdf+xml',
	rm			: 'application/vnd.rn-realmedia',
	rtf			: 'application/rtf',
	sfnt		: 'application/font-sfnt',
	sh			: 'application/x-sh',
	shar		: 'application/x-shar',
	sit			: 'application/x-stuffit',
	src			: 'application/x-wais-source',
	sv4cpio		: 'application/x-sv4cpio',
	sv4crc		: 'application/x-sv4crc',
	swf			: 'application/x-shockwave-flash',
	tar			: 'application/x-tar',
	tcl			: 'application/x-tcl',
	tex			: 'application/x-tex',
	texi		: 'application/x-texinfo',
	texinfo		: 'application/x-texinfo',
	ustar		: 'application/x-ustar',
	vxml		: 'application/voicexml+xml',
	xht			: 'application/xhtml+xml',
	xhtml		: 'application/xhtml+xml',
	xls			: 'application/vnd.ms-excel',
	xlsx		: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	xml			: 'application/xml',
	xsl			: 'application/xml',
	xslt		: 'application/xslt+xml',
	xul			: 'application/vnd.mozilla.xul+xml',
	vsd			: 'application/vnd.visio',
	wmlc		: 'application/vnd.wap.wmlc',
	wmlscriptc	: 'application/vnd.wap.wmlscriptc',
	// woff		: 'application/font-woff',
	// woff2		: 'application/font-woff2',
	wspolicy	: 'application/wspolicy+xml',
	z			: 'application/x-compress',
	zip			: 'application/zip', // Note, Windows uploads .zip files with the non-standard MIME type application/x-zip-compressed.
	manifest	: 'application/manifest+json',
	'7z'		: 'application/x-7z-compressed',
} as const


/**
 * A map of MIME `type` with their relative `subtypes` indexed by file extensions.
 * 
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types)
 */
export const MIME_TYPES_MAP = {
	text		: TEXT_MIME_TYPES,
	image		: IMAGE_MIME_TYPES,
	audio		: AUDIO_MIME_TYPES,
	video		: VIDEO_MIME_TYPES,
	font		: FONT_MIME_TYPES,
	model		: MODEL_MIME_TYPES,
	application	: APPLICATION_MIME_TYPES,
} as const


/**
 * Represents the MIME `type`.
 * 
 */
export type MediaType = keyof typeof MIME_TYPES_MAP


/**
 * Represents the MIME type (`type/subtype`).
 * 
 */
export type MIMEType = (
	| typeof MIME_TYPES_MAP[ 'text' ][ keyof typeof MIME_TYPES_MAP[ 'text' ] ]
	| typeof MIME_TYPES_MAP[ 'image' ][ keyof typeof MIME_TYPES_MAP[ 'image' ] ]
	| typeof MIME_TYPES_MAP[ 'audio' ][ keyof typeof MIME_TYPES_MAP[ 'audio' ] ]
	| typeof MIME_TYPES_MAP[ 'video' ][ keyof typeof MIME_TYPES_MAP[ 'video' ] ]
	| typeof MIME_TYPES_MAP[ 'font' ][ keyof typeof MIME_TYPES_MAP[ 'font' ] ]
	| typeof MIME_TYPES_MAP[ 'model' ][ keyof typeof MIME_TYPES_MAP[ 'model' ] ]
	| typeof MIME_TYPES_MAP[ 'application' ][ keyof typeof MIME_TYPES_MAP[ 'application' ] ]
)


/**
 * Represents the file extension.
 * 
 */
export type Extension = (
	| keyof typeof MIME_TYPES_MAP[ 'text' ]
	| keyof typeof MIME_TYPES_MAP[ 'image' ]
	| keyof typeof MIME_TYPES_MAP[ 'audio' ]
	| keyof typeof MIME_TYPES_MAP[ 'video' ]
	| keyof typeof MIME_TYPES_MAP[ 'font' ]
	| keyof typeof MIME_TYPES_MAP[ 'model' ]
	| keyof typeof MIME_TYPES_MAP[ 'application' ]
)


/**
 * Get the file extension from the filename.
 * 
 * @param	filename The filename.
 * @returns	The file extension.
 */
export const getFileExtension = ( filename: string ) => (
	( filename.toLowerCase().split( '.' ).pop() || undefined ) as Extension | undefined
)


/**
 * Get the MIME type from the given `input` string.
 * 
 * @param input The input string where MIME type is extracted from.
 * @param type (Optional) Accepted media types. This may be usefull when subtype matches other media types (eg. `audio/mp4` - `video/mp4`).
 * @returns The MIME type if found, `undefined` otherwise.
 * 
 * @example
 * ```ts
 * console.log( getMimeType( '/path/to/video-file.mp4' ) ) // Outputs: 'video/mp4'
 * console.log( getMimeType( '/path/to/audio-file.mp4', 'audio' ) ) // Outputs: 'audio/mp4'
 * console.log( getMimeType( '/path/to/audio-file.mp3' ) ) // Outputs: 'audio/mpeg'
 * ```
 */
export const getMimeType = ( input: string, type?: MediaType ) => {

	const ext = getFileExtension( input )

	if ( ! ext ) return
	
	if ( type ) {

		const types = MIME_TYPES_MAP[ type ]

		if ( types ) {
			const mimeType	= types[ ext as keyof typeof types ] as MIMEType | undefined
			return mimeType
		}

	}

	let mimeType: MIMEType | undefined

	Object.values( MIME_TYPES_MAP ).forEach( map => {

		const result = map[ ext as keyof typeof map ]
		if ( ! result ) return
		
		mimeType = result

	} )

	return mimeType

}


/**
 * Check if the given `input` string is a MIME type.
 * 
 * ⚠️ This function is for INTERNAL use only, needed as type guard and used inside a business logic that performs other relevant checks.
 * 
 * @param input The input string to check.
 * @returns `true` if the given `input` is a valid MIME type, `false` otherwise.
 */
const isMimeType = ( input: string ): input is MIMEType => (
	input.includes( '/' ) && ( input.substring( 0, input.indexOf( '/' ) ) in MIME_TYPES_MAP )
)


/**
 * Get allowed MIME types based on {@link HTMLInputElement.accept} atribute value.
 * 
 * @param accept (Optional) The {@link HTMLInputElement.accept} atribute value. It could be one of the following examples:
 * 	- `*`
 * 	- `image` (type)
 * 	- `image/*` ({type}/{subtype})
 * 	- `image/png` ({type}/{subtype}) - specific
 * 	- `.png` (extension)
 * 	- `image,audio` (multiple types)
 * 	- `image/*,audio/*` (multiple {type}/{subtype})
 * 	- `.png, .mp3` (multiple extensions)
 * 	- `.docx, audio, video/*, text/html` (mixed)
 * 
 * @returns An array of MIME types based on the `accept` value. `[ '*' ]` if a wildcard or no `accept` is given.
 */
export const getAllowedMimeTypes = ( accept?: HTMLInputElement[ 'accept' ] ) => {

	if ( ! accept || accept === '*' ) return [ '*' ]

	const allowedMimeTypes: string[] = []

	const accepted = (
		accept
			.replace( /\s|\./g, '' )	// remove spaces and dots ( eg. use case '.jpg, .png' ).
			.split( ',' )				// split accepted mime types ( eg. use case 'jpg,png'|'image/jpg,image/png' ).
			.filter( Boolean )			// remove falsey entries ( eg. use case '.jpg,' ).
	)

	accepted.forEach( type => {

		// Retrieve anything after `/` of MIME type ( eg. use case 'image/jpg'|'image/*' ).
		const fileType = type.substring( type.indexOf( '/' ) + 1 )

		if ( fileType === '*' || fileType in MIME_TYPES_MAP ) {

			const mimeType = (
				fileType in MIME_TYPES_MAP
					? fileType
					// Retrieve anything before `/` of MIME type ( eg. use case 'image/*' will return `image` ).
					: type.substring( 0, type.indexOf( '/' ) )
			) as MediaType

			// Retrieve all MIME types for 'audio|video' etc...
			const mimeTypes = MIME_TYPES_MAP[ mimeType ]

			if ( mimeTypes ) {
				return allowedMimeTypes.push( ...Object.values( mimeTypes ) )
			}

		}

		const mimeType = isMimeType( type ) ? type : getMimeType( fileType )

		if ( mimeType ) {
			return allowedMimeTypes.push( mimeType )
		}
		
	} )

	return arrayUnique( allowedMimeTypes )

}
import { ErrorCode as Exception } from '@alessiofrittoli/exception/code';

export const MediaUtilsErrorCode = {
	PIP_NOT_SUPPORTED: 'ERR:PIPNOTSUPPORTED',
	RENDERING_CONTEXT_UNAVAILABLE: 'ERR:RENDERINGCONTEXTUNAVAILABLE',
} as const

export const ErrorCode = { ...Exception, ...MediaUtilsErrorCode }
export type ErrorCode = ( typeof ErrorCode )[ keyof typeof ErrorCode ]
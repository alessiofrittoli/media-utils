import { ErrorCode as Exception } from '@alessiofrittoli/exception/code'

export const ErrorCode = {
	...Exception,
	PIP_NOT_SUPPORTED: 'ERR:PIPNOTSUPPORTED',
	RENDERING_CONTEXT_UNAVAILABLE: 'ERR:RENDERINGCONTEXTUNAVAILABLE',
	NO_ARTWORK_AVAILABLE: 'ERR:NOARTWORKAVAILABLE',
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

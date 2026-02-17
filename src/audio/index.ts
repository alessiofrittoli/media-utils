import { AudioEngine } from './engine'
export * from '@/audio/engine'
export * from '@/audio/utils'

/**
 * A WeakMap that stores `AudioEngine` instances indexed by an `HTMLMediaElement`.
 * 
 * - When a media element is no longer referenced elsewhere, it becomes eligible for garbage collection.
 * - The associated AudioEngine can be automatically cleaned up.
 * - Prevents memory leaks without requiring manual bookkeeping
 */
const engines = new WeakMap<HTMLMediaElement, AudioEngine>()


/**
 * Get the `AudioEngine` associated with the given `media`.
 * If none exists, it lazily creates a new instance.
 * 
 * @param media The HTMLMediaElement.
 * @returns The `AudioEngine` associated with the given `media` or a new `AudioEngine` instance if none exists.
 */
export const getEngine = ( media: HTMLMediaElement ): AudioEngine => (
	engines.get( media ) || engines.set( media, new AudioEngine( media ) ).get( media )!
)


/**
 * Proactively delete the `AudioEngine` associated with the given `media` to free resources.
 * 
 * @param media The HTMLMediaElement.
 * @returns `true` if the element was successfully removed, `false` if no engine was registered.
 */
export const destroyEngine = ( media: HTMLMediaElement ) => (
	engines.delete( media )
)
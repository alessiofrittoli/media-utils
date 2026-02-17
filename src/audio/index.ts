import { AudioEngine } from './engine'
export * from '@/audio/engine'

const audioEngines = new WeakMap<HTMLMediaElement, AudioEngine>()

/**
 * Delete the `AudioEngine` associated with the given `media` to free-up memory.
 * 
 * @param media The HTMLMediaElement.
 * @returns `true` if the element was successfully removed, or `false` if it was not present.
 */
export const destroyEngine = ( media: HTMLMediaElement ) => (
	audioEngines.delete( media )
)


/**
 * Get the `AudioEngine` associated with the given `media`.
 * 
 * @param media The HTMLMediaElement.
 * @returns The AudioEngine associated with the given `media` or a new AudioEngine instance if not found.
 */
export const getEngine = ( media: HTMLMediaElement ): AudioEngine => (
	audioEngines.get( media ) || audioEngines.set( media, new AudioEngine( media ) ).get( media )!
)
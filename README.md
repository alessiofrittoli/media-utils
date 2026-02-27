<h1 align="center">Media Utils 🎥</h1>
<p align="center">
  TypeScript media utility library
</p>
<p align="center">
  <a href="https://npmjs.org/package/@alessiofrittoli/media-utils">
    <img src="https://img.shields.io/npm/v/@alessiofrittoli/media-utils" alt="Latest version"/>
  </a>
  <a href="https://coveralls.io/github/alessiofrittoli/media-utils">
    <img src="https://coveralls.io/repos/github/alessiofrittoli/media-utils/badge.svg" alt="Test coverage"/>
  </a>
  <a href="https://socket.dev/npm/package/@alessiofrittoli/media-utils/overview">
    <img src="https://socket.dev/api/badge/npm/package/@alessiofrittoli/media-utils" alt="Socket Security score"/>
  </a>
  <a href="https://npmjs.org/package/@alessiofrittoli/media-utils">
    <img src="https://img.shields.io/npm/dm/@alessiofrittoli/media-utils.svg" alt="npm downloads"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/media-utils">
    <img src="https://badgen.net/bundlephobia/dependency-count/@alessiofrittoli/media-utils" alt="Dependencies"/>
  </a>
  <a href="https://libraries.io/npm/%40alessiofrittoli%2Fmedia-utils">
    <img src="https://img.shields.io/librariesio/release/npm/@alessiofrittoli/media-utils" alt="Dependencies status"/>
  </a>
</p>
<p align="center">
  <a href="https://bundlephobia.com/package/@alessiofrittoli/media-utils">
    <img src="https://badgen.net/bundlephobia/min/@alessiofrittoli/media-utils" alt="minified"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/media-utils">
    <img src="https://badgen.net/bundlephobia/minzip/@alessiofrittoli/media-utils" alt="minizipped"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/media-utils">
    <img src="https://badgen.net/bundlephobia/tree-shaking/@alessiofrittoli/media-utils" alt="Tree shakable"/>
  </a>
</p>
<p align="center">
  <a href="https://github.com/sponsors/alessiofrittoli">
    <img src="https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2" alt="Fund this package"/>
  </a>
</p>

[sponsor-badge]: https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2
[sponsor-url]: https://github.com/sponsors/alessiofrittoli

### Table of Contents

- [Getting started](#getting-started)
- [API Reference](#api-reference)
  - [MIME types](#mime-types)
  - [MediaSession](#mediasession)
  - [AudioEngine](#audioengine)
    - [Audio Engine Manager](#audio-engine-manager)
    - [Audio Utilities](#audio-utilities)
  - [Media Playback](#media-playback)
  - [Image Video Stream](#image-video-stream)
  - [Media Artwork Picture-in-Picture](#media-artwork-picture-in-picture)
  - [Utilities](#utilities)
- [Development](#development)
  - [Install depenendencies](#install-depenendencies)
  - [Build the source code](#build-the-source-code)
  - [ESLint](#eslint)
  - [Jest](#jest)
- [Contributing](#contributing)
- [Security](#security)
- [Credits](#made-with-)

---

### Getting started

Run the following command to start using `media-utils` in your projects:

```bash
npm i @alessiofrittoli/media-utils
```

or using `pnpm`

```bash
pnpm i @alessiofrittoli/media-utils
```

---

### API Reference

#### MIME types

##### `getMimeType()`

Get the MIME type from the given `input` string.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type        | Description                                                                                                                 |
| --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| `input`   | `string`    | The input string where MIME type is extracted from.                                                                         |
| `type`    | `MediaType` | (Optional) Accepted media type. This may be usefull when subtype matches other media types (eg. `audio/mp4` - `video/mp4`). |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `MIMEType`

- The MIME type if found.
- `undefined` otherwise.

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { getMimeType } from "@alessiofrittoli/media-utils";

console.log(getMimeType("/path/to/video-file.mp4")); // Outputs: 'video/mp4'
console.log(getMimeType("/path/to/audio-file.mp4", "audio")); // Outputs: 'audio/mp4'
console.log(getMimeType("/path/to/audio-file.mp3")); // Outputs: 'audio/mpeg'
```

</details>

---

##### `getAllowedMimeTypes()`

Get allowed MIME types.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Description                                                                                                                                         |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accept`  | `string` | (Optioanl) A string describing allowed MIME types.                                                                                                  |
|           |          | The format is the same accepted by [`HTMLInputElement.accept`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/accept) attribute. |
|           |          | It could be one of the following examples:                                                                                                          |
|           |          | - `*`                                                                                                                                               |
|           |          | - `image` (type)                                                                                                                                    |
|           |          | - `image/*` ({type}/{subtype})                                                                                                                      |
|           |          | - `image/png` ({type}/{subtype}) - specific                                                                                                         |
|           |          | - `.png` (extension)                                                                                                                                |
|           |          | - `image,audio` (multiple types)                                                                                                                    |
|           |          | - `image/*,audio/*` (multiple {type}/{subtype})                                                                                                     |
|           |          | - `.png, .mp3` (multiple extensions)                                                                                                                |
|           |          | - `.docx, audio, video/*, text/html` (mixed)                                                                                                        |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `(MIMEType | '*')[]`

An array of MIME types based on the `accept` value. `[ '*' ]` if a wildcard or no `accept` is given.

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { getAllowedMimeTypes } from "@alessiofrittoli/media-utils";

console.log(getAllowedMimeTypes());
console.log(getAllowedMimeTypes("*"));
console.log(getAllowedMimeTypes("image"));
console.log(getAllowedMimeTypes("audio/*"));
console.log(getAllowedMimeTypes("image,video"));
console.log(getAllowedMimeTypes("image/*,video/*"));
console.log(getAllowedMimeTypes(".mp3,mp4"));
console.log(getAllowedMimeTypes(".jpg, .png"));
console.log(getAllowedMimeTypes("image/jpeg,.jpg"));
```

</details>

---

#### MediaSession

##### Types

###### `MediaArtWork`

The Media Artwork.

Compatible type with the global `MediaImage` interface.

<details>

<summary style="cursor:pointer">Properties</summary>

| Property | Type       | Description                                                                                         |
| -------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `src`    | `UrlInput` | The Media Artwork image URL.                                                                        |
|          |            | See [`UrlInput`](https://npmjs.com/package/@alessiofrittoli/url-utils#urlinput) type for more info. |
| `size`   | `number`   | The Media Artwork image size.                                                                       |
|          |            | Common values are: `96`, `128`, `192`, `256`, `384`, `512`.                                         |
| `type`   | `MIMEType` | The Media Artwork image MIME type.                                                                  |

</details>

---

###### `Media`

Defines the media.

Extends the global [`MediaMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/MediaMetadata) interface.

<details>

<summary style="cursor:pointer">Properties</summary>

| Property  | Type             | Description                                                                                         |
| --------- | ---------------- | --------------------------------------------------------------------------------------------------- |
| `src`     | `UrlInput`       | The media URL.                                                                                      |
|           |                  | See [`UrlInput`](https://npmjs.com/package/@alessiofrittoli/url-utils#urlinput) type for more info. |
| `type`    | `MIMEType`       | The media MIME type.                                                                                |
| `title`   | `string`         | The title of the media.                                                                             |
| `artwork` | `MediaArtWork[]` | The media artwork.                                                                                  |
|           |                  | See [`MediaArtWork`](#mediaartwork) type for more info.                                             |
| `artist`  | `string`         | The artist of the media.                                                                            |
| `album`   | `string`         | The album of the media.                                                                             |

</details>

---

###### `UpdateMediaMetadataAndPositionOptions`

Defines the MediaSession update options.

<details>

<summary style="cursor:pointer">Properties</summary>

| Property | Type                 | Description             |
| -------- | -------------------- | ----------------------- |
| `media`  | `HTMLMediaElement`   | The HTMLMediaElement.   |
| `data`   | `Omit<Media, 'src'>` | The playing media data. |

</details>

---

##### `updatePositionState()`

Update `MediaSession` position state.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type               | Description           |
| --------- | ------------------ | --------------------- |
| `media`   | `HTMLMediaElement` | The HTMLMediaElement. |

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { updatePositionState } from "@alessiofrittoli/media-utils";

navigator.mediaSession.setActionHandler("seekto", (details) => {
  if (typeof details.seekTime === "undefined") return;

  media.currentTime = details.seekTime;

  updatePositionState(media);
});
```

</details>

---

##### `updateMediaMetadata()`

Update `MediaSession` metadata.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type                 | Description             |
| --------- | -------------------- | ----------------------- |
| `data`    | `Omit<Media, 'src'>` | The playing media data. |

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { updateMediaMetadata } from "@alessiofrittoli/media-utils";

media.play().then(() => {
  updateMediaMetadata({
    type: "audio/mpeg",
    title: "Song name",
    album: "Album name",
    artist: "Artist name",
    artwork: [
      {
        src: { pathname: "/path-to-image-96.png" },
        size: 96,
        type: "image/png",
      },
      {
        src: { pathname: "/path-to-image-128.png" },
        size: 128,
        type: "image/png",
      },
      {
        src: { pathname: "/path-to-image-192.png" },
        size: 192,
        type: "image/png",
      },
      {
        src: { pathname: "/path-to-image-256.png" },
        size: 256,
        type: "image/png",
      },
      {
        src: { pathname: "/path-to-image-384.png" },
        size: 384,
        type: "image/png",
      },
      {
        src: { pathname: "/path-to-image-512.png" },
        size: 512,
        type: "image/png",
      },
    ],
  });
});
```

</details>

---

##### `updateMediaMetadataAndPosition()`

Update `MediaSession` metadata and position state.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type                                    | Description                                                                                          |
| --------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `options` | `UpdateMediaMetadataAndPositionOptions` | An object defining `media` HTMLMediaElement and associated data.                                     |
|           |                                         | See [`UpdateMediaMetadataAndPositionOptions`](#updatemediametadataandpositionoptions) for more info. |

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { updateMediaMetadataAndPosition } from "@alessiofrittoli/media-utils";

media.play().then(() => {
  updateMediaMetadataAndPosition({
    media,
    data: {
      type: "audio/mpeg",
      title: "Song name",
      album: "Album name",
      artist: "Artist name",
      artwork: [
        {
          src: { pathname: "/path-to-image-96.png" },
          size: 96,
          type: "image/png",
        },
        {
          src: { pathname: "/path-to-image-128.png" },
          size: 128,
          type: "image/png",
        },
        {
          src: { pathname: "/path-to-image-192.png" },
          size: 192,
          type: "image/png",
        },
        {
          src: { pathname: "/path-to-image-256.png" },
          size: 256,
          type: "image/png",
        },
        {
          src: { pathname: "/path-to-image-384.png" },
          size: 384,
          type: "image/png",
        },
        {
          src: { pathname: "/path-to-image-512.png" },
          size: 512,
          type: "image/png",
        },
      ],
    },
  });
});
```

</details>

---

#### `AudioEngine`

Manages volume manipulation for HTML media elements.

Provides methods for fading volume with customizable tweening, and utilities for converting
between normalized volume values (0.0-1.0) and linear gain values using decibel-based calculations
that better match human perception of audio loudness.

- Refer to the [Audio Engine Manager](#audio-engine-manager) section to understand how instance caching prevents redundant `AudioEngine` instantiation.

##### AudioEngine Types

###### `TickHandler`

Callback executed on each interpolation tick.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Description                     |
| --------- | -------- | ------------------------------- |
| `value`   | `number` | The current interpolated value. |

</details>

---

###### `FadeVolumeOptions`

<details>

<summary style="cursor:pointer">Properties</summary>

| Property   | Type          | Default         | Description                                                                                                                     |
| ---------- | ------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `to`       | `number`      | -               | Defines the final volume to set [0-1].                                                                                          |
| `duration` | `number`      | `200`           | (Optional) Duration of the tween in milliseconds.                                                                               |
| `onTick`   | `TickHandler` | -               | Callback executed on each interpolation tick.                                                                                   |
|            |               |                 | See [`TickHandler`](#tickhandler) types for more info.                                                                          |
| `onEnd`    | `TickHandler` | -               | (Optional) Callback executed when the interpolation completes.                                                                  |
|            |               |                 | See [`TickHandler`](#tickhandler) types for more info.                                                                          |
| `easing`   | `EasingFn`    | `Easing.linear` | (Optional) Easing function used to transform the linear time progression.                                                       |
|            |               |                 | See [`EasingFn`](https://github.com/alessiofrittoli/math-utils/blob/master/docs/easing/README.md#easingfn) types for more info. |
| `Hz`       | `number`      | `120`           | (Optional) Custom tick rate in Hz.                                                                                              |

</details>

---

##### Methods

###### `AudioEngine.fade()`

Fade media volume.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type                | Description                                                  |
| --------- | ------------------- | ------------------------------------------------------------ |
| `options` | `FadeVolumeOptions` | An object defining customization and callbacks.              |
|           |                     | See [`FadeVolumeOptions`](#fadevolumeoptions) for more info. |

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { AudioEngine } from '@alessiofrittoli/media-utils/audio'

const audio  = new Audio( ... )
const engine = new AudioEngine( audio )

audio.volume = 0
audio.play()
 .then( () => {
   // Fade volume to 0.5 over 2 seconds
   engine.fade( {
     to         : 1,
     duration   : 2000,
   } )
 } )
```

</details>

---

##### Static methods

###### `AudioEngine.VolumeToGain()`

Converts a volume value (0.0 to 1.0) to a linear gain value.

The returned value will better match the human perceived volume.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Description                                                                   |
| --------- | -------- | ----------------------------------------------------------------------------- |
| `volume`  | `number` | The volume value, where 0 represents silence and 1 represents maximum volume. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `number`.

The corresponding linear gain value, or 0 if the gain is effectively inaudible.

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { AudioEngine } from '@alessiofrittoli/media-utils/audio'

const audio  = new Audio( ... )
const engine = new AudioEngine( audio )

audio.volume = 0
audio.play()
  .then( () => {
    engine.fade( {
      to: AudioEngine.VolumeToGain( 0.5 ),
      onEnd() {
        console.log( audio.volume ) // Outputs: `0.03162277660168379`
      },
    } )
  } )
```

</details>

---

###### `AudioEngine.GainToVolume()`

Converts a linear gain value to a normalized volume value between 0 and 1.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `gain`    | `number` | The linear gain value to convert. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `number`.

The normalized volume value in the range [0, 1].

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { AudioEngine } from '@alessiofrittoli/media-utils/audio'

const audio  = new Audio( ... )
const engine = new AudioEngine( audio )

audio.volume = 0
audio.play()
  .then( () => {
    engine.fade( {
      to: AudioEngine.VolumeToGain( 0.5 ),
      onEnd() {
        console.log( audio.volume ) // Outputs: `0.03162277660168379`
        console.log( AudioEngine.GainToVolume( audio.volume ) ) // Outputs: `0.5`
      },
    } )
  } )
```

</details>

---

###### `AudioEngine.normalize()`

Conditionally normalize volume using [`AudioEngine.VolumeToGain`](#audioenginevolumetogain).

This method acts as a wrapper and has the same API of [`AudioEngine.VolumeToGain()`](#audioenginevolumetogain) but it accepts a boolean value
as second argument that allows you to quickly opt-in/opt-out based on an incoming variable,
thus there is no need to call `AudioEngine.VolumeToGain()` conditionally.

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { AudioEngine } from '@alessiofrittoli/media-utils/audio'

// `normalizeAudio` may come from global settings
const audio  = new Audio( ... )
const engine = new AudioEngine( audio )

audio.volume = 0
audio.play()
  .then( () => {
    engine.fade( {
      to: AudioEngine.normalize( 0.5, normalizeAudio ),
      onEnd() {
        console.log( audio.volume ) // Outputs: `0.03162277660168379` if `normalizeAudio` is set to `true`, 0.5 otherwise.
      },
    } )
  } )
```

</details>

---

###### `AudioEngine.denormalize()`

Conditionally denormalize volume using [`AudioEngine.GainToVolume`](#audioenginegaintovolume).

This method acts as a wrapper and has the same API of [`AudioEngine.GainToVolume()`](#audioenginegaintovolume) but it accepts a boolean value
as second argument that allows you to quickly opt-in/opt-out based on an incoming variable,
thus there is no need to call `AudioEngine.GainToVolume()` conditionally.

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { AudioEngine } from '@alessiofrittoli/media-utils/audio'

// `normalizeAudio` may come from global settings
const audio  = new Audio( ... )
const engine = new AudioEngine( audio )

audio.volume = 0
audio.play()
  .then( () => {
    engine.fade( {
      to: AudioEngine.normalize( 0.5, normalizeAudio ),
      onEnd() {
        console.log(
          AudioEngine.denormalize( audio.volume, normalizeAudio )
        )
      },
    } )
  } )
```

</details>

---

##### Audio Engine Manager

The Audio Engine Manager is responsible for maintaining a one-to-one association between an `HTMLMediaElement` and its corresponding `AudioEngine` instance.
Its primary goal is to prevent unnecessary re-creation of `AudioEngine` objects when interacting with the same media element.

When working with audio processing APIs, repeatedly instantiating `AudioEngine` for the same HTMLMediaElement would:

- Introduce unnecessary computational overhead.
- Potentially duplicate internal state.
- Increase memory usage.
- Lead to inconsistent behavior.

The manager ensures that each media element has exactly one `AudioEngine` instance.

###### `getEngine()`

Get the `AudioEngine` associated with the given `media`. If none exists, it lazily creates a new instance.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | type               | Decription            |
| --------- | ------------------ | --------------------- |
| `media`   | `HTMLMediaElement` | The HTMLMediaElement. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `AudioEngine`.

The `AudioEngine` associated with the given `media` or a new `AudioEngine` instance if none exists.

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { getEngine } from "@alessiofrittoli/media-utils/audio";

const mute = (media: HTMLMediaElement) => {
  getEngine(media).fade({ to: 0 });
};

const unmute = (media: HTMLMediaElement) => {
  getEngine(media).fade({ to: 1 });
};
```

</details>

---

###### `destroyEngine()`

Proactively delete the `AudioEngine` associated with the given `media` to free resources.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | type               | Decription            |
| --------- | ------------------ | --------------------- |
| `media`   | `HTMLMediaElement` | The HTMLMediaElement. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `boolean`.

- `true` if the element was successfully removed.
- `false` if no engine was registered.

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { getEngine, destroyEngine } from "@alessiofrittoli/media-utils/audio";

const stop = (media: HTMLMediaElement) => {
  getEngine(media).fade({
    to: 0,
    onEnd() {
      media.pause();
      destroyEngine(media);
    },
  });
};
```

</details>

---

##### Audio Utilities

###### `fadeVolume()`

Fade media volume.

This utility function acts as a wrapper handling [`AudioEngine`](#audioengine) instances for you using the [Audio Engine Manager](#audio-engine-manager).

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | type                | Decription                                                   |
| --------- | ------------------- | ------------------------------------------------------------ |
| `media`   | `HTMLMediaElement`  | The HTMLMediaElement.                                        |
| `options` | `FadeVolumeOptions` | An object defining customization and callbacks.              |
|           |                     | See [`FadeVolumeOptions`](#fadevolumeoptions) for more info. |

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { fadeVolume } from "@alessiofrittoli/media-utils/audio";

const play = (media: HTMLMediaElement) => {
  media.volume = 0;
  media.play().then(() => {
    fadeVolume(media, { to: 1 });
  });
};
```

</details>

---

#### Media Playback

#### Media Playback types

##### `PlayMediaOptions`

An object defining play options and callbacks.

It extends [`UpdateMediaMetadataAndPositionOptions`](#updatemediametadataandpositionoptions) and [`FadeVolumeOptions`](#fadevolumeoptions) interfaces and adds/overrides the following properties.

<details>

<summary style="cursor:pointer">Properties</summary>

| Property  | Type                            | Default | Description                                                                      |
| --------- | ------------------------------- | ------- | -------------------------------------------------------------------------------- |
| `volume`  | `number`                        | -       | Defines the final volume to set [0-1].                                           |
|           |                                 |         | - overrides `FadeVolumeOptions['to']`                                            |
| `fade`    | `number`                        | `200`   | (Optional) A custom volume fade duration in milliseconds.                        |
|           |                                 |         | - overrides `FadeVolumeOptions['duration']`                                      |
| `onError` | `( error: MediaError ) => void` | -       | (Optional) A custom callback executed when an error occurs when playing a media. |

</details>

---

##### `PauseMediaOptions`

An object defining pause options and callbacks.

It extends [`PlayMediaOptions`](#playmediaoptions) and omits unnecessary properties.

---

#### `playMedia()`

Play the given media.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type               | Description                                                |
| --------- | ------------------ | ---------------------------------------------------------- |
| `options` | `PlayMediaOptions` | An object defining play options and callbacks.             |
|           |                    | See [`PlayMediaOptions`](#playmediaoptions) for more info. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `Promise<void>`

A new `Promise` which resolves once `media.play()` promise is resolved.

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { playMedia } from "@alessiofrittoli/media-utils";

const media = new Audio( ... )

play.addEventListener("click", () => {

  playMedia( {
    media,
    volume: 1,
    fade: 800,
    data: {
      type: 'audio/mpeg',
      title: 'Media title',
    },
    onError( error ) {
      switch ( error.code ) {
        case MediaError.MEDIA_ERR_ABORTED:
          console.error( 'The fetching of the associated resource was aborted by the user\'s request.' )
          break
        case MediaError.MEDIA_ERR_NETWORK:
          console.error( 'Some kind of network error occurred which prevented the media from being successfully fetched, despite having previously been available.' )
          break
        case MediaError.MEDIA_ERR_DECODE:
          console.error( 'Despite having previously been determined to be usable, an error occurred while trying to decode the media resource, resulting in an error.' )
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          console.error( 'The associated resource or media provider object (such as a MediaStream) has been found to be unsuitable.' )
          break
        default:
          console.error( 'Unknow error.' )
      }
    },
  } )

});
```

</details>

---

#### `pauseMedia()`

Pause the given media.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type                | Description                                                                 |
| --------- | ------------------- | --------------------------------------------------------------------------- |
| `options` | `PauseMediaOptions` | An object defining pause options and callbacks.                             |
|           |                     | See [`PauseMediaOptions`](#pausemediaoptions) for more info. for more info. |

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { pauseMedia } from "@alessiofrittoli/media-utils";

const media = new Audio( ... )

pause.addEventListener("click", () => {

  pauseMedia( { media, fade: 800 } )

});
```

</details>

---

#### Image Video Stream

##### Types

###### `CreateImageVideoStreamOptions` interface

Options for rendering an image into a video stream.

It optionally accepts a previously created `HTMLVideoElement` where image will get streamed into.

<details>

<summary style="cursor:pointer">Properties</summary>

- Extends [`RenderOptions`](#renderoptions-interface) interface.

| Property | Type                     | Default | Description                                                                              |
| -------- | ------------------------ | ------- | ---------------------------------------------------------------------------------------- |
| `media`  | `Blob\|HTMLImageElement` | -       | The image source to render. It can be either a `Blob` or a preloaded `HTMLImageElement`. |

</details>

---

###### `RenderOptions` interface

Rendering options.

<details>

<summary style="cursor:pointer">Properties</summary>

| Property      | Type                     | Default   | Description                                                                                         |
| ------------- | ------------------------ | --------- | --------------------------------------------------------------------------------------------------- |
| `media`       | `Blob\|HTMLImageElement` | -         | (Optional) The image source to render. It can be either a `Blob` or a preloaded `HTMLImageElement`. |
| `video`       | `HTMLVideoElement`       | -         | (Optional) A previously created `HTMLVideoElement` where image get streamed into.                   |
| `aspectRatio` | `number`                 | -         | (Optional) Target aspect ratio (width / height) of the rendering area.                              |
|               |                          |           | If omitted, the original media aspect ratio is preserved.                                           |
| `fit`         | `'contain'\|'cover'`     | `contain` | (Optional) Defines how the media should fit inside the rendering area.                              |
|               |                          |           | - `contain` (default) behaves like `object-fit: contain`                                            |
|               |                          |           | - `cover` behaves like `object-fit: cover`                                                          |
|               |                          |           | Only applies when `aspectRatio` is specified.                                                       |

</details>

---

###### `RenderResult` interface

The rendering result.

<details>

<summary style="cursor:pointer">Properties</summary>

| Property | Type               | Description                                           |
| -------- | ------------------ | ----------------------------------------------------- |
| `video`  | `HTMLVideoElement` | The `HTMLVideoElement` where image get streamed into. |

</details>

---

###### `RenderHandler` type

Render a new image to the video stream.

```ts
type RenderHandler = (options?: RenderOptions) => Promise<RenderResult>;
```

---

###### `DestroyHandler` type

Stop stream tracks and release allocated resources.

```ts
type DestroyHandler = () => void;
```

---

###### `CreateImageVideoStream` interface

Defines the returned result of rendering an image into a video.

<details>

<summary style="cursor:pointer">Properties</summary>

- Extends [`RenderResult`](#renderresult-interface) interface.

| Property  | Type             | Description                                          |
| --------- | ---------------- | ---------------------------------------------------- |
| `render`  | `RenderHandler`  | Render a new image to the video stream.              |
|           |                  | - See [`RenderHandler` type](#renderhandler-type).   |
| `destroy` | `DestroyHandler` | Stop stream tracks and release allocated resources.  |
|           |                  | - See [`DestroyHandler` type](#destroyhandler-type). |

</details>

---

##### `createImageVideoStream`

Render an image into a video stream.

If the provided media (HTMLImageElement) fails to load, a 1x1 black frame is rendered instead and the promise does not reject.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type                            | Description                                                                                  |
| --------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| `options` | `CreateImageVideoStreamOptions` | Rendering options.                                                                           |
|           |                                 | - See [`CreateImageVideoStreamOptions`](#createimagevideostreamoptions-interface) interface. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `Promise<CreateImageVideoStream>`

A new Promise that resolves the allocated rendering resources.

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

###### Fetch and render image Blob

```ts
import { fetch } from "@alessiofrittoli/fetcher";
import {
  getFallbackImage,
  createImageVideoStream,
} from "@alessiofrittoli/media-utils";

const createImageStream = async () => {
  const { data: media, error } = await fetch<Blob>("/path-to/image.png", {
    responseType: "blob",
  });

  if (error) {
    return createImageVideoStream({ media: getFallbackImage() });
  }

  return createImageVideoStream({ media });
};
```

---

###### Custom aspect ratio

```ts
import { createImageVideoStream } from "@alessiofrittoli/media-utils";

const createImageStream = () => {
  const media = document.createElement("img");
  media.src = "/path-to/image.png";

  return createImageVideoStream({
    media,
    aspectRatio: 16 / 9,
    fit: "cover", // or 'contain'
  });
};
```

---

###### Update streamed content

```ts
import { createImageVideoStream } from "@alessiofrittoli/media-utils";

const createImageStream = async () => {
  const media = document.createElement("img");
  media.src = "/path-to/image.png";

  const { video, render } = await createImageVideoStream({
    media,
    aspectRatio: 16 / 9,
    fit: "cover", // or 'contain'
  });

  // update streamed content after 5 seconds
  setTimeout(() => {
    media.src = "/path-to/image-2.png";

    await render({ aspectRatio: 1 });
  }, 5000);

  return video;
};
```

---

###### Using a previously created video

```ts
import { createImageVideoStream } from "@alessiofrittoli/media-utils";

const createImageStream = async () => {
  const video = document.createElement("video");
  video.src = "/path-to/video.mp4";

  const media = document.createElement("img");
  media.src = "/path-to/image.png";

  // replace original video content with streamed image
  await createImageVideoStream({
    media,
    video,
    aspectRatio: 16 / 9,
    fit: "cover", // or 'contain'
  });

  return video;
};
```

---

###### Free allocated resources

```ts
import { createImageVideoStream } from "@alessiofrittoli/media-utils";

const createImageStream = async () => {
  const media = document.createElement("img");
  media.src = "/path-to/image.png";

  // replace original video content with streamed image
  const { video, destroy } = await createImageVideoStream({
    media,
    aspectRatio: 16 / 9,
    fit: "cover", // or 'contain'
  });

  // free allocated resources after 5 seconds
  setTimeout(() => {
    destroy();
  }, 5000);

  return video;
};
```

</details>

---

#### Media Artwork Picture-in-Picture

##### Types

###### `OpenPictureInPictureCommonOptions` interface

Defines common configuration options for opening the media in Picture-in-Picture mode.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type         | Description                                                                |
| --------- | ------------ | -------------------------------------------------------------------------- |
| `onQuit`  | `() => void` | (Optional) A callback to execute when Picture-in-Picture window is closed. |

</details>

---

###### `OpenImagePictureInPictureOptions` interface

Defines configuration options for opening the image in Picture-in-Picture mode.

<details>

<summary style="cursor:pointer">Parameters</summary>

- Extends [`OpenPictureInPictureCommonOptions`](#openpictureinpicturecommonoptions-interface) interface.
- Extends [`CreateImageVideoStreamOptions`](#createimagevideostreamoptions-interface) interface.
- Partially extends [`CreateImageVideoStream`](#createimagevideostream-interface) interface.

| Parameter | Type                                                 | Description                                         |
| --------- | ---------------------------------------------------- | --------------------------------------------------- |
| `media`   | `CreateImageVideoStreamOptions[ 'media' ]\|UrlInput` | The media to render in a Picture-in-Picture window. |

</details>

---

###### `OpenImagePictureInPicture` type

Defines the returned result of opening a rendered image into a video Picture-in-Picture window.

- Alias for [`CreateImageVideoStream`](#createimagevideostream-interface) interface

---

###### `OpenVideoArtworkPictureInPictureOptions` interface

Defines configuration options for opening the video in Picture-in-Picture window.

<details>

<summary style="cursor:pointer">Parameters</summary>

- Extends [`OpenPictureInPictureCommonOptions`](#openpictureinpicturecommonoptions-interface) interface.
- Partially extends [`OpenVideoArtworkPictureInPicture`](#openvideoartworkpictureinpictureoptions-interface) interface.

| Parameter | Type                         | Description                                       |
| --------- | ---------------------------- | ------------------------------------------------- |
| `media`   | `HTMLVideoElement\|UrlInput` | The media to open in a Picture-in-Picture window. |

</details>

---

###### `OpenVideoArtworkPictureInPicture` interface

Defines the returned result of opening a video into a Picture-in-Picture window.

<details>

<summary style="cursor:pointer">Properties</summary>

| Property | Type               | Description                                   |
| -------- | ------------------ | --------------------------------------------- |
| `video`  | `HTMLVideoElement` | The `HTMLVideoElement` in Picture-in-Picture. |

</details>

---

###### `OpenArtworkPictureInPictureOptions` interface

Defines configuration options for opening media artwork in Picture-in-Picture window.

<details>

<summary style="cursor:pointer">Parameters</summary>

- Extends [`OpenImagePictureInPictureOptions`](#openimagepictureinpictureoptions-interface) interface.
- Extends [`OpenVideoArtworkPictureInPictureOptions`](#openvideoartworkpictureinpictureoptions-interface) interface.

| Parameter | Type                                                                      | Description                                                                           |
| --------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `media`   | `CreateImageVideoStreamOptions['media']\| HTMLVideoElement\|MediaArtWork` | The media to open in a Picture-in-Picture window.                                     |
|           |                                                                           | - See [`CreateImageVideoStreamOptions`](#createimagevideostream-interface) interface. |
|           |                                                                           | - See [`MediaArtWork`](#mediaartwork) interface.                                      |

</details>

---

###### `OpenArtworkPictureInPicture` interface

Defines the returned result of opening a media artwork into a Picture-in-Picture window.

It could be [`OpenImagePictureInPicture`](#openimagepictureinpicture-type) or [`OpenVideoArtworkPictureInPicture`](#openvideoartworkpictureinpicture-interface).

---

##### `isPictureInPictureSupported`

Checks if the Picture-in-Picture API is supported by the current browser.

---

##### `requiresPictureInPictureAPI`

Validates that the Picture-in-Picture API is supported by the current browser.

- Throws a new `Exception` with code `ErrorCode.PIP_NOT_SUPPORTED` if the Picture-in-Picture API is not supported.

---

##### `openImagePictureInPicture`

Opens an image in Picture-in-Picture window.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type                               | Description                                                                                        |
| --------- | ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| `options` | `OpenImagePictureInPictureOptions` | Configuration options for opening the image in PiP window.                                         |
|           |                                    | - See [`OpenImagePictureInPictureOptions`](#openimagepictureinpictureoptions-interface) interface. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `Promise<OpenImagePictureInPicture>`

A new Promise that resolves to the Picture-in-Picture result containing the video element and destroy function.

- See [`OpenImagePictureInPicture`](#openimagepictureinpicture-type) for more info.

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

###### Simple usage

```ts
import {
  ErrorCode,
  openImagePictureInPicture,
} from "@alessiofrittoli/media-utils";

try {
  navigator.mediaSession.setActionHandler("enterpictureinpicture", async () => {
    try {
      await openImagePictureInPicture({
        media: { pathname: "path/to/image.png" },
        aspectRatio: 1,
        fit: "cover",
        onQuit: () => console.log("Picture-in-Picture closed"),
      });
    } catch (_err) {
      const err = _err as Error;

      const error = Exception.isException<string, ErrorCode>(err)
        ? err
        : new Exception(err.message, {
            code: ErrorCode.UNKNOWN,
            name: err.name,
            cause: err,
          });
      switch (error.code) {
        case ErrorCode.PIP_NOT_SUPPORTED:
          alert("Picture-In-Picture is not supported by the current browser.");
          break;
        case ErrorCode.RENDERING_CONTEXT_UNAVAILABLE:
          alert("Couldn't render image in Picture-in-Picture.");
          break;
        default:
          console.error(error);
      }
    }
  });
} catch (error) {
  console.warn(
    'Warning! The "enterpictureinpicture" media session action is not supported.',
    error,
  );
}
```

---

###### Update image Picture-in-Picture content

```ts
import {
  openImagePictureInPicture,
  type OpenImagePictureInPicture,
} from "@alessiofrittoli/media-utils";

let resources: OpenImagePictureInPicture;

navigator.mediaSession.setActionHandler("enterpictureinpicture", async () => {
  resources = await openImagePictureInPicture({
    media: { pathname: "/path/to/image.png" },
  });
});

navigator.mediaSession.setActionHandler("nexttrack", async () => {
  resources = await openImagePictureInPicture({
    media: { pathname: "/path/to/image.png" },
    ...resources,
  });
});
```

</details>

---

##### `openVideoArtworkPictureInPicture`

Opens a video artwork element in Picture-in-Picture window.

This function is intended for rendering a short song artwork video.
This is not suitable if your're looking for a proper video Picture-in-Picture since it simple as calling `video.requestPictureInPicture()`.

Supports both `HTMLVideoElement` instances and URL inputs. When a URL is provided, a video element is created and the URL is set as its source.

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type                                      | Description                                                                                                      |
| --------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `options` | `OpenVideoArtworkPictureInPictureOptions` | Configuration options for opening the video in Picture-in-Picture.                                               |
|           |                                           | - See [`OpenVideoArtworkPictureInPictureOptions`](#openvideoartworkpictureinpictureoptions-interface) interface. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `Promise<OpenVideoArtworkPictureInPicture>`

A new Promise that resolves with an object containing the video element displayed in Picture-in-Picture mode.

- See [`OpenVideoArtworkPictureInPicture`](#openvideoartworkpictureinpicture-interface) for more info.

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { openVideoArtworkPictureInPicture } from "@alessiofrittoli/media-utils";

// With a URL
const { video } = await openVideoArtworkPictureInPicture({
  media: "/song-artwork-video.mp4",
  onQuit: () => console.log("Picture-in-Picture closed"),
});

// With an HTMLVideoElement
const media = document.querySelector("video");
media.src = "/song-artwork-video.mp4";

const { video } = await openVideoArtworkPictureInPicture({ media });
```

</details>

---

##### `openArtworkPictureInPicture`

Opens the given media in Picture-in-Picture window.

It easly handles images and videos rendering using [`openImagePictureInPicture`](#openimagepictureinpicture) or [`openVideoArtworkPictureInPicture`](#openvideoartworkpictureinpicture).

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type                                 | Description                                                                                            |
| --------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `options` | `OpenArtworkPictureInPictureOptions` | Configuration options for opening the media in Picture-in-Picture window.                              |
|           |                                      | - See [`OpenArtworkPictureInPictureOptions`](#openartworkpictureinpictureoptions-interface) interface. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `Promise<OpenArtworkPictureInPicture>`

A new Promise that resolves to the Picture-in-Picture result.

- See [`OpenArtworkPictureInPicture`](#openartworkpictureinpicture-interface).

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

###### Simple usage

```ts
import { openArtworkPictureInPicture } from "@alessiofrittoli/media-utils";

const result = await openArtworkPictureInPicture({
  media: {
    type: "image/png",
    src: "/path/to/image.png",
  },
  aspectRatio: 1,
  fit: "cover",
});

// update
await openArtworkPictureInPicture({
  media: {
    type: "video/mp4",
    src: "/path/to/video.mp4",
  },
  ...result,
});
```

---

###### Using media session image

```ts
import {
  openArtworkPictureInPicture,
  type MediaSessionMetadata,
} from "@alessiofrittoli/media-utils";

const data: MediaSessionMetadata = {
  title: "Test Song",
  artist: "Test Artist",
  album: "Test Album",
  artwork: [
    { src: "/path/to/song-artwork.png", sizes: 128, type: "image/png" },
  ],
};

updateMediaMetadata(data);

await openArtworkPictureInPicture();
```

---

###### Handling errors

```ts
import {
  ErrorCode,
  openArtworkPictureInPicture,
} from "@alessiofrittoli/media-utils";

try {
  await openArtworkPictureInPicture({ ... });
} catch (_err) {
  const err = _err as Error;

  const error = Exception.isException<string, ErrorCode>(err)
    ? err
    : new Exception(err.message, {
        code: ErrorCode.UNKNOWN,
        name: err.name,
        cause: err,
      });
  switch (error.code) {
    case ErrorCode.PIP_NOT_SUPPORTED:
      alert("Picture-In-Picture is not supported by the current browser.");
      break;
    case ErrorCode.RENDERING_CONTEXT_UNAVAILABLE:
      alert("Couldn't render image in Picture-in-Picture.");
      break;
    default:
      console.error(error);
  }
}
```

---

###### Free allocated resources

```ts
import { openArtworkPictureInPicture } from "@alessiofrittoli/media-utils";

const { destroy } = await openArtworkPictureInPicture({ ... });

// free allocated resources after 5 seconds
setTimeout(() => {
  destroy();
}, 5000);
```

</details>

---

#### Utilities

##### `formatMediaTiming()`

Formats a time value in seconds into a human-readable media timing string (M:SS or H:MM:SS).

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter   | Type      | Default | Description                                                  |
| ----------- | --------- | ------- | ------------------------------------------------------------ |
| `time`      | `number`  | -       | The time value in seconds to format.                         |
| `showHours` | `boolean` | `false` | (Optional) Whether to include hours in the formatted output. |

</details>

---

<details>

<summary style="cursor:pointer">Returns</summary>

Type: `string`

A formatted time string in the format "M:SS" or "H:MM:SS" if `showHours` is `true`.
If the time is 0 or invalid, returns "0:00".

</details>

---

<details>

<summary style="cursor:pointer">Examples</summary>

```ts
import { formatMediaTiming } from "@alessiofrittoli/media-utils";

console.log(formatMediaTiming(45)); // Outputs: "0:45"
console.log(formatMediaTiming(90)); // Outputs: "1:30"
console.log(formatMediaTiming(125)); // Outputs: "2:05"

console.log(formatMediaTiming(3661, true)); // Outputs: "1:01:01"

console.log(formatMediaTiming(0)); // Outputs: "0:00"
console.log(formatMediaTiming(-NaN)); // Outputs: "0:00"
console.log(formatMediaTiming(NaN)); // Outputs: "0:00"
console.log(formatMediaTiming(-Infinity)); // Outputs: "0:00"
console.log(formatMediaTiming(Infinity)); // Outputs: "0:00"

console.log(formatMediaTiming(0, true)); // Outputs: "0:00:00"
console.log(formatMediaTiming(-NaN, true)); // Outputs: "0:00:00"
console.log(formatMediaTiming(NaN, true)); // Outputs: "0:00:00"
console.log(formatMediaTiming(-Infinity, true)); // Outputs: "0:00:00"
console.log(formatMediaTiming(Infinity, true)); // Outputs: "0:00:00"
```

</details>

---

### Development

#### Install depenendencies

```bash
npm install
```

or using `pnpm`

```bash
pnpm i
```

#### Build the source code

Run the following command to test and build code for distribution.

```bash
pnpm build
```

#### [ESLint](https://www.npmjs.com/package/eslint)

warnings / errors check.

```bash
pnpm lint
```

#### [Jest](https://npmjs.com/package/jest)

Run all the defined test suites by running the following:

```bash
# Run tests and watch file changes.
pnpm test:watch

# Run tests in a CI environment.
pnpm test:ci
```

- See [`package.json`](./package.json) file scripts for more info.

Run tests with coverage.

An HTTP server is then started to serve coverage files from `./coverage` folder.

⚠️ You may see a blank page the first time you run this command. Simply refresh the browser to see the updates.

```bash
test:coverage:serve
```

---

### Contributing

Contributions are truly welcome!

Please refer to the [Contributing Doc](./CONTRIBUTING.md) for more information on how to start contributing to this project.

Help keep this project up to date with [GitHub Sponsor][sponsor-url].

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

---

### Security

If you believe you have found a security vulnerability, we encourage you to **_responsibly disclose this and NOT open a public issue_**. We will investigate all legitimate reports. Email `security@alessiofrittoli.it` to disclose any security vulnerabilities.

### Made with ☕

<table style='display:flex;gap:20px;'>
  <tbody>
    <tr>
      <td>
        <img alt="avatar" src='https://avatars.githubusercontent.com/u/35973186' style='width:60px;border-radius:50%;object-fit:contain;'>
      </td>
      <td>
        <table style='display:flex;gap:2px;flex-direction:column;'>
          <tbody>
              <tr>
                <td>
                  <a href='https://github.com/alessiofrittoli' target='_blank' rel='noopener'>Alessio Frittoli</a>
                </td>
              </tr>
              <tr>
                <td>
                  <small>
                    <a href='https://alessiofrittoli.it' target='_blank' rel='noopener'>https://alessiofrittoli.it</a> |
                    <a href='mailto:info@alessiofrittoli.it' target='_blank' rel='noopener'>info@alessiofrittoli.it</a>
                  </small>
                </td>
              </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>

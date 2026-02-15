# Media Utils 🎥

[![NPM Latest Version][version-badge]][npm-url] [![Coverage Status][coverage-badge]][coverage-url] [![Socket Status][socket-badge]][socket-url] [![NPM Monthly Downloads][downloads-badge]][npm-url] [![Dependencies][deps-badge]][deps-url]

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

[version-badge]: https://img.shields.io/npm/v/%40alessiofrittoli%2Fmedia-utils
[npm-url]: https://npmjs.org/package/%40alessiofrittoli%2Fmedia-utils
[coverage-badge]: https://coveralls.io/repos/github/alessiofrittoli/media-utils/badge.svg
[coverage-url]: https://coveralls.io/github/alessiofrittoli/media-utils
[socket-badge]: https://socket.dev/api/badge/npm/package/@alessiofrittoli/media-utils
[socket-url]: https://socket.dev/npm/package/@alessiofrittoli/media-utils/overview
[downloads-badge]: https://img.shields.io/npm/dm/%40alessiofrittoli%2Fmedia-utils.svg
[deps-badge]: https://img.shields.io/librariesio/release/npm/%40alessiofrittoli%2Fmedia-utils
[deps-url]: https://libraries.io/npm/%40alessiofrittoli%2Fmedia-utils
[sponsor-badge]: https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2
[sponsor-url]: https://github.com/sponsors/alessiofrittoli

## TypeScript media utility library

### Table of Contents

- [Getting started](#getting-started)
- [API Reference](#api-reference)
  - [MIME types](#mime-types)
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

##### `getMimeType`

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
// or
import { getMimeType } from "@alessiofrittoli/media-utils/mime";

console.log(getMimeType("/path/to/video-file.mp4")); // Outputs: 'video/mp4'
console.log(getMimeType("/path/to/audio-file.mp4", "audio")); // Outputs: 'audio/mp4'
console.log(getMimeType("/path/to/audio-file.mp3")); // Outputs: 'audio/mpeg'
```

</details>

---

##### `getAllowedMimeTypes`

Get allowed MIME types.

<!-- /**
 *
 * @param accept (Optional) A string describing allowed MIME types.
 * 	The format is the same accepted by {@link HTMLInputElement.accept} attribute.
 *
 * 	It could be one of the following examples:
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
export const getAllowedMimeTypes = ( accept?: string ) => { -->

<details>

<summary style="cursor:pointer">Parameters</summary>

| Parameter | Type     | Description                                                                                                                                         |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accept`  | `string` | (Optioanl) A string describing allowed MIME types.                                                                                                  |
|           |          | The format is the same accepted by [`HTMLInputElement.accept`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/accept) attribute. |
|           |          | It could be one of the following examples:                                                                                                          |
|           |          | `*`                                                                                                                                                 |
|           |          | `image` (type)                                                                                                                                      |
|           |          | `image/*` ({type}/{subtype})                                                                                                                        |
|           |          | `image/png` ({type}/{subtype}) - specific                                                                                                           |
|           |          | `.png` (extension)                                                                                                                                  |
|           |          | `image,audio` (multiple types)                                                                                                                      |
|           |          | `image/*,audio/*` (multiple {type}/{subtype})                                                                                                       |
|           |          | `.png, .mp3` (multiple extensions)                                                                                                                  |
|           |          | `.docx, audio, video/*, text/html` (mixed)                                                                                                          |

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
// or
import { getAllowedMimeTypes } from "@alessiofrittoli/media-utils/mime";

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

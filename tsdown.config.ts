import { tsdownConfig } from '@alessiofrittoli/package-configs/tsdown'
import { resolve } from 'path'

export default tsdownConfig(() => ({
	tsconfig: resolve(process.cwd(), 'tsconfig.build.json'),
	deps: {
		onlyBundle: [
			// this allow use to include tree-shaked used types in the dist
			'@alessiofrittoli/type-utils',
		],
	},
}))

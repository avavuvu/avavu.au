import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { buildLinkGraph } from '../../src/markdoc/wikilinks.ts'
import { layoutGraph } from './layout.ts'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const wikiRoot = join(scriptDir, '../../src/wiki')
const outPath = join(scriptDir, '../../src/lib/wikiGraph.json')

const width = 500
const height = 500

const edges = buildLinkGraph(wikiRoot)
const { positions, edges: edgeList } = layoutGraph(edges, { width, height })

const output = {
	width,
	height,
	nodes: [...positions.entries()].map(([id, pos]) => ({ id, x: pos.x, y: pos.y })),
	edges: edgeList
}

await writeFile(outPath, JSON.stringify(output, null, 2))

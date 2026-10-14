const CHARACTER_WIDTH = 5.6
const LABEL_PADDING = 10
const VERTICAL_PADDING = 6
const MAX_LINE_LENGTH = 28

export const LINE_HEIGHT = 12

export type LabelBox = { lines: string[]; width: number; height: number }

const wrap = (words: string[], maxLength: number) => {
	const lines: string[] = []
	for (const word of words) {
		const last = lines.at(-1)
		if (last !== undefined && last.length + 1 + word.length <= maxLength) {
			lines[lines.length - 1] = `${last} ${word}`
		} else {
			lines.push(word)
		}
	}
	return lines
}

const evenWrap = (label: string, maxLineLength: number) => {
	const words = label.split(/\s+/).filter(Boolean)
	const lineCount = wrap(words, maxLineLength).length
	if (lineCount <= 1) return [label]

	for (let length = Math.ceil(label.length / lineCount); ; length++) {
		const lines = wrap(words, length)
		if (lines.length <= lineCount) return lines
	}
}

export const labelBox = (label: string, maxLineLength = MAX_LINE_LENGTH): LabelBox => {
	const lines = evenWrap(label, maxLineLength)
	return {
		lines,
		width: Math.max(...lines.map((line) => line.length)) * CHARACTER_WIDTH + LABEL_PADDING,
		height: lines.length * LINE_HEIGHT + VERTICAL_PADDING
	}
}

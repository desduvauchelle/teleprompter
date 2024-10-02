
export interface PrompterProps {
	text: string,
	setText: (text: string) => void
}

export interface PromptWord {
	id: string | number
	text: string
	hasBeenRead?: boolean
}

export interface PromptSentence {
	id: string | number
	hasBeenRead?: boolean
	words: PromptWord[]
}

export type PromptText = PromptSentence[]

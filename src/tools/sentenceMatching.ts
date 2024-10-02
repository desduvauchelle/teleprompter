import { PromptSentence } from "../types/ITeleprompter"

const sentenceMatching = ({
	sentence,
	spokenWords
}: {
	sentence: PromptSentence
	spokenWords: string[]
}): PromptSentence => {

	const cleanStr = (text: string): string => text.toLowerCase().replace(/[^a-z0-9]/gi, '')
	const cleanSpokenWords = spokenWords.map(cleanStr)

	sentence.words.forEach((word, index) => {
		if (word.hasBeenRead) return
		const cleanWord = cleanStr(word.text)
		if (cleanSpokenWords.includes(cleanWord)) {
			word.hasBeenRead = true
			// remove it from the spoken words
			const spokenIndex = cleanSpokenWords.indexOf(cleanWord)
			cleanSpokenWords.splice(spokenIndex, 1)
			// Check if any of the previous words have not been read, if not mark those as read
			for (let i = index - 1; i >= 0; i--) {
				const previousWord = sentence.words[i]
				if (!previousWord.hasBeenRead) {
					previousWord.hasBeenRead = true
				} else {
					break
				}
			}
		}
	})

	// Check if all the words in the sentence have been read, if so mark the sentence as read
	const allWordsRead = sentence.words.every((word) => word.hasBeenRead)
	if (allWordsRead) {
		sentence.hasBeenRead = true
	}
	return sentence

}

export default sentenceMatching

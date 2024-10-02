import { PromptText } from "../types/ITeleprompter"

const prepText = (text: string): PromptText => {
	const output: PromptText = []

	const sentences = text.split(/(?<=[.!?])\s+|\n+/).filter(sentence => sentence.trim() !== '')

	// I want to replace any encoded characters with their actual characters like &quot; with "
	// I also want to remove any html tags
	const htmlRegex = /<[^>]*>/g
	const encodedRegex = /&[a-z]+;/g
	sentences.forEach((sentence, index) => {
		sentences[index] = sentence.replace(htmlRegex, '').replace(encodedRegex, '')
	})

	sentences.forEach((sentence, sentenceIndex) => {
		const words = sentence.trim().split(/\s+/).map((word, wordIndex) => ({
			id: `${sentenceIndex}-${wordIndex}`,
			text: word
		}))

		output.push({
			id: sentenceIndex,
			words
		})
	})

	return output
}

export default prepText

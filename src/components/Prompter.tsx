import { useState, useEffect, FC, useRef } from 'react'
import Editor from './Editor'
import mySpeechRecognition from '../tools/mySpeechRecognition'
import sentenceMatching from '../tools/sentenceMatching'
import prepText from '../tools/prepText'
import { PromptSentence, PromptText, PrompterProps } from '../types/ITeleprompter'



declare global {
	interface Window {
		webkitSpeechRecognition: {
			new(): SpeechRecognition
		}
	}

	interface SpeechRecognition {
		continuous: boolean
		interimResults: boolean
		onresult: (event: SpeechRecognitionEvent) => void
		start: () => void
		stop: () => void
	}

	interface SpeechRecognitionEvent {
		results: SpeechRecognitionResultList
	}

	interface SpeechRecognitionResultList {
		// @ts-expect-error - Index signature in type 'SpeechRecognitionResultList' only permits reading
		length: number
		item: (index: number) => SpeechRecognitionResult
		[index: number]: SpeechRecognitionResult
	}

	interface SpeechRecognitionResult {
		// @ts-expect-error - Index signature in type 'SpeechRecognitionResult' only permits reading
		isFinal: boolean
		// @ts-expect-error - Index signature in type 'SpeechRecognitionResult' only permits
		length: number
		item: (index: number) => SpeechRecognitionAlternative
		[index: number]: SpeechRecognitionAlternative
	}

	interface SpeechRecognitionAlternative {
		// @ts-expect-error - Index signature in type 'SpeechRecognitionAlternative' only permits reading
		transcript: string
		// @ts-expect-error - Index signature in type 'SpeechRecognitionAlternative' only permits reading
		confidence: number
	}
}

const SentenceDisplay: FC<{
	sentence: PromptSentence
}> = ({ sentence }) => {

	return (
		<div className="">
			{sentence.words.map((word) => (
				<span
					key={word.id}
					data-id={word.id}
					className={`cursor-pointer inline-block mr-4 text-white ${word.hasBeenRead ? 'opacity-40' : ''}`}>
					{word.text}
				</span>
			))}
		</div>
	)
}



const mySp = mySpeechRecognition()
const Prompter: FC<PrompterProps> = ({ text, setText }) => {
	const [preparedText, setPreparedText] = useState<PromptText | undefined>()
	const [isRunning, setIsRunning] = useState<boolean>(false)
	const [fontSize, setFontSize] = useState<number>(50)
	const [textWidth, setTextWidth] = useState<number>(500)
	const [isEditingText, setIsEditingText] = useState<boolean>(false)
	const recognition = useRef(mySp)
	const wrapperDivRef = useRef<HTMLDivElement | null>(null)
	const copyOfPreparedText = useRef<PromptText | undefined>()
	const [isntCompatible, setIsntCompatible] = useState<boolean>(false)

	useEffect(() => {
		// if 'webkitSpeechRecognition' is not in window, then set isNotCompatible to true
		if (!('webkitSpeechRecognition' in window)) {
			setIsntCompatible(true)
		}
	}, [])

	useEffect(() => {
		const preparedText = prepText(text)
		setPreparedText(preparedText)
		copyOfPreparedText.current = preparedText
	}, [text])

	// On change of the preparedText, it should scroll to the current word being read
	useEffect(() => {
		if (!preparedText || !wrapperDivRef.current) return
		const currentSentence = preparedText.find((sentence) => !sentence.hasBeenRead)
		if (!currentSentence) return
		const currentWord = currentSentence.words.find((word) => !word.hasBeenRead)
		if (!currentWord) return
		const wordElement = wrapperDivRef.current.querySelector(`span[data-id="${currentWord.id}"]`)
		if (!wordElement) return
		wordElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

	}, [preparedText])

	useEffect(() => {
		if (!isRunning) {
			recognition.current.stop()
			return
		}
		if (!copyOfPreparedText.current) {
			console.error("Prepared text not available")
			return
		}
		console.log("Listening")
		// Find the first sentence that has not been read
		recognition.current.listen((words) => {
			// console.log("Spoken words", words)
			const currentSentence = copyOfPreparedText.current?.find((sentence) => !sentence.hasBeenRead)
			// console.log("Current Sentence", currentSentence)

			if (currentSentence) {
				const newSentence = sentenceMatching({ sentence: currentSentence, spokenWords: words })
				// console.log("New Sentence", newSentence)
				const newText = copyOfPreparedText.current?.map((sentence) => sentence.id === newSentence.id ? newSentence : sentence)
				copyOfPreparedText.current = newText
				setPreparedText(copyOfPreparedText.current)
			}
		})

	}, [isRunning])



	const handleStartStop = () => {
		if (isRunning) {
			recognition.current.stop()
			setIsRunning(false)

			return
		}
		setIsRunning(true)

	}

	const reset = () => {
		// Reset the prepared text
		const preparedText = prepText(text)
		setPreparedText(preparedText)
		copyOfPreparedText.current = preparedText
		if (isRunning) {
			recognition.current.stop()
			setIsRunning(false)
		}
	}
	const onClickOfSentence = (sentenceId: string | number) => {
		// Mark that sentence as unread and all previous as read
		if (!preparedText) return
		const sentenceIndex = preparedText?.findIndex((sentence) => sentence.id === sentenceId)
		if (!sentenceIndex) return
		const newPreparedText = preparedText.map((sentence, index) => {
			if (index < sentenceIndex) {
				return {
					...sentence,
					hasBeenRead: true,
					words: sentence.words.map((word) => ({ ...word, hasBeenRead: true }))
				}
			}
			if (index === sentenceIndex) {
				return {
					...sentence,
					hasBeenRead: false,
					words: sentence.words.map((word) => ({ ...word, hasBeenRead: false }))
				}
			}
			return sentence
		})
		copyOfPreparedText.current = newPreparedText
		setPreparedText(newPreparedText)
	}



	if (isntCompatible) {
		return <div className="flex flex-col h-screen items-center justify-center">
			<h1 className="text-4xl font-bold">Speech Recognition not supported</h1>
		</div>
	}

	if (isEditingText) {
		return <Editor text={text} onChange={setText} onClose={() => setIsEditingText(false)} />
	}



	return (
		<div className="flex flex-col h-screen items-center w-full  overflow-hidden">
			<div
				className="flex-grow w-full overflow-hidden">
				<div className="h-full w-full overflow-y-scroll">
					<div className="min-h-full mx-auto font-bold px-4 border-l-2 border-r-2 border-slate-500" style={{ fontSize: `${fontSize}px`, width: `${textWidth}px` }} ref={wrapperDivRef}>
						{/* {preparedText || ""} */}
						{preparedText?.map((sentence) => {
							return <div key={sentence.id}
								role="button"
								onClick={() => {
									onClickOfSentence(sentence.id)
								}}>
								<SentenceDisplay

									sentence={sentence} />
							</div>
						})}
					</div>
				</div>
			</div>
			<div className="flex-shrink-0 w-full p-2 border-t border-gray-300 flex flex-row gap-4 items-center justify-center">
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded"
					onClick={handleStartStop}
				>
					{isRunning ? 'Stop' : 'Start'}
				</button>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded"
					onClick={reset}>
					Reset
				</button>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded"
					onClick={() => setIsEditingText(true)}
				>
					Edit Text
				</button>
				<div>
					<label htmlFor="size" className="mr-2">Font Size: </label>
					<input
						id="size"
						type="range"
						min="10"
						max="100"
						value={fontSize}
						onChange={(e) => setFontSize(Number(e.target.value))}
					/>
				</div>
				<div>
					<label className="mr-2" htmlFor='width'>Text Width: </label>
					<input
						id="width"
						type="range"
						min="300"
						max="1200"
						value={textWidth}
						onChange={(e) => setTextWidth(Number(e.target.value))}
					/>
				</div>
			</div>
		</div>
	)
}

export default Prompter

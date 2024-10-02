
let lastTranscript = ''

const mySpeechRecognition = () => {
	let recognition: SpeechRecognition | null = null
	let isAlreadyRunning = false



	const init = () => {

		if ('webkitSpeechRecognition' in window) {
			// @ts-expect-error - Property 'webkitSpeechRecognition' does not exist on type 'Window'
			recognition = new webkitSpeechRecognition()
			// @ts-expect-error - Object is possibly 'null'
			recognition.continuous = true
			// @ts-expect-error - Object is possibly 'null'
			recognition.interimResults = true
			console.log('Speech recognition initialized')
		} else {
			console.error('Speech recognition not supported')
			// startBtn.disabled = true
		}
	}
	init()
	const listen = (onResult: (result: string[]) => void) => {
		if (!recognition) return console.error('Speech recognition not initialized')
		// Check if recognition is already running
		lastTranscript = ''
		if (isAlreadyRunning) return console.warn('Recognition is already running')
		isAlreadyRunning = true

		let timeoutId: number | null = null

		const clearTranscriptPeriodically = () => {
			if (timeoutId) clearTimeout(timeoutId)
			timeoutId = setTimeout(() => {
				lastTranscript = ''
				clearTranscriptPeriodically()
			}, 3000)
		}

		recognition.onresult = (event) => {
			const results = event.results
			const transcript = results[results.length - 1][0].transcript.trim()
			const words = transcript.split(' ')

			// Find the new words by comparing with the last transcript
			const lastWords = lastTranscript.split(' ')
			const newWords = words.slice(lastWords.length)

			// console.log('Transcript:', transcript)
			// console.log('New Words:', newWords)

			// Update the last transcript
			lastTranscript = transcript

			onResult(newWords)

			// Reset the periodic clearing of the transcript
			clearTranscriptPeriodically()
		}

		recognition.start()
		clearTranscriptPeriodically()
	}

	const stop = () => {
		if (!recognition) return
		if (isAlreadyRunning === false) return
		isAlreadyRunning = false
		recognition.stop()
		lastTranscript = ''
	}

	return {
		listen,
		stop
	}
}

export default mySpeechRecognition

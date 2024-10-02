import { useState } from 'react'

import Prompter from './components/Prompter'

function App() {
	const [text, setText] = useState(`Edit your text here...`)

	return <div className='w-full h-screen overflow-hidden'>
		<Prompter text={text} setText={setText} />
	</div>

}

export default App

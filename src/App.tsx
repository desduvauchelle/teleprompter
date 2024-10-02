import { useState } from 'react'

import Prompter from './components/Prompter'

function App() {
	const [text, setText] = useState(`Ever wondered how AI can search like Google and answer like Einstein?

That's the magic of Retrieval Augmented Generation, or RAG!

It's like blending a search engine with artificial intelligence.

When you ask something, the AI first searches documents, the web, or any source you provided.

Then, it extracts key info to add context to your prompt.

Finally, the AI uses this enriched info to give a super accurate answer.

Imagine uploading your favorite book to the AI.

The AI breaks it into single pages and stores them.

Ask about a character from that book, and it finds the relevant pages to tailor its response.

Why is this amazing?

It makes answers more accurate and insightful.

Plus, it saves resources and can even lower costs.

Unlock more power with AI and RAG!`)

	return <div className='w-full h-screen overflow-hidden'>
		<Prompter text={text} setText={setText} />
	</div>

}

export default App

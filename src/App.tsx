import { useState } from 'react'

import Prompter from './components/Prompter'

function App() {
	const [text, setText] = useState(`If you've ever wondered why your AI prompts aren't yielding the results you expect, or you just want a smoother process, then you're in the right place!

Here's what you'll get from watching this video:

Understand the basic prompting techniques to get better results with AI.

Learn a foolproof format that you can use to boost your AI productivity.

 Get analogies and practical examples to make the guidelines stick.

 What's up AI Juicers! Denis here. If you are new, we're dedicated to squeezing every last drop of value from AI!

 So, how can you avoid spending hours tweaking and refining your AI-generated content?

 By learning a simple, yet powerful prompting technique!

Imagine you're training a new employee. If you just tell them, &quot;do this now,&quot; they'll likely struggle.

Instead, you walk them through the key points.

The same principle applies to AI prompting.

If you find any value in this video, please drop a like and subscribe, that would help me make more of these videos!

Let's get into the super secret format I use to get optimal AI results: Role, Guidelines, Context, Task.

First, tell the AI its role. For instance, &quot;You are an expert at writing social media posts.&quot; This turns AI from a bazooka into a sniper.

 Next, provide your own sauce through guidelines. These are bullet points outlining what's important to you.

&quot;Start the posts with a Hook, be concise...&quot; You can list 2 bullet points or 20 but keep it relevant and short.

 Then, give it some context.

 Explain what your company or project is about, your goals, and your style.

And, if you are sharing content, tell the AI who your audience is. This informs tone and wording.

Finally, specify the task. By now, the AI knows what needs to be done.

 Summarize with, &quot;Do the thing you need to do, following the guidelines and targeted to my audience.&quot; Simple, right?

Just remember, this is like training an intern. Clarify their role, guidelines, context, and task.

And don't worry; AI is flexible. Your prompt could be 5 lines or 200, depending on your needs.

To save time, write your prompt in a notepad app or check out ai-juicing.com, where you can create your own prompt libraries.

Thanks for watching, and if you have any questions, drop them in the comments along with a Like! Have a good one!!`)

	return <div className='w-full h-screen overflow-hidden'>
		<Prompter text={text} setText={setText} />
	</div>

}

export default App

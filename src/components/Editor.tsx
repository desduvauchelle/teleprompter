import React, { useState } from 'react'

interface EditorProps {
	text?: string
	onChange: (newText: string) => void
	onClose: () => void
}

const Editor: React.FC<EditorProps> = ({ text = '', onChange, onClose }) => {
	const [currentText, setCurrentText] = useState(text)

	const handleSave = () => {
		onChange(currentText)
		onClose()
	}

	return (
		<div className="flex flex-col h-screen">
			<textarea
				aria-label="Script"
				className="flex-grow p-4  bg-transparent text-white text-xl"
				value={currentText}
				onChange={(e) => setCurrentText(e.target.value)}
			/>
			<div className="flex justify-end p-4 space-x-2 min-h-5">
				<button
					className="px-4 py-2 bg-blue-500 text-white rounded"
					onClick={handleSave}
				>
					Save
				</button>
				<button
					className="px-4 py-2 bg-gray-500 text-white rounded"
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	)
}

export default Editor

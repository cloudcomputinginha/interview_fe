import React from 'react'

type Props = {}

const AICard = (props: Props) => {
	return (
		<div className="flex-1 min-w-[200px] bg-gray-800 rounded-lg flex flex-col items-center justify-center relative p-4">
			<div className="absolute top-3 left-3 bg-gray-900/50 px-2 py-1 rounded text-xs">
				면접관
			</div>
			<div className="w-24 h-24 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center">
				<span className="text-[#8FD694] text-4xl font-bold">AI</span>
			</div>
			<div className="mt-2 text-center">
				<div className="text-sm font-medium text-gray-300">AI 면접관</div>
				<div className="text-xs text-gray-500">질문 진행</div>
			</div>
		</div>
	)
}

export default AICard

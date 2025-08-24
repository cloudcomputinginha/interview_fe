import React from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type Props = {}

const InterviewHeader = (props: Props) => {
	return (
		<div className="p-4 border-b border-gray-800 flex justify-between items-center">
			<div className="flex items-center">
				<div className="w-8 h-8 rounded-full bg-[#8FD694] flex items-center justify-center mr-2">
					<span className="text-white font-bold">In</span>
				</div>
				<span className="font-bold">job</span>
			</div>
			<div className="text-center">
				<span className="text-sm text-gray-400">면접 진행 중</span>
			</div>
			<Button
				variant="ghost"
				size="sm"
				className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
				onClick={() => {
					if (
						confirm(
							'면접을 종료하시겠습니까? 지금까지의 진행 상황은 저장되지 않습니다.'
						)
					) {
						window.location.href = '/workspace'
					}
				}}
			>
				<X className="h-5 w-5 mr-1" /> 종료
			</Button>
		</div>
	)
}

export default InterviewHeader

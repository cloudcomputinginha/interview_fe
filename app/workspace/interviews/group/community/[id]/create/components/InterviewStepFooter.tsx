import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface InterviewStepFooterProps {
	step: number
	onPrev: () => void
	onNext: () => void
}

export function InterviewStepFooter({
	step,
	onPrev,
	onNext,
}: InterviewStepFooterProps) {
	return (
		<div className="flex justify-between">
			<Button variant="outline" onClick={onPrev}>
				{step === 1 ? '취소' : '이전'}
			</Button>
			<Button
				className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
				onClick={onNext}
			>
				{step === 2 ? '면접 예약하기' : '다음'}
				<ArrowRight className="ml-2 h-4 w-4" />
			</Button>
		</div>
	)
}

import { getStepTitle, getTotalSteps } from '@/lib/interview/util'

type Props = {
	step: number
	interviewType: string
}

const CreateInterviewProgress = ({ step, interviewType }: Props) => {
	return (
		<div className="mb-8">
			<div className="flex justify-between text-sm mb-2">
				<span className="text-[#8FD694] font-medium">
					단계 {step}/{getTotalSteps(interviewType)}
				</span>
				<span className="text-gray-500">
					{getStepTitle(step, interviewType)}
				</span>
			</div>
			<div className="w-full bg-gray-200 rounded-full h-2">
				<div
					className="bg-[#8FD694] h-2 rounded-full transition-all duration-300"
					style={{ width: `${(step / getTotalSteps(interviewType)) * 100}%` }}
				></div>
			</div>
		</div>
	)
}

export default CreateInterviewProgress

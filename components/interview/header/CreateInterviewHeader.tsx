import React from 'react'
import { ArrowLeft } from 'lucide-react'

type Props = {
	prevStep: () => void
}

const CreateInterviewHeader = ({ prevStep }: Props) => {
	return (
		<div className="mb-8">
			<button
				onClick={prevStep}
				className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
			>
				<ArrowLeft className="h-4 w-4 mr-1" /> 내 면접으로 돌아가기
			</button>
			<h1 className="text-2xl font-bold">새 면접 만들기</h1>
			<p className="text-gray-600 mt-2">
				면접을 시작하기 위한 정보를 입력해주세요.
			</p>
		</div>
	)
}

export default CreateInterviewHeader

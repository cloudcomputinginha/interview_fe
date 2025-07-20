'use client'

import { CheckCircle, MessageSquareQuote } from 'lucide-react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { aiFetch } from '@/utils/fetch/fetch'
import { terminateInterview } from '@/apis/interview'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export default function ReportPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	// Param으로 넘겨줄 때 interviewId, memberInterviewId, sessionId 순으로 넘겨줌

	const { id: ids } = use(params)
	const [interviewId, memberInterviewId, sessionId] = ids.split('_')

	const router = useRouter()

	const {
		data: result,
		isError,
		error,
	} = useQuery({
		queryKey: ['interview', sessionId],
		queryFn: () =>
			aiFetch.get(`/interview/session/${interviewId}/${memberInterviewId}`),
		enabled: !!interviewId && !!memberInterviewId,
	})

	if (isError) {
		alert('면접 세션을 찾을 수 없습니다.')
		router.replace('/workspace/interviews')
	}
	console.log(result)

	const { mutateAsync: endInterview } = useMutation({
		mutationFn: () =>
			terminateInterview(Number(interviewId), {
				endedAt: new Date().toISOString(),
			}),
	})

	const closeInterview = async () => {
		if (confirm('면접을 종료하시겠습니까?')) {
			if (memberInterviewId) {
				await endInterview()
			}
			router.replace('/workspace/interviews')
		}
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto p-6">
				{/* 멤버 정보 및 인사 멘트 */}
				<div className="flex flex-col items-center mb-8">
					<div className="w-16 h-16 rounded-full mb-2 border border-gray-200 bg-white flex items-center justify-center">
						<Sparkles className="w-8 h-8 text-[#8FD694]" />
					</div>
					<div className="text-lg font-semibold text-gray-800 mb-1">
						수고하셨습니다
					</div>
				</div>
				{/* 최종 평가 */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 text-center">
					<div className="flex flex-col items-center mb-2">
						<CheckCircle className="h-8 w-8 text-[#8FD694] mb-2" />
						<h2 className="text-2xl font-bold mb-2">최종 평가</h2>
					</div>
					<p className="text-gray-700 text-base leading-relaxed max-w-2xl mx-auto">
						{result?.final_report}
					</p>
				</div>

				{/* 질문별 피드백 */}
				<div className="mb-6">
					<h2 className="text-xl font-semibold mb-4">질문별 피드백</h2>
					<div className="space-y-6">
						{result?.qa_flow?.map((qa, idx) => (
							<div
								key={idx}
								className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
							>
								<div className="flex items-center mb-2">
									<MessageSquareQuote className="h-5 w-5 text-[#8FD694] mr-2" />
									<span className="font-medium text-lg text-gray-900">
										Q{idx + 1}. {qa.question}
									</span>
								</div>
								<div className="ml-7 mb-1 text-gray-700">
									<span className="font-semibold">답변:</span> {qa.answer}
								</div>
								{qa.follow_ups && qa.follow_ups?.length > 0 && (
									<div className="ml-7 mb-2 space-y-1">
										{qa.follow_ups?.map((fu, fidx) => (
											<div
												key={fidx}
												className="pl-4 border-l-2 border-[#8FD694] text-gray-600 text-sm"
											>
												<span className="font-semibold">└ 추가질문:</span>{' '}
												{fu?.question}
												<br />
												<span className="font-semibold">└ 답변:</span>{' '}
												{fu?.answer}
											</div>
										))}
									</div>
								)}
								<div className="ml-7 mt-2 text-gray-500 text-sm">
									<span className="font-semibold">피드백:</span> {qa.feedback}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

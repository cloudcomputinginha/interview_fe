'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	ArrowLeft,
	Download,
	Share2,
	CheckCircle,
	XCircle,
	BarChart,
	Play,
} from 'lucide-react'
import { HeaderWithNotifications } from '@/components/header-with-notifications'
import { CommunityLayout } from '@/components/community-layout'

export default function ReportPage() {
	// Mock data for the report
	const overallScore = 'A'
	const categories = [
		{
			name: '내용 전달력',
			score: 'A',
			feedback:
				'질문의 핵심을 정확히 파악하고 논리적으로 답변했습니다. 특히 프로젝트 경험을 설명할 때 STAR 기법을 잘 활용했습니다.',
		},
		{
			name: '논리성',
			score: 'B+',
			feedback:
				'전반적으로 논리적인 구조를 갖추었으나, 일부 답변에서 주제 간 연결이 부족했습니다. 특히 직무 역량 관련 질문에서 더 구체적인 예시가 필요했습니다.',
		},
		{
			name: '태도',
			score: 'A+',
			feedback:
				'면접 내내 적절한 자세와 시선 처리를 유지했습니다. 자신감 있는 목소리 톤과 밝은 표정이 인상적이었습니다.',
		},
		{
			name: '전문성',
			score: 'A-',
			feedback:
				'직무 관련 지식을 충분히 보여주었으나, 일부 기술적 질문에서 더 깊이 있는 답변이 필요했습니다.',
		},
	]

	const goodPoints = [
		'자기소개서와 일관된 답변으로 신뢰감을 주었습니다.',
		'구체적인 경험과 수치를 활용한 답변이 설득력 있었습니다.',
		'어려운 질문에도 침착하게 대응했습니다.',
	]

	const improvementPoints = [
		'일부 답변이 너무 길었습니다. 핵심을 더 간결하게 전달하면 좋겠습니다.',
		'기술적 역량을 보여주는 구체적인 사례가 더 필요합니다.',
		'가끔 불필요한 간투어(음..., 그...)를 사용했습니다.',
	]

	return (
		<>
			<HeaderWithNotifications />
			<CommunityLayout activeItem="documents">
				<div className="min-h-screen bg-gray-50">
					<div className="max-w-4xl mx-auto p-6">
						{/* Header */}
						<div className="mb-8">
							<Link
								href="/workspace"
								className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
							>
								<ArrowLeft className="h-4 w-4 mr-1" /> 워크스페이스로 돌아가기
							</Link>
							<div className="flex justify-between items-center">
								<h1 className="text-2xl font-bold">면접 결과 리포트</h1>
								<div className="flex space-x-2">
									<Button
										variant="outline"
										size="sm"
										className="flex items-center"
									>
										<Download className="h-4 w-4 mr-1" /> PDF 저장
									</Button>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center"
									>
										<Share2 className="h-4 w-4 mr-1" /> 공유
									</Button>
								</div>
							</div>
							<p className="text-gray-600 mt-2">
								2023년 5월 16일 진행된 모의 면접 결과입니다.
							</p>
						</div>

						{/* Overall Score */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 text-center">
							<div className="inline-flex flex-col items-center">
								<div className="text-6xl font-bold text-[#8FD694] mb-2">
									{overallScore}
								</div>
								<div className="text-gray-600">종합 평가</div>
							</div>
							<p className="mt-4 text-gray-700 max-w-2xl mx-auto">
								전반적으로 우수한 면접 수행을 보여주셨습니다. 특히 자기소개서와
								일관된 답변과 구체적인 경험 사례가 돋보였습니다. 일부 개선이
								필요한 부분이 있으나, 충분히 경쟁력 있는 면접 역량을 갖추고
								있습니다.
							</p>
						</div>

						{/* Category Feedback */}
						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-4">카테고리별 피드백</h2>
							<div className="space-y-4">
								{categories.map((category, index) => (
									<div
										key={index}
										className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
									>
										<div className="flex justify-between items-center mb-3">
											<h3 className="font-medium text-lg flex items-center">
												<BarChart className="h-5 w-5 text-[#8FD694] mr-2" />
												{category.name}
											</h3>
											<div
												className={`px-3 py-1 rounded-full text-sm font-medium ${
													category.score.startsWith('A+')
														? 'bg-purple-100 text-purple-800'
														: category.score.startsWith('A')
															? 'bg-green-100 text-green-800'
															: 'bg-blue-100 text-blue-800'
												}`}
											>
												{category.score}
											</div>
										</div>
										<p className="text-gray-700">{category.feedback}</p>
									</div>
								))}
							</div>
						</div>

						{/* Good Points & Improvements */}
						<div className="grid md:grid-cols-2 gap-6 mb-8">
							{/* Good Points */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
								<h3 className="font-medium text-lg flex items-center mb-4">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2" />
									잘한 점
								</h3>
								<ul className="space-y-3">
									{goodPoints.map((point, index) => (
										<li key={index} className="flex items-start">
											<div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
												<CheckCircle className="h-3 w-3 text-green-500" />
											</div>
											<span className="text-gray-700">{point}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Improvements */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
								<h3 className="font-medium text-lg flex items-center mb-4">
									<XCircle className="h-5 w-5 text-red-500 mr-2" />
									개선할 점
								</h3>
								<ul className="space-y-3">
									{improvementPoints.map((point, index) => (
										<li key={index} className="flex items-start">
											<div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
												<XCircle className="h-3 w-3 text-red-500" />
											</div>
											<span className="text-gray-700">{point}</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						{/* Question-by-Question */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
							<h2 className="text-xl font-semibold mb-4">질문별 분석</h2>
							<p className="text-gray-600 mb-4">
								각 질문에 대한 상세 피드백과 점수를 확인하세요.
							</p>
							<div className="space-y-4">
								{[1, 2, 3].map(questionNum => (
									<div
										key={questionNum}
										className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
									>
										<div className="flex justify-between items-center">
											<h4 className="font-medium">질문 {questionNum}</h4>
											<Button
												variant="ghost"
												size="sm"
												className="text-[#8FD694] hover:text-[#7ac47f] hover:bg-[#8FD694]/10"
											>
												<Play className="h-4 w-4 mr-1" /> 답변 듣기
											</Button>
										</div>
										<p className="text-sm text-gray-500 mt-1">
											{questionNum === 1
												? '자기소개서에 언급하신 프로젝트에서 가장 어려웠던 점과 어떻게 해결했는지 설명해주세요.'
												: questionNum === 2
													? '팀 프로젝트에서 갈등이 있었을 때 어떻게 해결했는지 구체적인 사례를 들어 설명해주세요.'
													: '지원하신 직무에 필요한 역량이 무엇이라고 생각하시나요?'}
										</p>
									</div>
								))}
							</div>
							<div className="text-center mt-4">
								<Button variant="outline">모든 질문 보기 (총 5개)</Button>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex justify-between">
							<Button
								variant="outline"
								onClick={() => (window.location.href = '/workspace')}
							>
								워크스페이스로 돌아가기
							</Button>
							<Button
								className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
								onClick={() => (window.location.href = '/workspace/upload')}
							>
								새 면접 시작하기
							</Button>
						</div>
					</div>
				</div>
			</CommunityLayout>
		</>
	)
}

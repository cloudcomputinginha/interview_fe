// src/components/interview/steps/Step5Individual.tsx
'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
	FileText,
	Upload,
	Brain,
	CalendarIcon,
	Clock,
	User,
} from 'lucide-react'
import type { InterviewFormState } from '@/lib/interview/types'
import { useMemo } from 'react'

/**
 * 이 컴포넌트는 "개인 면접" 최종 확인 화면입니다.
 * resumes / coverLetters 배열은 선택 props로 두어, 상위가 전달하지 않아도 컴파일 에러가 나지 않도록 처리했습니다.
 */

export interface Resume {
	id: string
	name: string
	url: string
}
export interface CoverLetter {
	id: string
	representativeTitle: string
	items: { title: string; content: string }[]
}

interface Props {
	form: InterviewFormState
	setForm?: React.Dispatch<React.SetStateAction<InterviewFormState>> // 사용은 안하지만 상위 호환
	resumes?: Resume[]
	coverLetters?: CoverLetter[]
}

export default function Step5Individual({
	form,
	resumes = [],
	coverLetters = [],
}: Props) {
	const resumeObj = resumes.find(r => r.id === form.resumeId)
	const coverLetterObj = coverLetters.find(c => c.id === form.coverLetterId)

	const voiceType = useMemo(() => {
		if (form.voiceType.includes('female')) {
			return '여성 ' + form.voiceType.split('female')[1] + '대'
		} else {
			return '남성 ' + form.voiceType.split('male')[1] + '대'
		}
	}, [form.voiceType])

	return (
		<div className="space-y-6">
			<div className="text-center mb-8">
				<h2 className="text-xl font-semibold mb-2">면접 정보 확인</h2>
				<p className="text-gray-600">
					설정한 내용을 검토하고 면접을 생성하세요.
				</p>
			</div>

			<div className="grid gap-6">
				{/* 기본 정보 */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-[#8FD694]" /> 기본 정보
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-1 text-sm">
						<p>기업: {form.company}</p>
						<p>직무: {form.position}</p>
						<p className="flex items-center gap-1">
							유형: <User className="h-4 w-4 text-[#8FD694]" /> 1:1 개인 면접
						</p>
						<p>제목: {form.title}</p>
						{form.description && <p>설명: {form.description}</p>}
					</CardContent>
				</Card>

				{/* 일정 */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CalendarIcon className="h-5 w-5 text-[#8FD694]" /> 일정 정보
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-1 text-sm">
						<p className="flex items-center gap-1">
							<Clock className="h-4 w-4 text-[#8FD694]" /> 시작 방식:{' '}
							{form.startType === 'now' ? '즉시' : '예약'}
						</p>
						{form.startType === 'scheduled' && form.scheduledDate && (
							<p>
								예약 시간: {form.scheduledDate.toLocaleDateString()}{' '}
								{form.scheduledTime}
							</p>
						)}
					</CardContent>
				</Card>

				{/* 옵션 */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Brain className="h-5 w-5 text-[#8FD694]" /> 면접 옵션
						</CardTitle>
					</CardHeader>
					<CardContent className="grid md:grid-cols-2 gap-2 text-sm">
						<p>AI 음성: {voiceType}</p>
						<p>
							스타일: {form.interviewStyle === 'personality' ? '인성' : '기술'}
						</p>
						<p>질문 수: {form.questionCount}</p>
						<p>답변 시간: {form.answerDuration}분</p>
					</CardContent>
				</Card>

				{/* 자료 정보 */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Upload className="h-5 w-5 text-[#8FD694]" /> 자료 정보
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-sm">
						<div className="flex justify-between items-center">
							<span className="text-gray-600">이력서:</span>
							<span className="font-medium">
								{form.resumeTitle || (resumeObj ? resumeObj.name : '미선택')}
							</span>
						</div>
						<div>
							<div className="flex justify-between mb-1">
								<span className="text-gray-600">자기소개서:</span>
								<span className="font-medium">
									{form.coverLetterTitle ||
										(coverLetterObj
											? coverLetterObj.representativeTitle
											: '미선택')}
								</span>
							</div>
							{coverLetterObj && (
								<ul className="bg-gray-50 p-3 rounded max-h-32 overflow-y-auto whitespace-pre-wrap text-xs space-y-2">
									{coverLetterObj.items.map((item: any, idx: number) => (
										<li key={idx}>
											<span className="font-semibold">[{item.title}]</span>{' '}
											{item.content}
										</li>
									))}
								</ul>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

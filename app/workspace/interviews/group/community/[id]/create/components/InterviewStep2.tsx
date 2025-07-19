import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
	DURATION_RANGE,
	QUESTION_COUNT_RANGE,
	AI_VOICE_OPTIONS,
} from '../constants/interviewOptions'
import type {
	Resume,
	CoverLetter,
	AiVoice,
	InterviewType,
} from '../types/interview'

interface InterviewStep2Props {
	selectedResume: string
	selectedCoverLetter: string
	aiVoice: AiVoice
	interviewType: InterviewType
	questionCount: number
	duration: number
	setField: (field: string, value: any) => void
	resumes: Resume[]
	coverLetters: CoverLetter[]
}

export function InterviewStep2({
	selectedResume,
	selectedCoverLetter,
	aiVoice,
	interviewType,
	questionCount,
	duration,
	setField,
	resumes,
	coverLetters,
}: InterviewStep2Props) {
	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<h3 className="text-sm font-medium text-gray-700">호스트 자료 선택</h3>
				<p className="text-sm text-gray-600">
					호스트로서 사용할 이력서와 자기소개서를 선택해주세요. 다른 참가자들은
					면접 참여 신청 시 자신의 자료를 선택하게 됩니다.
				</p>
				<div>
					<Label className="block text-sm font-medium text-gray-700 mb-2">
						이력서 선택
					</Label>
					<Select
						value={selectedResume}
						onValueChange={v => setField('selectedResume', v)}
					>
						<SelectTrigger>
							<SelectValue placeholder="이력서를 선택하세요" />
						</SelectTrigger>
						<SelectContent>
							{resumes.map(resume => (
								<SelectItem key={resume.id} value={resume.id}>
									{resume.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label className="block text-sm font-medium text-gray-700 mb-2">
						자기소개서 선택
					</Label>
					<Select
						value={selectedCoverLetter}
						onValueChange={v => setField('selectedCoverLetter', v)}
					>
						<SelectTrigger>
							<SelectValue placeholder="자기소개서를 선택하세요" />
						</SelectTrigger>
						<SelectContent>
							{coverLetters.map(letter => (
								<SelectItem key={letter.id} value={letter.id}>
									{letter.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="border-t pt-6 space-y-6">
				<h3 className="text-sm font-medium text-gray-700">면접 옵션 설정</h3>
				<p className="text-sm text-gray-600">
					면접 진행 방식에 대한 옵션을 설정해주세요. 이 설정은 모든 참가자에게
					공통으로 적용됩니다.
				</p>
				<div className="space-y-6">
					<div>
						<Label className="block text-sm font-medium text-gray-700 mb-2">
							AI 음성 선택
						</Label>
						<Select value={aiVoice} onValueChange={v => setField('aiVoice', v)}>
							<SelectTrigger>
								<SelectValue placeholder="AI 음성을 선택하세요" />
							</SelectTrigger>
							<SelectContent>
								{AI_VOICE_OPTIONS.map(opt => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-xs text-gray-500 mt-1">
							면접관의 음성을 선택합니다. 실제 면접과 유사한 경험을 위해
							선택하세요.
						</p>
					</div>
					<div>
						<Label className="block text-sm font-medium text-gray-700 mb-2">
							면접 유형
						</Label>
						<div className="flex items-center justify-between p-3 border rounded-md">
							<span className="text-sm">인성 면접</span>
							<Switch
								checked={interviewType === 'technical'}
								onCheckedChange={checked =>
									setField(
										'interviewType',
										checked ? 'technical' : 'personality'
									)
								}
							/>
							<span className="text-sm">기술 면접</span>
						</div>
						<p className="text-xs text-gray-500 mt-1">
							인성 면접은 가치관과 경험에 관한 질문, 기술 면접은 직무 관련 전문
							지식을 평가합니다.
						</p>
					</div>
					<div>
						<Label className="block text-sm font-medium text-gray-700 mb-2">
							질문 수
						</Label>
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-500">질문 수</span>
								<span className="font-medium">{questionCount}개</span>
							</div>
							<Slider
								value={[questionCount]}
								min={QUESTION_COUNT_RANGE.min}
								max={QUESTION_COUNT_RANGE.max}
								step={1}
								onValueChange={v => setField('questionCount', v[0])}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-gray-500">
								<span>{QUESTION_COUNT_RANGE.min}개</span>
								<span>{QUESTION_COUNT_RANGE.default}개</span>
								<span>{QUESTION_COUNT_RANGE.max}개</span>
							</div>
						</div>
						<p className="text-xs text-gray-500 mt-1">
							면접에서 제시될 질문의 수를 설정합니다.
						</p>
					</div>
					<div>
						<Label className="block text-sm font-medium text-gray-700 mb-2">
							답변 시간 설정
						</Label>
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-500">답변 시간</span>
								<span className="font-medium">{duration}분</span>
							</div>
							<Slider
								value={[duration]}
								min={DURATION_RANGE.min}
								max={DURATION_RANGE.max}
								step={1}
								onValueChange={v => setField('duration', v[0])}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-gray-500">
								<span>{DURATION_RANGE.min}분</span>
								<span>{DURATION_RANGE.default}분</span>
								<span>{DURATION_RANGE.max}분</span>
							</div>
						</div>
						<p className="text-xs text-gray-500 mt-1">
							각 질문당 답변 시간을 설정합니다. 기본값은 2분입니다.
						</p>
					</div>
					<div>
						<Label className="block text-sm font-medium text-gray-700 mb-2">
							면접 방식
						</Label>
						<div className="p-3 border rounded-md bg-gray-50">
							<div className="flex items-center">
								<div className="w-5 h-5 rounded-full bg-[#8FD694] flex items-center justify-center mr-2">
									<span className="text-white text-xs">✓</span>
								</div>
								<span className="font-medium">다대다 면접</span>
							</div>
							<p className="text-xs text-gray-500 mt-1 ml-7">
								여러 참가자가 순서대로 동일한 질문에 답변하는 방식입니다.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

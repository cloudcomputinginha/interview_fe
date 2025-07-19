'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function GroupInterviewSetupPage() {
	const [step, setStep] = useState(1)
	const [interviewType, setInterviewType] = useState('technical')
	const [duration, setDuration] = useState(2)
	const [aiVoice, setAiVoice] = useState('female1')

	// 이 데이터는 실제로는 이전 페이지에서 전달받거나 상태 관리 라이브러리에서 가져옴
	const [sessionName, setSessionName] = useState('2023 상반기 공채 모의면접')
	const [participants, setParticipants] = useState([
		{ id: 1, name: '김지원', resume: '', coverLetter: '' },
		{ id: 2, name: '이민수', resume: '', coverLetter: '' },
		{ id: 3, name: '박서연', resume: '', coverLetter: '' },
	])

	// Mock data
	const resumes = [
		{ id: '1', name: '신입 개발자 이력서.pdf' },
		{ id: '2', name: '포트폴리오_2023.pdf' },
		{ id: '3', name: '경력기술서_최종.docx' },
	]

	const coverLetters = [
		{ id: '1', name: '삼성전자 자기소개서.pdf' },
		{ id: '2', name: '네이버 지원 자소서.docx' },
		{ id: '3', name: '카카오 인턴십 자소서' },
		{ id: '4', name: '현대자동차 공채 지원서.pdf' },
	]

	const updateParticipant = (
		id: number,
		field: 'resume' | 'coverLetter',
		value: string
	) => {
		setParticipants(
			participants.map(p => (p.id === id ? { ...p, [field]: value } : p))
		)
	}

	const nextStep = () => {
		if (step === 1) {
			// 모든 참가자가 이력서와 자소서를 선택했는지 확인
			const allSelected = participants.every(p => p.resume && p.coverLetter)
			if (!allSelected) {
				alert('모든 참가자의 이력서와 자기소개서를 선택해주세요.')
				return
			}
		}

		if (step < 3) {
			setStep(step + 1)
		} else {
			// 면접 시작
			window.location.href = '/workspace/interview/group/session'
		}
	}

	const prevStep = () => {
		if (step > 1) {
			setStep(step - 1)
		} else {
			window.location.href = '/workspace/interviews'
		}
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto p-6">
				{/* Header */}
				<div className="mb-8">
					<Link
						href="/workspace/interviews"
						className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
					>
						<ArrowLeft className="h-4 w-4 mr-1" /> 내 면접으로 돌아가기
					</Link>
					<h1 className="text-2xl font-bold">{sessionName}</h1>
					<p className="text-gray-600 mt-2">
						다대다 면접을 시작하기 위한 설정을 완료해주세요.
					</p>
				</div>

				{/* Progress Bar */}
				<div className="mb-8">
					<div className="flex justify-between text-sm mb-2">
						<span className="text-[#8FD694] font-medium">단계 {step}/3</span>
						<span className="text-gray-500">
							{step === 1
								? '참가자 정보'
								: step === 2
									? '이력서/자소서 선택'
									: '면접 옵션 선택'}
						</span>
					</div>
					<Progress value={(step / 3) * 100} className="h-2" />
				</div>

				{/* Step Content */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>
							{step === 1
								? '참가자 정보'
								: step === 2
									? '이력서/자소서 선택'
									: '면접 옵션 선택'}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{step === 1 && (
							<div className="space-y-4">
								<p className="text-sm text-gray-600 mb-4">
									다대다 면접에 참여할 참가자 명단입니다. 필요한 경우 이름을
									수정하세요.
								</p>

								{participants.map((participant, index) => (
									<div
										key={participant.id}
										className="flex items-center space-x-2"
									>
										<div className="w-8 h-8 rounded-full bg-[#8FD694] bg-opacity-20 flex items-center justify-center">
											<span className="text-[#8FD694] font-medium">
												{index + 1}
											</span>
										</div>
										<input
											type="text"
											value={participant.name}
											onChange={e => {
												const newParticipants = [...participants]
												newParticipants[index].name = e.target.value
												setParticipants(newParticipants)
											}}
											className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8FD694] focus:border-transparent"
											placeholder={`참가자 ${index + 1} 이름`}
										/>
									</div>
								))}
							</div>
						)}

						{step === 2 && (
							<div className="space-y-6">
								<p className="text-sm text-gray-600 mb-4">
									각 참가자의 이력서와 자기소개서를 선택해주세요.
								</p>

								<Tabs
									defaultValue={participants[0].id.toString()}
									className="w-full"
								>
									<TabsList className="w-full flex mb-4">
										{participants.map((participant, index) => (
											<TabsTrigger
												key={participant.id}
												value={participant.id.toString()}
												className="flex-1"
											>
												참가자 {index + 1}: {participant.name}
											</TabsTrigger>
										))}
									</TabsList>

									{participants.map(participant => (
										<TabsContent
											key={participant.id}
											value={participant.id.toString()}
											className="space-y-4"
										>
											<div>
												<Label className="block text-sm font-medium text-gray-700 mb-2">
													이력서 선택
												</Label>
												<Select
													value={participant.resume}
													onValueChange={value =>
														updateParticipant(participant.id, 'resume', value)
													}
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
													value={participant.coverLetter}
													onValueChange={value =>
														updateParticipant(
															participant.id,
															'coverLetter',
															value
														)
													}
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
										</TabsContent>
									))}
								</Tabs>
							</div>
						)}

						{step === 3 && (
							<div className="space-y-6">
								<p className="text-sm text-gray-600 mb-4">
									면접 진행 방식에 대한 옵션을 설정해주세요. 이 설정은 모든
									참가자에게 공통으로 적용됩니다.
								</p>

								<div className="space-y-6">
									{/* AI Voice */}
									<div>
										<Label className="block text-sm font-medium text-gray-700 mb-2">
											AI 음성 선택
										</Label>
										<Select value={aiVoice} onValueChange={setAiVoice}>
											<SelectTrigger>
												<SelectValue placeholder="AI 음성을 선택하세요" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="female1">
													여성 음성 1 (기본)
												</SelectItem>
												<SelectItem value="female2">여성 음성 2</SelectItem>
												<SelectItem value="male1">남성 음성 1</SelectItem>
												<SelectItem value="male2">남성 음성 2</SelectItem>
											</SelectContent>
										</Select>
										<p className="text-xs text-gray-500 mt-1">
											면접관의 음성을 선택합니다. 실제 면접과 유사한 경험을 위해
											선택하세요.
										</p>
									</div>

									{/* Interview Type */}
									<div>
										<Label className="block text-sm font-medium text-gray-700 mb-2">
											면접 유형
										</Label>
										<div className="flex items-center justify-between p-3 border rounded-md">
											<span className="text-sm">인성 면접</span>
											<Switch
												checked={interviewType === 'technical'}
												onCheckedChange={checked =>
													setInterviewType(
														checked ? 'technical' : 'personality'
													)
												}
											/>
											<span className="text-sm">기술 면접</span>
										</div>
										<p className="text-xs text-gray-500 mt-1">
											인성 면접은 가치관과 경험에 관한 질문, 기술 면접은 직무
											관련 전문 지식을 평가합니다.
										</p>
									</div>

									{/* Answer Duration */}
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
												min={1}
												max={5}
												step={1}
												onValueChange={value => setDuration(value[0])}
												className="w-full"
											/>
											<div className="flex justify-between text-xs text-gray-500">
												<span>1분</span>
												<span>2분</span>
												<span>3분</span>
												<span>4분</span>
												<span>5분</span>
											</div>
										</div>
										<p className="text-xs text-gray-500 mt-1">
											각 질문당 답변 시간을 설정합니다. 기본값은 2분입니다.
										</p>
									</div>

									{/* Interview Format */}
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
												여러 참가자가 순서대로 동일한 질문에 답변하는
												방식입니다.
											</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="outline" onClick={prevStep}>
							{step === 1 ? '취소' : '이전'}
						</Button>
						<Button
							className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
							onClick={nextStep}
						>
							{step === 3 ? '면접 시작' : '다음'}
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}

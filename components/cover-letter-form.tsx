'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useMemberSession } from '@/components/member-session-context'

interface CoverLetterFormProps {
	onSubmit: (data: {
		memberId: number
		corporateName: string
		jobName: string
		qnaDTOList: { question: string; answer: string }[]
	}) => void
	onCancel: () => void
	initialData?: {
		corporateName: string
		jobName: string
		qnaDTOList: { question: string; answer: string }[]
	}
}

export function CoverLetterForm({
	onSubmit,
	onCancel,
	initialData,
}: CoverLetterFormProps) {
	const { memberId } = useMemberSession()
	const [corporateName, setCorporateName] = useState(
		initialData?.corporateName || ''
	)
	const [jobName, setJobName] = useState(initialData?.jobName || '')
	const [questionAnswerPairs, setQuestionAnswerPairs] = useState(
		initialData?.qnaDTOList
			? initialData.qnaDTOList.map((item, idx) => ({
					id: Date.now() + idx,
					...item,
				}))
			: [{ id: 1, question: '', answer: '' }]
	)
	const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

	const addQuestionAnswerPair = () => {
		setQuestionAnswerPairs([
			...questionAnswerPairs,
			{ id: Date.now(), question: '', answer: '' },
		])
	}

	const removeQuestionAnswerPair = (id: number) => {
		if (questionAnswerPairs.length > 1) {
			setQuestionAnswerPairs(questionAnswerPairs.filter(pair => pair.id !== id))
		}
	}

	const updateQuestionAnswerPair = (
		id: number,
		field: 'question' | 'answer',
		value: string
	) => {
		setQuestionAnswerPairs(
			questionAnswerPairs.map(pair =>
				pair.id === id ? { ...pair, [field]: value } : pair
			)
		)
	}

	const handleSubmit = () => {
		onSubmit({
			memberId: memberId!,
			corporateName,
			jobName,
			qnaDTOList: questionAnswerPairs.map(({ question, answer }) => ({
				question,
				answer,
			})),
		})
	}

	const isFormValid = () => {
		return (
			corporateName &&
			jobName &&
			questionAnswerPairs.every(pair => pair.question && pair.answer)
		)
	}

	return (
		<div className="space-y-6">
			<div>
				<Label htmlFor="corporateName" className="mb-2 block">
					기업명
				</Label>
				<Input
					id="corporateName"
					value={corporateName}
					onChange={e => setCorporateName(e.target.value)}
					placeholder="예: 삼성전자"
				/>
			</div>
			<div>
				<Label htmlFor="jobName" className="mb-2 block">
					직무명
				</Label>
				<Input
					id="jobName"
					value={jobName}
					onChange={e => setJobName(e.target.value)}
					placeholder="예: SW개발자"
				/>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={value => setActiveTab(value as 'edit' | 'preview')}
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="edit">편집</TabsTrigger>
					<TabsTrigger value="preview" disabled={!isFormValid()}>
						미리보기
					</TabsTrigger>
				</TabsList>

				<TabsContent value="edit" className="space-y-4">
					{questionAnswerPairs.map((pair, index) => (
						<div key={pair.id} className="p-4 border rounded-lg bg-gray-50">
							<div className="flex justify-between items-center mb-2">
								<h4 className="font-medium">질문 {index + 1}</h4>
								{questionAnswerPairs.length > 1 && (
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
										onClick={() => removeQuestionAnswerPair(pair.id)}
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
							<div className="space-y-3">
								<div>
									<Label
										htmlFor={`question-${pair.id}`}
										className="mb-1 block text-sm"
									>
										질문
									</Label>
									<Input
										id={`question-${pair.id}`}
										value={pair.question}
										onChange={e =>
											updateQuestionAnswerPair(
												pair.id,
												'question',
												e.target.value
											)
										}
										placeholder="예: 본인의 강점과 약점을 설명해주세요."
									/>
								</div>
								<div>
									<Label
										htmlFor={`answer-${pair.id}`}
										className="mb-1 block text-sm"
									>
										답변
									</Label>
									<Textarea
										id={`answer-${pair.id}`}
										value={pair.answer}
										onChange={e =>
											updateQuestionAnswerPair(
												pair.id,
												'answer',
												e.target.value
											)
										}
										placeholder="답변을 입력하세요..."
										rows={4}
									/>
								</div>
							</div>
						</div>
					))}
					<Button
						variant="outline"
						className="w-full border-dashed"
						onClick={addQuestionAnswerPair}
					>
						<Plus className="mr-2 h-4 w-4" /> 질문 추가
					</Button>
				</TabsContent>

				<TabsContent value="preview" className="space-y-6">
					<Card>
						<CardContent className="pt-6">
							<h2 className="text-xl font-bold mb-6">
								{corporateName} - {jobName}
							</h2>
							{questionAnswerPairs.map((pair, index) => (
								<div key={pair.id} className="mb-8">
									<h3 className="font-medium text-lg mb-2">{pair.question}</h3>
									<p className="text-gray-700 whitespace-pre-line">
										{pair.answer}
									</p>
								</div>
							))}
						</CardContent>
					</Card>
					<div className="text-right">
						<Button
							variant="outline"
							onClick={() => setActiveTab('edit')}
							className="gap-2"
						>
							계속 편집하기
						</Button>
					</div>
				</TabsContent>
			</Tabs>

			<div className="flex justify-end space-x-2 pt-4">
				<Button variant="outline" onClick={onCancel}>
					취소
				</Button>
				<Button
					className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
					onClick={handleSubmit}
					disabled={!isFormValid()}
				>
					저장
				</Button>
			</div>
		</div>
	)
}

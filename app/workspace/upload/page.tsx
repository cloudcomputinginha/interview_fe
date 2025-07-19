'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
	ArrowLeft,
	ArrowRight,
	Upload,
	FileText,
	AlertCircle,
} from 'lucide-react'
import { HeaderWithNotifications } from '@/components/header-with-notifications'
import { CommunityLayout } from '@/components/community-layout'

export default function UploadPage() {
	const [text, setText] = useState('')
	const [spellCheck, setSpellCheck] = useState(true)
	const [isDragging, setIsDragging] = useState(false)

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value)
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = () => {
		setIsDragging(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setIsDragging(false)

		// Handle file upload logic here
		const files = e.dataTransfer.files
		if (files.length) {
			console.log('File dropped:', files[0].name)
			// Process file
		}
	}

	return (
		<>
			<HeaderWithNotifications />
			<CommunityLayout activeItem="documents">
				<div className="min-h-screen bg-gray-50">
					<div className="max-w-3xl mx-auto p-6">
						{/* Header */}
						<div className="mb-8">
							<Link
								href="/workspace"
								className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
							>
								<ArrowLeft className="h-4 w-4 mr-1" /> 워크스페이스로 돌아가기
							</Link>
							<h1 className="text-2xl font-bold">자기소개서 업로드</h1>
							<p className="text-gray-600 mt-2">
								자기소개서를 업로드하면 AI가 분석하여 맞춤형 면접 질문을
								생성합니다.
							</p>
						</div>

						{/* Upload Area */}
						<div
							className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors ${
								isDragging
									? 'border-[#8FD694] bg-[#8FD694] bg-opacity-5'
									: 'border-gray-300'
							}`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<div className="mx-auto w-16 h-16 bg-[#8FD694] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
								<Upload className="h-8 w-8 text-[#8FD694]" />
							</div>
							<h3 className="text-lg font-medium mb-2">
								파일을 드래그하여 업로드하세요
							</h3>
							<p className="text-gray-500 mb-4">또는</p>
							<Button
								variant="outline"
								className="border-[#8FD694] text-[#8FD694] hover:bg-[#8FD694] hover:text-white"
							>
								파일 찾기
							</Button>
							<p className="text-sm text-gray-500 mt-4">
								지원 파일 형식: PDF, DOCX, TXT (최대 5MB)
							</p>
						</div>

						{/* Direct Input */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
							<div className="flex items-center mb-4">
								<FileText className="h-5 w-5 text-[#8FD694] mr-2" />
								<h3 className="text-lg font-medium">직접 입력하기</h3>
							</div>

							<div className="mb-4">
								<Textarea
									placeholder="자기소개서 내용을 여기에 입력하세요..."
									className="min-h-[200px] resize-y"
									value={text}
									onChange={handleTextChange}
									spellCheck={spellCheck}
								/>

								<div className="flex justify-between items-center mt-2 text-sm text-gray-500">
									<div className="flex items-center">
										<span className="mr-2">맞춤법 검사</span>
										<Switch
											checked={spellCheck}
											onCheckedChange={setSpellCheck}
										/>
									</div>
									<div
										className={`${text.length > 2000 ? 'text-red-500' : ''}`}
									>
										{text.length} / 2000자
									</div>
								</div>
							</div>

							{text.length > 2000 && (
								<div className="flex items-center p-3 bg-red-50 text-red-700 rounded-md text-sm mb-4">
									<AlertCircle className="h-4 w-4 mr-2" />
									<span>최대 글자 수(2000자)를 초과했습니다.</span>
								</div>
							)}
						</div>

						{/* Navigation */}
						<div className="flex justify-between">
							<Button variant="outline" onClick={() => window.history.back()}>
								취소
							</Button>
							<Button
								className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
								disabled={text.length > 2000 || text.length === 0}
								onClick={() => (window.location.href = '/workspace/settings')}
							>
								다음 <ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</CommunityLayout>
		</>
	)
}

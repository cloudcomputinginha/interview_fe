// src/components/interview/steps/Step2.tsx
'use client'

import React, { useState, useRef } from 'react'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { InterviewFormState } from '@/lib/interview/types'
import { z } from 'zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
	getResumeList,
	getPresignedUploadUrl,
	saveResume,
	getResumeDetail,
} from '@/api/resume'
import {
	findMyCoverletter,
	createCoverletter,
	getCoverletterDetail,
} from '@/api/coverletter'
import { Progress } from '@/components/ui/progress'
import { CoverLetterForm } from '@/components/cover-letter-form'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'

interface Props {
	form: InterviewFormState
	setForm: React.Dispatch<React.SetStateAction<InterviewFormState>>
}

export default function Step2({ form, setForm }: Props) {
	const queryClient = useQueryClient()
	const memberId =
		typeof window !== 'undefined'
			? Number(localStorage.getItem('memberId'))
			: undefined
	// Dialog 상태
	const [resumeDialogOpen, setResumeDialogOpen] = useState(false)
	const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false)

	// 이력서 리스트
	const { data: resumeList = [], isLoading: resumeLoading } = useQuery({
		queryKey: ['resumeList', memberId],
		queryFn: () => getResumeList(memberId!),
		enabled: !!memberId,
		select: data =>
			data.result?.resumes?.map(r => ({
				id: r.resumeId?.toString(),
				name: r.fileName,
				url: undefined, // 상세조회에서 필요시 추가
			})) || [],
	})

	// 자기소개서 리스트
	const { data: coverLetterList = [], isLoading: coverLetterLoading } =
		useQuery({
			queryKey: ['coverLetterList', memberId],
			queryFn: () => findMyCoverletter(memberId!),
			enabled: !!memberId,
			select: data =>
				data.result?.coverletters?.map(cl => ({
					id: cl.coverletterId?.toString(),
					representativeTitle: `${cl.corporateName}-${cl.jobName}`,
					items: [], // 상세조회에서 필요시 추가
				})) || [],
		})

	// 이력서 미리보기
	const { data: resumeDetail, isLoading: resumeDetailLoading } = useQuery({
		queryKey: ['resumeDetail', form.resumeId, memberId],
		queryFn: () => getResumeDetail(Number(form.resumeId), memberId!),
		enabled: !!form.resumeId && !!memberId,
		select: res => res.result,
	})

	// 자기소개서 미리보기
	const { data: coverLetterDetail, isLoading: coverLetterDetailLoading } =
		useQuery({
			queryKey: ['coverLetterDetail', form.coverLetterId],
			queryFn: () => getCoverletterDetail(Number(form.coverLetterId)),
			enabled: !!form.coverLetterId,
			select: res => res.result,
		})
	// Zod 스키마 (대표제목, items: [{title, content}])
	const coverLetterSchema = z.object({
		representativeTitle: z.string().min(1, '대표 제목을 입력하세요.'),
		items: z
			.array(
				z.object({
					title: z.string().min(1, '제목을 입력하세요.'),
					content: z.string().min(1, '내용을 입력하세요.'),
				})
			)
			.min(1, '최소 1개 항목 필요'),
	})

	/* 편의 패치 함수 */
	const patch = (p: Partial<InterviewFormState>) =>
		setForm(f => ({ ...f, ...p }))

	return (
		<div className="space-y-6">
			{/* 📑 이력서 */}
			<div className="space-y-4">
				<Label>이력서 선택 *</Label>
				{resumeLoading ? (
					<div>불러오는 중...</div>
				) : resumeList.length === 0 ? (
					<div className="text-gray-500 text-sm mb-2">
						등록된 이력서가 없습니다.
					</div>
				) : (
					<Select
						value={form.resumeId ?? ''}
						onValueChange={v => {
							const selected = resumeList.find(r => r.id === v)
							patch({ resumeId: v, resumeTitle: selected ? selected.name : '' })
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="이력서를 선택하세요" />
						</SelectTrigger>
						<SelectContent>
							{resumeList.map(r => (
								<SelectItem key={r.id} value={r.id!}>
									{r.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
				<Button
					variant="outline"
					onClick={() => setResumeDialogOpen(true)}
					className="w-full flex items-center gap-2"
				>
					<Plus className="h-4 w-4" /> 새 이력서 업로드
				</Button>
				<ResumeUploadDialog
					open={resumeDialogOpen}
					onOpenChange={setResumeDialogOpen}
					memberId={memberId!}
					onSuccess={() => {
						setResumeDialogOpen(false)
						queryClient.invalidateQueries({
							queryKey: ['resumeList', memberId],
						})
					}}
				/>
				{/* 미리보기 */}
				<div className="mt-2">
					{form.resumeId ? (
						resumeDetailLoading ? (
							<div>미리보기 불러오는 중...</div>
						) : resumeDetail ? (
							<Card>
								<CardContent className="pt-6">
									<h2 className="text-lg font-bold mb-2">
										{resumeDetail.fileName}
									</h2>
									<div className="text-sm text-gray-500 mb-2">
										업로드일:{' '}
										{resumeDetail.createdAt
											? new Date(resumeDetail.createdAt).toLocaleString()
											: '-'}
									</div>
									<div className="text-sm text-gray-500 mb-2">
										파일 크기:{' '}
										{resumeDetail.fileSize
											? `${(resumeDetail.fileSize / 1024).toFixed(1)}KB`
											: '-'}
									</div>
									{resumeDetail.fileUrl && (
										<a
											href={resumeDetail.fileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 underline"
										>
											다운로드
										</a>
									)}
								</CardContent>
							</Card>
						) : (
							<div>미리보기 불러오기 실패</div>
						)
					) : (
						<div className="text-gray-400 text-sm">
							선택된 이력서가 없습니다.
						</div>
					)}
				</div>
			</div>

			{/* 📝 자기소개서 */}
			<div className="space-y-4">
				<Label>자기소개서 선택 *</Label>
				{coverLetterLoading ? (
					<div>불러오는 중...</div>
				) : coverLetterList.length === 0 ? (
					<div className="text-gray-500 text-sm mb-2">
						등록된 자기소개서가 없습니다.
					</div>
				) : (
					<div className="space-y-2 max-h-48 overflow-y-auto">
						{coverLetterList.map(cl => (
							<Card
								key={cl.id}
								className={`cursor-pointer transition ${form.coverLetterId === cl.id ? 'border-[#8FD694] bg-[#8FD694]/5' : 'hover:bg-gray-50'}`}
								onClick={() =>
									patch({
										coverLetterId: cl.id,
										coverLetterTitle: cl.representativeTitle,
									})
								}
							>
								<CardContent className="p-4">
									<h4 className="font-medium truncate">
										{cl.representativeTitle}
									</h4>
								</CardContent>
							</Card>
						))}
					</div>
				)}
				<Button
					variant="outline"
					className="w-full flex items-center gap-2"
					onClick={() => setCoverLetterDialogOpen(true)}
				>
					<Plus className="h-4 w-4" /> 새 자기소개서 작성
				</Button>
				<CoverLetterDialog
					open={coverLetterDialogOpen}
					onOpenChange={setCoverLetterDialogOpen}
					memberId={memberId!}
					onSuccess={() => {
						setCoverLetterDialogOpen(false)
						queryClient.invalidateQueries({
							queryKey: ['coverLetterList', memberId],
						})
					}}
				/>
				{/* 미리보기 */}
				<div className="mt-2">
					{form.coverLetterId ? (
						coverLetterDetailLoading ? (
							<div>미리보기 불러오는 중...</div>
						) : coverLetterDetail ? (
							<Card>
								<CardContent className="pt-6">
									<h2 className="text-lg font-bold mb-2">
										{coverLetterDetail.corporateName} -{' '}
										{coverLetterDetail.jobName}
									</h2>
									<div className="text-sm text-gray-500 mb-2">
										생성일:{' '}
										{coverLetterDetail.createdAt
											? new Date(coverLetterDetail.createdAt).toLocaleString()
											: '-'}
									</div>
									{coverLetterDetail.qnaList &&
									coverLetterDetail.qnaList.length > 0 ? (
										coverLetterDetail.qnaList.map((qna, idx) => (
											<div key={idx} className="mb-6">
												<h3 className="font-medium text-base mb-2">
													{qna.question}
												</h3>
												<p className="text-gray-700 whitespace-pre-line text-sm">
													{qna.answer}
												</p>
											</div>
										))
									) : (
										<div>질문/답변이 없습니다.</div>
									)}
								</CardContent>
							</Card>
						) : (
							<div>미리보기 불러오기 실패</div>
						)
					) : (
						<div className="text-gray-400 text-sm">
							선택된 자기소개서가 없습니다.
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

function ResumeUploadDialog({
	open,
	onOpenChange,
	memberId,
	onSuccess,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	memberId: number
	onSuccess: () => void
}) {
	const [file, setFile] = useState<File | null>(null)
	const [progress, setProgress] = useState(0)
	const [isUploading, setIsUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0])
			setError(null)
		}
	}

	const handleUpload = async () => {
		if (!file) return
		setIsUploading(true)
		setProgress(0)
		setError(null)
		try {
			const presigned = await getPresignedUploadUrl(file.name)
			const { presignedUrl, fileUrl } = presigned.result!
			await new Promise<void>((resolve, reject) => {
				const xhr = new XMLHttpRequest()
				xhr.open('PUT', presignedUrl!, true)
				xhr.upload.onprogress = event => {
					if (event.lengthComputable) {
						setProgress(Math.round((event.loaded / event.total) * 100))
					}
				}
				xhr.onload = () => {
					if (xhr.status === 200) resolve()
					else reject(new Error('S3 업로드 실패'))
				}
				xhr.onerror = () => reject(new Error('S3 업로드 실패'))
				xhr.setRequestHeader('Content-Type', file.type)
				xhr.send(file)
			})
			await saveResume({
				memberId,
				fileName: file.name,
				fileUrl: fileUrl!,
				fileSize: file.size,
			})
			setProgress(100)
			onSuccess()
			alert('이력서가 성공적으로 업로드되었습니다.')
		} catch (e: any) {
			setError(e.message || '업로드 실패')
			alert('업로드에 실패했습니다. 다시 시도해주세요.')
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>이력서 업로드</DialogTitle>
					<DialogDescription>PDF 파일을 업로드하세요.</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<Input
						type="file"
						accept="application/pdf"
						onChange={handleFileChange}
						disabled={isUploading}
					/>
					{progress > 0 && <Progress value={progress} />}
					{error && <div className="text-red-500 text-sm">{error}</div>}
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isUploading}
						>
							취소
						</Button>
						<Button
							onClick={handleUpload}
							disabled={!file || isUploading}
							className="bg-[#8FD694] text-white"
						>
							{isUploading ? '업로드 중...' : '업로드'}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function CoverLetterDialog({
	open,
	onOpenChange,
	memberId,
	onSuccess,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	memberId: number
	onSuccess: () => void
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>자기소개서 추가</DialogTitle>
					<DialogDescription>질문과 답변을 직접 입력하세요.</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<CoverLetterForm
						onSubmit={data => {
							createCoverletter({
								...data,
								memberId,
							})
								.then(() => {
									onSuccess()
									alert('자기소개서가 성공적으로 등록되었습니다.')
								})
								.catch(() => {
									alert('자기소개서 등록에 실패했습니다. 다시 시도해주세요.')
								})
						}}
						onCancel={() => onOpenChange(false)}
					/>
				</div>
			</DialogContent>
		</Dialog>
	)
}

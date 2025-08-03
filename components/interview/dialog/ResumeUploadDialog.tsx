'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getPresignedUploadUrl } from '@/apis/resume'
import { saveResume } from '@/apis/resume'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { useQueryClient } from '@tanstack/react-query'

const ResumeUploadDialogDetailView = ({
	memberId,
	onSuccess,
	onCancel,
}: {
	memberId: number
	onSuccess: () => void
	onCancel: () => void
}) => {
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
			// 1. presigned url 발급
			const presigned = await getPresignedUploadUrl(file.name)
			const { presignedUrl, fileUrl } = presigned.result!
			// 2. S3 업로드
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
			// 3. 메타데이터 저장
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
			console.error(e)
			setError(e.message || '업로드 실패')
			alert('업로드에 실패했습니다. 다시 시도해주세요.')
		} finally {
			setIsUploading(false)
		}
	}

	return (
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
				<Button variant="outline" onClick={onCancel} disabled={isUploading}>
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
	)
}

export const ResumeUploadDialog = ({
	resumeDialogOpen,
	setResumeDialogOpen,
	memberId,
}: {
	resumeDialogOpen: boolean
	setResumeDialogOpen: (open: boolean) => void
	memberId: number
}) => {
	const queryClient = useQueryClient()
	return (
		<Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>이력서 업로드</DialogTitle>
					<DialogDescription>PDF 파일을 업로드하세요.</DialogDescription>
				</DialogHeader>
				<ResumeUploadDialogDetailView
					memberId={memberId!}
					onSuccess={() => {
						setResumeDialogOpen(false)
						queryClient.invalidateQueries({
							queryKey: ['resumeList', memberId],
						})
					}}
					onCancel={() => setResumeDialogOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	)
}

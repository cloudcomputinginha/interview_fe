import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { getResumeDetail } from '@/apis/resume'

const ResumeDetailView = ({
	resumeId,
	memberId,
}: {
	resumeId: number
	memberId: number
}) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['resumeDetail', resumeId],
		queryFn: () => getResumeDetail(resumeId),
		enabled: !!resumeId && !!memberId,
		select: res => res.result,
	})

	if (isLoading) return <div>불러오는 중...</div>
	if (isError || !data) return <div>불러오기 실패</div>

	return (
		<Card>
			<CardContent className="pt-6">
				<h2 className="text-xl font-bold mb-2">{data.fileName}</h2>
				<div className="text-sm text-gray-500 mb-2">
					업로드일:{' '}
					{data.createdAt ? new Date(data.createdAt).toLocaleString() : '-'}
				</div>
				<div className="text-sm text-gray-500 mb-2">
					파일 크기:{' '}
					{data.fileSize ? `${(data.fileSize / 1024).toFixed(1)}KB` : '-'}
				</div>
				{data.fileUrl && (
					<a
						href={data.fileUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 underline"
					>
						다운로드
					</a>
				)}
			</CardContent>
		</Card>
	)
}

export const ResumeDetailViewDialog = ({
	detailResumeDialogOpen,
	setDetailResumeDialogOpen,
	selectedResumeId,
	memberId,
}: {
	detailResumeDialogOpen: boolean
	setDetailResumeDialogOpen: (open: boolean) => void
	selectedResumeId: number
	memberId: number
}) => {
	return (
		<Dialog
			open={detailResumeDialogOpen}
			onOpenChange={setDetailResumeDialogOpen}
		>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="mb-2">이력서 상세보기</DialogTitle>
					<DialogDescription>
						추후 미리보기를 지원할 예정입니다.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					{selectedResumeId ? (
						<ResumeDetailView
							resumeId={selectedResumeId}
							memberId={memberId!}
						/>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	)
}

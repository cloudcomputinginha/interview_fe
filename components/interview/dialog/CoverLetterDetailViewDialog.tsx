'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { getCoverletterDetail } from '@/apis/coverletter'

const CoverLetterDetailView = ({
	coverletterId,
}: {
	coverletterId: number
}) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['coverletterDetail', coverletterId],
		queryFn: () => getCoverletterDetail(coverletterId),
		enabled: !!coverletterId,
		select: res => res.result,
	})

	if (isLoading) return <div>불러오는 중...</div>
	if (isError || !data) return <div>불러오기 실패</div>

	return (
		<Card>
			<CardContent className="pt-6">
				<h2 className="text-xl font-bold mb-2">
					{data.corporateName} - {data.jobName}
				</h2>
				<div className="text-sm text-gray-500 mb-4">
					생성일:{' '}
					{data.createdAt ? new Date(data.createdAt).toLocaleString() : '-'}
				</div>
				{data.qnaList && data.qnaList.length > 0 ? (
					data.qnaList.map((qna, idx) => (
						<div key={idx} className="mb-6">
							<h3 className="font-medium text-lg mb-2">{qna.question}</h3>
							<p className="text-gray-700 whitespace-pre-line">{qna.answer}</p>
						</div>
					))
				) : (
					<div>질문/답변이 없습니다.</div>
				)}
			</CardContent>
		</Card>
	)
}

export const CoverLetterDetailViewDialog = ({
	detailDialogOpen,
	setDetailDialogOpen,
	selectedCoverLetterId,
}: {
	detailDialogOpen: boolean
	setDetailDialogOpen: (open: boolean) => void
	selectedCoverLetterId: number
}) => {
	return (
		<Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>자기소개서 상세보기</DialogTitle>
				</DialogHeader>
				<div className="py-4">
					{selectedCoverLetterId ? (
						<CoverLetterDetailView coverletterId={selectedCoverLetterId} />
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	)
}

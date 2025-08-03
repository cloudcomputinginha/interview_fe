'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Plus,
	MoreVertical,
	Trash2,
	Edit,
	Download,
	FileText,
	Search,
	Filter,
} from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { DeleteConfirmDialog } from '@/components/interview/dialog/common/delete-confirm-dialog'
import { useDeleteConfirmWithInterviewCheck } from '@/hooks/useDeleteConfirmWithInterviewCheck'
import { CoverLetterForm } from '@/components/cover-letter-form'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { CommunityLayout } from '@/components/community-layout'
import { HeaderWithNotifications } from '@/components/header-with-notifications'
import { useMemberSession } from '@/components/member-session-context'
import {
	useQueries,
	useQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import {
	findMyCoverletter,
	createCoverletter,
	getCoverletterDetail,
	deleteCoverletter,
} from '@/apis/coverletter'
import { getResumeList, getResumeDetail, deleteResume } from '@/apis/resume'
import { convertDate } from '@/utils/date/convertDate'
import { toast } from 'sonner'
import Loading from '@/components/loading'
import { ResumeUploadDialog } from '@/components/interview/dialog/ResumeUploadDialog'
import { CoverLetterDetailViewDialog } from '@/components/interview/dialog/CoverLetterDetailViewDialog'
import { ResumeDetailViewDialog } from '@/components/interview/dialog/ResumeDetailViewDialog'

export default function WorkspacePage() {
	const [dialogOpen, setDialogOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [typeFilter, setTypeFilter] = useState('all')
	const [detailDialogOpen, setDetailDialogOpen] = useState(false)
	const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<
		number | null
	>(null)
	const [detailResumeDialogOpen, setDetailResumeDialogOpen] = useState(false)
	const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
	const [resumeDialogOpen, setResumeDialogOpen] = useState(false)
	const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
	const { memberId } = useMemberSession()
	const queryClient = useQueryClient()

	// TODO : 이력서 API 완성되면 가져오기
	const { data: coverLetterList, isLoading: coverLetterListLoading } = useQuery(
		{
			queryKey: ['coverLetterList', memberId],
			queryFn: () => findMyCoverletter(),
			enabled: !!memberId,
			select: data => {
				const coverLetters = data.result?.coverletters
				return coverLetters?.map(coverLetter => ({
					id: coverLetter.coverletterId,
					name: `${coverLetter.corporateName}-${coverLetter.jobName}`,
					corporateName: coverLetter.corporateName,
					jobName: coverLetter.jobName,
					date: coverLetter.createdAt!,
					size: '0KB',
					type: 'manual',
				}))
			},
		}
	)

	// 이력서 리스트 가져오기 (동기 select)
	const { data: resumeList, isLoading: resumeListLoading } = useQuery({
		queryKey: ['resumeList', memberId],
		queryFn: () => getResumeList(),
		enabled: !!memberId,
		select: data => data.result?.resumes ?? [],
	})

	// 이력서 상세정보 병렬 fetch
	const resumeIds =
		resumeList
			?.map(r => r.resumeId)
			.filter((id): id is number => typeof id === 'number') ?? []
	const resumeDetailsQueries = useQueries({
		queries: resumeIds.map(resumeId => ({
			queryKey: ['resumeDetail', resumeId, memberId],
			queryFn: () => getResumeDetail(resumeId),
			enabled: !!resumeId && !!memberId,
			select: (res: any) => res.result,
		})),
	})

	// 상세정보 매핑
	const resumeDetailsMap = Object.fromEntries(
		resumeIds.map((id, idx) => [id, resumeDetailsQueries[idx]?.data])
	)

	// 문서 통합
	const allDocuments = [
		...(resumeList
			?.filter(resume => typeof resume.resumeId === 'number')
			.map(resume => {
				const detail = resumeDetailsMap[resume.resumeId as number] as
					| { updatedAt?: string }
					| undefined
				return {
					id: resume.resumeId,
					name: resume.fileName,
					date: detail?.updatedAt ? detail.updatedAt : '-',
					size: resume.fileSize
						? `${(resume.fileSize / 1024).toFixed(1)}KB`
						: '-',
					type: 'resume',
				}
			}) ?? []),
		...(coverLetterList ?? []),
	]

	// 기존 filteredDocuments를 allDocuments로 변경
	const filteredDocuments = allDocuments?.filter(doc => {
		const matchesSearch = doc.name
			?.toLowerCase()
			.includes(searchQuery.toLowerCase())
		const matchesType =
			typeFilter === 'all' ||
			(typeFilter === 'resume' && doc.type === 'resume') ||
			(typeFilter === 'coverLetter' && doc.type === 'manual')
		return matchesSearch && matchesType
	})

	const createCoverletterMutation = useMutation({
		mutationFn: createCoverletter,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['coverLetterList', memberId] })
			setDialogOpen(false)
			toast.success('자기소개서가 성공적으로 등록되었습니다.')
		},
	})

	// 이력서 삭제 확인 훅
	const resumeDeleteDialog = useDeleteConfirmWithInterviewCheck({
		mutationFn: deleteResume,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['resumeList', memberId] })
		},
		successMessage: '이력서가 삭제되었습니다.',
		errorMessage: '이력서 삭제에 실패했습니다.',
		itemType: 'resume',
	})

	// 자기소개서 삭제 확인 훅
	const coverletterDeleteDialog = useDeleteConfirmWithInterviewCheck({
		mutationFn: deleteCoverletter,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['coverLetterList', memberId] })
		},
		successMessage: '자기소개서가 삭제되었습니다.',
		errorMessage: '자기소개서 삭제에 실패했습니다.',
		itemType: 'coverletter',
	})

	const handleDeleteClick = (doc: {
		id: number
		type: 'resume' | 'manual'
		name: string
	}) => {
		if (doc.type === 'resume') {
			resumeDeleteDialog.openDialog({ id: doc.id, name: doc.name })
		} else {
			coverletterDeleteDialog.openDialog({ id: doc.id, name: doc.name })
		}
		setOpenDropdownId(null)
	}

	if (!memberId) return null

	return (
		<>
			<HeaderWithNotifications />
			<CommunityLayout activeItem="documents">
				<div className="p-6 max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div>
							<h1 className="text-2xl font-bold">이력서 / 자소서 관리</h1>
							<p className="text-gray-600 mt-1">
								이력서와 자기소개서를 관리하고 면접에 활용하세요.
							</p>
						</div>
						<div className="flex space-x-2">
							<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
								<DialogTrigger asChild>
									<Button variant="outline" className="text-sm">
										<Plus className="mr-2 h-4 w-4" /> 자소서 추가
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
									<DialogHeader>
										<DialogTitle>자기소개서 추가</DialogTitle>
										<DialogDescription>
											질문과 답변을 직접 입력하세요.
										</DialogDescription>
									</DialogHeader>
									<div className="py-4">
										<CoverLetterForm
											onSubmit={data => {
												createCoverletterMutation.mutate(data)
											}}
											onCancel={() => setDialogOpen(false)}
											isPending={createCoverletterMutation.isPending}
										/>
									</div>
								</DialogContent>
							</Dialog>
							<Button
								variant="outline"
								className="text-sm"
								onClick={() => setResumeDialogOpen(true)}
							>
								<Plus className="mr-2 h-4 w-4" /> 이력서 업로드
							</Button>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									placeholder="문서 검색"
									className="pl-10"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<div className="flex items-center">
									<Filter className="mr-2 h-4 w-4 text-gray-500" />
									<span className="text-sm text-gray-500 mr-2">필터:</span>
								</div>
								<Select value={typeFilter} onValueChange={setTypeFilter}>
									<SelectTrigger className="w-[150px] h-9">
										<SelectValue placeholder="문서 유형" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">모든 문서</SelectItem>
										<SelectItem value="resume">이력서</SelectItem>
										<SelectItem value="coverLetter">자기소개서</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Documents Grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
						{coverLetterListLoading || resumeListLoading ? (
							<div className="col-span-full py-12 text-center text-gray-500">
								<Loading />
							</div>
						) : filteredDocuments && filteredDocuments?.length > 0 ? (
							filteredDocuments?.map(doc => (
								<Card
									key={`${doc.type}-${doc.id}`}
									className="hover:shadow-md transition-shadow cursor-pointer"
								>
									<CardContent className="p-5 w-fit">
										<div className="flex justify-between items-start mb-3 gap-2">
											<Badge
												className={
													'type' in doc && doc.type === 'resume'
														? 'bg-blue-100 text-blue-800 hover:bg-blue-100 whitespace-nowrap'
														: 'bg-purple-100 text-purple-800 hover:bg-purple-100 whitespace-nowrap'
												}
											>
												{'type' in doc && doc.type === 'resume'
													? '이력서'
													: '자기소개서'}
											</Badge>
											{/* 기업 배지 */}
											{doc.type === 'manual' && (
												<Badge className="bg-blue-100 text-blue-800 whitespace-nowrap hover:bg-blue-100">
													{(doc as any).corporateName}
												</Badge>
											)}
											{/* 직무 배지 */}
											{doc.type === 'manual' && (
												<Badge className="bg-purple-100 text-purple-800 whitespace-nowrap hover:bg-purple-100">
													{(doc as any).jobName}
												</Badge>
											)}
										</div>
										<div className="flex items-center mb-3">
											<FileText className="h-5 w-5 text-gray-400 mr-2" />
											<h3 className="font-medium text-lg line-clamp-1">
												{doc.name}
											</h3>
										</div>
										<div className="text-sm text-gray-500">
											<p>마지막 수정: {convertDate(doc.date!)}</p>
										</div>
									</CardContent>
									<CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-end">
										<DropdownMenu
											open={openDropdownId === doc.id}
											onOpenChange={open => {
												setOpenDropdownId(open && doc.id ? doc.id : null)
											}}
										>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0"
													onClick={() => {
														setOpenDropdownId(
															openDropdownId === doc.id ? null : doc.id || null
														)
													}}
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												{'type' in doc && doc.type === 'file' ? (
													<DropdownMenuItem className="flex items-center">
														<Download className="mr-2 h-4 w-4" />
														<span>다운로드</span>
													</DropdownMenuItem>
												) : (
													<DropdownMenuItem
														className="flex items-center"
														onClick={() => {
															if (doc.type === 'resume') {
																setSelectedResumeId(doc.id!)
																setDetailResumeDialogOpen(true)
															} else {
																setSelectedCoverLetterId(doc.id!)
																setDetailDialogOpen(true)
															}
															setOpenDropdownId(null)
														}}
													>
														<FileText className="mr-2 h-4 w-4" />
														<span>상세 보기</span>
													</DropdownMenuItem>
												)}
												<DropdownMenuItem
													className="flex items-center"
													onClick={() => {
														toast.info('아직 지원하지 않는 기능입니다.')
														setOpenDropdownId(null)
													}}
												>
													<Edit className="mr-2 h-4 w-4" />
													<span>수정</span>
												</DropdownMenuItem>
												<DropdownMenuItem
													className="flex items-center text-red-600"
													onClick={() => {
														if (doc.id && doc.name) {
															handleDeleteClick({
																id: doc.id,
																type: doc.type as 'resume' | 'manual',
																name: doc.name,
															})
														}
													}}
												>
													<Trash2 className="mr-2 h-4 w-4" />
													<span>삭제</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</CardFooter>
								</Card>
							))
						) : (
							<div className="col-span-full py-12 text-center text-gray-500">
								<FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
								<p className="text-lg font-medium mb-1">문서가 없습니다</p>
								<p className="mb-4">새 이력서나 자기소개서를 추가해보세요.</p>
								<div className="flex justify-center space-x-2">
									<Button
										variant="outline"
										onClick={() => setResumeDialogOpen(true)}
									>
										<Plus className="mr-2 h-4 w-4" /> 이력서 업로드
									</Button>
									<Button variant="outline" onClick={() => setDialogOpen(true)}>
										<Plus className="mr-2 h-4 w-4" /> 자소서 추가
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</CommunityLayout>
			<CoverLetterDetailViewDialog
				detailDialogOpen={detailDialogOpen}
				setDetailDialogOpen={setDetailDialogOpen}
				selectedCoverLetterId={selectedCoverLetterId!}
			/>
			<ResumeDetailViewDialog
				detailResumeDialogOpen={detailResumeDialogOpen}
				setDetailResumeDialogOpen={setDetailResumeDialogOpen}
				selectedResumeId={selectedResumeId!}
				memberId={memberId!}
			/>
			<ResumeUploadDialog
				resumeDialogOpen={resumeDialogOpen}
				setResumeDialogOpen={setResumeDialogOpen}
				memberId={memberId!}
			/>
			<DeleteConfirmDialog
				isOpen={resumeDeleteDialog.isOpen}
				onOpenChange={resumeDeleteDialog.closeDialog}
				title={resumeDeleteDialog.title}
				description={resumeDeleteDialog.description}
				onConfirm={resumeDeleteDialog.handleConfirm}
				isPending={resumeDeleteDialog.isPending}
			/>
			<DeleteConfirmDialog
				isOpen={coverletterDeleteDialog.isOpen}
				onOpenChange={coverletterDeleteDialog.closeDialog}
				title={coverletterDeleteDialog.title}
				description={coverletterDeleteDialog.description}
				onConfirm={coverletterDeleteDialog.handleConfirm}
				isPending={coverletterDeleteDialog.isPending}
			/>
		</>
	)
}

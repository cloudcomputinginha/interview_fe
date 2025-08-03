import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users, Calendar, Building, Briefcase } from 'lucide-react'
import { convertDate } from '@/utils/date/convertDate'
import type { InterviewGroupCardDTO } from '@/apis/types/interview-types'

interface ConnectedInterviewsListProps {
	interviews: InterviewGroupCardDTO[]
	itemName: string
	itemType: 'resume' | 'coverletter'
}

export function ConnectedInterviewsList({
	interviews,
	itemName,
	itemType,
}: ConnectedInterviewsListProps) {
	if (!interviews || interviews.length === 0) {
		return null
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
				<Users className="h-4 w-4" />
				<span>
					"{itemName}"에 연결된 면접이 {interviews.length}개 있습니다
				</span>
			</div>

			<Card className="border-amber-200 bg-amber-50">
				<CardHeader className="pb-3">
					<CardTitle className="text-sm text-amber-800">
						연결된 면접 목록
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-0">
					<ScrollArea className="h-32">
						<div className="space-y-2">
							{interviews.map(interview => (
								<div
									key={interview.interviewId}
									className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-200"
								>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<h4 className="font-medium text-sm text-gray-900 truncate">
												{interview.name}
											</h4>
											<Badge
												variant="secondary"
												className="text-xs bg-blue-100 text-blue-800"
											>
												{interview.interviewType === 'PERSONALITY'
													? '인성'
													: '기술'}
											</Badge>
										</div>

										<div className="space-y-1 text-xs text-gray-600">
											<div className="flex items-center gap-1">
												<Building className="h-3 w-3" />
												<span className="truncate">{interview.jobName}</span>
											</div>

											<div className="flex items-center gap-1">
												<Users className="h-3 w-3" />
												<span>
													참가자: {interview.currentParticipants}/
													{interview.maxParticipants}
												</span>
											</div>

											{interview.startedAt && (
												<div className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													<span>시작: {convertDate(interview.startedAt)}</span>
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>

			<div className="text-xs text-amber-700 bg-amber-100 p-3 rounded-lg">
				<strong>주의:</strong> 삭제하면 연결된 면접에서도 해당{' '}
				{itemType === 'resume' ? '이력서' : '자기소개서'}를 사용할 수 없게
				됩니다.
			</div>
		</div>
	)
}

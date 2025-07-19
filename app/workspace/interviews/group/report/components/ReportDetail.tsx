import type { ParticipantReport } from '../types/report'
import { CategoryFeedbackList } from './CategoryFeedbackList'
import { PointsList } from './PointsList'

interface ReportDetailProps {
	report: ParticipantReport
}

export function ReportDetail({ report }: ReportDetailProps) {
	if (!report) return <div>리포트가 없습니다.</div>
	return (
		<div className="p-4 border rounded bg-white">
			<h2 className="text-xl font-bold mb-2">{report.name}</h2>
			<div className="mb-4">
				<span className="font-semibold">전체 점수: </span>
				<span>{report.overallScore}</span>
			</div>
			<CategoryFeedbackList categories={report.categories} />
			<PointsList title="잘한 점" points={report.goodPoints} />
			<PointsList title="개선할 점" points={report.improvementPoints} />
		</div>
	)
}

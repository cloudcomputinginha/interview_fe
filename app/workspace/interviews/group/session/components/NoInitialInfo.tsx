import React from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

type Props = {
	interviewId: number
	myMemberInterviewId: number
}

const NoInitialInfo = (props: Props) => {
	const { interviewId, myMemberInterviewId } = props

	const handleRefresh = () => {
		window.location.reload()
	}

	const handleGoHome = () => {
		window.location.href = '/workspace/interviews'
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
			<div className="max-w-md w-full">
				<Card className="border-orange-200 bg-orange-50">
					<CardHeader className="text-center pb-4">
						<div className="flex justify-center mb-4">
							<div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
								<AlertCircle className="w-8 h-8 text-white" />
							</div>
						</div>
						<CardTitle className="text-xl text-orange-800">
							초기 정보를 찾을 수 없습니다
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Alert className="border-orange-300 bg-orange-100">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription className="text-orange-800">
								인터뷰 세션을 시작하기 위한 기본 정보를 가져올 수 없습니다.
							</AlertDescription>
						</Alert>

						<div className="bg-white rounded-lg p-4 border border-orange-200">
							<h3 className="font-medium text-gray-900 mb-3">문제 정보</h3>
							<div className="space-y-2 text-sm text-gray-600">
								<div>
									<span className="font-medium">인터뷰 ID:</span> {interviewId}
								</div>
								<div>
									<span className="font-medium">참가자 ID:</span>{' '}
									{myMemberInterviewId}
								</div>
							</div>
						</div>

						<div className="space-y-3">
							<Button
								onClick={handleRefresh}
								className="w-full bg-orange-600 hover:bg-orange-700 text-white"
							>
								<RefreshCw className="w-4 h-4 mr-2" />
								페이지 새로고침
							</Button>

							<Button
								onClick={handleGoHome}
								variant="outline"
								className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
							>
								<Home className="w-4 h-4 mr-2" />
								인터뷰 목록으로 돌아가기
							</Button>
						</div>

						<div className="text-xs text-orange-600 text-center pt-2">
							문제가 지속되면 관리자에게 문의해주세요.
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default NoInitialInfo

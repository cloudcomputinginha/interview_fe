import React from 'react'
import { PollingStatus } from '@/interview/types'
import { WsStatus } from '@/interview/hooks/useTeamSocket'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// 확장 가능한 준비 상태 타입 정의
export type PreparationStep = {
	id: string
	title: string
	description: string
	status: 'pending' | 'loading' | 'complete' | 'failed'
	errorMessage?: string
}

type Props = {
	status: PollingStatus
	socketStatus: WsStatus
	onReady?: () => void
}

const InterviewReady = (props: Props) => {
	const { status, socketStatus, onReady } = props

	// PollingStatus를 준비 단계로 매핑
	const getPollingSteps = (): PreparationStep[] => [
		{
			id: 'initial',
			title: '인터뷰 초기화',
			description: '인터뷰 기본 정보를 확인합니다',
			status:
				status === 'initial'
					? 'pending'
					: status === 'failed'
						? 'failed'
						: 'complete',
		},
		{
			id: 'fetching_base',
			title: '기본 데이터 로드',
			description: '인터뷰 기본 데이터를 가져옵니다',
			status: ['initial'].includes(status)
				? 'pending'
				: ['fetching_base'].includes(status)
					? 'loading'
					: status === 'failed'
						? 'failed'
						: 'complete',
		},
		{
			id: 'generating_sessions',
			title: '세션 생성',
			description: '인터뷰 세션을 생성합니다',
			status: ['initial', 'fetching_base'].includes(status)
				? 'pending'
				: ['generating_sessions'].includes(status)
					? 'loading'
					: status === 'failed'
						? 'failed'
						: 'complete',
		},
		{
			id: 'polling_missing',
			title: '누락된 데이터 확인',
			description: '누락된 데이터를 확인하고 폴링합니다',
			status: ['initial', 'fetching_base', 'generating_sessions'].includes(
				status
			)
				? 'pending'
				: ['polling_missing'].includes(status)
					? 'loading'
					: status === 'failed'
						? 'failed'
						: 'complete',
		},
		{
			id: 'polling_all',
			title: '전체 데이터 동기화',
			description: '모든 데이터가 준비될 때까지 대기합니다',
			status: [
				'initial',
				'fetching_base',
				'generating_sessions',
				'polling_missing',
			].includes(status)
				? 'pending'
				: ['polling_all'].includes(status)
					? 'loading'
					: status === 'failed'
						? 'failed'
						: 'complete',
		},
	]

	// WsStatus를 준비 단계로 매핑
	const getSocketSteps = (): PreparationStep[] => [
		{
			id: 'socket_connecting',
			title: '팀 소켓 연결',
			description: '팀원들과의 실시간 통신을 위한 소켓을 연결합니다',
			status:
				socketStatus === 'idle'
					? 'pending'
					: socketStatus === 'connecting'
						? 'loading'
						: socketStatus === 'open'
							? 'complete'
							: 'failed',
			errorMessage:
				socketStatus === 'error' ? '소켓 연결에 실패했습니다' : undefined,
		},
	]

	const allSteps = [...getPollingSteps(), ...getSocketSteps()]

	const isAllComplete = allSteps.every(step => step.status === 'complete')
	const hasError = allSteps.some(step => step.status === 'failed')

	const renderStepIcon = (step: PreparationStep) => {
		switch (step.status) {
			case 'pending':
				return (
					<div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-50" />
				)
			case 'loading':
				return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
			case 'complete':
				return <Check className="w-6 h-6 text-green-500" />
			case 'failed':
				return (
					<div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold">
						!
					</div>
				)
			default:
				return null
		}
	}

	const getStepTextColor = (step: PreparationStep) => {
		switch (step.status) {
			case 'pending':
				return 'text-gray-500'
			case 'loading':
				return 'text-blue-600'
			case 'complete':
				return 'text-green-600'
			case 'failed':
				return 'text-red-600'
			default:
				return 'text-gray-500'
		}
	}

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold text-gray-900">인터뷰 준비</h1>
				<p className="text-gray-600">
					인터뷰를 시작하기 전 필요한 준비를 진행합니다
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
						준비 진행 상황
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{allSteps.map((step, index) => (
						<div key={step.id} className="flex items-start gap-4">
							<div className="flex-shrink-0 mt-1">{renderStepIcon(step)}</div>
							<div className="flex-1 min-w-0">
								<div className={`font-medium ${getStepTextColor(step)}`}>
									{step.title}
								</div>
								<div className="text-sm text-gray-500 mt-1">
									{step.description}
								</div>
								{step.errorMessage && (
									<div className="text-sm text-red-500 mt-1">
										{step.errorMessage}
									</div>
								)}
							</div>
							{index < allSteps.length - 1 && (
								<div className="absolute left-7 top-8 w-0.5 h-8 bg-gray-200 ml-3" />
							)}
						</div>
					))}
				</CardContent>
			</Card>

			{/* 준비 완료 또는 에러 상태 표시 */}
			{isAllComplete && !hasError && (
				<Card className="border-green-200 bg-green-50">
					<CardContent className="pt-6">
						<div className="text-center space-y-4">
							<div className="flex justify-center">
								<div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
									<Check className="w-8 h-8 text-white" />
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-green-800">
									준비 완료!
								</h3>
								<p className="text-green-600 mt-1">
									모든 준비가 완료되었습니다. 인터뷰를 시작할 수 있습니다.
								</p>
							</div>
							<Button
								onClick={onReady}
								className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
							>
								인터뷰 시작하기
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{hasError && (
				<Card className="border-red-200 bg-red-50">
					<CardContent className="pt-6">
						<div className="text-center space-y-4">
							<div className="flex justify-center">
								<div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
									<div className="text-white text-2xl font-bold">!</div>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-red-800">
									준비 중 오류 발생
								</h3>
								<p className="text-red-600 mt-1">
									일부 준비 과정에서 오류가 발생했습니다. 페이지를
									새로고침하거나 다시 시도해주세요.
								</p>
							</div>
							<Button
								onClick={() => window.location.reload()}
								variant="outline"
								className="border-red-300 text-red-700 hover:bg-red-100 px-8 py-3 text-lg"
							>
								페이지 새로고침
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* 진행 중인 상태 표시 */}
			{!isAllComplete && !hasError && (
				<div className="text-center text-gray-500">
					<p>준비가 진행 중입니다. 잠시만 기다려주세요...</p>
				</div>
			)}
		</div>
	)
}

export default InterviewReady

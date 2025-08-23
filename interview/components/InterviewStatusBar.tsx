// app/group/interview-session/components/InterviewStatusBar.tsx
'use client'

import type { PollingStatus } from '@/interview/types'

export default function InterviewStatusBar({
	pollingStatus,
	socketStatus,
	isMyTurn,
}: {
	pollingStatus: PollingStatus
	socketStatus: 'idle' | 'connecting' | 'open' | 'closed' | 'error' | undefined
	isMyTurn: boolean
}) {
	const pill = (
		label: string,
		tone: 'ok' | 'warn' | 'info' | 'err' | 'muted' = 'info'
	) => {
		const c = {
			ok: 'bg-green-100 text-green-700',
			warn: 'bg-yellow-100 text-yellow-700',
			info: 'bg-blue-100 text-blue-700',
			err: 'bg-red-100 text-red-700',
			muted: 'bg-gray-100 text-gray-600',
		}[tone]
		return (
			<span className={`px-2 py-0.5 rounded-full text-xs ${c}`}>{label}</span>
		)
	}

	return (
		<div className="flex flex-wrap items-center gap-2 text-sm">
			{isMyTurn ? pill('내 차례', 'ok') : pill('대기 중', 'muted')}
			{pollingStatus === 'complete'
				? pill('세션 준비 완료', 'ok')
				: pollingStatus === 'failed'
					? pill('세션 준비 실패', 'err')
					: pill(`세션 준비: ${pollingStatus}`, 'info')}
			{socketStatus === 'open'
				? pill('소켓 연결됨', 'ok')
				: socketStatus === 'connecting'
					? pill('소켓 연결 중', 'info')
					: socketStatus === 'error'
						? pill('소켓 오류', 'err')
						: socketStatus === 'closed'
							? pill('소켓 종료', 'warn')
							: pill('소켓 대기', 'muted')}
		</div>
	)
}

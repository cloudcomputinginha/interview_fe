import { useEffect, useState } from 'react'
import { socketClient } from './socket-client'
import { useRouter } from 'next/navigation'

export interface Participant {
	memberId: number
	name: string
	host?: boolean
	submitted?: boolean
}

type INTERVIEWSTATUS = 'ENTER' | 'DONE' | 'LEAVE'

export function useWaitingRoomSocket(interviewId: number, memberId: number) {
	const [participants, setParticipants] = useState<number[]>([])
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	useEffect(() => {
		if (!interviewId || !memberId) {
			console.log('[소켓] interviewId 또는 memberId 없음', {
				interviewId,
				memberId,
			})
			return
		}

		console.log('[소켓] connect 시도', { interviewId, memberId })
		socketClient.connect(
			() => {
				console.log('[소켓] 연결 성공')
				// 참가 상태 구독
				socketClient.subscribe(
					`/topic/waiting-room/${interviewId}`,
					message => {
						console.log('[소켓] 참가 상태 구독', message.body)
						const data = JSON.parse(message.body)
						if (data?.type === 'DONE') {
							// 면접 시작
							router.replace('/workspace/interview/group/session')
						}
					}
				)

				socketClient.subscribe(
					`/topic/waiting-room/${interviewId}/participants`,
					message => {
						console.log('[소켓] 참가자 목록 메시지 수신2', message.body)
						const data = JSON.parse(message.body)
						setParticipants(data.memberIds)
					}
				)
				// 에러 구독
				socketClient.subscribe('/user/queue/errors', message => {
					console.error('[소켓] 에러 메시지 수신', message.body)
					setError(message.body)
				})
				// 입장 송신
				console.log('[소켓] 입장 송신', { interviewId, memberId })
				socketClient.send('/app/waiting-room/enter', { interviewId, memberId })
			},
			err => {
				console.error('[소켓] 연결 오류', err)
				setError('소켓 연결 오류')
			}
		)

		// 언마운트 시 퇴장 및 해제
		return () => {
			console.log('[소켓] 언마운트: 퇴장 송신 및 연결 해제', {
				interviewId,
				memberId,
			})
			socketClient.send('/app/waiting-room/leave', { interviewId, memberId })
			socketClient.unsubscribeAll()
			socketClient.disconnect()
		}
	}, [interviewId, memberId])

	return { participants, error }
}

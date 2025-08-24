import { PollingStatus } from '../types'

export const statusMessages: Record<PollingStatus, string> = {
	initial: '인터뷰 준비 중...',
	fetching_base: '기본 정보 불러오는 중...',
	generating_sessions: 'AI 세션 생성 중...',
	polling_missing: '누락된 세션 확인 중...',
	polling_all: '참가자 세션 불러오는 중...',
	complete: '준비 완료!',
	failed: '준비 실패! 페이지를 새로고침 해주세요.',
}

// 년, 달, 주, 일, 시간, 분, 초 단위로 남은 시간을 표시하는 함수
export function formatCountdownString(totalSeconds: number) {
	const YEAR = 60 * 60 * 24 * 365
	const MONTH = 60 * 60 * 24 * 30
	const WEEK = 60 * 60 * 24 * 7
	const DAY = 60 * 60 * 24
	const HOUR = 60 * 60
	const MINUTE = 60

	if (totalSeconds >= YEAR) {
		const years = Math.floor(totalSeconds / YEAR)
		return `${years}년 후 시작 예정`
	}
	if (totalSeconds >= MONTH) {
		const months = Math.floor(totalSeconds / MONTH)
		return `${months}달 후 시작 예정`
	}
	if (totalSeconds >= WEEK) {
		const weeks = Math.floor(totalSeconds / WEEK)
		return `${weeks}주 후 시작 예정`
	}
	if (totalSeconds >= DAY) {
		const days = Math.floor(totalSeconds / DAY)
		return `${days}일 후 시작 예정`
	}
	if (totalSeconds >= HOUR) {
		const hours = Math.floor(totalSeconds / HOUR)
		return `${hours}시간 후 시작 예정`
	}
	if (totalSeconds >= MINUTE) {
		const minutes = Math.floor(totalSeconds / MINUTE)
		const seconds = totalSeconds % MINUTE
		return `${minutes}분 ${seconds}초 후 시작 예정`
	}
	return `${totalSeconds}초 후 시작 예정`
}

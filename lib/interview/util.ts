export const getStepTitle = (step: number, interviewType: string) => {
	switch (step) {
		case 1:
			return '면접 유형 및 기본 정보'
		case 2:
			return '자료 선택하기'
		case 3:
			return '면접 옵션 설정'
		case 4:
			if (interviewType === 'individual') return '시작 옵션 선택'
			return '면접 예약'
		case 5:
			if (interviewType === 'individual') return '미리보기 및 완료'
			return '참가자 초대'
		case 6:
			return '미리보기 및 완료'
		default:
			return ''
	}
}

export const getTotalSteps = (interviewType: string) => {
	if (interviewType === 'individual') return 5
	return 6
}

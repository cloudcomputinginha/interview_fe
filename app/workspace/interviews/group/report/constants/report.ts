import type { Participant, ParticipantReports } from '../types/report'

export const PARTICIPANTS: Participant[] = [
	{ id: '1', name: '김지원', score: 'A' },
	{ id: '2', name: '이민수', score: 'B+' },
	{ id: '3', name: '박서연', score: 'A-' },
]

export const PARTICIPANT_REPORTS: ParticipantReports = {
	'1': {
		name: '김지원',
		overallScore: 'A',
		categories: [
			{
				name: '내용 전달력',
				score: 'A',
				feedback:
					'질문의 핵심을 정확히 파악하고 논리적으로 답변했습니다. 특히 프로젝트 경험을 설명할 때 STAR 기법을 잘 활용했습니다.',
			},
			{
				name: '논리성',
				score: 'A-',
				feedback:
					'전반적으로 논리적인 구조를 갖추었으나, 일부 답변에서 주제 간 연결이 부족했습니다.',
			},
			{
				name: '태도',
				score: 'A+',
				feedback:
					'면접 내내 적절한 자세와 시선 처리를 유지했습니다. 자신감 있는 목소리 톤과 밝은 표정이 인상적이었습니다.',
			},
		],
		goodPoints: [
			'자기소개서와 일관된 답변으로 신뢰감을 주었습니다.',
			'구체적인 경험과 수치를 활용한 답변이 설득력 있었습니다.',
		],
		improvementPoints: [
			'일부 답변이 너무 길었습니다. 핵심을 더 간결하게 전달하면 좋겠습니다.',
		],
	},
	'2': {
		name: '이민수',
		overallScore: 'B+',
		categories: [
			{
				name: '내용 전달력',
				score: 'B+',
				feedback:
					'답변 내용은 좋았으나, 전달 방식에서 간간이 불필요한 반복이 있었습니다.',
			},
			{
				name: '논리성',
				score: 'A-',
				feedback:
					'논리적 구조는 잘 갖추었으나, 일부 예시가 주제와 직접적인 연관성이 부족했습니다.',
			},
			{
				name: '태도',
				score: 'B',
				feedback:
					'전반적으로 무난했으나, 더 적극적인 자세와 표정 관리가 필요합니다.',
			},
		],
		goodPoints: [
			'기술적 지식이 풍부하고 전문성이 돋보였습니다.',
			'질문에 대한 이해도가 높았습니다.',
		],
		improvementPoints: [
			'답변 시 목소리 톤의 변화가 적어 단조로운 느낌이 들었습니다.',
			'더 구체적인 사례를 준비하면 좋겠습니다.',
		],
	},
	'3': {
		name: '박서연',
		overallScore: 'A-',
		categories: [
			{
				name: '내용 전달력',
				score: 'A',
				feedback: '명확하고 간결한 답변으로 핵심을 잘 전달했습니다.',
			},
			{
				name: '논리성',
				score: 'B+',
				feedback: '대체로 논리적이었으나, 일부 답변에서 근거가 부족했습니다.',
			},
			{
				name: '태도',
				score: 'A',
				feedback: '자신감 있는 태도와 적절한 제스처가 인상적이었습니다.',
			},
		],
		goodPoints: [
			'간결하면서도 핵심을 놓치지 않는 답변이 좋았습니다.',
			'어려운 질문에도 침착하게 대응했습니다.',
		],
		improvementPoints: [
			'일부 기술적 질문에 대한 깊이 있는 답변이 부족했습니다.',
			'답변 시간을 더 효율적으로 활용하면 좋겠습니다.',
		],
	},
}

export const QUESTION_TEXTS = [
	'자기소개서에 언급하신 프로젝트에서 가장 어려웠던 점과 어떻게 해결했는지 설명해주세요.',
	'팀 프로젝트에서 갈등이 있었을 때 어떻게 해결했는지 구체적인 사례를 들어 설명해주세요.',
	'지원하신 직무에 필요한 역량이 무엇이라고 생각하시나요?',
	// ...추가 질문 필요시 여기에
]

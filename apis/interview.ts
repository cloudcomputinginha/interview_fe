import { serverFetch } from '../utils/fetch/fetch'
import {
	InterviewCreateDTO,
	ApiResponseInterviewCreateResultDTO,
	CreateMemberInterviewDTO,
	ApiResponseCreateMemberInterviewDTO,
	changeMemberStatusDTO,
	ApiResponseMemberInterviewStatusDTO,
	endInterviewRequestDTO,
	ApiResponseInterviewEndResultDTO,
	InterviewOptionUpdateDTO,
	ApiResponseInterviewOptionUpdateResponseDTO,
	ApiResponseListInterviewGroupCardDTO,
	ApiResponseGroupInterviewDetailDTO,
	ApiResponseInterviewStartResponseDTO,
	ApiResponseMyInterviewListDTO,
	UpdateDocumentDTO,
	ApiResponseMemberInterviewDocumentDTO,
	ApiResponseInterviewGetResponseDTO,
} from './types/interview-types'
import { checkEntityInterviewConnections } from '../utils/api-helpers'
import mockData from './mock.json'

// 면접 생성
export async function createInterview(data: InterviewCreateDTO) {
	return serverFetch.post<
		ApiResponseInterviewCreateResultDTO,
		InterviewCreateDTO
	>('/interviews', data)
}

// 면접 참여 신청
export async function createMemberInterview(
	interviewId: number,
	data: CreateMemberInterviewDTO
) {
	return serverFetch.post<
		ApiResponseCreateMemberInterviewDTO,
		CreateMemberInterviewDTO
	>(`/interviews/${interviewId}`, data)
}

// 면접 옵션 수정
export async function updateInterviewOption(
	interviewId: number,
	data: InterviewOptionUpdateDTO
) {
	return serverFetch.patch<
		ApiResponseInterviewOptionUpdateResponseDTO,
		InterviewOptionUpdateDTO
	>(`/interviews/${interviewId}/option`, data)
}

// 1대다 면접 모집글 리스트 조회
export async function getGroupInterviewCards() {
	return serverFetch.get<ApiResponseListInterviewGroupCardDTO>(
		'/interviews/group'
	)
}

// 1대다 면접 모집글 상세 조회
export async function getGroupInterviewDetail(interviewId: number) {
	return serverFetch.get<ApiResponseGroupInterviewDetailDTO>(
		`/interviews/group/${interviewId}`
	)
}

// 면접 시작 API
export async function startInterview(interviewId: number) {
	return serverFetch.get<ApiResponseInterviewStartResponseDTO>(
		`/interviews/${interviewId}/start`
	)
}

export async function getInterview(interviewId: number) {
	return serverFetch.get<ApiResponseInterviewGetResponseDTO>(
		`/interviews/${interviewId}`
	)
}

export async function getMockInterview(interviewId: number) {
	return new Promise<ApiResponseInterviewStartResponseDTO>(resolve => {
		setTimeout(() => {
			resolve(mockData as unknown as ApiResponseInterviewStartResponseDTO)
		}, 3000) // 3초 지연
	})
}

// 대기실 내 사용자 상태 변경
export async function changeParticipantsStatus(
	interviewId: number,
	data: changeMemberStatusDTO
) {
	return serverFetch.patch<
		ApiResponseMemberInterviewStatusDTO,
		changeMemberStatusDTO
	>(`/interviews/${interviewId}/waiting-room`, data)
}

// 면접 종료
export async function terminateInterview(
	interviewId: number,
	data: endInterviewRequestDTO
) {
	return serverFetch.patch<
		ApiResponseInterviewEndResultDTO,
		endInterviewRequestDTO
	>(`/interviews/${interviewId}/end`, data)
}

// 내 인터뷰 리스트 조회
export async function getMyInterviewList() {
	return serverFetch.get<ApiResponseMyInterviewListDTO>('/mypage/interviews')
}

// 면접 정보 수정
export async function updateInterview(
	interviewId: number,
	data: {
		title: string
		startAt: string
		isPublic: boolean
		maxParticipants: string
		participants: { id: number; email: string }[]
		resume: string
		coverLetter: string
	}
) {
	return serverFetch.put(`/interviews/${interviewId}`, data)
}

export async function getInterviewDetail(interviewId: number) {
	return serverFetch.get<ApiResponseInterviewStartResponseDTO>(
		`/interviews/${interviewId}/start`
	)
}

// 면접 문서 변경
export async function updateInterviewDocuments(
	interviewId: number,
	data: UpdateDocumentDTO
) {
	return serverFetch.patch<
		ApiResponseMemberInterviewDocumentDTO,
		UpdateDocumentDTO
	>(`/interviews/${interviewId}/documents`, data)
}

// 면접 삭제
export async function deleteInterview(interviewId: number) {
	return serverFetch.del(`/interviews/${interviewId}`)
}

// 엔티티에 연결된 면접 목록 조회 (공통 함수)
export { checkEntityInterviewConnections }

import { serverFetch } from '../utils/fetch/fetch'
import {
	CreateCoverletterDTO,
	ApiResponseCreateCoverletterDTO,
	ApiResponseCoverletterDetailDTO,
	ApiResponseMyCoverletterListDTO,
} from './types/coverletter-types'

import { ApiResponseVoid } from './types/common-types'
import { checkEntityInterviewConnections } from '../utils/api-helpers'

// 자기소개서 생성
export async function createCoverletter(data: CreateCoverletterDTO) {
	return serverFetch.post<
		ApiResponseCreateCoverletterDTO,
		CreateCoverletterDTO
	>('/coverletters', data)
}

// 자기소개서 상세 조회
export async function getCoverletterDetail(coverletterId: number) {
	return serverFetch.get<ApiResponseCoverletterDetailDTO>(
		`/coverletters/${coverletterId}`
	)
}

// 내 자기소개서 리스트 조회
export async function findMyCoverletter() {
	return serverFetch.get<ApiResponseMyCoverletterListDTO>('/coverletters')
}

// 자기소개서에 연결된 면접이 있는지 확인
export async function checkHasConnectedInterview(coverletterId: number) {
	return checkEntityInterviewConnections('coverletters', coverletterId)
}

// 자기소개서 삭제
export async function deleteCoverletter(coverletterId: number) {
	return serverFetch.del<ApiResponseVoid>(`/coverletters/${coverletterId}`)
}

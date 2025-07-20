import { serverFetch } from '../utils/fetch/fetch'
import {
	RegisterInfoDTO,
	UpdateInfoDTO,
	ApiResponseMemberInfoResponseDTO,
	TokenReissueRequestDto,
	ApiResponseTokenReissueResponseDto,
} from './types/member-types'

// 사용자 프로필 조회
export async function getMemberInfo() {
	return serverFetch.get<ApiResponseMemberInfoResponseDTO>('/members')
}

// 사용자 기본 정보 등록
export async function registerBasicInfo(data: RegisterInfoDTO) {
	return serverFetch.patch<ApiResponseMemberInfoResponseDTO, RegisterInfoDTO>(
		'/members',
		data
	)
}

// 사용자 기본 정보 변경
export async function updateBasicInfo(data: UpdateInfoDTO) {
	return serverFetch.patch<ApiResponseMemberInfoResponseDTO, UpdateInfoDTO>(
		'/members/info',
		data
	)
}

// 토큰 재발급
export async function reissueToken(data: TokenReissueRequestDto) {
	return serverFetch.post<
		ApiResponseTokenReissueResponseDto,
		TokenReissueRequestDto
	>('/auth/reissue', data)
}

// 사용자 기본 정보 등록
export interface RegisterInfoDTO {
	phone: string
	jobType: string
	introduction: string
}

// 사용자 기본 정보 변경
export interface UpdateInfoDTO {
	name: string
	phone: string
	jobType: string
	introduction: string
}

// 사용자 정보 응답
export interface MemberInfoResponseDTO {
	memberId?: number
	name?: string
	email?: string
	phone?: string
	jobType?: string
	introduction?: string
}

// 사용자 정보 응답 래퍼
export interface ApiResponseMemberInfoResponseDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: MemberInfoResponseDTO
}

// 토큰 재발급 요청
export interface TokenReissueRequestDto {
	refreshToken: string
}

// 토큰 재발급 응답
export interface TokenReissueResponseDto {
	accessToken: string
	refreshToken: string
}

// 토큰 재발급 응답 래퍼
export interface ApiResponseTokenReissueResponseDto {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: TokenReissueResponseDto
}

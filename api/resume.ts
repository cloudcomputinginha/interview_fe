import { serverFetch } from '../utils/fetch/fetch'
import {
	ResumeCreateDTO,
	ApiResponseCreateResumeResultDTO,
	ApiResponsePresignedUploadDTO,
	ApiResponseResumeDetailDTO,
	ApiResponseResumeListDTO,
} from './types/resume-types'

// presigned url 발급
export async function getPresignedUploadUrl(fileName: string) {
	return serverFetch.get<ApiResponsePresignedUploadDTO>('/resumes/upload', {
		fileName,
	})
}

// 이력서 메타데이터 저장
export async function saveResume(data: ResumeCreateDTO) {
	return serverFetch.post<ApiResponseCreateResumeResultDTO, ResumeCreateDTO>(
		'/resumes/upload',
		data
	)
}

// 이력서 상세 조회
export async function getResumeDetail(resumeId: number, memberId: number) {
	return serverFetch.get<ApiResponseResumeDetailDTO>(`/resumes/${resumeId}`, {
		memberId,
	})
}

// 이력서 리스트 조회
export async function getResumeList(memberId: number) {
	return serverFetch.get<ApiResponseResumeListDTO>('/resumes/', { memberId })
}

export interface ResumeCreateDTO {
	memberId: number
	fileName: string
	fileUrl: string
	fileSize: number
}

export interface CreateResumeResultDTO {
	resumeId?: number
	createdAt?: string
}

export interface ApiResponseCreateResumeResultDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: CreateResumeResultDTO
}

export interface PresignedUploadDTO {
	presignedUrl?: string
	key?: string
	fileUrl?: string
}

export interface ApiResponsePresignedUploadDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: PresignedUploadDTO
}

export interface ResumeDetailDTO {
	resumeId?: number
	fileName?: string
	fileUrl?: string
	fileSize?: number
	fileType?: 'PDF'
	createdAt?: string
	updatedAt?: string
}

export interface ApiResponseResumeDetailDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: ResumeDetailDTO
}

export interface ResumeDTO {
	resumeId?: number
	fileName?: string
	fileSize?: number
}

export interface ResumeListDTO {
	resumes?: ResumeDTO[]
}

export interface ApiResponseResumeListDTO {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: ResumeListDTO
}

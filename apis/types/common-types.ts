export interface ApiResponseVoid {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: void
}

export interface ApiErrorResponse {
	isSuccess?: boolean
	code?: string
	message?: string
	result?: string
}

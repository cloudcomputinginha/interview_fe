import { toast } from 'sonner'
import { ApiError } from './error'

export const errorToast = (error: ApiError) => {
	if (process.env.NODE_ENV === 'development') {
		toast.error(error.code, {
			description: error.message,
		})
	} else {
		toast.error('API Error가 발생했습니다.', {
			description: error.message,
		})
	}
}

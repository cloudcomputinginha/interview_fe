import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'sonner'

const useCoreMutation = <
	TData = unknown,
	TError = Error,
	TVariables = void,
	TContext = unknown,
>(
	options: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
	return useMutation<TData, TError, TVariables, TContext>({
		...options,
		onError: error => {
			toast.error(error.message ?? '에러가 발생했습니다.')
		},
	})
}

export default useCoreMutation

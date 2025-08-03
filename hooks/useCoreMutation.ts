import { useMutation, UseMutationOptions } from '@tanstack/react-query'

const useCoreMutation = <
	TData = unknown,
	TError = Error,
	TVariables = void,
	TContext = unknown,
>(
	options: UseMutationOptions<TData, TError, TVariables, TContext>
) => {
	return useMutation<TData, TError, TVariables, TContext>(options)
}

export default useCoreMutation

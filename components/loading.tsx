import React from 'react'

type LoadingProps = {
	variant?: 'default' | 'danger'
}

const defaultClassName =
	'animate-spin rounded-full border-b-2 h-8 w-8 border-[#8FD694] mx-auto'
const dangerClassName =
	'animate-spin rounded-full border-b-2 h-8 w-8 border-[#FF6B6B] mx-auto'

const Loading = ({ variant = 'default' }: LoadingProps) => {
	return (
		<div
			className={variant === 'default' ? defaultClassName : dangerClassName}
		></div>
	)
}

export default Loading

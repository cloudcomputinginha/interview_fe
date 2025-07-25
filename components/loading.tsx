export default function LoadingSpinner({
	infoText,
	size = 12,
}: {
	infoText?: string
	size?: number
}) {
	return (
		<div className="flex justify-center items-center h-full">
			<div
				className="animate-spin rounded-full border-b-2 border-[#8FD694] mx-auto mb-4 h-full"
				style={{ height: `${size}px`, width: `${size}px` }}
			></div>
			{infoText && <p>{infoText}</p>}
		</div>
	)
}

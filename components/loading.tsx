export default function LoadingSpinner({ infoText }: { infoText?: string }) {
	return (
		<div className="flex flex-col gap-2 justify-center items-center h-screen">
			<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FD694] mx-auto mb-4"></div>
			{infoText && <p>{infoText}</p>}
		</div>
	)
}

import Loading from './loading'

export default function LoadingFullScreen({ infoText }: { infoText?: string }) {
	return (
		<div className="flex flex-col justify-center items-center h-screen w-full gap-4">
			<Loading />
			{infoText && <p>{infoText}</p>}
		</div>
	)
}

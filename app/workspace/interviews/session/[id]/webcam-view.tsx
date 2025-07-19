'use client'

import { useEffect, useRef } from 'react'

export function WebcamView() {
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		let stream: MediaStream

		async function setupWebcam() {
			try {
				stream = await navigator.mediaDevices.getUserMedia({ video: true })
				if (videoRef.current) {
					videoRef.current.srcObject = stream
				}
			} catch (err) {
				console.error('웹캠 접근 실패:', err)
			}
		}

		setupWebcam()

		return () => {
			if (stream) {
				stream.getTracks().forEach(track => track.stop())
			}
		}
	}, [])

	return (
		<video
			ref={videoRef}
			autoPlay
			muted
			playsInline
			className="rounded-lg aspect-square object-cover bg-black border border-gray-300 shadow"
			style={{ background: '#000' }}
		/>
	)
}

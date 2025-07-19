'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InterviewPage() {
	const router = useRouter()

	useEffect(() => {
		// /workspace/interviews로 리다이렉트
		router.replace('/workspace/interviews')
	}, [router])

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8FD694] mx-auto mb-4"></div>
				<p className="text-gray-600">면접 페이지로 이동 중...</p>
			</div>
		</div>
	)
}

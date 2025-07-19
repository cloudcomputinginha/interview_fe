'use client'

import { Suspense } from 'react'
import AuthRedirectPageInner from './auth-redirect-page-inner'

export default function AuthRedirectPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					<div className="bg-white p-8 rounded shadow text-center">
						<p className="text-gray-700">로그인 처리 중입니다...</p>
					</div>
				</div>
			}
		>
			<AuthRedirectPageInner />
		</Suspense>
	)
}

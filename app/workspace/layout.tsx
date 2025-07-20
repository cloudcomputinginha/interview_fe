'use client'
import { ReactNode, useEffect } from 'react'
import { useMemberSession } from '@/components/member-session-context'
import { usePathname } from 'next/navigation'

const EXCLUDE_PATHS = [
	'/workspace/interviews/session',
	'/login',
	'/workspace/loading',
]

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
	const { memberId } = useMemberSession()

	const pathname = usePathname()

	useEffect(() => {
		if (!memberId && !EXCLUDE_PATHS.includes(pathname)) {
			alert('로그인이 필요합니다.')
		}
	}, [memberId, pathname])

	if (!memberId && !EXCLUDE_PATHS.includes(pathname)) return null

	return <>{children}</>
}

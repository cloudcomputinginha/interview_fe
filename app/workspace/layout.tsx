'use client'
import { ReactNode, useEffect } from 'react'
import { useMemberSession } from '@/components/member-session-context'
import { useRequireMemberId } from '@/components/member-session-context'

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
    const { memberId } = useMemberSession()
    useRequireMemberId()
    useEffect(() => {
        if (!memberId) {
            alert('로그인이 필요합니다.')
        }
    }, [memberId])
    if (!memberId) return null
    return <>{children}</>
} 
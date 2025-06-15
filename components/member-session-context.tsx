'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { serverFetch } from '@/utils/fetch/fetch'

interface MemberSessionContextProps {
    memberId: number | null
    login: (id: number) => void
    logout: () => void
}

const MemberSessionContext = createContext<MemberSessionContextProps | undefined>(undefined)

export function MemberSessionProvider({ children }: { children: ReactNode }) {
    const [memberId, setMemberId] = useState<number | null>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('memberId')
            return stored ? Number(stored) : null
        }
        return null
    })

    const login = (id: number) => {
        setMemberId(id)
        localStorage.setItem('memberId', String(id))
    }

    const logout = async () => {
        await serverFetch.del('/auth/logout')
        setMemberId(null)
        localStorage.removeItem('memberId')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }

    return (
        <MemberSessionContext.Provider value={{ memberId, login, logout }}>
            {children}
        </MemberSessionContext.Provider>
    )
}

export function useMemberSession() {
    const ctx = useContext(MemberSessionContext)
    if (!ctx) throw new Error('useMemberSession must be used within MemberSessionProvider')
    return ctx
}

export function useRequireMemberId(excludePaths: string[] = []) {
    const { memberId } = useMemberSession();
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!memberId && !excludePaths.includes(pathname)) {
            router.replace('/login')
        }
    }, [memberId, pathname])

    return memberId
} 
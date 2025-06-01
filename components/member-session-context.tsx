'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

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

    const logout = () => {
        setMemberId(null)
        localStorage.removeItem('memberId')
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

export function useRequireMemberId() {
    const { memberId } = useMemberSession();
    const router = useRouter()

    useEffect(() => {
        if (!memberId) {
            router.replace('/login')
        }
    }, [memberId, router])

    return memberId
} 
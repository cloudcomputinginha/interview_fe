'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { logout } from '@/api/auth'

interface MemberSessionContextProps {
	memberId: number | null
	login: (id: number) => void
	logout: () => Promise<void>
}

const MemberSessionContext = createContext<
	MemberSessionContextProps | undefined
>(undefined)

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

	const handleLogout = async () => {
		try {
			await logout()
		} catch (error) {
			console.error('로그아웃 실패:', error)
		} finally {
			setMemberId(null)
			localStorage.removeItem('memberId')
			localStorage.removeItem('accessToken')
			localStorage.removeItem('refreshToken')
		}
	}

	return (
		<MemberSessionContext.Provider
			value={{ memberId, login, logout: handleLogout }}
		>
			{children}
		</MemberSessionContext.Provider>
	)
}

export function useMemberSession() {
	const ctx = useContext(MemberSessionContext)
	if (!ctx)
		throw new Error(
			'useMemberSession must be used within MemberSessionProvider'
		)
	return ctx
}

// 소셜 로그인 시작
export function startSocialLogin(provider: 'GOOGLE' | 'KAKAO') {
	const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/${provider}`
	window.location.href = url
}

// 소셜 로그인 콜백 처리
export function handleSocialLoginCallback(
	provider: 'GOOGLE' | 'KAKAO',
	code: string
) {
	const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/${provider}/callback?code=${code}`
	window.location.href = url
}

// 로그아웃 (기존 member-session-context에서 사용 중)
export async function logout() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`,
		{
			method: 'DELETE',
			credentials: 'include',
		}
	)

	if (!response.ok) {
		throw new Error('로그아웃 실패')
	}

	return response.ok
}

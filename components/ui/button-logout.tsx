import { useMemberSession } from '../member-session-context'

export function ButtonLogout() {
	const { logout } = useMemberSession()
	return (
		<button
			onClick={() => {
				logout()
				window.location.href = '/login'
			}}
			className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
		>
			로그아웃
		</button>
	)
}

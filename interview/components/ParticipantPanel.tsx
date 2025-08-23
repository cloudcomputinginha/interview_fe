// app/group/interview-session/components/ParticipantsPanel.tsx
'use client'

export default function ParticipantsPanel({
	sessionsMap,
	activeMemberId,
}: {
	sessionsMap: Record<string, string>
	activeMemberId?: string | null
}) {
	const ids = Object.keys(sessionsMap)
	if (!ids.length) return null

	return (
		<div>
			<h2 className="text-lg font-semibold mb-2">참가자</h2>
			<ul className="divide-y rounded border bg-white">
				{ids.map(mid => (
					<li
						key={mid}
						className="p-3 text-sm flex items-center justify-between"
					>
						<div>
							<div className="font-medium">Member #{mid}</div>
							<div className="text-gray-500">SID: {sessionsMap[mid]}</div>
						</div>
						{activeMemberId === mid ? (
							<span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
								활성
							</span>
						) : (
							<span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
								대기
							</span>
						)}
					</li>
				))}
			</ul>
		</div>
	)
}

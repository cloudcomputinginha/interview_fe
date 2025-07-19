import { useState } from 'react'
import type { Participant, ParticipantReports } from '../types/report'
import { PARTICIPANTS, PARTICIPANT_REPORTS } from '../constants/report'

export function useGroupInterviewReportForm() {
	const [selectedParticipant, setSelectedParticipant] = useState(
		PARTICIPANTS[0].id
	)
	const currentReport = PARTICIPANT_REPORTS[selectedParticipant]
	return {
		participants: PARTICIPANTS,
		selectedParticipant,
		setSelectedParticipant,
		currentReport,
	}
}

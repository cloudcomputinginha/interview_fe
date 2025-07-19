import React from 'react'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { getStepTitle } from '@/lib/interview/util'

type Props = {
	step: number
	interviewType: string
}

const StepTitle = ({ step, interviewType }: Props) => {
	return (
		<CardHeader>
			<CardTitle>{getStepTitle(step, interviewType)}</CardTitle>
		</CardHeader>
	)
}

export default StepTitle

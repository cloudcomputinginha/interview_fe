'use client'

import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface StepContainerProps {
	children: ReactNode
	className?: string
}

export function StepContainer({
	children,
	className = '',
}: StepContainerProps) {
	return (
		<Card className={`w-full max-w-2xl mx-auto ${className}`}>
			<CardContent className="p-6">{children}</CardContent>
		</Card>
	)
}

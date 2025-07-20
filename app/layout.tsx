import type { Metadata } from 'next'
import React from 'react'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
	title: 'Injob',
	description: 'Injob',
	generator: 'Injob',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}

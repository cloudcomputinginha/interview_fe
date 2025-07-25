import type { Metadata } from 'next'
import React from 'react'
import './globals.css'
import Providers from './providers'
import { Toaster } from 'sonner'

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
				<Toaster position="top-center" richColors duration={1500} />
			</body>
		</html>
	)
}

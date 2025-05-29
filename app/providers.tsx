'use client'

import { ReactNode, useState } from 'react'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function Providers({ children }: { children: ReactNode }) {
    // 한 번만 생성되는 QueryClient
    const [client] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={client}>
            {children}
            {/* 개발 중이면 열어두면 편리, 배포 시 빼도 OK */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
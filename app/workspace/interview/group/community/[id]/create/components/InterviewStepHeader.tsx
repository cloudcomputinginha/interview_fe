import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface InterviewStepHeaderProps {
    postId: string
    sessionName: string
}

export function InterviewStepHeader({ postId, sessionName }: InterviewStepHeaderProps) {
    return (
        <div className='mb-8'>
            <Link
                href={`/workspace/interview/group/community/${postId}`}
                className='inline-flex items-center text-gray-600 hover:text-gray-900 mb-6'
            >
                <ArrowLeft className='h-4 w-4 mr-1' /> 모집글로 돌아가기
            </Link>
            <h1 className='text-2xl font-bold'>{sessionName}</h1>
            <p className='text-gray-600 mt-2'>다대다 면접 세션을 생성하고 예약합니다.</p>
        </div>
    )
}

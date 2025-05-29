import { Info } from 'lucide-react'

interface InterviewStepNoticeProps {
    date: string
    time: string
    formatDateTime: (date: string, time: string) => string
}

export function InterviewStepNotice({ date, time, formatDateTime }: InterviewStepNoticeProps) {
    return (
        <div className='bg-blue-50 p-4 rounded-lg'>
            <div className='flex items-start'>
                <Info className='h-5 w-5 text-blue-500 mr-3 mt-0.5' />
                <div>
                    <p className='text-blue-600 text-sm'>
                        <span className='font-medium'>안내:</span> 설정된 시간({formatDateTime(date, time)})에 자동으로 면접이 시작됩니다. 모든 참가자는 시작 시간 10분 전부터 대기실에 입장할 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    )
}

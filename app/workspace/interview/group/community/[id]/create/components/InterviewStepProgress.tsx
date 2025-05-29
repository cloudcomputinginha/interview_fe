import { Progress } from '@/components/ui/progress'

interface InterviewStepProgressProps {
    step: number
}

export function InterviewStepProgress({ step }: InterviewStepProgressProps) {
    return (
        <div className='mb-8'>
            <div className='flex justify-between text-sm mb-2'>
                <span className='text-[#8FD694] font-medium'>단계 {step}/2</span>
                <span className='text-gray-500'>{step === 1 ? '면접 일정 설정' : '호스트 자료 및 면접 옵션 설정'}</span>
            </div>
            <Progress value={(step / 2) * 100} className='h-2' />
        </div>
    )
}

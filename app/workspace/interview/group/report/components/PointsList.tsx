/**
 * 특정 포인트(잘한 점, 개선할 점 등) 리스트를 렌더링하는 컴포넌트
 * @param title 리스트 제목
 * @param points 포인트 문자열 배열
 */
export interface PointsListProps {
    title: string
    points: string[]
}

export function PointsList({ title, points }: PointsListProps) {
    if (!points || points.length === 0) return null
    return (
        <div className='mb-4'>
            <h3 className='font-semibold mb-2'>{title}</h3>
            <ul className='list-disc list-inside space-y-1'>
                {points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                ))}
            </ul>
        </div>
    )
}

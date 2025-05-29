import type { CategoryFeedback } from '../types/report'

interface CategoryFeedbackListProps {
    categories: CategoryFeedback[]
}

export function CategoryFeedbackList({ categories }: CategoryFeedbackListProps) {
    return (
        <div className='mb-4'>
            <h3 className='font-semibold mb-2'>카테고리별 피드백</h3>
            <ul className='space-y-2'>
                {categories.map((cat) => (
                    <li key={cat.name} className='border rounded p-2'>
                        <div className='flex justify-between mb-1'>
                            <span className='font-medium'>{cat.name}</span>
                            <span className='text-sm text-gray-500'>점수: {cat.score}</span>
                        </div>
                        <p className='text-gray-700'>{cat.feedback}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

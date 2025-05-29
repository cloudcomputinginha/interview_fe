import type { Participant } from '../types/report'

interface ParticipantSelectorProps {
    participants: Participant[]
    selectedParticipant: string
    onSelect: (id: string) => void
}

export function ParticipantSelector({ participants, selectedParticipant, onSelect }: ParticipantSelectorProps) {
    return (
        <div className='flex gap-2 mb-4'>
            {participants.map((p) => (
                <button
                    key={p.id}
                    onClick={() => onSelect(p.id)}
                    className={`px-3 py-1 rounded border ${selectedParticipant === p.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                >
                    {p.name}
                </button>
            ))}
        </div>
    )
}

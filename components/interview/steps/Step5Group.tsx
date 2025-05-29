// src/components/interview/steps/Step5Group.tsx
"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import type { InterviewFormState } from "@/lib/interview/types"

interface Props {
    form: InterviewFormState
    setForm: React.Dispatch<React.SetStateAction<InterviewFormState>>
}

export default function Step5Group({ form, setForm }: Props) {
    const patch = (p: Partial<InterviewFormState>) => setForm((f) => ({ ...f, ...p }))

    const add = () =>
        form.inviteEmails.length < 5 &&
        patch({ inviteEmails: [...form.inviteEmails, { id: Date.now(), email: "" }] })

    const remove = (id: number) =>
        form.inviteEmails.length > 1 &&
        patch({ inviteEmails: form.inviteEmails.filter((e) => e.id !== id) })

    const update = (id: number, email: string) =>
        patch({
            inviteEmails: form.inviteEmails.map((e) => (e.id === id ? { ...e, email } : e)),
        })

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">참가자 초대</h2>
                <p className="text-gray-600">그룹 면접에 참여할 사람들의 이메일을 입력해주세요.</p>
            </div>

            <div className="space-y-4">
                <Label>참가자 이메일 ({form.inviteEmails.length}/5)</Label>
                {form.inviteEmails.map((e, i) => (
                    <div key={e.id} className="flex items-center gap-2">
                        <Input
                            type="email"
                            placeholder={`참가자 ${i + 1} 이메일`}
                            value={e.email}
                            onChange={(ev) => update(e.id, ev.target.value)}
                        />
                        {form.inviteEmails.length > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => remove(e.id)} className="h-8 w-8 text-red-500">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}

                {form.inviteEmails.length < 5 && (
                    <Button variant="outline" size="sm" onClick={add} className="mt-2 flex items-center gap-1">
                        <Plus className="h-4 w-4" /> 참가자 추가
                    </Button>
                )}

                <p className="text-sm text-gray-500 mt-2">참가자들에게는 면접 시작 전에 이메일 알림이 발송됩니다.</p>
            </div>
        </div>
    )
}

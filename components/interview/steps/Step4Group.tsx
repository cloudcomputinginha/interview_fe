// src/components/interview/steps/Step4Group.tsx
"use client"

import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { InterviewFormState } from "@/lib/interview/types"

const TIMES = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
]

interface Props {
    form: InterviewFormState
    setForm: React.Dispatch<React.SetStateAction<InterviewFormState>>
}

export default function Step4Group({ form, setForm }: Props) {
    const patch = (p: Partial<InterviewFormState>) => setForm((f) => ({ ...f, ...p }))

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">면접 예약</h2>
                <p className="text-gray-600">그룹 면접 일정을 선택해주세요.</p>
            </div>

            {/* 참가자 수 */}
            <div className="space-y-4">
                <div>
                    <Label>최대 참가자 수</Label>
                    <Select
                        value={form.maxParticipants}
                        onValueChange={(v) => patch({ maxParticipants: v })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="인원 수 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {["2", "3", "4", "5"].map((n) => (
                                <SelectItem key={n} value={n}>{n}명</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 공개 / 비공개 */}
                <div>
                    <Label>공개 설정</Label>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                        {[
                            { key: "public", title: "🌐 공개", desc: "모든 사용자가 검색하여 참여할 수 있습니다" },
                            { key: "private", title: "🔒 비공개", desc: "초대받은 사용자만 참여할 수 있습니다" },
                        ].map((opt) => (
                            <Card
                                key={opt.key}
                                className={`cursor-pointer transition ${form.visibility === opt.key ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                                    }`}
                                onClick={() => patch({ visibility: opt.key as any })}
                            >
                                <CardContent className="p-4 text-center">
                                    <h3 className="font-semibold mb-2">{opt.title}</h3>
                                    <p className="text-sm text-gray-600">{opt.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 날짜 & 시간 */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <Label className="block mb-3 text-base font-medium">날짜 선택</Label>
                        <Calendar
                            mode="single"
                            selected={form.scheduledDate}
                            onSelect={(d) => {
                                if (!d) return
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                if (d >= today) {
                                    patch({
                                        startType: "scheduled",
                                        scheduledDate: d,
                                    })
                                }
                            }}
                            disabled={(d) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                return d < today
                            }}
                            className="rounded-md border"
                        />
                    </div>

                    <div>
                        <Label className="block mb-3 text-base font-medium">시간 선택</Label>
                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                            {TIMES.map((t) => (
                                <Button
                                    key={t}
                                    size="sm"
                                    variant={form.scheduledTime === t ? "default" : "outline"}
                                    className={form.scheduledTime === t ? "bg-[#8FD694] hover:bg-[#7ac47f]" : ""}
                                    onClick={() => patch({ scheduledTime: t })}
                                >
                                    {t}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

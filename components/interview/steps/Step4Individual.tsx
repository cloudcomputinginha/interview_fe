// src/components/interview/steps/Step4Individual.tsx
"use client"

import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, CalendarIcon } from "lucide-react"
import type { InterviewFormState } from "@/lib/interview/types"

interface Props {
    form: InterviewFormState
    setForm: React.Dispatch<React.SetStateAction<InterviewFormState>>
}

const TIMES = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
]

export default function Step4Individual({ form, setForm }: Props) {
    const patch = (p: Partial<InterviewFormState>) => setForm((f) => ({ ...f, ...p }))

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">면접 시작 옵션</h2>
                <p className="text-gray-600">지금 시작하거나 예약할 시간을 선택해주세요.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* 지금 시작 */}
                <Card
                    className={`cursor-pointer transition ${form.startType === "now" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                        }`}
                    onClick={() => patch({ startType: "now" })}
                >
                    <CardContent className="p-6 text-center">
                        <Clock className="h-8 w-8 mx-auto mb-3 text-[#8FD694]" />
                        <h3 className="font-semibold mb-2">지금 시작</h3>
                        <p className="text-sm text-gray-600">바로 면접을 시작합니다</p>
                    </CardContent>
                </Card>
                {/* 예약 시작 */}
                <Card
                    className={`cursor-pointer transition ${form.startType === "scheduled" ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                        }`}
                    onClick={() => patch({ startType: "scheduled" })}
                >
                    <CardContent className="p-6 text-center">
                        <CalendarIcon className="h-8 w-8 mx-auto mb-3 text-[#8FD694]" />
                        <h3 className="font-semibold mb-2">예약하기</h3>
                        <p className="text-sm text-gray-600">원하는 시간에 면접을 예약합니다</p>
                    </CardContent>
                </Card>
            </div>

            {/* 예약 상세 */}
            {form.startType === "scheduled" && (
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {/* 날짜 */}
                    <div>
                        <Label className="block mb-3 text-base font-medium">날짜 선택</Label>
                        <Calendar
                            mode="single"
                            selected={form.scheduledDate}
                            onSelect={(d) => {
                                if (!d) return
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                if (d >= today) patch({ scheduledDate: d })
                            }}
                            disabled={(d) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                return d < today
                            }}
                            className="rounded-md border"
                        />
                    </div>

                    {/* 시간 */}
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
            )}
        </div>
    )
}

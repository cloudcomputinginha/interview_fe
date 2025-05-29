// src/components/interview/steps/Step3.tsx
"use client"

import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { InterviewFormState } from "@/lib/interview/types"

interface Props {
    form: InterviewFormState
    setForm: React.Dispatch<React.SetStateAction<InterviewFormState>>
}

export default function Step3({ form, setForm }: Props) {
    const patch = (p: Partial<InterviewFormState>) => setForm((f) => ({ ...f, ...p }))

    return (
        <div className="space-y-6">
            {/* AI 음성 */}
            <div className="space-y-2">
                <Label>AI 음성</Label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { value: "female1", label: "여성 음성 1", sample: "안녕하세요! 면접을 시작하겠습니다." },
                        { value: "female2", label: "여성 음성 2", sample: "안녕하세요! 준비되셨나요?" },
                        { value: "male1", label: "남성 음성 1", sample: "안녕하세요! 편안하게 답변해주세요." },
                        { value: "male2", label: "남성 음성 2", sample: "안녕하세요! 좋은 면접이 되길 바랍니다." },
                    ].map((voice) => (
                        <Card
                            key={voice.value}
                            className={`cursor-pointer transition ${form.voiceType === voice.value ? "ring-2 ring-[#8FD694] bg-green-50" : "hover:bg-gray-50"
                                }`}
                            onClick={() => patch({ voiceType: voice.value as any })}
                        >
                            <CardContent className="p-4 text-center">
                                <h3 className="font-semibold mb-2">{voice.label}</h3>
                                <p className="text-xs text-gray-600 italic">"{voice.sample}"</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <p className="text-xs text-gray-500">실제 면접과 유사한 목소리를 선택하세요.</p>
            </div>

            {/* 면접 스타일 */}
            <div className="space-y-2">
                <Label>면접 스타일</Label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                    <Button
                        variant={form.interviewStyle === "personality" ? "default" : "ghost"}
                        onClick={() => patch({ interviewStyle: "personality" })}
                    >
                        인성 면접
                    </Button>
                    <Button
                        variant={form.interviewStyle === "technical" ? "default" : "ghost"}
                        onClick={() => patch({ interviewStyle: "technical" })}
                    >
                        기술 면접
                    </Button>
                </div>
                <p className="text-xs text-gray-500">인성 = 가치관·경험, 기술 = 직무 지식 평가</p>
            </div>

            {/* 질문 수 */}
            <div className="space-y-4">
                <Label>질문 수: {form.questionCount}개</Label>
                <Slider
                    value={[form.questionCount]}
                    onValueChange={(v) => patch({ questionCount: v[0] })}
                    max={15}
                    min={5}
                    step={1}
                />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>5개</span>
                    <span>10개</span>
                    <span>15개</span>
                </div>
            </div>

            {/* 답변 시간 */}
            <div className="space-y-4">
                <Label>답변 시간: {form.answerDuration}분</Label>
                <Slider
                    value={[form.answerDuration]}
                    onValueChange={(v) => patch({ answerDuration: v[0] })}
                    max={5}
                    min={1}
                    step={1}
                />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>1분</span>
                    <span>3분</span>
                    <span>5분</span>
                </div>
            </div>
        </div>
    )
}

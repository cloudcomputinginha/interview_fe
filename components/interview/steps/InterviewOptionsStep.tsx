"use client"

import { useInterviewWizard } from "../InterviewWizardContext"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Volume2, Brain, Clock } from "lucide-react"

export function InterviewOptionsStep() {
  const { state, setState } = useInterviewWizard()

  const voiceOptions = [
    { value: "female1", label: "여성 음성 1" },
    { value: "female2", label: "여성 음성 2" },
    { value: "male1", label: "남성 음성 1" },
    { value: "male2", label: "남성 음성 2" },
  ]

  const styleOptions = [
    { value: "personality", label: "인성 면접", description: "인성과 태도를 중심으로 한 면접" },
    { value: "technical", label: "기술 면접", description: "전문 지식과 기술을 중심으로 한 면접" },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">면접 옵션을 설정해주세요</h2>
        <p className="text-gray-600">AI 면접관의 음성과 면접 스타일을 선택해주세요.</p>
      </div>

      <div className="space-y-6">
        {/* Voice Type */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            AI 면접관 음성
          </Label>
          <Select
            value={state.options.voiceType}
            onValueChange={(value: any) =>
              setState({
                options: { ...state.options, voiceType: value },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {voiceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interview Style */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Brain className="h-4 w-4" />
            면접 스타일
          </Label>
          <div className="grid gap-3">
            {styleOptions.map((option) => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  state.options.interviewStyle === option.value
                    ? "ring-2 ring-[#8FD694] bg-green-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setState({
                    options: { ...state.options, interviewStyle: option.value as any },
                  })
                }
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{option.label}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Answer Duration */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            답변 시간: {state.options.answerDuration}분
          </Label>
          <div className="px-3">
            <Slider
              value={[state.options.answerDuration]}
              onValueChange={(value) =>
                setState({
                  options: { ...state.options, answerDuration: value[0] },
                })
              }
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>1분</span>
              <span>5분</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

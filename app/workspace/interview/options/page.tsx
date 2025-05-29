"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ArrowRight, Info, Mic, Clock, Users } from "lucide-react"

export default function InterviewOptionsPage() {
  const [interviewType, setInterviewType] = useState("technical")
  const [duration, setDuration] = useState(2)
  const [format, setFormat] = useState("1:1")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/workspace/interview/start"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> 이전 단계로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold">면접 옵션 설정</h1>
          <p className="text-gray-600 mt-2">AI 면접 진행 방식을 설정해주세요.</p>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 space-y-8">
          {/* AI Voice */}
          <div>
            <div className="flex items-center mb-3">
              <Mic className="h-5 w-5 text-[#8FD694] mr-2" />
              <h3 className="text-lg font-medium">AI 음성 선택</h3>
            </div>
            <Select defaultValue="female1">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="AI 음성을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female1">여성 음성 1 (기본)</SelectItem>
                <SelectItem value="female2">여성 음성 2</SelectItem>
                <SelectItem value="male1">남성 음성 1</SelectItem>
                <SelectItem value="male2">남성 음성 2</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              면접관의 음성을 선택합니다. 실제 면접과 유사한 경험을 위해 선택하세요.
            </p>
          </div>

          {/* Interview Type */}
          <div>
            <div className="flex items-center mb-3">
              <Users className="h-5 w-5 text-[#8FD694] mr-2" />
              <h3 className="text-lg font-medium">면접 유형</h3>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <span className="mr-2">인성 면접</span>
                <div className="relative group">
                  <Info className="h-4 w-4 text-gray-400" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    인성, 가치관, 경험에 관한 질문 위주로 진행됩니다.
                  </div>
                </div>
              </div>
              <Switch
                checked={interviewType === "technical"}
                onCheckedChange={(checked) => setInterviewType(checked ? "technical" : "personality")}
              />
              <div className="flex items-center">
                <span className="mr-2">기술 면접</span>
                <div className="relative group">
                  <Info className="h-4 w-4 text-gray-400" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                    직무 관련 전문 지식과 문제 해결 능력을 평가합니다.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answer Duration */}
          <div>
            <div className="flex items-center mb-3">
              <Clock className="h-5 w-5 text-[#8FD694] mr-2" />
              <h3 className="text-lg font-medium">답변 시간 설정</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">답변 시간</span>
                <span className="font-medium">{duration}분</span>
              </div>
              <Slider
                value={[duration]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => setDuration(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1분</span>
                <span>2분</span>
                <span>3분</span>
                <span>4분</span>
                <span>5분</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">각 질문당 답변 시간을 설정합니다. 기본값은 2분입니다.</p>
          </div>

          {/* Interview Format */}
          <div>
            <div className="flex items-center mb-3">
              <Users className="h-5 w-5 text-[#8FD694] mr-2" />
              <h3 className="text-lg font-medium">면접 방식</h3>
            </div>
            <RadioGroup value={format} onValueChange={setFormat} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1:1" id="format-1" />
                <Label htmlFor="format-1">1:1 면접</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1:n" id="format-2" />
                <Label htmlFor="format-2">다수 면접관</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500 mt-2">
              1:1은 단일 면접관, 다수 면접관은 여러 명의 면접관이 번갈아 질문합니다.
            </p>
          </div>

          {/* Question Count */}
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-[#8FD694] mr-2" />
              <p className="text-sm">
                <span className="font-medium">최대 15개 질문, 자동 설정됨</span> - 자기소개서 내용을 기반으로 최적의
                질문 수가 자동으로 설정됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            이전
          </Button>
          <Button
            className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
            onClick={() => (window.location.href = "/workspace/interview/session")}
          >
            면접 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

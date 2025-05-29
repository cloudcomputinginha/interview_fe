"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Users } from "lucide-react"

export default function InterviewDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">면접 마법사 데모</h1>
          <p className="text-gray-600">두 가지 면접 플로우를 테스트해보세요.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-[#8FD694]" />
                1:1 개인 면접
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">AI와 함께하는 개인 맞춤형 면접 연습을 설정합니다.</p>
              <ul className="text-sm text-gray-500 mb-6 space-y-1">
                <li>• 면접 유형 선택</li>
                <li>• 이력서 및 자기소개서 입력</li>
                <li>• 시작 옵션 선택 (즉시/예약)</li>
                <li>• 면접 옵션 설정</li>
                <li>• 정보 미리보기</li>
              </ul>
              <Link href="/interview/new/individual">
                <Button className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white">개인 면접 시작</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-[#8FD694]" />
                그룹 면접
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">여러 참가자와 함께하는 그룹 면접을 설정합니다.</p>
              <ul className="text-sm text-gray-500 mb-6 space-y-1">
                <li>• 면접 유형 선택</li>
                <li>• 자기소개서 입력</li>
                <li>• 면접 예약 설정</li>
                <li>• 참가자 초대</li>
                <li>• 면접 옵션 설정</li>
                <li>• 정보 미리보기</li>
              </ul>
              <Link href="/interview/new/group">
                <Button className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white">그룹 면접 시작</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            각 플로우는 단계별 검증과 함께 진행되며, 마지막에 API 호출을 통해 면접이 생성됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}

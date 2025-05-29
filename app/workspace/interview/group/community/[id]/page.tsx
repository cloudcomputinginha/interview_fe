"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Users, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HeaderWithNotifications } from '@/components/header-with-notifications'

export default function InterviewPostDetailPage({ params }: { params: { id: string } }) {
  const postId = params.id
  const [timeLeft, setTimeLeft] = useState("")
  const [isHost, setIsHost] = useState(true) // For demo purposes, set to true

  // Mock data for the interview post
  const post = {
    id: Number.parseInt(postId),
    title: "삼성전자 상반기 공채 대비 모의면접",
    field: "개발",
    date: "2023-06-10T14:00:00",
    currentParticipants: 2,
    maxParticipants: 4,
    type: "technical",
    description:
      "삼성전자 개발직군 공채를 준비하는 분들과 함께 모의면접을 진행하려고 합니다. 알고리즘, 자료구조, CS 기초 지식 등을 중점적으로 다룰 예정입니다. 각자 준비한 자기소개서를 바탕으로 질문을 주고받을 예정이니 참여하실 분들은 자기소개서를 미리 준비해주세요.",
    host: {
      id: 1,
      name: "김지원",
    },
    participants: [
      {
        id: 1,
        name: "김지원",
        isHost: true,
        hasSubmittedDocs: true,
      },
      {
        id: 2,
        name: "이민수",
        isHost: false,
        hasSubmittedDocs: false,
      },
    ],
  }

  // Mock data for recommended posts
  const recommendedPosts = [
    {
      id: 3,
      title: "금융권 취업 준비 모임",
      field: "금융",
      date: "2023-06-15T10:00:00",
      currentParticipants: 3,
      maxParticipants: 5,
    },
    {
      id: 5,
      title: "IT 대기업 기술면접 대비",
      field: "개발",
      date: "2023-06-14T16:00:00",
      currentParticipants: 2,
      maxParticipants: 5,
    },
  ]

  // Calculate time left until the interview
  useEffect(() => {
    const calculateTimeLeft = () => {
      const interviewDate = new Date(post.date)
      const now = new Date()
      const difference = interviewDate.getTime() - now.getTime()

      if (difference <= 0) {
        setTimeLeft("면접 시간이 지났습니다")
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeLeft(`${days}일 ${hours}시간 남음`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}시간 ${minutes}분 남음`)
      } else {
        setTimeLeft(`${minutes}분 남음`)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [post.date])

  // Format date for display
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("ko-KR", options)
  }

  const handleJoin = () => {
    // 면접 참여 신청 페이지로 이동
    window.location.href = `/workspace/interview/group/community/${postId}/join`
  }

  const handleCreateInterview = () => {
    // 호스트만 면접 생성 및 수정 가능
    window.location.href = `/workspace/interview/group/community/create`
  }

  return (
    <>
      <HeaderWithNotifications />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/workspace/interview/group/community"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> 다대다 면접 모집으로 돌아가기
            </Link>
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge
                className={
                  post.type === "technical"
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                }
              >
                {post.type === "technical" ? "기술 면접" : "인성 면접"}
              </Badge>
              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{post.field}</Badge>
              <span className="text-gray-500 text-sm">
                • 작성자: <span className="font-medium">{post.host.name}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Interview Details */}
              <Card>
                <CardHeader>
                  <CardTitle>면접 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-[#8FD694] mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">면접 일시</h3>
                      <p className="text-gray-600">{formatDate(post.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-[#8FD694] mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">남은 시간</h3>
                      <p className="text-gray-600">{timeLeft}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-[#8FD694] mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">참여 인원</h3>
                      <p className="text-gray-600">
                        {post.currentParticipants}/{post.maxParticipants}명 참여 중
                      </p>
                    </div>
                  </div>
                  {post.description && (
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">상세 설명</h3>
                      <p className="text-gray-600 whitespace-pre-line">{post.description}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline" onClick={() => window.history.back()}>
                    뒤로 가기
                  </Button>
                  {isHost ? (
                    <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={handleCreateInterview}>
                      {post.currentParticipants > 0 ? "면접 설정 수정" : "면접 만들기"}
                    </Button>
                  ) : post.currentParticipants < post.maxParticipants ? (
                    <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={handleJoin}>
                      면접 참여 신청
                    </Button>
                  ) : (
                    <Button disabled>모집 마감</Button>
                  )}
                </CardFooter>
              </Card>

              {/* Participants */}
              <Card>
                <CardHeader>
                  <CardTitle>참여자 목록</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {post.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarFallback className="bg-[#8FD694] text-white">
                              {participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{participant.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {participant.hasSubmittedDocs ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">자료 제출 완료</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">자료 미제출</Badge>
                          )}
                          {participant.isHost && <Badge className="bg-[#8FD694] hover:bg-[#8FD694]">호스트</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Join Card */}
              <Card className="bg-[#8FD694] bg-opacity-5 border-[#8FD694] border-opacity-20">
                <CardHeader>
                  <CardTitle className="text-[#8FD694]">면접 참여하기</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    이 면접에 참여하면 다른 취업 준비생들과 함께 모의면접을 진행할 수 있습니다.
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{timeLeft}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    면접은 <span className="font-medium">{formatDate(post.date)}</span>에 자동으로 시작됩니다.
                  </p>
                </CardContent>
                <CardFooter>
                  {isHost ? (
                    <Button className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={handleCreateInterview}>
                      {post.currentParticipants > 0 ? "면접 설정 수정" : "면접 만들기"}
                    </Button>
                  ) : post.currentParticipants < post.maxParticipants ? (
                    <Button className="w-full bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={handleJoin}>
                      면접 참여 신청
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      모집 마감
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Recommended Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>추천 모집글</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedPosts.map((recPost) => (
                    <Link href={`/workspace/interview/group/community/${recPost.id}`} key={recPost.id} className="block">
                      <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <h3 className="font-medium mb-2 line-clamp-1">{recPost.title}</h3>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{recPost.field}</span>
                          <span>
                            {recPost.currentParticipants}/{recPost.maxParticipants}명
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link
                    href="/workspace/interview/group/community"
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    더 많은 모집글 보기 <ChevronRight className="inline h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

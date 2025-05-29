"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Mail, Calendar, Clock, Users, Play } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CommunityLayout } from "@/components/community-layout"
import { HeaderWithNotifications } from "@/components/header-with-notifications"

export default function InterviewsPage() {
  // Mock data for past interviews
  const pastInterviews = [
    { id: 1, title: "삼성전자 신입 공채", date: "2023-05-15", score: "A", company: "삼성전자", position: "SW개발" },
    {
      id: 2,
      title: "네이버 개발자 인턴십",
      date: "2023-04-22",
      score: "B+",
      company: "네이버",
      position: "백엔드개발",
    },
    {
      id: 3,
      title: "현대자동차 상반기 공채",
      date: "2023-03-10",
      score: "A-",
      company: "현대자동차",
      position: "IT개발",
    },
    { id: 4, title: "카카오 UX 디자이너", date: "2023-02-28", score: "S", company: "카카오", position: "UX디자인" },
  ]

  // Mock data for upcoming interviews
  const upcomingInterviews = [
    {
      id: 101,
      title: "삼성전자 상반기 공채 대비 모의면접",
      date: "2023-06-10T14:00:00",
      type: "group",
      participants: 3,
      maxParticipants: 4,
      isHost: true,
      status: "scheduled",
      field: "개발",
      company: "삼성전자",
      position: "SW개발",
    },
    {
      id: 102,
      title: "네이버 기술 면접 연습",
      date: "2023-06-15T10:00:00",
      type: "individual",
      status: "scheduled",
      field: "개발",
      company: "네이버",
      position: "백엔드개발",
    },
    {
      id: 103,
      title: "카카오 인턴십 모의면접",
      date: "2023-06-18T16:00:00",
      type: "group",
      participants: 2,
      maxParticipants: 5,
      isHost: false,
      status: "pending",
      field: "디자인",
      company: "카카오",
      position: "UX디자인",
    },
  ]

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<any>(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [interviewToDelete, setInterviewToDelete] = useState<any>(null)

  const handleInvite = (interview: any) => {
    setSelectedInterview(interview)
    setInviteDialogOpen(true)
  }

  const sendInvite = () => {
    if (!inviteEmail.trim()) {
      alert("이메일 주소를 입력해주세요.")
      return
    }

    alert(`${inviteEmail}로 초대 이메일이 성공적으로 발송되었습니다.`)
    setInviteEmail("")
    setInviteDialogOpen(false)
  }

  const handleDelete = (interview: any) => {
    setInterviewToDelete(interview)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    console.log("Deleting interview:", interviewToDelete)
    alert("면접이 성공적으로 삭제되었습니다.")
    setDeleteDialogOpen(false)
  }

  const handleStartInterview = (interview: any) => {
    // 면접 세션으로 직접 이동 (리다이렉트 없이)
    window.location.href = `/workspace/interview/session`
  }

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

  return (
    <>
      <HeaderWithNotifications />
      <CommunityLayout activeItem="home">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">내 면접 목록</h1>
              <p className="text-gray-600 mt-1">예정된 면접과 과거 면접 기록을 확인하세요.</p>
            </div>
            <Link href="/workspace/interview/start">
              <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white">
                <Plus className="mr-2 h-4 w-4" /> 새 면접 만들기
              </Button>
            </Link>
          </div>

          {/* Upcoming Interviews */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">예정된 면접</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingInterviews.map((interview) => (
                <Card key={interview.id} className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge
                        className={
                          interview.type === "individual"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                        }
                      >
                        {interview.type === "individual" ? "개인 면접" : "그룹 면접"}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{interview.field}</Badge>
                    </div>
                    <h3 className="font-medium text-lg mb-2 line-clamp-2">{interview.title}</h3>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>
                        {interview.company} • {interview.position}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(interview.date)}</span>
                    </div>
                    {interview.type === "group" && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>
                          {interview.participants}/{interview.maxParticipants}명 참여 중
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{interview.status === "scheduled" ? "예약됨" : "대기 중"}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-[#8FD694] hover:bg-[#7ac47f] text-white"
                        onClick={() => handleStartInterview(interview)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        시작
                      </Button>
                      <Link href={`/workspace/interviews/edit/${interview.id}`}>
                        <Button variant="outline" size="sm">
                          수정
                        </Button>
                      </Link>
                      {interview.isHost && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleInvite(interview)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(interview)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Past Interviews */}
          <div>
            <h2 className="text-xl font-bold mb-4">과거 면접</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastInterviews.map((interview) => (
                <Card key={interview.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">과거 면접</Badge>
                      <Badge
                        className={
                          interview.score.startsWith("A+") || interview.score === "S"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : interview.score.startsWith("A")
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {interview.score}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-lg mb-2">{interview.title}</h3>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>
                        {interview.company} • {interview.position}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{interview.date}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-[#8FD694] hover:text-[#7ac47f]">
                      결과 보기
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* 초대 다이얼로그 */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>면접 참가자 초대</DialogTitle>
              <DialogDescription>참가자의 이메일 주소를 입력하여 면접에 초대하세요.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="inviteEmail" className="text-sm font-medium">
                이메일 주소
              </Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="example@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                취소
              </Button>
              <Button className="bg-[#8FD694] hover:bg-[#7ac47f] text-white" onClick={sendInvite}>
                초대 보내기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 삭제 확인 다이얼로그 */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>면접 삭제 확인</DialogTitle>
              <DialogDescription>정말로 이 면접을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                취소
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                삭제
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CommunityLayout>
    </>
  )
}

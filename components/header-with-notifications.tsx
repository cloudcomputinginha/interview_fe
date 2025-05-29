"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: number
  type: "interview" | "system"
  message: string
  link: string
  time: string
  read: boolean
}

export function HeaderWithNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // 실제 구현에서는 API에서 알림을 가져옴
  useEffect(() => {
    // 예정된 면접이 있는지 확인 (실제로는 API에서 가져옴)
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: "interview",
        message: "삼성전자 상반기 공채 대비 모의면접이 10분 후에 시작됩니다.",
        link: "/workspace/interview/group/waiting/1",
        time: "방금 전",
        read: false,
      },
      {
        id: 2,
        type: "system",
        message: "새로운 면접 참가 요청이 있습니다.",
        link: "/workspace/interview/group/community/3",
        time: "1시간 전",
        read: false,
      },
      {
        id: 3,
        type: "interview",
        message: "면접 피드백이 도착했습니다.",
        link: "/workspace/interview/report",
        time: "어제",
        read: true,
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [])

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }

  return (
    <header className="border-b bg-white">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/workspace">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#8FD694] flex items-center justify-center">
                  <span className="text-white font-bold">AI</span>
                </div>
                <span className="font-bold text-lg">InterviewPro</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 bg-red-500 hover:bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2 border-b">
                <h3 className="font-medium">알림</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllAsRead}>
                    모두 읽음 표시
                  </Button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`p-3 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                      onClick={() => {
                        markAsRead(notification.id)
                        window.location.href = notification.link
                      }}
                    >
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">
                            {notification.type === "interview" ? "면접 알림" : "시스템 알림"}
                          </span>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-sm mt-1">{notification.message}</p>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p>새로운 알림이 없습니다.</p>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/workspace/profile" className="w-full">
                  프로필
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/workspace/settings" className="w-full">
                  설정
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/login" className="w-full">
                  로그아웃
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Home, FileText, Calendar, User, Settings, Users } from "lucide-react"

interface CommunityLayoutProps {
  children: ReactNode
  activeItem?: "home" | "community" | "documents" | "calendar" | "profile" | "settings"
}

export function CommunityLayout({ children, activeItem = "home" }: CommunityLayoutProps) {
  const menuItems = [
    {
      name: "내 면접",
      href: "/workspace/interviews",
      icon: Home,
      id: "home",
    },
    {
      name: "다대다 면접 모집",
      href: "/workspace/interview/group/community",
      icon: Users,
      id: "community",
    },
    {
      name: "이력서 / 자소서 관리",
      href: "/workspace",
      icon: FileText,
      id: "documents",
    },
    {
      name: "일정",
      href: "/workspace/calendar",
      icon: Calendar,
      id: "calendar",
    },
    {
      name: "프로필",
      href: "/workspace/profile",
      icon: User,
      id: "profile",
    },
    {
      name: "설정",
      href: "/workspace/settings",
      icon: Settings,
      id: "settings",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white hidden md:block">
        <nav className="p-4 border-b border-r border-gray-200">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 p-2 rounded-md ${activeItem === item.id
                    ? "bg-[#8FD694] bg-opacity-10 text-[#8FD694]"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}

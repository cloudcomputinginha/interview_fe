# Interview API Specification

## Overview
This document describes the REST API endpoints for the interview management system.

## Authentication
All API requests require authentication using a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## Base URL
\`\`\`
https://api.yourapp.com/api/v1
\`\`\`

## Endpoints

### 1. Create Interview
Creates a new interview (individual or group).

**Endpoint:** `POST /interviews`

**Request Headers:**
\`\`\`
Content-Type: application/json
Authorization: Bearer <token>
\`\`\`

**Request Body (Individual Interview):**
\`\`\`json
{
  "kind": "individual",
  "title": "삼성전자 SW개발 모의면접",
  "resumeId": "resume-123",
  "coverLetterId": "cl-456",
  "startType": "scheduled",
  "startAt": "2024-03-15T14:00:00Z",
  "options": {
    "voiceType": "female1",
    "interviewStyle": "technical",
    "answerDuration": 3
  }
}
\`\`\`

**Request Body (Group Interview):**
\`\`\`json
{
  "kind": "group",
  "sessionName": "네이버 신입 개발자 그룹 면접",
  "maxParticipants": 4,
  "visibility": "public",
  "participants": [
    {
      "email": "user1@example.com",
      "resumeId": "resume-123",
      "coverLetterId": "cl-456",
      "status": "invited"
    }
  ],
  "scheduledAt": "2024-03-20T10:00:00Z",
  "options": {
    "voiceType": "male1",
    "interviewStyle": "personality",
    "answerDuration": 2
  }
}
\`\`\`

**Response (Success - 201):**
\`\`\`json
{
  "id": "interview-789",
  "status": "scheduled",
  "createdAt": "2024-03-10T09:00:00Z",
  "message": "Interview created successfully"
}
\`\`\`

### 2. Get Interview Details
Retrieves details of a specific interview.

**Endpoint:** `GET /interviews/{id}`

**Response (Success - 200):**
\`\`\`json
{
  "id": "interview-789",
  "kind": "individual",
  "status": "scheduled",
  "title": "삼성전자 SW개발 모의면접",
  "resumeId": "resume-123",
  "coverLetterId": "cl-456",
  "startType": "scheduled",
  "startAt": "2024-03-15T14:00:00Z",
  "options": {
    "voiceType": "female1",
    "interviewStyle": "technical",
    "answerDuration": 3
  },
  "createdAt": "2024-03-10T09:00:00Z"
}
\`\`\`

### 3. Update Interview
Updates an existing interview.

**Endpoint:** `PUT /interviews/{id}`

**Request Body:**
\`\`\`json
{
  "title": "Updated Interview Title",
  "startAt": "2024-03-16T15:00:00Z",
  "options": {
    "voiceType": "female2",
    "interviewStyle": "personality",
    "answerDuration": 4
  }
}
\`\`\`

**Response (Success - 200):**
\`\`\`json
{
  "id": "interview-789",
  "message": "Interview updated successfully"
}
\`\`\`

### 4. Start Interview
Starts a scheduled interview.

**Endpoint:** `POST /interviews/{id}/start`

**Response (Success - 200):**
\`\`\`json
{
  "id": "interview-789",
  "status": "inProgress",
  "startedAt": "2024-03-15T14:00:00Z",
  "questions": [
    {
      "id": "question-1",
      "text": "자기소개를 해주세요.",
      "order": 1
    },
    {
      "id": "question-2", 
      "text": "지원 동기를 말씀해주세요.",
      "order": 2
    }
  ]
}
\`\`\`

### 5. Upload Answer Recording
Uploads a recorded answer for a specific question.

**Endpoint:** `POST /interviews/{id}/answers`

**Request Headers:**
\`\`\`
Content-Type: application/json
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "questionId": "question-1",
  "blobUrl": "indexeddb://interview-789-question-1",
  "duration": 120,
  "recordedAt": "2024-03-15T14:05:00Z"
}
\`\`\`

**Response (Success - 201):**
\`\`\`json
{
  "id": "answer-101",
  "questionId": "question-1",
  "status": "uploaded",
  "message": "Answer uploaded successfully"
}
\`\`\`

### 6. List Interviews
Retrieves a list of interviews for the authenticated user.

**Endpoint:** `GET /interviews`

**Query Parameters:**
- `status` (optional): Filter by status (`scheduled`, `inProgress`, `finished`)
- `kind` (optional): Filter by kind (`individual`, `group`)
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Number of results to skip (default: 0)

**Response (Success - 200):**
\`\`\`json
{
  "interviews": [
    {
      "id": "interview-789",
      "kind": "individual",
      "status": "scheduled",
      "title": "삼성전자 SW개발 모의면접",
      "startAt": "2024-03-15T14:00:00Z",
      "createdAt": "2024-03-10T09:00:00Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
\`\`\`

### 7. Apply to Group Interview
Applies to join a public group interview.

**Endpoint:** `POST /interviews/{id}/apply`

**Request Body:**
\`\`\`json
{
  "email": "applicant@example.com",
  "resumeId": "resume-456",
  "coverLetterId": "cl-789"
}
\`\`\`

**Response (Success - 201):**
\`\`\`json
{
  "participantId": "participant-123",
  "status": "applied",
  "message": "Application submitted successfully"
}
\`\`\`

### 8. Get Public Group Interviews
Retrieves a list of public group interviews available for application.

**Endpoint:** `GET /interviews/public`

**Query Parameters:**
- `limit` (optional): Number of results per page (default: 20)
- `offset` (optional): Number of results to skip (default: 0)

**Response (Success - 200):**
\`\`\`json
{
  "interviews": [
    {
      "id": "interview-456",
      "sessionName": "네이버 신입 개발자 그룹 면접",
      "maxParticipants": 4,
      "currentParticipants": 2,
      "scheduledAt": "2024-03-20T10:00:00Z",
      "options": {
        "interviewStyle": "personality",
        "answerDuration": 2
      },
      "createdAt": "2024-03-12T15:30:00Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
\`\`\`

### 9. Manage Resume
Upload and manage resumes.

**Endpoint:** `POST /resumes`

**Request Body (multipart/form-data):**
\`\`\`
file: <resume_file.pdf>
fileName: "신입개발자_이력서.pdf"
\`\`\`

**Response (Success - 201):**
\`\`\`json
{
  "id": "resume-123",
  "fileName": "신입개발자_이력서.pdf",
  "url": "/static/resumes/resume-123.pdf",
  "uploadedAt": "2024-03-10T09:00:00Z"
}
\`\`\`

**Get Resumes:** `GET /resumes`

**Response:**
\`\`\`json
{
  "resumes": [
    {
      "id": "resume-123",
      "fileName": "신입개발자_이력서.pdf",
      "url": "/static/resumes/resume-123.pdf",
      "uploadedAt": "2024-03-10T09:00:00Z"
    }
  ]
}
\`\`\`

### 10. Manage Cover Letters
Create and manage cover letters.

**Endpoint:** `POST /cover-letters`

**Request Body:**
\`\`\`json
{
  "representativeTitle": "삼성전자 SW개발직군 자기소개서",
  "content": "안녕하세요. 삼성전자 SW개발직군에 지원하는 지원자입니다..."
}
\`\`\`

**Response (Success - 201):**
\`\`\`json
{
  "id": "cl-456",
  "representativeTitle": "삼성전자 SW개발직군 자기소개서",
  "createdAt": "2024-03-10T09:00:00Z"
}
\`\`\`

**Get Cover Letters:** `GET /cover-letters`

**Response:**
\`\`\`json
{
  "coverLetters": [
    {
      "id": "cl-456",
      "representativeTitle": "삼성전자 SW개발직군 자기소개서",
      "content": "안녕하세요. 삼성전자 SW개발직군에 지원하는...",
      "createdAt": "2024-03-10T09:00:00Z"
    }
  ]
}
\`\`\`

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "error": "BAD_REQUEST",
  "message": "Invalid request data",
  "details": {
    "field": "startAt",
    "reason": "Invalid date format"
  }
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "error": "UNAUTHORIZED",
  "message": "Authentication required"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "error": "FORBIDDEN",
  "message": "Access denied"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "error": "NOT_FOUND",
  "message": "Interview not found"
}
\`\`\`

### 409 Conflict
\`\`\`json
{
  "error": "CONFLICT",
  "message": "Interview time slot already taken"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred"
}
\`\`\`

## Status Codes Summary

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 409  | Conflict |
| 500  | Internal Server Error |

## Data Models

### InterviewOptions
\`\`\`json
{
  "voiceType": "female1" | "female2" | "male1" | "male2",
  "interviewStyle": "personality" | "technical",
  "answerDuration": 1-5 // minutes
}
\`\`\`

### Participant Status
- `invited`: 초대됨 (초기 상태)
- `applied`: 신청완료 (사용자가 신청)
- `accepted`: 승인됨 (호스트가 승인)

### Interview Status
- `scheduled`: 예약됨
- `inProgress`: 진행중
- `finished`: 완료됨

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. File uploads use multipart/form-data
3. Recording blobs are stored in IndexedDB on the client side
4. The `blobUrl` in answer uploads references the IndexedDB location
5. Group interview participants can have different statuses
6. Only public group interviews appear in the `/interviews/public` endpoint
7. Authentication is required for all endpoints
8. Rate limiting may apply (implementation specific)
\`\`\`

마지막으로 내 면접 페이지를 수정하여 시작/수정 버튼을 분리하겠습니다:

```tsx file="app/workspace/interviews/page.tsx"
[v0-no-op-code-block-prefix]"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Play, Edit } from 'lucide-react'

interface Interview {
  id: string
  title: string
  createdAt: string
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const router = useRouter()

  useEffect(() => {
    // Fetch interviews from API
    const fetchInterviews = async () => {
      try {
        const response = await fetch("/api/interviews")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setInterviews(data)
      } catch (error) {
        console.error("Failed to fetch interviews:", error)
      }
    }

    fetchInterviews()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">인터뷰 목록</h1>
        <Button onClick={() => router.push("/workspace/interviews/new")}>
          새 인터뷰 생성
        </Button>
      </div>

      <Table>
        <TableCaption>인터뷰 목록을 확인하고 관리합니다.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow key={interview.id}>
              <TableCell className="font-medium">{interview.id}</TableCell>
              <TableCell>{interview.title}</TableCell>
              <TableCell>{interview.createdAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/workspace/interviews/edit/${interview.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    수정
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      // Start interview logic
                      router.push(`/workspace/interview/${interview.id}`)
                    }}
                    className="bg-[#8FD694] hover:bg-[#7ac47f]"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    시작
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

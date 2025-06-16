import { useEffect, useRef, useState } from "react";
import EventSourcePolyfill from "eventsource";

interface Notification {
  type: string;
  message: string;
  url: string;
  createdAt: string;
}

/**
 * /notifications/subscribe SSE로부터 알림을 받아오는 커스텀 훅
 * Last-Event-ID를 지원하여 새로고침/재연결 시 누락 없이 이어받음
 * @returns { notifications: Notification[] }
 */
function useSseNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const eventSourceRef = useRef<any>(null);

  useEffect(() => {
    const lastEventId = localStorage.getItem("lastEventId");
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/subscribe`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
    };
    if (lastEventId) headers["Last-Event-ID"] = lastEventId;

    const eventSource = new EventSourcePolyfill(url, { headers });
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        setNotifications((prev) => [data, ...prev]);
        // 이벤트 ID 저장
        if (event.lastEventId) {
          localStorage.setItem("lastEventId", event.lastEventId);
        }
      } catch (e) {
        console.error("SSE 알림 파싱 오류:", e);
      }
    };

    eventSource.onerror = (err: Event) => {
      console.error("SSE 연결 오류:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { notifications };
}

export default useSseNotifications;

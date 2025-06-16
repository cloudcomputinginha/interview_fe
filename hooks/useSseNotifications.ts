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
 * @returns { notifications: Notification[] }
 */
function useSseNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const eventSourceRef = useRef<any>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/subscribe`;
    const newEventSource = new EventSourcePolyfill(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const eventSource = newEventSource;
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        // 최신 알림이 위로 오도록
        setNotifications((prev) => [data, ...prev]);
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

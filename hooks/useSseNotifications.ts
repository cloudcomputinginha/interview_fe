import { useEffect, useRef, useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

interface Notification {
  type: string;
  message: string;
  url: string;
  createdAt: string;
}

/**
 * /notifications/subscribe SSE로부터 알림을 받아오는 커스텀 훅
 * Last-Event-ID를 지원하여 새로고침/재연결 시 누락 없이 이어받음
 * @returns { notifications: Notification[], sseConnected: boolean }
 */
function useSseNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sseConnected, setSseConnected] = useState(false);
  const eventSourceRef = useRef<any>(null);

  useEffect(() => {
    const lastEventId = localStorage.getItem("lastEventId");
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/${process.env.NEXT_PUBLIC_SSE_SUBSCRIBE_PATH}`;

    console.log(lastEventId);

    const eventSource = new EventSourcePolyfill(url, {
      headers: {
        "Content-Type": "text/event-stream",
        Authorization: `Bearer ${accessToken}`,
        "Last-Event-Id": lastEventId,
      },
      withCredentials: true,
    });
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const rawData = event.data;
        if (event.data === "ping") return;
        if (rawData.includes("EventStream created. ")) {
          setSseConnected(true);
        }
        if (event.lastEventId) {
          localStorage.setItem("lastEventId", event.lastEventId);
        }
        const data = JSON.parse(event.data);
        setNotifications((prev) => [data, ...prev]);

        // 연결 신호 메시지라면 연결 상태를 true로
        if (
          event.data &&
          typeof event.data === "string" &&
          event.data.startsWith("EventStream created")
        ) {
          setSseConnected(true);
        }
      } catch (e) {
        // 그 외는 무시
      }
    };

    eventSource.onerror = (err: Event) => {
      console.error("SSE 연결 오류:", err);
      setSseConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { notifications, sseConnected };
}

export default useSseNotifications;

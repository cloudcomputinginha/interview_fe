import { useEffect, useRef, useState } from "react";
import EventSourcePolyfill from "eventsource";

/**
 * /notifications/subscribe SSE로부터 알림을 받아오는 커스텀 훅
 * @returns { messages: string[] }
 */
function useSseNotifications() {
  const [messages, setMessages] = useState<string[]>([]);
  const eventSourceRef = useRef<any>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const url = "https://interview.play-qr.site/notifications/subscribe";
    const newEventSource = new EventSourcePolyfill(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const eventSource = newEventSource;
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event: MessageEvent) => {
      setMessages((prev) => [...prev, event.data]);
    };

    eventSource.onerror = (err: Event) => {
      console.error("SSE 연결 오류:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { messages };
}

export default useSseNotifications;

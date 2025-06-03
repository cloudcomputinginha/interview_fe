// api/ai-interview-socket.ts

type MessageHandler = (data: any) => void;

export class AIInterviewWebSocket {
  private socket: WebSocket | null = null;
  private url: string;
  private onMessageHandler: MessageHandler | null = null;

  constructor() {
    this.url = process.env.NEXT_PUBLIC_AI_WEBSOCKET_URL as string;
    if (!this.url)
      throw new Error("NEXT_PUBLIC_AI_WEBSOCKET_URL 환경변수가 필요합니다.");
  }

  connect() {
    if (this.socket) return;
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => {
      // 연결 성공
    };
    this.socket.onmessage = (event) => {
      if (this.onMessageHandler) {
        try {
          const data = JSON.parse(event.data);
          this.onMessageHandler(data);
        } catch {
          this.onMessageHandler(event.data);
        }
      }
    };
    this.socket.onclose = () => {
      this.socket = null;
    };
    this.socket.onerror = (e) => {
      // 에러 처리
    };
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  send(data: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(typeof data === "string" ? data : JSON.stringify(data));
  }

  onMessage(handler: MessageHandler) {
    this.onMessageHandler = handler;
  }

  isConnected() {
    return !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }
}

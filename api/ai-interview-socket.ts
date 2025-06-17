export type AIInterviewSocketMessage = {
  text?: string;
  [key: string]: any;
};

export type AIInterviewSocketHandler = (data: AIInterviewSocketMessage) => void;

export class AIInterviewSocket {
  private socket: WebSocket | null = null;
  private handler: AIInterviewSocketHandler | null = null;

  connect(
    interviewId: string,
    memberInterviewId: string,
    qIndex: number,
    fIndex: number,
    sessionId: string
  ) {
    if (this.socket) return;
    const baseUrl = process.env.NEXT_PUBLIC_AI_WEBSOCKET_URL;
    if (!baseUrl)
      throw new Error("NEXT_PUBLIC_AI_WEBSOCKET_URL 환경변수가 필요합니다.");
    const url = `${baseUrl}?interview_id=${interviewId}&member_interview_id=${memberInterviewId}&session_id=${sessionId}&index=${qIndex}&f_index=${fIndex}`;
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => {
      if (this.handler) {
        try {
          const data = JSON.parse(event.data);
          this.handler(data);
        } catch {
          this.handler({ text: event.data });
        }
      }
    };
    this.socket.onclose = () => {
      this.socket = null;
    };
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  sendAudio(blob: Blob) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    blob.arrayBuffer().then((buffer) => {
      this.socket?.send(buffer);
    });
  }

  onMessage(handler: AIInterviewSocketHandler) {
    this.handler = handler;
  }

  isConnected() {
    return !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }
}

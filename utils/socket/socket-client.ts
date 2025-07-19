// @ts-ignore
import SockJS from 'sockjs-client'
// @ts-ignore
import {
	Client,
	IMessage,
	StompSubscription,
	StompConfig,
	Stomp,
	IFrame,
} from '@stomp/stompjs'

const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_SOCKET_URL as string

export type MessageCallback = (message: IMessage) => void

export class SocketClient {
	private client: Client
	private subscriptions: StompSubscription[] = []
	private connected = false

	constructor(url: string = SOCKET_URL) {
		this.client = new Client({
			brokerURL: undefined, // SockJS 사용 시 undefined
			webSocketFactory: () => new SockJS(url),
			reconnectDelay: 5000,
			debug: (str: string) => {},
		})
	}

	connect(onConnect?: () => void, onError?: (err: any) => void) {
		if (this.connected) return
		this.client.onConnect = () => {
			this.connected = true
			onConnect && onConnect()
		}
		this.client.onStompError = (frame: IFrame) => {
			onError && onError(frame)
		}
		this.client.activate()
	}

	disconnect() {
		if (!this.connected) return
		this.subscriptions.forEach(sub => sub.unsubscribe())
		this.client.deactivate()
		this.connected = false
	}

	subscribe(destination: string, callback: MessageCallback) {
		if (!this.connected) throw new Error('Socket not connected')
		const sub = this.client.subscribe(destination, callback)
		this.subscriptions.push(sub)
		return sub
	}

	unsubscribeAll() {
		this.subscriptions.forEach(sub => sub.unsubscribe())
		this.subscriptions = []
	}

	send(destination: string, body: any) {
		if (!this.connected) throw new Error('Socket not connected')
		this.client.publish({ destination, body: JSON.stringify(body) })
	}

	isConnected() {
		return this.connected
	}
}

// 싱글턴 인스턴스 (필요시 여러 인스턴스 생성 가능)
export const socketClient = new SocketClient()

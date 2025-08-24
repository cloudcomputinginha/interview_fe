export interface MultiSessionMessage {
	type: 'state' | 'stt_text' | 'stt_status' | 'finished'
	index?: number
	active_pid?: number
	f_index_current?: number
	order?: string[]
	participant_f_index?: Record<string, number>
	text?: string
	participant_id?: string
	f_index?: number
	status?: 'processing' | 'end'
}

export interface MultiSessionControlMessage {
	type: 'advance' | 'set_order' | 'set_active'
	order?: string[]
	participant_id?: string
}

export type MultiSessionMessageHandler = (data: MultiSessionMessage) => void
export type MultiSessionCloseHandler = (code: number, reason: string) => void

export class AIInterviewMultiSocket {
	private socket: WebSocket | null = null
	private messageHandler: MultiSessionMessageHandler | null = null
	private closeHandler: MultiSessionCloseHandler | null = null
	private isConnecting = false
	private reconnectAttempts = 0
	private maxReconnectAttempts = 3

	connectMulti(
		sessionId: string,
		participantId: string,
		mode: 'team' = 'team'
	) {
		if (this.socket || this.isConnecting) {
			console.log('멀티 세션 WebSocket 이미 연결 중이거나 연결됨')
			return
		}

		const baseUrl = process.env.NEXT_PUBLIC_AI_WEBSOCKET_URL
		if (!baseUrl) {
			console.error('NEXT_PUBLIC_AI_WEBSOCKET_URL 환경변수가 설정되지 않음')
			throw new Error('NEXT_PUBLIC_AI_WEBSOCKET_URL 환경변수가 필요합니다.')
		}

		console.log(`멀티 세션 WebSocket 연결 시도:`, {
			baseUrl,
			sessionId,
			participantId,
			mode,
		})
		this.isConnecting = true

		const url = `${baseUrl}?session_id=${sessionId}&participant_id=${participantId}&mode=${mode}`
		console.log('멀티 세션 WebSocket URL:', url)

		this.socket = new WebSocket(url)

		this.socket.onopen = () => {
			console.log('✅ 멀티 세션 WebSocket 연결 성공')
			this.isConnecting = false
			this.reconnectAttempts = 0
		}

		this.socket.onmessage = event => {
			console.log('📨 멀티 세션 WebSocket 메시지 수신:', {
				data: event.data,
				type: typeof event.data,
				timestamp: new Date().toISOString(),
			})
			if (this.messageHandler) {
				try {
					const data = JSON.parse(event.data)
					console.log('📨 파싱된 메시지:', data)
					this.messageHandler(data)
				} catch (error) {
					console.log('📨 텍스트 메시지로 처리:', event.data)
					this.messageHandler({ type: 'stt_text', text: event.data })
				}
			}
		}

		this.socket.onclose = event => {
			console.log(`❌ 멀티 세션 WebSocket 연결 종료:`, {
				code: event.code,
				reason: event.reason,
				wasClean: event.wasClean,
			})

			if (this.closeHandler) {
				this.closeHandler(event.code, event.reason)
			}

			this.socket = null
			this.isConnecting = false

			// 재연결 로직
			if (
				event.code !== 1000 &&
				this.reconnectAttempts < this.maxReconnectAttempts
			) {
				this.reconnectAttempts++
				const delay = Math.min(
					1000 * Math.pow(2, this.reconnectAttempts - 1),
					10000
				)
				console.log(
					`🔄 멀티 세션 WebSocket 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts} (${delay}ms 후)`
				)
				setTimeout(() => {
					this.connectMulti(sessionId, participantId, mode)
				}, delay)
			}
		}

		this.socket.onerror = error => {
			console.error('💥 멀티 세션 WebSocket 연결 에러:', error)
			this.isConnecting = false
		}
	}

	disconnect() {
		if (this.socket) {
			console.log('멀티 세션 WebSocket 연결 해제')
			this.socket.close(1000, 'Client disconnect')
			this.socket = null
		}
		this.isConnecting = false
		this.reconnectAttempts = 0
	}

	sendAudio(blob: Blob) {
		if (!this.socket) {
			console.warn('❌ 멀티 세션 WebSocket 인스턴스가 없어 오디오 전송 실패')
			return
		}

		if (this.socket.readyState !== WebSocket.OPEN) {
			console.warn('❌ 멀티 세션 WebSocket이 연결되지 않아 오디오 전송 실패', {
				readyState: this.socket.readyState,
				readyStateText: ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][
					this.socket.readyState
				],
			})
			return
		}

		console.log('🎤 멀티 세션 오디오 전송 중...', { blobSize: blob.size })
		blob
			.arrayBuffer()
			.then(buffer => {
				try {
					this.socket?.send(buffer)
					console.log('✅ 멀티 세션 오디오 전송 완료', {
						bufferSize: buffer.byteLength,
					})
				} catch (error) {
					console.error('💥 멀티 세션 오디오 전송 에러:', error)
				}
			})
			.catch(error => {
				console.error('💥 멀티 세션 오디오 버퍼 변환 에러:', error)
			})
	}

	sendControl(message: MultiSessionControlMessage) {
		if (!this.socket) {
			console.warn(
				'❌ 멀티 세션 WebSocket 인스턴스가 없어 제어 메시지 전송 실패'
			)
			return
		}

		if (this.socket.readyState !== WebSocket.OPEN) {
			console.warn(
				'❌ 멀티 세션 WebSocket이 연결되지 않아 제어 메시지 전송 실패',
				{
					readyState: this.socket.readyState,
					readyStateText: ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][
						this.socket.readyState
					],
				}
			)
			return
		}

		try {
			const messageStr = JSON.stringify(message)
			console.log('📤 멀티 세션 제어 메시지 전송:', {
				message,
				messageString: messageStr,
				readyState: this.socket.readyState,
				url: this.socket.url,
			})

			this.socket.send(messageStr)
			console.log('✅ 멀티 세션 제어 메시지 전송 완료:', message)
		} catch (error) {
			console.error('💥 멀티 세션 제어 메시지 전송 에러:', error)
		}
	}

	onMessage(handler: MultiSessionMessageHandler) {
		this.messageHandler = handler
	}

	onClose(handler: MultiSessionCloseHandler) {
		this.closeHandler = handler
	}

	isConnected() {
		return !!this.socket && this.socket.readyState === WebSocket.OPEN
	}
}

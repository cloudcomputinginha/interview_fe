export type AIInterviewSocketMessage = {
	text?: string
	[key: string]: any
}

export type AIInterviewSocketHandler = (data: AIInterviewSocketMessage) => void

export class AIInterviewSocket {
	private socket: WebSocket | null = null
	private handler: AIInterviewSocketHandler | null = null
	private isConnecting = false
	private reconnectAttempts = 0
	private maxReconnectAttempts = 3

	connect(
		interviewId: string,
		memberInterviewId: string,
		qIndex: number,
		fIndex: number,
		sessionId: string
	) {
		if (this.socket || this.isConnecting) {
			console.log('WebSocket 이미 연결 중이거나 연결됨')
			return
		}

		const baseUrl = process.env.NEXT_PUBLIC_AI_WEBSOCKET_URL
		if (!baseUrl) {
			console.error('NEXT_PUBLIC_AI_WEBSOCKET_URL 환경변수가 설정되지 않음')
			throw new Error('NEXT_PUBLIC_AI_WEBSOCKET_URL 환경변수가 필요합니다.')
		}

		console.log(`WebSocket 연결 시도:`, {
			baseUrl,
			sessionId,
			interviewId,
			memberInterviewId,
			qIndex,
			fIndex,
		})
		this.isConnecting = true

		const url = `${baseUrl}?interview_id=${interviewId}&member_interview_id=${memberInterviewId}&session_id=${sessionId}&index=${qIndex}&f_index=${fIndex}`
		console.log('WebSocket URL:', url)

		this.socket = new WebSocket(url)

		this.socket.onopen = () => {
			console.log('✅ WebSocket 연결 성공')
			this.isConnecting = false
			this.reconnectAttempts = 0
		}

		this.socket.onmessage = event => {
			console.log('📨 WebSocket 메시지 수신:', event.data)
			if (this.handler) {
				try {
					const data = JSON.parse(event.data)
					this.handler(data)
				} catch {
					this.handler({ text: event.data })
				}
			}
		}

		this.socket.onclose = event => {
			console.log(`❌ WebSocket 연결 종료:`, {
				code: event.code,
				reason: event.reason,
				wasClean: event.wasClean,
			})

			// 서버 오류 코드별 처리
			switch (event.code) {
				case 1000: // 정상 종료
					console.log('✅ WebSocket 정상 종료')
					break
				case 1011: // 서버 내부 오류
					console.error('💥 서버 내부 오류로 연결이 끊어졌습니다')
					break
				case 1006: // 비정상 종료
					console.error('💥 WebSocket 비정상 종료')
					break
				default:
					console.error(`💥 WebSocket 오류 코드: ${event.code}`)
			}

			this.socket = null
			this.isConnecting = false

			// 정상적인 종료가 아닌 경우 재연결 시도
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
					`🔄 WebSocket 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts} (${delay}ms 후)`
				)
				setTimeout(() => {
					this.connect(
						interviewId,
						memberInterviewId,
						qIndex,
						fIndex,
						sessionId
					)
				}, delay)
			} else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
				console.error('❌ WebSocket 최대 재연결 시도 횟수 초과')
			}
		}

		this.socket.onerror = error => {
			console.error('💥 WebSocket 연결 에러:', error)
			console.error('💥 WebSocket URL:', this.socket?.url)
			console.error('💥 WebSocket ReadyState:', this.socket?.readyState)
			this.isConnecting = false
		}
	}

	disconnect() {
		if (this.socket) {
			console.log('WebSocket 연결 해제')
			this.socket.close(1000, 'Client disconnect')
			this.socket = null
		}
		this.isConnecting = false
		this.reconnectAttempts = 0
	}

	sendAudio(blob: Blob) {
		if (!this.socket) {
			console.warn('❌ WebSocket 인스턴스가 없어 오디오 전송 실패')
			return
		}

		if (this.socket.readyState !== WebSocket.OPEN) {
			console.warn('❌ WebSocket이 연결되지 않아 오디오 전송 실패', {
				readyState: this.socket.readyState,
				readyStateText: ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][
					this.socket.readyState
				],
			})
			return
		}

		console.log('🎤 오디오 전송 중...', { blobSize: blob.size })
		blob
			.arrayBuffer()
			.then(buffer => {
				try {
					this.socket?.send(buffer)
					console.log('✅ 오디오 전송 완료', { bufferSize: buffer.byteLength })
				} catch (error) {
					console.error('💥 오디오 전송 에러:', error)
				}
			})
			.catch(error => {
				console.error('💥 오디오 버퍼 변환 에러:', error)
			})
	}

	onMessage(handler: AIInterviewSocketHandler) {
		this.handler = handler
	}

	isConnected() {
		return !!this.socket && this.socket.readyState === WebSocket.OPEN
	}
}

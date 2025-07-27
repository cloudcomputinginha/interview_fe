export type AIInterviewSocketMessage = {
	text?: string
	[key: string]: any
}

export type AIInterviewSocketHandler = (data: AIInterviewSocketMessage) => void
export type AIInterviewSocketCloseHandler = (
	code: number,
	reason: string
) => void

export class AIInterviewSocket {
	private socket: WebSocket | null = null
	private handler: AIInterviewSocketHandler | null = null
	private closeHandler: AIInterviewSocketCloseHandler | null = null
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

			// IANA WebSocket Close Code Registry에 따른 상세 에러 메시지
			const getCloseCodeMessage = (code: number): string => {
				switch (code) {
					// 표준 WebSocket 종료 코드
					case 1000:
						return '정상 종료 (Normal Closure)'
					case 1001:
						return '클라이언트가 떠남 (Going Away)'
					case 1002:
						return '프로토콜 오류 (Protocol Error)'
					case 1003:
						return '지원하지 않는 데이터 타입 (Unsupported Data)'
					case 1004:
						return '예약됨 (Reserved)'
					case 1005:
						return '상태 코드 없음 (No Status Received)'
					case 1006:
						return '비정상 종료 (Abnormal Closure)'
					case 1007:
						return '일관성 없는 데이터 타입 (Invalid frame payload data)'
					case 1008:
						return '정책 위반 (Policy Violation)'
					case 1009:
						return '메시지가 너무 큼 (Message Too Big)'
					case 1010:
						return '클라이언트 확장 필요 (Client Extension Required)'
					case 1011:
						return '서버 내부 오류 (Internal Error)'
					case 1012:
						return '서비스 재시작 (Service Restart)'
					case 1013:
						return '일시적인 조건 (Try Again Later)'
					case 1014:
						return '잘못된 게이트웨이 (Bad Gateway)'
					case 1015:
						return 'TLS 핸드셰이크 실패 (TLS Handshake)'

					// 확장된 종료 코드 (3000-3999)
					case 3000:
						return '인증 실패 (Unauthorized)'
					case 3003:
						return '접근 금지 (Forbidden)'
					case 3008:
						return '시간 초과 (Timeout)'

					// 알 수 없는 코드
					default:
						if (code >= 4000 && code <= 4999) {
							return `개인용 종료 코드 (Private Use): ${code}`
						}
						return `알 수 없는 종료 코드: ${code}`
				}
			}

			const errorMessage = getCloseCodeMessage(event.code)
			console.error(`💥 WebSocket 종료 상세: ${errorMessage}`)

			// 종료 핸들러 호출
			if (this.closeHandler) {
				this.closeHandler(event.code, event.reason)
			}

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
				case 1002: // 프로토콜 오류
					console.error('💥 WebSocket 프로토콜 오류')
					break
				case 1008: // 정책 위반
					console.error('💥 WebSocket 정책 위반')
					break
				case 1009: // 메시지가 너무 큼
					console.error('💥 WebSocket 메시지 크기 초과')
					break
				case 3000: // 인증 실패
					console.error('💥 WebSocket 인증 실패')
					break
				case 3003: // 접근 금지
					console.error('💥 WebSocket 접근 금지')
					break
				case 3008: // 시간 초과
					console.error('💥 WebSocket 시간 초과')
					break
				default:
					console.error(
						`💥 WebSocket 오류 코드: ${event.code} - ${errorMessage}`
					)
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
				console.log(`🔄 종료 코드: ${event.code} - ${errorMessage}`)
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
				console.error(`❌ 최종 종료 코드: ${event.code} - ${errorMessage}`)
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

	onClose(handler: AIInterviewSocketCloseHandler) {
		this.closeHandler = handler
	}

	isConnected() {
		return !!this.socket && this.socket.readyState === WebSocket.OPEN
	}
}

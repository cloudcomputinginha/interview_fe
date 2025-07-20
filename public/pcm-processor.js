// 음성 변환하는데 필요한 엔진입니다. 삭제시 음성 전송 불가
class PCMProcessor extends AudioWorkletProcessor {
	process(inputs, outputs, parameters) {
		const input = inputs[0]
		if (input && input[0]) {
			this.port.postMessage(input[0])
		}
		return true
	}
}
registerProcessor('pcm-processor', PCMProcessor)

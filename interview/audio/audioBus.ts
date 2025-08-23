// interview/audio/AudioBus.ts
type Listener = (s: AudioBusState) => void

export type AudioBusState = {
	status: 'idle' | 'buffering' | 'playing' | 'error'
	label?: string
	url?: string
}

class _AudioBus {
	private audioEl: HTMLAudioElement | null = null
	private listeners = new Set<Listener>()
	private state: AudioBusState = { status: 'idle' }
	private currentUrl?: string
	private cache = new Map<string, string>() // src -> objectURL

	attach(el: HTMLAudioElement) {
		this.audioEl = el
		el.onplaying = () =>
			this.set({
				status: 'playing',
				url: this.currentUrl,
				label: this.state.label,
			})
		el.onwaiting = () =>
			this.set({
				status: 'buffering',
				url: this.currentUrl,
				label: this.state.label,
			})
		el.onpause = () =>
			this.set({
				status: 'idle',
				url: this.currentUrl,
				label: this.state.label,
			})
		el.onerror = () =>
			this.set({
				status: 'error',
				url: this.currentUrl,
				label: this.state.label,
			})
	}

	detach() {
		this.audioEl = null
	}

	subscribe(fn: Listener) {
		this.listeners.add(fn)
		fn(this.state)
		return () => this.listeners.delete(fn)
	}

	private set(s: AudioBusState) {
		this.state = s
		this.listeners.forEach(fn => fn(s))
	}

	async preload(src: string): Promise<string> {
		if (this.cache.has(src)) return this.cache.get(src)!
		const res = await fetch(src)
		const blob = await res.blob()
		const url = URL.createObjectURL(blob)
		this.cache.set(src, url)
		return url
	}

	async play(src: string, label?: string) {
		if (!this.audioEl) return
		this.set({ status: 'buffering', label, url: src })
		this.currentUrl = src
		try {
			const objectUrl = await this.preload(src)
			this.audioEl.src = objectUrl
			await this.audioEl.play()
		} catch {
			this.set({ status: 'error', label, url: src })
		}
	}

	stop() {
		if (!this.audioEl) return
		this.audioEl.pause()
	}
}

export const AudioBus = new _AudioBus()

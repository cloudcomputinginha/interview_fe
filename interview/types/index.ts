export type PollingStatus =
	| 'initial'
	| 'fetching_base'
	| 'generating_sessions'
	| 'polling_missing'
	| 'polling_all'
	| 'complete'
	| 'failed'

export type BootstrapOptions = {
	intervalMs?: number
	maxAttempts?: number
}
export type OnProgressCallback = (status: PollingStatus) => void

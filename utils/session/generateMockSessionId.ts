export const generateMockSessionId = () =>
	String(Math.floor(Math.random() * 100_000_000) + 1)

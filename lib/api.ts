export async function post<T>(url: string, data: unknown): Promise<T> {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}

	return response.json()
}

export interface IndividualRes {
	id: string
	status: string
}

export interface GroupRes {
	id: string
	status: string
}

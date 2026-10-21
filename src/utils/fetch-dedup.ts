const pendingFetches = new Map<string, Promise<unknown>>();

export function fetchWithDedup<T>(url: string): Promise<T> {
	const pending = pendingFetches.get(url);
	if (pending) return pending as Promise<T>;

	const promise = fetch(url).then((r) => {
		if (!r.ok) throw new Error("Failed to fetch");
		return r.json() as Promise<T>;
	});
	pendingFetches.set(url, promise);
	promise.finally(() => pendingFetches.delete(url));
	return promise;
}

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, init);

  if (!response.ok) {
    const fallback = `${response.status} ${response.statusText}`;
    let message = fallback;

    try {
      const data = (await response.json()) as Record<string, unknown>;
      if ("message" in data && typeof data.message === "string") {
        message = data.message;
      }
    } catch {
      // use fallback
    }

    throw new ApiError(response.status, message);
  }

  return (await response.json()) as T;
}

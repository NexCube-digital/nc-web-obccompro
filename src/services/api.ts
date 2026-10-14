import axios, { type InternalAxiosRequestConfig } from "axios";

export const AUTH_SESSION_KEY = "obc.auth.session";

interface StoredSession {
	accessToken: string;
	refreshToken: string;
	user: unknown;
}

interface ApiSuccess<T> {
	success: true;
	data: T;
}

interface TokenPair {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}

type RetriableRequest = InternalAxiosRequestConfig & { authRetry?: boolean };

interface ApiErrorBody {
	error?: string;
	message?: string;
}

export class ApiError extends Error {
	readonly status?: number;
	readonly code?: string;

	constructor(message: string, status?: number, code?: string) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
	}
}

export function getStoredAuthSession<T>(): T | null {
	if (typeof window === "undefined") return null;

	for (const storage of [window.sessionStorage, window.localStorage]) {
		const serialized = storage.getItem(AUTH_SESSION_KEY);
		if (!serialized) continue;

		try {
			return JSON.parse(serialized) as T;
		} catch {
			storage.removeItem(AUTH_SESSION_KEY);
		}
	}

	return null;
}

export function storeAuthSession<T>(session: T, rememberMe: boolean): void {
	if (typeof window === "undefined") return;

	window.sessionStorage.removeItem(AUTH_SESSION_KEY);
	window.localStorage.removeItem(AUTH_SESSION_KEY);
	const storage = rememberMe ? window.localStorage : window.sessionStorage;
	storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
	if (typeof window === "undefined") return;

	window.sessionStorage.removeItem(AUTH_SESSION_KEY);
	window.localStorage.removeItem(AUTH_SESSION_KEY);
}

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
	timeout: 15_000,
	headers: { "Content-Type": "application/json" },
});

let refreshInFlight: Promise<void> | null = null;

apiClient.interceptors.request.use((config) => {
	if (typeof window === "undefined") return config;

	const isPublicAuthRequest = ["/auth/login", "/auth/refresh", "/auth/logout"]
		.some((path) => config.url?.includes(path));
	const session = getStoredAuthSession<StoredSession>();

	if (!isPublicAuthRequest && session?.accessToken) {
		config.headers.Authorization = `Bearer ${session.accessToken}`;
	}

	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error: unknown) => {
		if (axios.isAxiosError<ApiErrorBody>(error)) {
			const request = error.config as RetriableRequest | undefined;
			const isPublicAuthRequest = ["/auth/login", "/auth/refresh", "/auth/logout"]
				.some((path) => request?.url?.includes(path));

			if (error.response?.status === 401 && request && !request.authRetry && !isPublicAuthRequest) {
				request.authRetry = true;
				try {
					if (!refreshInFlight) {
						refreshInFlight = refreshSession();
					}
					await refreshInFlight;
					const session = getStoredAuthSession<StoredSession>();
					if (!session) throw new Error("Sesi tidak tersedia.");
					request.headers.Authorization = `Bearer ${session.accessToken}`;
					return apiClient(request);
				} catch {
					clearAuthSession();
				} finally {
					refreshInFlight = null;
				}
			}

			const message = error.response?.data?.message ??
				(error.response
					? "Permintaan tidak dapat diproses. Silakan coba lagi."
					: "Tidak dapat terhubung ke server. Periksa koneksi Anda.");

			return Promise.reject(
				new ApiError(message, error.response?.status, error.response?.data?.error),
			);
		}

		return Promise.reject(error);
	},
);

async function refreshSession(): Promise<void> {
	const session = getStoredAuthSession<StoredSession>();
	if (!session?.refreshToken) throw new Error("Refresh token tidak tersedia.");

	const response = await apiClient.post<ApiSuccess<TokenPair>>("/auth/refresh", {
		refreshToken: session.refreshToken,
	});
	storeAuthSession({ ...session, ...response.data.data }, window.localStorage.getItem(AUTH_SESSION_KEY) !== null);
}

export function getApiErrorMessage(error: unknown): string {
	return error instanceof Error
		? error.message
		: "Terjadi kesalahan. Silakan coba lagi.";
}

export default apiClient;

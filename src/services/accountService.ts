import apiClient, {
	AUTH_SESSION_KEY,
	getStoredAuthSession,
	storeAuthSession,
} from "./api";

export interface AccountProfile {
	id: string;
	email: string;
	name: string;
	phone: string | null;
	bio: string | null;
	avatarUrl: string | null;
	role: string;
	tenantId: string | null;
	status?: string;
	lastLoginAt?: string;
}

export function getProfilePhotoUrl(avatarUrl: string): string {
	try {
		const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
		const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;
		return new URL(avatarUrl, apiOrigin).toString();
	} catch {
		return avatarUrl;
	}
}

interface ApiSuccess<T> {
	success: true;
	data: T;
}

function syncProfileSession(profile: AccountProfile): void {
	const session = getStoredAuthSession<{
		accessToken: string;
		refreshToken: string;
		expiresIn: number;
		user: Record<string, unknown>;
	}>();

	if (session && typeof window !== "undefined") {
		storeAuthSession(
			{ ...session, user: { ...session.user, ...profile } },
			window.localStorage.getItem(AUTH_SESSION_KEY) !== null,
		);
		window.dispatchEvent(new Event("obc:auth-session-updated"));
	}
}

export async function getProfile(): Promise<AccountProfile> {
	const response = await apiClient.get<ApiSuccess<AccountProfile>>("/auth/profile");
	return response.data.data;
}

export async function updateProfile(payload: {
	name: string;
	phone: string | null;
	bio: string | null;
}): Promise<AccountProfile> {
	const response = await apiClient.put<ApiSuccess<AccountProfile>>(
		"/auth/profile",
		payload,
	);
	const profile = response.data.data;
	syncProfileSession(profile);
	return profile;
}

export async function uploadProfilePhoto(file: File): Promise<AccountProfile> {
	const formData = new FormData();
	formData.append("photo", file);
	const response = await apiClient.put<ApiSuccess<AccountProfile>>(
		"/auth/profile",
		formData,
		{ headers: { "Content-Type": "multipart/form-data" } },
	);
	const profile = response.data.data;
	syncProfileSession(profile);
	return profile;
}

export async function changePassword(
	currentPassword: string,
	newPassword: string,
): Promise<void> {
	await apiClient.put<ApiSuccess<{ message: string }>>("/auth/password", {
		currentPassword,
		newPassword,
	});
}

import apiClient, {
	clearAuthSession,
	getStoredAuthSession,
	storeAuthSession,
} from "./api";

export interface StaffProfile {
	id: string;
	email: string;
	name: string;
	role: string;
	tenantId: string | null;
	lastLoginAt: string;
}

export interface AuthSession {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	user: StaffProfile;
}

interface ApiSuccess<T> {
	success: true;
	data: T;
}

interface LoginCredentials {
	email: string;
	password: string;
}

export const authService = {
	getCurrentSession(): AuthSession | null {
		return getStoredAuthSession<AuthSession>();
	},

	async login(
		credentials: LoginCredentials,
		rememberMe: boolean,
	): Promise<StaffProfile> {
		const response = await apiClient.post<ApiSuccess<AuthSession>>(
			"/auth/login",
			credentials,
		);
		const session = response.data.data;

		storeAuthSession(session, rememberMe);
		return session.user;
	},

	async logout(): Promise<void> {
		const session = getStoredAuthSession<AuthSession>();

		try {
			if (session?.refreshToken) {
				await apiClient.post("/auth/logout", {
					refreshToken: session.refreshToken,
				});
			}
		} finally {
			clearAuthSession();
		}
	},
};

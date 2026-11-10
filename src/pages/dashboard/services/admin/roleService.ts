import apiClient from "../../../../services/api";

export interface RolePermission {
	id: string;
	role: string;
	permissions: string[];
	updatedAt: string;
}

interface ApiSuccess<T> {
	data: T;
}

export const ROLE_PERMISSION_OPTIONS = [
	{ key: "all", label: "Akses semua" },
	{ key: "dashboard", label: "Dashboard" },
	{ key: "bookings", label: "Booking" },
	{ key: "finances", label: "Keuangan" },
	{ key: "invoices", label: "Invoice" },
	{ key: "users", label: "Pengguna" },
	{ key: "contacts", label: "Kontak" },
	{ key: "portfolios", label: "Portfolio" },
	{ key: "packages", label: "Paket layanan" },
	{ key: "testimonials", label: "Testimoni" },
	{ key: "teams", label: "Tim" },
	{ key: "settings", label: "Pengaturan" },
	{ key: "resources", label: "Resource" },
	{ key: "memberships", label: "Membership" },
] as const;

export const ROLE_LABELS: Record<string, string> = {
	super_admin: "Super admin",
	admin: "Admin",
	marketing: "Marketing",
	sport: "Sport",
};

export const PERMISSION_LABELS = Object.fromEntries(
	ROLE_PERMISSION_OPTIONS.map(({ key, label }) => [key, label]),
) as Record<string, string>;

function normalizeRolePermission(value: unknown): RolePermission {
	const rolePermission = value as Partial<RolePermission>;
	return {
		id: rolePermission.id ?? rolePermission.role ?? "",
		role: rolePermission.role ?? "",
		permissions: Array.isArray(rolePermission.permissions)
			? rolePermission.permissions.filter((permission): permission is string => typeof permission === "string")
			: [],
		updatedAt: rolePermission.updatedAt ?? "",
	};
}

export const roleService = {
	async getRolePermissions(): Promise<RolePermission[]> {
		const response = await apiClient.get<ApiSuccess<unknown[]>>("/admin/role-permissions");
		return response.data.data.map(normalizeRolePermission);
	},

	async updateRolePermissions(role: string, permissions: string[]): Promise<RolePermission> {
		const response = await apiClient.put<ApiSuccess<unknown>>(
			`/admin/role-permissions/${encodeURIComponent(role)}`,
			{ permissions },
		);
		return normalizeRolePermission(response.data.data);
	},

	async resetRolePermissions(): Promise<RolePermission[]> {
		const response = await apiClient.post<ApiSuccess<unknown[]>>("/admin/role-permissions/reset");
		return response.data.data.map(normalizeRolePermission);
	},
};

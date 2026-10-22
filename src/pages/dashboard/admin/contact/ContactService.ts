import apiClient from "../../../../services/api";

export type Contact = {
	id: string;
	tenantId: string | null;
	name: string;
	email: string;
	company: string | null;
	phone: string | null;
	message: string | null;
	service: string | null;
	budget: string | null;
	status: "new_contact" | "read" | "responded" | "active" | "inactive";
	createdAt: string;
	updatedAt: string;
};

interface ApiSuccess<T> {
	data: T;
}

export type ContactUpdatePayload = Partial<Pick<Contact,
	"name" | "email" | "company" | "phone" | "message" | "service" | "budget" | "status"
>>;

export const contactService = {
	async getContactList(): Promise<Contact[]> {
		const response = await apiClient.get<ApiSuccess<Contact[]>>("/admin/contacts");
		return response.data.data;
	},

	async getContactById(id: string): Promise<Contact> {
		const response = await apiClient.get<ApiSuccess<Contact>>(`/admin/contacts/${id}`);
		return response.data.data;
	},

	async updateContact(id: string, payload: ContactUpdatePayload): Promise<Contact> {
		const response = await apiClient.put<ApiSuccess<Contact>>(`/admin/contacts/${id}`, payload);
		return response.data.data;
	},

	async updateContactStatus(id: string, status: Contact["status"]): Promise<Contact> {
		const response = await apiClient.patch<ApiSuccess<Contact>>(`/admin/contacts/${id}/status`, { status });
		return response.data.data;
	},

	async deleteContact(id: string): Promise<void> {
		await apiClient.delete(`/admin/contacts/${id}`);
	},
};

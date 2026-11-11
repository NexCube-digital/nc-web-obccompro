import apiClient from "./api";

export interface PublicSiteContact {
	email: string;
	whatsapp: string;
	instagram: string;
	tiktok: string;
	address: string;
	maps: string;
}

interface ApiSuccess<T> {
	data: T;
}

interface PublicHomeContent {
	page?: {
		sections?: { sectionKey: string; content?: Record<string, unknown> }[];
	};
}

export const emptyPublicSiteContact: PublicSiteContact = { email: "", whatsapp: "", instagram: "", tiktok: "", address: "", maps: "" };

export async function getPublicSiteContact(): Promise<PublicSiteContact> {
	try {
		const { data } = await apiClient.get<ApiSuccess<PublicHomeContent>>("/public/tenants/obc-barber/content", {
			params: { page: "home", lang: "id" },
		});
		const content = data.data.page?.sections?.find((section) => section.sectionKey === "site-contact")?.content;
		const readString = (key: keyof PublicSiteContact) => typeof content?.[key] === "string" ? (content[key] as string).trim() : "";
		return {
			email: readString("email"),
			whatsapp: readString("whatsapp"),
			instagram: readString("instagram"),
			tiktok: readString("tiktok"),
			address: readString("address"),
			maps: readString("maps"),
		};
	} catch {
		return emptyPublicSiteContact;
	}
}

export function getWhatsAppHref(value: string | null | undefined): string {
	const contact = value?.trim() ?? "";
	if (!contact) return "";
	if (/^https?:\/\//i.test(contact)) return contact;
	let digits = contact.replace(/\D/g, "");
	if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
	else if (!digits.startsWith("62")) digits = `62${digits}`;
	return digits.length > 2 ? `https://wa.me/${digits}` : "";
}
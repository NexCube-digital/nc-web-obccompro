import apiClient from "../../../../services/api";

interface ApiSuccess<T> { data: T }

export interface SiteContactContent {
	section: "site-contact";
	email: string;
	whatsapp: string;
	instagram: string;
	tiktok: string;
	address: string;
	maps: string;
}

export interface SiteLocation {
	address: string;
	mapUrl: string;
	units: string[];
	info: string[];
}

export interface LocationsContent {
	section: "locations";
	locations: SiteLocation[];
}

async function getContent<T>(section: string): Promise<T> {
	const response = await apiClient.get<ApiSuccess<T>>("/admin/cms/content", { params: { section } });
	return response.data.data;
}

async function saveContent<T>(payload: T): Promise<T> {
	const response = await apiClient.put<ApiSuccess<T>>("/admin/cms/content", payload);
	return response.data.data;
}

export const siteContentService = {
	getContact: () => getContent<SiteContactContent>("site-contact"),
	saveContact: (payload: SiteContactContent) => saveContent(payload),
	getLocations: () => getContent<LocationsContent>("locations"),
	saveLocations: (payload: LocationsContent) => saveContent(payload),
};

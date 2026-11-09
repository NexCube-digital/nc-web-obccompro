import apiClient from "./api";

export interface PublicBusinessUnit {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tenantType: "sport" | "event" | "fnb" | "other";
  picName: string | null;
  picWhatsapp: string | null;
  whatsappUrl: string | null;
  config: Record<string, unknown>;
}

interface ApiSuccess<T> { data: T }

export async function getPublicBusinessUnits(): Promise<PublicBusinessUnit[]> {
  const response = await apiClient.get<ApiSuccess<PublicBusinessUnit[]>>("/public/tenants");
  return response.data.data;
}

export async function getPublicBusinessUnit(slug: string): Promise<PublicBusinessUnit> {
  const response = await apiClient.get<ApiSuccess<PublicBusinessUnit>>(`/public/tenants/${encodeURIComponent(slug)}`);
  return response.data.data;
}

import apiClient from "../../../../services/api";

interface ApiSuccess<T> {
  data: T;
}

export interface CourtResource {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  resourceType: "court" | "hall" | "field" | "room";
  sportTypes: string[];
  capacity: number;
  amenities: string[];
  imageUrl: string | null;
  gallery: string[] | null;
  slotMinutes: number;
  fromPrice: number | null;
  fromPriceFormatted: string | null;
  tenant: { id: string; name: string; slug: string };
  location: { id: string; name: string; city: string; address: string } | null;
}

export const courtService = {
  async getResources(tenant = "obc-sport"): Promise<CourtResource[]> {
    const response = await apiClient.get<ApiSuccess<CourtResource[]>>("/sports/resources", {
      params: { tenant },
    });
    return response.data.data;
  },
};

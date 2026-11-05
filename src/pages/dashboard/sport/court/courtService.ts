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
  parallelUnits: number;
  amenities: string[];
  imageUrl: string | null;
  gallery: string[] | null;
  slotMinutes: number;
  fromPrice: number | null;
  fromPriceFormatted: string | null;
  tenant: { id: string; name: string; slug: string };
  location: { id: string; name: string; city: string; address: string } | null;
}

export interface CourtResourceUpdateInput {
  name: string;
  description: string | null;
  sportTypes: string[];
  capacity: number;
  parallelUnits: number;
  amenities: string[];
  slotMinutes: number;
  imageUrl?: string | null;
}

export const sportOptions = [
  { value: "futsal", label: "Futsal" },
  { value: "badminton", label: "Badminton" },
  { value: "basketball", label: "Basket" },
  { value: "volleyball", label: "Voli" },
  { value: "pickleball", label: "Pickleball" },
  { value: "tennis", label: "Tenis" },
  { value: "table_tennis", label: "Tenis meja" },
  { value: "billiard", label: "Biliar" },
  { value: "swimming", label: "Renang" },
  { value: "sepakbola", label: "Sepak bola" },
  { value: "event", label: "Event" },
  { value: "other", label: "Lainnya" },
] as const;

export const tableSportTypes = ["billiard", "table_tennis"];

export const courtService = {
  async getResources(tenant = "obc-sport"): Promise<CourtResource[]> {
    const response = await apiClient.get<ApiSuccess<CourtResource[]>>("/sports/resources", {
      params: { tenant },
    });
    return response.data.data;
  },
  async updateResource(id: string, input: CourtResourceUpdateInput): Promise<CourtResource> {
    const response = await apiClient.put<ApiSuccess<CourtResource>>(`/admin/resources/${id}`, input);
    return response.data.data;
  },
};

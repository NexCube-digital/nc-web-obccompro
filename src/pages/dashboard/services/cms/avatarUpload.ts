import { unitbisnisService } from "./unitbisnisService";
import { mediaService } from "../../v2/media/mediaService";

export async function uploadTestimonialAvatar(file: File): Promise<string> {
	const units = await unitbisnisService.getUnits();
	const tenant = units.find((unit) => unit.slug === "obc-barber") ?? units[0];
	if (!tenant) throw new Error("Tenant untuk upload gambar tidak ditemukan.");
	const media = await mediaService.uploadMedia(file, tenant.id);
	return media.url;
}

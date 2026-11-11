import { useQuery } from "@tanstack/react-query";
import { emptyPublicSiteContact, getPublicSiteContact } from "../services/publicSiteContactService";

export default function usePublicSiteContact(enabled = true) {
	const { data = emptyPublicSiteContact } = useQuery({
		queryKey: ["public-site-contact"],
		queryFn: getPublicSiteContact,
		enabled,
		staleTime: 60_000,
	});

	return enabled ? data : emptyPublicSiteContact;
}
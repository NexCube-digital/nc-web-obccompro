import { useEffect, useState } from "react";
import { emptyPublicSiteContact, getPublicSiteContact } from "../services/publicSiteContactService";

export default function usePublicSiteContact(enabled = true) {
	const [contact, setContact] = useState(emptyPublicSiteContact);

	useEffect(() => {
		if (!enabled) return;
		let active = true;
		getPublicSiteContact().then((value) => { if (active) setContact(value); });
		return () => { active = false; };
	}, [enabled]);

	return contact;
}
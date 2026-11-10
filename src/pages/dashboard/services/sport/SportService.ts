import { sportBookingService } from "./sportBookingService";
import { sportMembershipService } from "./sportMembershipService";
import { sportPricingService } from "./sportPricingService";
import { sportResourceService, getSportResourceImage } from "./sportResourceService";

export * from "./sportTypes";
export { getSportResourceImage };

export const sportService = {
	...sportBookingService,
	...sportResourceService,
	...sportPricingService,
	...sportMembershipService,
};

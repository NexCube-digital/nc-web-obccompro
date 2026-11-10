import apiClient from "../../../../services/api";
import { getPaginated, type ApiSuccess, type ListParams } from "./sportServiceUtils";
import type {
	AdminBookingCustomer,
	AdminFullDayBookingResult,
	BookingStatus,
	Paginated,
	SportBooking,
	SportBookingDetails,
	SportType,
} from "./sportTypes";

export const sportBookingService = {
	async searchAdminCustomers(search: string): Promise<AdminBookingCustomer[]> {
		const response = await apiClient.get<ApiSuccess<{ items: AdminBookingCustomer[] }>>("/admin/customers", {
			params: { search, status: "active", limit: 10 },
		});
		return response.data.data.items;
	},
	async createAdminFullDayBooking(input: {
		resourceId: string;
		bookingDate: string;
		startTime: string;
		endTime: string;
		sportType: SportType;
		customerId?: string;
		guestName?: string;
		guestEmail?: string;
		guestPhone?: string;
	}): Promise<AdminFullDayBookingResult> {
		const response = await apiClient.post<ApiSuccess<AdminFullDayBookingResult>>("/sports/bookings", {
			...input,
			fullDayAdmin: true,
			bookingType: "regular",
		});
		return response.data.data;
	},
	getBookings(params: ListParams & { status?: BookingStatus }): Promise<Paginated<SportBooking>> {
		return getPaginated("/admin/bookings", params);
	},
	getBookingDetails(id: string): Promise<SportBookingDetails> {
		return apiClient.get<ApiSuccess<SportBookingDetails>>(`/admin/bookings/${id}`).then((response) => response.data.data);
	},
};
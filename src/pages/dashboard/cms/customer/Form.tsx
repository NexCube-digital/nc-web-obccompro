import { Search } from "lucide-react";
import type { FormEvent } from "react";
import type { CustomerStatus } from "./customerService";

type Props = {
	search: string;
	status: CustomerStatus | "all";
	onSearchChange: (value: string) => void;
	onStatusChange: (value: CustomerStatus | "all") => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function CustomerFilters({ search, status, onSearchChange, onStatusChange, onSubmit }: Props) {
	return (
		<form onSubmit={onSubmit} className="mb-4 flex flex-col gap-3 rounded-xl border border-obc-border bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
			<div className="grid flex-1 gap-3 sm:grid-cols-2">
				<label className="block text-[12px] font-medium text-obc-charcoal">Cari pelanggan
					<span className="relative mt-1 block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Nama, email, username, telepon" className="h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive" /></span>
				</label>
				<label className="block text-[12px] font-medium text-obc-charcoal">Status akun
					<select value={status} onChange={(event) => onStatusChange(event.target.value as CustomerStatus | "all")} className="mt-1 h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] outline-none focus:border-obc-olive"><option value="all">Semua status</option><option value="active">Aktif</option><option value="inactive">Nonaktif</option><option value="suspended">Ditangguhkan</option></select>
				</label>
			</div>
			<button type="submit" className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover">Terapkan filter</button>
		</form>
	);
}

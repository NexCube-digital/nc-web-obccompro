import { ChevronLeft, ChevronRight } from "lucide-react";

type PageItem = number | "left-ellipsis" | "right-ellipsis";

type PaginationProps = {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	totalItems?: number;
	pageSize?: number;
	itemLabel?: string;
	disabled?: boolean;
	className?: string;
};

function getPageItems(totalPages: number, currentPage: number): PageItem[] {
	if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

	const start = Math.max(2, currentPage - 1);
	const end = Math.min(totalPages - 1, currentPage + 1);
	const items: PageItem[] = [1];
	if (start > 2) items.push("left-ellipsis");
	for (let pageNumber = start; pageNumber <= end; pageNumber += 1) items.push(pageNumber);
	if (end < totalPages - 1) items.push("right-ellipsis");
	items.push(totalPages);
	return items;
}

export default function Pagination({
	page,
	totalPages,
	onPageChange,
	totalItems,
	pageSize,
	itemLabel = "data",
	disabled = false,
	className = "flex flex-col gap-3 border-t border-obc-border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between",
}: PaginationProps) {
	const pageCount = Math.max(1, totalPages);
	const currentPage = Math.min(Math.max(1, page), pageCount);
	const pageItems = getPageItems(pageCount, currentPage);
	const firstItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : 0;
	const lastItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : 0;

	return (
		<div className={className}>
			<p aria-live="polite" className="text-[12px] text-obc-muted">
				{totalItems !== undefined && pageSize
					? <>Menampilkan {firstItem}–{lastItem} dari {totalItems.toLocaleString("id-ID")} {itemLabel}</>
					: <>Halaman {currentPage} dari {pageCount}</>}
			</p>
			<nav aria-label={`Navigasi halaman ${itemLabel}`} className="flex items-center justify-end gap-1">
				<button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={disabled || currentPage <= 1} aria-label="Halaman sebelumnya" className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border text-obc-charcoal transition hover:bg-obc-hover-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={16} /></button>
				{pageItems.map((item) => typeof item === "number" ? (
					<button key={item} type="button" onClick={() => onPageChange(item)} disabled={disabled} aria-label={`Halaman ${item}`} aria-current={item === currentPage ? "page" : undefined} className={`grid size-9 shrink-0 place-items-center rounded-lg text-[12px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green disabled:cursor-not-allowed disabled:opacity-50 ${item === currentPage ? "bg-obc-green text-white shadow-sm" : "text-obc-muted hover:bg-obc-hover-surface hover:text-obc-charcoal"}`}>{item}</button>
				) : <span key={item} aria-hidden="true" className="grid size-6 shrink-0 place-items-center text-[12px] text-obc-muted">...</span>)}
				<button type="button" onClick={() => onPageChange(currentPage + 1)} disabled={disabled || currentPage >= pageCount} aria-label="Halaman berikutnya" className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border text-obc-charcoal transition hover:bg-obc-hover-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={16} /></button>
			</nav>
		</div>
	);
}
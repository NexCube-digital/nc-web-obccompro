import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Star } from "lucide-react";
import { toast } from "sonner";
import { useDebouncedValue } from "../../components/hooks/useDebouncedValue";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Pagination from "../../components/common/Pagination";
import ReviewTable from "./Table";
import ReviewForm from "./Form";
import { reviewService, type ReviewItem, type ReviewStatus } from "./reviewService";

export default function ReviewManagement() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState<ReviewStatus | "all">("all");
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebouncedValue(query);
	const [selected, setSelected] = useState<ReviewItem | null>(null);
	const reviewsQuery = useQuery({
		queryKey: ["v2-reviews", page, status],
		queryFn: () => reviewService.getReviews({ page, limit: 20, ...(status !== "all" ? { status } : {}) }),
	});
	const reviews = reviewsQuery.data?.items ?? [];
	const totalPages = reviewsQuery.data?.pagination.totalPages ?? 1;
	const total = reviewsQuery.data?.pagination.total ?? 0;
	const loading = reviewsQuery.isPending;

	useEffect(() => {
		if (reviewsQuery.error) {
			toast.error(reviewsQuery.error instanceof Error ? reviewsQuery.error.message : "Gagal memuat review.");
		}
		if (reviewsQuery.data && reviewsQuery.data.pagination.page !== page) {
			setPage(reviewsQuery.data.pagination.page);
		}
	}, [page, reviewsQuery.data, reviewsQuery.error]);

	const changeStatus = async (review: ReviewItem, nextStatus: ReviewStatus) => {
		try {
			const updated = await reviewService.updateStatus(review.id, nextStatus);
			void queryClient.invalidateQueries({ queryKey: ["v2-reviews"] });
			if (selected?.id === updated.id) setSelected(updated);
			toast.success("Status review diperbarui.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal memperbarui status review.");
		}
	};

	const filtered = useMemo(
		() => reviews.filter((review) => `${review.customer?.name ?? ""} ${review.customer?.email ?? ""} ${review.resource?.name ?? ""} ${review.comment}`.toLowerCase().includes(debouncedQuery.toLowerCase())),
		[reviews, debouncedQuery],
	);

	return (
		<DashboardLayout>
			<div className="px-3 py-5 sm:px-6 sm:py-6">
				<header className="mb-5 flex items-start justify-between gap-3"><div><p className="text-[13px] text-obc-muted">OBC Sport / Review</p><h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Review & ulasan</h1><p className="mt-1 text-[13px] text-obc-muted">Moderasi ulasan customer untuk seluruh resource olahraga.</p></div></header>
				<section className="mb-4 flex flex-col gap-3 rounded-xl border border-obc-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2 text-[13px] text-obc-muted"><Star size={16} />{total.toLocaleString("id-ID")} review ditemukan</div>
					<div className="flex gap-2"><label className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari customer atau resource..." className="h-10 w-full rounded-lg border border-obc-border pl-9 pr-3 text-[13px] sm:w-72"/></label><select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value as ReviewStatus | "all"); }} className="h-10 rounded-lg border border-obc-border px-3 text-[13px]"><option value="all">Semua status</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div>
				</section>
				<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
					<ReviewTable reviews={filtered} loading={loading} onView={setSelected} onStatusChange={changeStatus}/>
					<Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={total} pageSize={20} itemLabel="review" disabled={loading} />
				</section>
				{selected && <ReviewForm review={selected} onClose={() => setSelected(null)} onStatusChange={changeStatus}/>} 
			</div>
		</DashboardLayout>
	);
}

import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import DeleteModal from "../../components/ui/DeleteModal";
import { testimonialService, type Testimonial, type TestimonialListResponse } from "../../services/cms/testimonialService";
import { toast } from "sonner";
import TestimonialForm, { type TestimonialFormValues } from "./Form";
import TestimonialTable from "./Table";

const PAGE_SIZE = 8;

export default function Testimoni() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Testimonial["status"]>("all");
  const testimonialsQuery = useQuery({
    queryKey: ["cms-testimonials", page, PAGE_SIZE, search, statusFilter],
    queryFn: () => testimonialService.getTestimonials({ page, limit: PAGE_SIZE, search, status: statusFilter }),
  });
  const data = testimonialsQuery.data ?? {
    items: [],
    pagination: { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 },
    summary: {
      total: 0,
      publishedCount: 0,
      averageRating: 0,
      statusCounts: { published: 0, draft: 0, archived: 0 },
    },
  } satisfies TestimonialListResponse;
  const loading = testimonialsQuery.isPending;
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deletingItem, setDeletingItem] = useState<Testimonial | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const closeDeleteModal = useCallback(() => setDeletingItem(null), []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (testimonialsQuery.error) {
      toast.error(
        testimonialsQuery.error instanceof Error
          ? testimonialsQuery.error.message
          : "Gagal memuat data testimoni.",
      );
    }
    const lastPage = Math.max(1, testimonialsQuery.data?.pagination.totalPages ?? 1);
    if (page > lastPage) setPage(lastPage);
  }, [page, testimonialsQuery.data, testimonialsQuery.error]);

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["cms-testimonials"] });
  };

  const saveTestimonial = async (
    values: TestimonialFormValues,
    avatarFile?: File,
    avatarRemoved = false,
  ) => {
    const payload = {
      ...values,
      company: values.company.trim() || null,
      textEn: values.textEn.trim() || null,
      avatar: values.avatar.trim() || null,
    };
    try {
      if (editingItem?.id) {
        await testimonialService.updateTestimonial(
          editingItem.id,
          payload,
          avatarFile,
          avatarRemoved,
        );
        toast.success("Testimoni berhasil diperbarui.");
      } else {
        await testimonialService.createTestimonial(payload, avatarFile);
        toast.success("Testimoni berhasil dibuat.");
      }
      setPage(1);
      refresh();
      setFormOpen(false);
      setEditingItem(null);
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan testimoni.",
      );
      return false;
    }
  };

  const deleteTestimonial = (item: Testimonial) => setDeletingItem(item);

  const confirmDeleteTestimonial = async () => {
    if (!deletingItem) return;
    setDeleteLoading(true);
    try {
      await testimonialService.deleteTestimonial(deletingItem.id);
      setDeletingItem(null);
      refresh();
      toast.success("Testimoni dipindahkan ke Sampah.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus testimoni.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateStatus = async (
    item: Testimonial,
    status: Testimonial["status"],
  ) => {
    try {
      await testimonialService.updateTestimonial(item.id, {
        status,
      });
      refresh();
      toast.success("Status testimoni berhasil diubah.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengubah status testimoni.",
      );
    }
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  if (formOpen) {
    return (
      <DashboardPageLayout
        breadcrumb={editingItem ? "Testimoni / Edit" : "Testimoni / Tambah"}
        title={editingItem ? "Edit testimoni" : "Tambah testimoni"}
        description="Lengkapi cerita pelanggan untuk ditampilkan di halaman publik."
      >
        <TestimonialForm
          key={editingItem?.id ?? "new-testimonial"}
          testimonial={editingItem}
          onCancel={closeForm}
          onSave={saveTestimonial}
        />
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      breadcrumb="Testimoni"
      title="Manajemen Testimoni"
      description="Kelola testimoni pelanggan dan tampilkan di halaman publik."
    >
      <TestimonialTable
        testimonials={data.items}
        loading={loading}
        summary={data.summary}
        pagination={data.pagination}
        page={page}
        query={searchInput}
        statusFilter={statusFilter}
        onQueryChange={setSearchInput}
        onStatusFilterChange={(status) => {
          setPage(1);
          setStatusFilter(status);
        }}
        onPageChange={setPage}
        onCreate={openCreateForm}
        onEdit={(item) => {
          setEditingItem(item);
          setFormOpen(true);
        }}
        onDelete={deleteTestimonial}
        onStatusChange={updateStatus}
      />
      <DeleteModal
        isOpen={Boolean(deletingItem)}
        title="Hapus testimoni?"
        description="Testimoni dipindahkan ke Sampah dan dapat dipulihkan admin selama 30 hari."
        itemName={deletingItem?.name}
        isLoading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteTestimonial}
      />
    </DashboardPageLayout>
  );
}

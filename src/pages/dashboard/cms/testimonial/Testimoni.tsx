import { useCallback, useEffect, useState } from "react";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import DeleteModal from "../../components/ui/DeleteModal";
import { testimonialService, type Testimonial } from "../../services/cms/testimonialService";
import { toast } from "sonner";
import TestimonialForm, { type TestimonialFormValues } from "./Form";
import TestimonialTable from "./Table";

export default function Testimoni() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deletingItem, setDeletingItem] = useState<Testimonial | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const closeDeleteModal = useCallback(() => setDeletingItem(null), []);

  useEffect(() => {
    let active = true;
    testimonialService
      .getTestimonials()
      .then((data) => {
        if (active) setTestimonials(data);
      })
      .catch((error: unknown) => {
        if (active)
          toast.error(
            error instanceof Error
              ? error.message
              : "Gagal memuat data testimoni.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

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
        const updated = await testimonialService.updateTestimonial(
          editingItem.id,
          payload,
          avatarFile,
          avatarRemoved,
        );
        setTestimonials((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        toast.success("Testimoni berhasil diperbarui.");
      } else {
        const created = await testimonialService.createTestimonial(
          payload,
          avatarFile,
        );
        setTestimonials((current) => [created, ...current]);
        toast.success("Testimoni berhasil dibuat.");
      }
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
      setTestimonials((current) =>
        current.filter((testimonial) => testimonial.id !== deletingItem.id),
      );
      setDeletingItem(null);
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
      const updated = await testimonialService.updateTestimonial(item.id, {
        status,
      });
      setTestimonials((current) =>
        current.map((testimonial) =>
          testimonial.id === updated.id ? updated : testimonial,
        ),
      );
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
        testimonials={testimonials}
        loading={loading}
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

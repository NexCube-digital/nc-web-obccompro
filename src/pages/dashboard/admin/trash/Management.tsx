import { useEffect, useState } from "react";
import { ArchiveRestore, Clock3 } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DeleteModal from "../../components/ui/DeleteModal";
import TrashTable from "./Table";
import {
  getTrashItems,
  permanentlyDeleteTrashItem,
  restoreTrashItem,
  type TrashItem,
} from "../../services/admin/trashService";

export default function TrashManagement() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<TrashItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTrashItems()
      .then((result) => {
        if (!cancelled) setItems(result);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Gagal memuat Sampah.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const restoreItem = async (item: TrashItem) => {
    const key = `${item.entityType}:${item.entityId}`;
    setProcessingId(key);
    try {
      await restoreTrashItem(item);
      setItems((current) => current.filter((entry) => `${entry.entityType}:${entry.entityId}` !== key));
      toast.success("Data berhasil dipulihkan.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memulihkan data.");
    } finally {
      setProcessingId(null);
    }
  };

  const confirmPermanentDelete = async () => {
    if (!deletingItem) return;
    const key = `${deletingItem.entityType}:${deletingItem.entityId}`;
    setProcessingId(key);
    try {
      await permanentlyDeleteTrashItem(deletingItem);
      setItems((current) => current.filter((entry) => `${entry.entityType}:${entry.entityId}` !== key));
      setDeletingItem(null);
      toast.success("Data berhasil dihapus permanen.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus data permanen.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-screen-2xl px-3 py-5 sm:px-6 sm:py-7">
        <header className="relative mb-5 overflow-hidden rounded-xl bg-[#1F3320] px-5 py-5 text-white shadow-[0_8px_24px_rgba(31,51,32,0.12)] sm:px-7 sm:py-6">
          <div className="absolute inset-y-0 right-0 hidden w-[34%] border-l border-white/10 bg-white/[0.03] sm:block" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#CDF178] text-[#1F3320] shadow-sm">
                <ArchiveRestore size={22} />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#CDF178]">Administrasi data</p>
                <h1 className="mt-1 font-heading text-2xl font-bold">Sampah</h1>
                <p className="mt-1 max-w-xl text-[12px] leading-5 text-white/75">
                  Pulihkan data atau hapus permanen sebelum masa penyimpanan berakhir.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-white/15 pt-4 sm:min-w-52 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <span className="grid size-10 place-items-center rounded-lg bg-white/10 text-[#CDF178]">
                <Clock3 size={18} />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">Retensi data</p>
                <p className="mt-0.5 font-heading text-lg font-bold">30 hari</p>
              </div>
              <span className="ml-auto font-heading text-3xl font-bold text-[#CDF178]">
                {items.length.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </header>

        <TrashTable
          items={items}
          loading={loading}
          processingId={processingId}
          onRestore={(item) => void restoreItem(item)}
          onDelete={setDeletingItem}
        />
        <DeleteModal
          isOpen={Boolean(deletingItem)}
          title="Hapus permanen?"
          description="Data dan file terkait akan dihapus permanen dan tidak bisa dipulihkan."
          itemName={deletingItem?.title}
          confirmLabel="Hapus permanen"
          isLoading={Boolean(deletingItem && processingId === `${deletingItem.entityType}:${deletingItem.entityId}`)}
          onClose={() => setDeletingItem(null)}
          onConfirm={confirmPermanentDelete}
        />
      </div>
    </DashboardLayout>
  );
}

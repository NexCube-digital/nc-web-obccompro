import { ImagePlus, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";

type Props = {
  image: File | null;
  preview: string | null;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
};

export default function PortfolioImagePanel({
  image,
  preview,
  onImageChange,
  onRemoveImage,
}: Props) {
  return (
    <section className="border-t border-obc-border bg-[#FCFCFA] p-5 sm:p-7 lg:border-l lg:border-t-0">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-obc-muted">
              Preview sampul
            </p>
            <p className="mt-1 text-[11px] text-obc-muted">Rasio tampilan 4:3</p>
          </div>
          {image && (
            <button
              type="button"
              onClick={onRemoveImage}
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[11px] font-semibold text-obc-red transition hover:bg-[#FDE8E8]"
            >
              <Trash2 size={13} />
              Hapus gambar baru
            </button>
          )}
        </div>
        <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-obc-border bg-[#E8ECE3] shadow-inner">
          {preview ? (
            <img
              src={preview}
              alt="Pratinjau sampul portfolio"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-[#737D67]">
              <span className="grid size-14 place-items-center rounded-2xl bg-white/80 text-obc-olive shadow-sm">
                <ImagePlus size={25} />
              </span>
              <p className="mt-3 font-heading text-[13px] font-semibold text-obc-charcoal">
                Pilih gambar sampul
              </p>
              <p className="mt-1 max-w-xs text-[11px] leading-5">
                Preview gambar akan tampil di area ini.
              </p>
            </div>
          )}
          <label className="absolute inset-x-3 bottom-3 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/95 px-3 text-[12px] font-semibold text-obc-charcoal shadow-sm transition hover:bg-white">
            <ImagePlus size={15} />
            {preview ? "Ganti gambar" : "Pilih gambar"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onImageChange}
              tabIndex={-1}
              className="sr-only"
            />
          </label>
        </div>
    </section>
  );
}

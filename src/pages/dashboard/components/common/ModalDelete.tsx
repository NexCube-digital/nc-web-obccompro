import { useEffect } from "react";
import { AlertTriangle, LoaderCircle, Trash2, X } from "lucide-react";

type ModalDeleteProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	itemName?: string;
	isDeleting?: boolean;
};

export default function ModalDelete({
	isOpen,
	onClose,
	onConfirm,
	itemName,
	isDeleting = false,
}: ModalDeleteProps) {
	useEffect(() => {
		if (!isOpen) return;

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !isDeleting) onClose();
		};
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isDeleting, isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b211b]/55 p-4 backdrop-blur-[2px]"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-delete-title"
			aria-describedby="modal-delete-description"
			onClick={() => {
				if (!isDeleting) onClose();
			}}
		>
			<div
				className="w-full max-w-[420px] rounded-2xl border border-obc-border bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] sm:p-7"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-4">
					<div className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#FDF2F2] text-obc-red">
						<AlertTriangle size={22} aria-hidden="true" />
					</div>
					<button
						type="button"
						aria-label="Tutup dialog"
						disabled={isDeleting}
						onClick={onClose}
						className="grid size-9 shrink-0 place-items-center rounded-lg text-obc-muted transition-colors hover:bg-obc-hover-surface hover:text-obc-charcoal disabled:cursor-not-allowed disabled:opacity-50"
					>
						<X size={18} aria-hidden="true" />
					</button>
				</div>

				<h2 id="modal-delete-title" className="mt-5 font-heading text-lg font-semibold text-obc-charcoal">
					Hapus data ini?
				</h2>
				<p id="modal-delete-description" className="mt-2 text-sm leading-6 text-obc-muted">
					{itemName ? (
						<>Data <span className="font-semibold text-obc-charcoal">{itemName}</span> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.</>
					) : (
						<>Data yang dipilih akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.</>
					)}
				</p>

				<div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<button
						type="button"
						disabled={isDeleting}
						onClick={onClose}
						className="inline-flex h-10 items-center justify-center rounded-lg border border-obc-border px-4 font-body text-sm font-medium text-obc-charcoal transition-colors hover:bg-obc-hover-surface disabled:cursor-not-allowed disabled:opacity-50"
					>
						Batal
					</button>
					<button
						type="button"
						disabled={isDeleting}
						onClick={onConfirm}
						className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-red px-4 font-body text-sm font-semibold text-white transition-colors hover:bg-obc-red-hover disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isDeleting ? (
							<>
								<LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
								Menghapus...
							</>
						) : (
							<>
								<Trash2 size={16} aria-hidden="true" />
								Hapus
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

import { useEffect, useRef } from 'react'
import { AlertTriangle, LoaderCircle, Trash2 } from 'lucide-react'

interface DeleteModalProps {
	isOpen: boolean
	title?: string
	description?: string
	itemName?: string
	confirmLabel?: string
	cancelLabel?: string
	isLoading?: boolean
	onClose: () => void
	onConfirm: () => void | Promise<void>
}

function DeleteModal({
	isOpen,
	title = 'Hapus item ini?',
	description = 'Data dipindahkan ke Sampah dan dapat dipulihkan admin selama 30 hari.',
	itemName,
	confirmLabel = 'Hapus',
	cancelLabel = 'Batal',
	isLoading = false,
	onClose,
	onConfirm,
}: DeleteModalProps) {
	const cancelButtonRef = useRef<HTMLButtonElement>(null)
	const confirmButtonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (!isOpen) return

		const previousOverflow = document.body.style.overflow
		const previousActiveElement = document.activeElement instanceof HTMLElement
			? document.activeElement
			: null

		document.body.style.overflow = 'hidden'
		cancelButtonRef.current?.focus()

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && !isLoading) {
				onClose()
				return
			}

			if (event.key === 'Tab') {
				const firstButton = cancelButtonRef.current
				const lastButton = confirmButtonRef.current
				if (event.shiftKey && document.activeElement === firstButton) {
					event.preventDefault()
					lastButton?.focus()
				} else if (!event.shiftKey && document.activeElement === lastButton) {
					event.preventDefault()
					firstButton?.focus()
				}
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.body.style.overflow = previousOverflow
			document.removeEventListener('keydown', handleKeyDown)
			if (previousActiveElement?.isConnected) previousActiveElement.focus()
		}
	}, [isOpen, isLoading, onClose])

	if (!isOpen) return null

	return (
		<div
			className="fixed inset-0 z-80 flex items-center justify-center bg-obc-charcoal/65 p-4 backdrop-blur-sm"
			onClick={(event) => {
				event.stopPropagation()
				if (event.target === event.currentTarget && !isLoading) onClose()
			}}
		>
			<section
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="delete-modal-title"
				aria-describedby="delete-modal-description"
				aria-busy={isLoading}
				className="w-full max-w-115 overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_28px_90px_rgba(24,28,24,0.28)]"
			>
				<div className="h-1.5 bg-obc-red" />
				<div className="border-b border-obc-border bg-[#FDF8F7] px-5 py-5 sm:px-7 sm:py-6">
					<div className="flex items-center gap-4">
						<div className="grid size-12 shrink-0 place-items-center rounded-xl bg-obc-red text-white shadow-[0_5px_14px_rgba(191,0,33,0.2)]">
							<AlertTriangle size={22} strokeWidth={2} aria-hidden="true" />
						</div>
						<div className="min-w-0">
							<p className="text-[10px] font-bold uppercase tracking-[0.12em] text-obc-red">Konfirmasi tindakan</p>
							<h2 id="delete-modal-title" className="mt-1 font-heading text-xl font-bold leading-tight text-obc-charcoal">
								{title}
							</h2>
						</div>
					</div>
				</div>

				<div className="px-5 py-5 sm:px-7 sm:py-6">
					<p id="delete-modal-description" className="text-[13px] leading-6 text-obc-muted">
						{description}
					</p>
					{itemName && (
						<div className="mt-4 flex min-w-0 items-start gap-3 rounded-xl border border-[#F1D9D9] bg-[#FFF9F8] p-3.5">
							<span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#FDE8E8] text-obc-red">
								<Trash2 size={15} aria-hidden="true" />
							</span>
							<div className="min-w-0">
								<p className="text-[10px] font-bold uppercase tracking-widest text-obc-muted">Item yang dipilih</p>
								<p className="mt-1 wrap-break-word text-[13px] font-semibold leading-5 text-obc-charcoal">{itemName}</p>
							</div>
						</div>
					)}
				</div>

				<div className="flex flex-col-reverse gap-2 border-t border-obc-border bg-[#FAFBF8] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
					<button
						ref={cancelButtonRef}
						type="button"
						disabled={isLoading}
						onClick={onClose}
						className="h-11 rounded-lg border border-obc-border bg-white px-5 font-heading text-sm font-semibold text-obc-charcoal transition-colors hover:bg-obc-hover-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-olive focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{cancelLabel}
					</button>
					<button
						ref={confirmButtonRef}
						type="button"
						disabled={isLoading}
						onClick={() => { void onConfirm() }}
						className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-obc-red px-5 font-heading text-sm font-bold text-white shadow-sm transition-colors hover:bg-obc-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-red focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isLoading ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Trash2 size={16} aria-hidden="true" />}
						{isLoading ? 'Memproses...' : confirmLabel}
					</button>
				</div>
			</section>
		</div>
	)
}

export default DeleteModal

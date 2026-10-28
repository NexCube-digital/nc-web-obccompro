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
	description = 'Item yang dihapus tidak dapat dikembalikan.',
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
			className="fixed inset-0 z-[80] flex items-center justify-center bg-[#343133]/55 p-4 backdrop-blur-[2px]"
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
				className="w-full max-w-[420px] rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.2)] sm:p-6"
			>
				<div className="flex gap-4">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FDE8E8] text-[#BF0021]">
						<AlertTriangle size={23} strokeWidth={1.9} aria-hidden="true" />
					</div>
					<div className="min-w-0 pt-0.5">
						<h2 id="delete-modal-title" className="font-heading text-lg font-bold text-[#343133]">
							{title}
						</h2>
						<p id="delete-modal-description" className="mt-2 text-sm leading-6 text-[#6F6B6E]">
							{description}
						</p>
						{itemName && (
							<p className="mt-3 break-words rounded-lg bg-[#FDFCF7] px-3 py-2 text-sm font-semibold text-[#343133]">
								{itemName}
							</p>
						)}
					</div>
				</div>

				<div className="mt-6 grid grid-cols-2 gap-3">
					<button
						ref={cancelButtonRef}
						type="button"
						disabled={isLoading}
						onClick={onClose}
						className="h-11 rounded-lg border border-[#D4D4D4] bg-white px-3 font-heading text-sm font-semibold text-[#343133] transition-colors hover:bg-[#F4F4E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#404F14] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{cancelLabel}
					</button>
					<button
						ref={confirmButtonRef}
						type="button"
						disabled={isLoading}
						onClick={() => { void onConfirm() }}
						className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#BF0021] px-3 font-heading text-sm font-bold text-white transition-colors hover:bg-[#99001B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BF0021] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
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

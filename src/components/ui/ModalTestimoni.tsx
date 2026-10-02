import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Star, CheckCircle2, ChevronDown } from 'lucide-react'

export type TestimoniFormData = {
	name: string
	unit: string // contoh: "OBC Laundry"
	role: string // contoh: "Customer"
	rating: number
	text: string
}

type ModalTestimoniProps = {
	isOpen: boolean
	onClose: () => void
	onSubmit?: (data: TestimoniFormData) => void | Promise<void>
}

const UNIT_OPTIONS = [
	'OBC Sport Center',
	'OBC Guest House',
	'OBC Villa',
	'OBC Laundry',
	'OBC Food Court',
	'OBC Coffee',
	'OBC Agribisnis',
]

const ROLE_OPTIONS = ['Customer', 'Guest', 'Member', 'Visitor']

const MAX_TEXT = 300
const MIN_TEXT = 20

const initialForm: TestimoniFormData = {
	name: '',
	unit: '',
	role: '',
	rating: 0,
	text: '',
}

type FormErrors = Partial<Record<keyof TestimoniFormData, string>>

type DropdownFieldProps = {
	id: string
	value: string
	placeholder: string
	options: string[]
	error?: string
	onChange: (value: string) => void
}

const inputBase =
	"w-full rounded-[12px] border bg-white px-4 py-2.5 font-['Montserrat'] text-[14px] text-[#000000] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#004000] focus:ring-2 focus:ring-[#CDF178]"

function DropdownField({ id, value, placeholder, options, error, onChange }: DropdownFieldProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [activeIndex, setActiveIndex] = useState(Math.max(options.indexOf(value), 0))
	const selectedIndex = options.indexOf(value)

	const openAtSelection = () => {
		setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
		setIsOpen(true)
	}

	const selectOption = (option: string) => {
		onChange(option)
		setIsOpen(false)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault()
			event.stopPropagation()
			if (!isOpen) {
				openAtSelection()
				return
			}
			setActiveIndex((current) =>
				event.key === 'ArrowDown'
					? (current + 1) % options.length
					: (current - 1 + options.length) % options.length,
			)
		} else if (event.key === 'Home' || event.key === 'End') {
			event.preventDefault()
			if (!isOpen) setIsOpen(true)
			setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			if (isOpen) selectOption(options[activeIndex])
			else openAtSelection()
		} else if (event.key === 'Escape' && isOpen) {
			event.preventDefault()
			event.stopPropagation()
			setIsOpen(false)
		}
	}

	return (
		<div
			className="relative"
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOpen(false)
			}}
		>
			<button
				id={id}
				type="button"
				role="combobox"
				aria-expanded={isOpen}
				aria-controls={`${id}-listbox`}
				aria-haspopup="listbox"
				aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? `${id}-error` : undefined}
				className={`${inputBase} flex cursor-pointer items-center justify-between text-left ${error ? 'border-red-500' : 'border-[#e5e5e5]'}`}
				onClick={() => (isOpen ? setIsOpen(false) : openAtSelection())}
				onKeyDown={handleKeyDown}
			>
				<span className={value ? 'text-[#1F3320]' : 'text-[#9ca3af]'}>{value || placeholder}</span>
				<ChevronDown className={`h-4 w-4 text-[#1F3320] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>
			{isOpen && (
				<div
					id={`${id}-listbox`}
					role="listbox"
					aria-labelledby={id}
					className="absolute left-0 top-full z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-[12px] border border-[#e5e5e5] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
				>
					{options.map((option, index) => (
						<button
							id={`${id}-option-${index}`}
							key={option}
							type="button"
							role="option"
							aria-selected={value === option}
							className={`w-full rounded-[8px] px-3 py-2 text-left font-['Montserrat'] text-[14px] transition-colors focus-visible:outline-none ${
								activeIndex === index || value === option
									? 'bg-[#eaf4d7] text-[#1F3320]'
									: 'text-[#1F3320] hover:bg-[#f5f5f5]'
							}`}
							tabIndex={-1}
							onMouseDown={(event) => event.preventDefault()}
							onMouseEnter={() => setActiveIndex(index)}
							onClick={() => selectOption(option)}
						>
							{option}
						</button>
					))}
				</div>
			)}
			{error && <p id={`${id}-error`} className="mt-1 text-[12px] text-red-500">{error}</p>}
		</div>
	)
}

export default function ModalTestimoni({ isOpen, onClose, onSubmit }: ModalTestimoniProps) {
	const { t } = useTranslation()
	const [form, setForm] = useState<TestimoniFormData>(initialForm)
	const [errors, setErrors] = useState<FormErrors>({})
	const [hoverRating, setHoverRating] = useState(0)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	// Reset form setiap modal ditutup
	useEffect(() => {
		if (!isOpen) {
			setForm(initialForm)
			setErrors({})
			setHoverRating(0)
			setIsSubmitting(false)
			setIsSuccess(false)
		}
	}, [isOpen])

	// Tutup dengan tombol Escape + kunci scroll halaman
	useEffect(() => {
		if (!isOpen) return

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}

		document.addEventListener('keydown', handleEscape)
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.body.style.overflow = previousOverflow
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	const setField = <K extends keyof TestimoniFormData>(key: K, value: TestimoniFormData[K]) => {
		setForm((prev) => ({ ...prev, [key]: value }))
		setErrors((prev) => ({ ...prev, [key]: undefined }))
	}

	const validate = () => {
		const next: FormErrors = {}
		if (!form.name.trim()) next.name = t('modalTestimoni.errors.nameRequired')
		if (!form.unit) next.unit = t('modalTestimoni.errors.unitRequired')
		if (!form.role) next.role = t('modalTestimoni.errors.roleRequired')
		if (form.rating === 0) next.rating = t('modalTestimoni.errors.ratingRequired')
		if (form.text.trim().length < MIN_TEXT) next.text = t('modalTestimoni.errors.textMin', { min: MIN_TEXT })
		setErrors(next)
		return Object.keys(next).length === 0
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		if (!validate() || isSubmitting) return

		setIsSubmitting(true)
		try {
			await onSubmit?.({ ...form, name: form.name.trim(), text: form.text.trim() })
			setIsSuccess(true)
		} finally {
			setIsSubmitting(false)
		}
	}

	const activeRating = hoverRating || form.rating

	return (
		<div
			className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-testimoni-title"
			onClick={onClose}
		>
			<div
				className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[25px] border border-[#ececec] bg-white p-6 shadow-[0_5px_80px_0_rgba(0,0,0,0.25)] sm:max-h-[calc(100vh-40px)] sm:max-w-[720px] sm:overflow-hidden sm:rounded-[25px] sm:p-6"
				onClick={(event) => event.stopPropagation()}
			>
				{/* Tombol tutup */}
				<button
					type="button"
					className="absolute right-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-[0.67px] border-[#1F3320] bg-white text-[#1F3320] transition-colors hover:bg-[#f5f5f5]"
					aria-label={t('modalTestimoni.closeBtn')}
					onClick={onClose}
				>
					<X size={18} />
				</button>

				{isSuccess ? (
					<div className="flex flex-col items-center py-8 text-center">
						<span className="grid h-16 w-16 place-items-center rounded-full bg-[#CDF178] text-[#004000]">
							<CheckCircle2 size={34} />
						</span>
						<h3 className="mt-5 font-['Montserrat'] text-[22px] font-bold text-[#1F3320]">
							{t('modalTestimoni.thankYouTitle')}
						</h3>
						<p className="mt-2 max-w-[340px] font-['Montserrat'] text-[14px] leading-[22px] text-[#4b5563]">
							{t('modalTestimoni.thankYouDesc')}
						</p>
						<button
							type="button"
							className="mt-6 inline-flex h-[44px] cursor-pointer items-center justify-center rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-8 font-['Montserrat'] text-[15px] font-semibold text-[#000000] shadow-[0px_3px_5.8px_0px_#0000004D] transition-colors hover:bg-[#c0e85a]"
							onClick={onClose}
						>
							{t('modalTestimoni.closeBtn')}
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit} noValidate>
						<span className="block font-['Montserrat'] text-[13px] font-semibold uppercase tracking-[1.4px] text-[#000000CC]">
							{t('modalTestimoni.badge')}
						</span>
						<h3
							id="modal-testimoni-title"
							className="mt-1 pr-10 font-['Montserrat'] text-[22px] font-bold leading-[30px] text-[#000000] sm:text-[26px] sm:leading-[34px]"
						>
							{t('modalTestimoni.title')}
						</h3>
						<p className="mt-2 font-['Montserrat'] text-[13px] leading-[20px] text-[#4b5563]">
							{t('modalTestimoni.subtitle')}
						</p>

						<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
							{/* Nama */}
							<div className="sm:col-span-2">
								<label htmlFor="testimoni-name" className="mb-1.5 block font-['Montserrat'] text-[13px] font-semibold text-[#1F3320]">
									{t('modalTestimoni.nameLabel')}
								</label>
								<input
									id="testimoni-name"
									type="text"
									value={form.name}
									maxLength={40}
									placeholder={t('modalTestimoni.namePlaceholder')}
									className={`${inputBase} ${errors.name ? 'border-red-500' : 'border-[#e5e5e5]'}`}
									onChange={(e) => setField('name', e.target.value)}
								/>
								{errors.name && <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>}
							</div>

							{/* Unit + peran */}
							<div className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2">
								<div>
									<label htmlFor="testimoni-unit" className="mb-1.5 block font-['Montserrat'] text-[13px] font-semibold text-[#1F3320]">
										{t('modalTestimoni.unitLabel')}
									</label>
									<DropdownField
										id="testimoni-unit"
										value={form.unit}
										placeholder={t('modalTestimoni.unitPlaceholder')}
										options={UNIT_OPTIONS}
										error={errors.unit}
										onChange={(value) => setField('unit', value)}
									/>
								</div>

								<div>
									<label htmlFor="testimoni-role" className="mb-1.5 block font-['Montserrat'] text-[13px] font-semibold text-[#1F3320]">
										{t('modalTestimoni.roleLabel')}
									</label>
									<DropdownField
										id="testimoni-role"
										value={form.role}
										placeholder={t('modalTestimoni.rolePlaceholder')}
										options={ROLE_OPTIONS}
										error={errors.role}
										onChange={(value) => setField('role', value)}
									/>
								</div>
							</div>

							{/* Rating */}
							<div>
								<span className="mb-1.5 block font-['Montserrat'] text-[13px] font-semibold text-[#1F3320]">
										{t('modalTestimoni.ratingLabel')}
								</span>
								<div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											className="cursor-pointer p-0.5 transition-transform hover:scale-110"
											aria-label={`${t('modalTestimoni.ratingLabel')} ${star}`}
											aria-pressed={form.rating === star}
											onMouseEnter={() => setHoverRating(star)}
											onClick={() => setField('rating', star)}
										>
											<Star
												size={30}
												strokeWidth={1.5}
												className={star <= activeRating ? 'text-[#f5a623]' : 'text-[#d1d5db]'}
												fill={star <= activeRating ? 'currentColor' : 'none'}
											/>
										</button>
									))}
									{form.rating > 0 && (
										<span className="ml-2 font-['Montserrat'] text-[20px] font-normal text-[#1F3320]">
											{form.rating}.0
										</span>
									)}
								</div>
								{errors.rating && <p className="mt-1 text-[12px] text-red-500">{errors.rating}</p>}
							</div>

							{/* Isi ulasan */}
							<div>
								<label htmlFor="testimoni-text" className="mb-1.5 block font-['Montserrat'] text-[13px] font-semibold text-[#1F3320]">
									{t('modalTestimoni.reviewLabel')}
								</label>
								<textarea
									id="testimoni-text"
									rows={4}
									value={form.text}
									maxLength={MAX_TEXT}
									placeholder={t('modalTestimoni.reviewPlaceholder')}
									className={`${inputBase} resize-none leading-[22px] ${errors.text ? 'border-red-500' : 'border-[#e5e5e5]'}`}
									onChange={(e) => setField('text', e.target.value)}
								/>
								<div className="mt-1 flex items-start justify-between gap-2">
									<p className="text-[12px] text-red-500">{errors.text}</p>
									<span className="shrink-0 font-['Montserrat'] text-[12px] text-[#6b7280]">
										{form.text.length}/{MAX_TEXT}
									</span>
								</div>
							</div>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="mt-4 flex h-[48px] w-full cursor-pointer items-center justify-center rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-4 font-['Montserrat'] text-[16px] font-semibold text-[#000000] shadow-[0px_3px_5.8px_0px_#0000004D] transition-colors hover:bg-[#c0e85a] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
						>
							{isSubmitting ? t('modalTestimoni.submittingBtn') : t('modalTestimoni.submitBtn')}
						</button>
					</form>
				)}
			</div>
		</div>
	)
}
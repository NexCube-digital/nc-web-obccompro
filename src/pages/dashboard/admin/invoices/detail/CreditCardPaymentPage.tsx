import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { invoiceService, type InvoiceBookingDetails } from '../invoiceService'
import CreditCardPaymentForm from '../payment/CreditCardPaymentForm'

function CreditCardPaymentPage() {
	const location = useLocation()
	const navigate = useNavigate()
	const bookingId = new URLSearchParams(location.search).get('bookingId') ?? ''
	const [booking, setBooking] = useState<InvoiceBookingDetails | null>(null)
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		if (!bookingId) {
			navigate('/home', { replace: true })
			return
		}

		let active = true
		invoiceService.getBookingDetails(bookingId)
			.then((details) => {
				if (!active) return
				if (details.status === 'fully_paid' || details.status === 'completed' || details.payments[0]?.status === 'paid') {
					navigate(`/invoice-payment/success?bookingId=${encodeURIComponent(bookingId)}`, {
						replace: true,
					})
					return
				}
				if (['cancelled', 'expired', 'refunded'].includes(details.status)) {
					navigate(`/invoice-payment/failed?bookingId=${encodeURIComponent(bookingId)}`, {
						replace: true,
					})
					return
				}
				if (details.payments[0]?.method !== 'credit_card') {
					navigate(`/invoice-payment/finalizing?bookingId=${encodeURIComponent(bookingId)}`, {
						replace: true,
					})
					return
				}
				setBooking(details)
			})
			.catch((error: unknown) => {
				if (active) setErrorMessage(error instanceof Error ? error.message : 'Booking tidak dapat dimuat.')
			})

		return () => { active = false }
	}, [bookingId, navigate])

	const openInformationOrder = () => {
		navigate(`/invoice-payment/finalizing?bookingId=${encodeURIComponent(bookingId)}`, {
			replace: true,
		})
	}

	return (
		<div className="flex min-h-screen flex-col bg-white font-body text-[#343133]">
			<main className="mx-auto w-full max-w-[560px] flex-1 px-4 pt-6 pb-16">
				{errorMessage ? (
					<p role="alert" className="rounded-lg border border-[#F1B4B4] bg-[#FDF2F2] px-4 py-3 text-sm text-[#C00000]">
						{errorMessage}
					</p>
				) : booking ? (
					<CreditCardPaymentForm
						bookingId={booking.id}
						amount={booking.payments[0]?.amount ?? booking.pricing.totalPrice}
						onPaymentStarted={openInformationOrder}
					/>
				) : (
					<p role="status" className="text-center text-sm text-[#6F6B6E]">Memuat pembayaran kartu...</p>
				)}
			</main>
		</div>
	)
}

export default CreditCardPaymentPage
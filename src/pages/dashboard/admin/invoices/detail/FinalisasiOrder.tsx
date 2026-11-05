import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PaymentInstructionCard, { type PaymentBookingItem } from '../payment/PaymentInstructionCard'
import { invoiceService, type InvoiceBookingDetails } from '../invoiceService'
import { parsePersistedDirectPayment } from '../../../../../services/paymentService'

function FinalisasiOrder() {
  const navigate = useNavigate()
  const location = useLocation()
  const bookingId = new URLSearchParams(location.search).get('bookingId') ?? ''
  const [booking, setBooking] = useState<InvoiceBookingDetails | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (!bookingId) {
      navigate('/admin/invoices', { replace: true })
      return
    }
    let active = true
    const refreshStatus = async () => {
      setIsChecking(true)
      try {
        const details = await invoiceService.getBookingDetails(bookingId)
        if (!active) return
        const payment = details.payments[0]
        if (['fully_paid', 'completed'].includes(details.status) || ['paid', 'settlement', 'capture'].includes(payment?.status ?? '')) {
          navigate(`/invoice-payment/success?bookingId=${encodeURIComponent(bookingId)}`, { replace: true })
          return
        }
        if (['cancelled', 'expired', 'refunded'].includes(details.status) || ['failed', 'expired', 'refunded'].includes(payment?.status ?? '')) {
          navigate(`/invoice-payment/failed?bookingId=${encodeURIComponent(bookingId)}`, { replace: true })
          return
        }
        setBooking(details)
        setErrorMessage('')
      } catch (error) {
        if (active) setErrorMessage(error instanceof Error ? error.message : 'Status pembayaran belum dapat dimuat.')
      } finally {
        if (active) setIsChecking(false)
      }
    }

    void refreshStatus()
    const interval = window.setInterval(() => { void refreshStatus() }, 4000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [bookingId, navigate])

  const payment = booking?.payments[0]
  const paymentDetails = payment?.paymentDetails
  const directInfo = parsePersistedDirectPayment(paymentDetails)
  const paymentChannel = typeof paymentDetails?.obc_payment_channel === 'string'
    ? paymentDetails.obc_payment_channel
    : payment?.method ?? 'Pembayaran online'
  const bookings: PaymentBookingItem[] = booking ? [{
    id: booking.id,
    facilityName: booking.resource.name,
    bookingDate: booking.bookingDate,
    startTime: booking.startTime,
    endTime: booking.endTime,
  }] : []

  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-[#343133]">
      <main className="mx-auto w-full max-w-[560px] flex-1 px-4 pt-6 pb-16">
        {errorMessage && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}
        {!booking && !errorMessage && <p role="status" className="py-10 text-center text-sm text-[#6F6B6E]">Memeriksa status pembayaran...</p>}
        {booking && (
          <PaymentInstructionCard
            info={directInfo}
            totalLabel={`Rp ${(payment?.amount ?? booking.pricing.totalPrice).toLocaleString('id-ID')}`}
            channelLabel={paymentChannel}
            bookings={bookings}
            onCheckStatus={() => { void invoiceService.getBookingDetails(bookingId).then(setBooking).catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Gagal memeriksa status.')) }}
          />
        )}
        {isChecking && <p role="status" className="mt-3 text-center text-xs text-[#6F6B6E]">Memperbarui status...</p>}
      </main>
    </div>
  )
}

export default FinalisasiOrder

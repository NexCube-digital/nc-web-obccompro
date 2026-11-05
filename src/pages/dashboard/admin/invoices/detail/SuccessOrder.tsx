import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CalendarDays, CheckCircle2, Clock3, MapPin } from 'lucide-react'
import { invoiceService, type InvoiceBookingDetails } from '../invoiceService'

const isConfirmed = (booking: InvoiceBookingDetails) =>
  ['fully_paid', 'completed'].includes(booking.status)
  || ['paid', 'settlement', 'capture'].includes(booking.payments[0]?.status ?? '')
  || (booking.status === 'unpaid' && !booking.lockedUntil && booking.notes?.startsWith('[PAYMENT:COD]'))

function SuccessOrder() {
  const navigate = useNavigate()
  const location = useLocation()
  const bookingId = new URLSearchParams(location.search).get('bookingId') ?? ''
  const [booking, setBooking] = useState<InvoiceBookingDetails | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const isCod = booking?.notes?.startsWith('[PAYMENT:COD]') ?? false

  useEffect(() => {
    if (!bookingId) {
      navigate('/admin/invoices', { replace: true })
      return
    }
    let active = true
    invoiceService.getBookingDetails(bookingId)
      .then((details) => {
        if (!active) return
        if (!isConfirmed(details)) {
          navigate(`/invoice-payment/finalizing?bookingId=${encodeURIComponent(bookingId)}`, { replace: true })
          return
        }
        setBooking(details)
      })
      .catch((error: unknown) => {
        if (active) setErrorMessage(error instanceof Error ? error.message : 'Status booking tidak dapat dimuat.')
      })
    return () => { active = false }
  }, [bookingId, navigate])

  if (errorMessage) return <main className="mx-auto max-w-[560px] px-4 py-10"><p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p></main>
  if (!booking) return <p role="status" className="px-4 py-10 text-center text-sm text-obc-muted">Memeriksa konfirmasi booking...</p>

  const bookingCode = booking.id.slice(-8).toUpperCase()
  const bookingDate = new Date(`${booking.bookingDate}T00:00:00`).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const total = booking.pricing.totalPrice.toLocaleString('id-ID')

  return (
    <main className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-[1068px] content-center gap-8 px-4 py-8 text-obc-charcoal md:grid-cols-[minmax(0,1fr)_480px] md:px-6">
      <section className="flex flex-col justify-center">
        <span className="grid size-14 place-items-center rounded-full bg-[#E7F5D0] text-obc-green"><CheckCircle2 size={32} /></span>
        <span className="mt-5 w-fit rounded-full bg-[#E7F5D0] px-3 py-1.5 text-[11px] font-bold text-obc-green">{isCod ? 'BOOKING DIKONFIRMASI' : 'PEMBAYARAN BERHASIL'}</span>
        <h1 className="mt-3 font-heading text-2xl font-bold md:text-[32px]">Booking berhasil</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-obc-muted">{isCod ? 'Slot lapangan sudah dikonfirmasi. Pembayaran dilakukan di lokasi saat kedatangan.' : 'Pembayaran diterima dan booking lapangan Anda sudah dikonfirmasi.'}</p>
        <div className="mt-6 rounded-xl border border-obc-border bg-white p-4">
          <p className="text-[11px] font-semibold uppercase text-obc-muted">Kode booking</p>
          <p className="mt-1 font-heading text-2xl font-bold text-obc-green">{bookingCode}</p>
        </div>
      </section>

      <section className="h-fit rounded-xl border border-obc-border bg-white p-5">
        <h2 className="font-heading text-base font-semibold">Ringkasan booking</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div className="flex items-start gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-obc-green" /><div><dt className="text-xs text-obc-muted">Lapangan</dt><dd className="mt-0.5 font-semibold">{booking.resource.name}</dd></div></div>
          <div className="flex items-start gap-3"><CalendarDays size={17} className="mt-0.5 shrink-0 text-obc-green" /><div><dt className="text-xs text-obc-muted">Tanggal</dt><dd className="mt-0.5 font-semibold">{bookingDate}</dd></div></div>
          <div className="flex items-start gap-3"><Clock3 size={17} className="mt-0.5 shrink-0 text-obc-green" /><div><dt className="text-xs text-obc-muted">Waktu</dt><dd className="mt-0.5 font-semibold">{booking.startTime} - {booking.endTime} ({booking.durationMinutes / 60} jam)</dd></div></div>
        </dl>
        <div className="mt-5 flex items-center justify-between border-t border-obc-border pt-4"><span className="text-sm font-semibold">{isCod ? 'Total dibayar di lokasi' : 'Total dibayar'}</span><strong className="font-heading text-lg text-obc-green">Rp {total}</strong></div>
        <button type="button" onClick={() => navigate('/admin/invoices')} className="mt-5 h-11 w-full rounded-lg bg-obc-green text-sm font-semibold text-white transition-colors hover:bg-obc-green-hover">Selesai</button>
      </section>
    </main>
  )
}

export default SuccessOrder

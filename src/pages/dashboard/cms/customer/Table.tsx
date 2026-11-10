import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Eye,
  Mail,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  getCustomerAvatarUrl,
  type CustomerRecord,
  type CustomerStatus,
} from "../../services/cms/customerService";

type Props = {
  customers: CustomerRecord[];
  loading: boolean;
};

export default function CustomerTable({ customers, loading }: Props) {
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerRecord | null>(null);

  useEffect(() => {
    if (!selectedCustomer) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCustomer(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCustomer]);

  const statusLabels: Record<CustomerStatus, string> = {
    active: "Aktif",
    inactive: "Nonaktif",
    suspended: "Ditangguhkan",
  };
  const statusClasses: Record<CustomerStatus, string> = {
    active: "bg-[#E7F5D0] text-[#1F3320]",
    inactive: "bg-[#F1EFE8] text-[#68665F]",
    suspended: "bg-[#FDF2F2] text-[#B42318]",
  };
  const initialsFor = (name: string) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  const formatDate = (value: string | null, withTime = false) =>
    value
      ? new Date(value).toLocaleDateString(
          "id-ID",
          withTime
            ? {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            : { day: "numeric", month: "short", year: "numeric" },
        )
      : "Belum pernah";
  const avatar = (customer: CustomerRecord, size = "size-11") => {
    const avatarUrl = getCustomerAvatarUrl(customer.avatarUrl);
    return avatarUrl ? (
      <img
        src={avatarUrl}
        alt=""
        className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm`}
      />
    ) : (
      <span
        className={`grid ${size} shrink-0 place-items-center rounded-full bg-[#E7F5D0] font-heading text-[13px] font-bold text-[#1F3320] ring-2 ring-white shadow-sm`}
      >
        {initialsFor(customer.name) || <Users size={16} />}
      </span>
    );
  };

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_2px_12px_rgba(31,51,32,0.04)]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-obc-border bg-[#FDFCF7] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">
              <Users size={18} />
            </span>
            <div>
              <h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">
                Daftar pelanggan
              </h2>
              <p className="mt-0.5 text-[12px] text-obc-muted">
                Data akun dan aktivitas pelanggan
              </p>
            </div>
          </div>
          <span className="rounded-full border border-obc-border bg-white px-3 py-1.5 text-[12px] font-semibold text-obc-charcoal">
            {customers.length.toLocaleString("id-ID")} pelanggan
          </span>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-obc-border bg-white font-heading text-[10px] font-semibold uppercase tracking-wide text-obc-muted">
                <th className="px-5 py-3.5">Pelanggan</th>
                <th className="px-5 py-3.5">Aktivitas</th>
                <th className="px-5 py-3.5">Terdaftar</th>
                <th className="px-5 py-3.5">Login terakhir</th>
                <th className="px-5 py-3.5 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-16 text-center text-obc-muted"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-obc-border border-t-obc-green" />
                      Memuat pelanggan...
                    </span>
                  </td>
                </tr>
              ) : customers.length ? (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-obc-border transition-colors hover:bg-[#F8FAF4]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {avatar(customer)}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-obc-charcoal">
                            {customer.name}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-obc-muted">
                            <Mail size={12} className="shrink-0" />
                            {customer.email}
                          </p>
                          {customer.phone && (
                            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-obc-muted">
                              <Phone size={12} className="shrink-0" />
                              {customer.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded-md bg-[#F3F8E8] px-2 py-1 text-[11px] font-medium text-[#1F3320]">
                          {customer._count.bookings} booking
                        </span>
                        <span className="rounded-md bg-[#F1EFE8] px-2 py-1 text-[11px] font-medium text-[#68665F]">
                          {customer._count.memberships} membership
                        </span>
                        <span className="rounded-md bg-[#FBF0D3] px-2 py-1 text-[11px] font-medium text-[#8A6100]">
                          {customer._count.reviews} ulasan
                        </span>
                      </div>
                      <p className="mt-1.5 text-[10px] capitalize text-obc-muted">
                        Akun {customer.authProvider}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[12px] text-obc-charcoal">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-obc-green" />
                        {formatDate(customer.createdAt)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[12px] text-obc-charcoal">
                      <span className="flex items-center gap-2">
                        <Clock3 size={14} className="text-obc-green" />
                        {formatDate(customer.lastLoginAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(customer)}
                          title={`Lihat detail ${customer.name}`}
                          aria-label={`Lihat detail ${customer.name}`}
                          className="grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-green transition-colors hover:border-obc-green hover:bg-[#F3F8E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDF178]"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <span className="mx-auto grid size-11 place-items-center rounded-full bg-[#F3F8E8] text-obc-green">
                      <Users size={19} />
                    </span>
                    <p className="mt-3 text-[13px] font-semibold text-obc-charcoal">
                      Belum ada pelanggan
                    </p>
                    <p className="mt-1 text-[12px] text-obc-muted">
                      Coba ubah kata kunci pencarian Anda.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedCustomer(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-obc-border bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-obc-border bg-[#FDFCF7] px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                {avatar(selectedCustomer, "size-14")}
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-obc-green">
                    Profil pelanggan
                  </p>
                  <h2
                    id="customer-detail-title"
                    className="mt-1 truncate font-heading text-lg font-bold text-obc-charcoal"
                  >
                    {selectedCustomer.name}
                  </h2>
                  <span
                    className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[selectedCustomer.status]}`}
                  >
                    {statusLabels[selectedCustomer.status]}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                aria-label="Tutup detail pelanggan"
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal"
              >
                <X size={17} />
              </button>
            </header>
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-lg bg-[#F3F8E8] p-3">
                  <BookOpen size={16} className="text-obc-green" />
                  <p className="mt-2 font-heading text-xl font-bold text-obc-charcoal">
                    {selectedCustomer._count.bookings}
                  </p>
                  <p className="text-[10px] text-obc-muted sm:text-[11px]">
                    Booking
                  </p>
                </div>
                <div className="rounded-lg bg-[#F1EFE8] p-3">
                  <ShieldCheck size={16} className="text-[#68665F]" />
                  <p className="mt-2 font-heading text-xl font-bold text-obc-charcoal">
                    {selectedCustomer._count.memberships}
                  </p>
                  <p className="text-[10px] text-obc-muted sm:text-[11px]">
                    Membership
                  </p>
                </div>
                <div className="rounded-lg bg-[#FBF0D3] p-3">
                  <Star size={16} className="text-[#8A6100]" />
                  <p className="mt-2 font-heading text-xl font-bold text-obc-charcoal">
                    {selectedCustomer._count.reviews}
                  </p>
                  <p className="text-[10px] text-obc-muted sm:text-[11px]">
                    Ulasan
                  </p>
                </div>
              </div>
              <section className="mt-5">
                <h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal">
                  <UserRound size={15} className="text-obc-green" />
                  Informasi akun
                </h3>
                <dl className="mt-3 grid gap-x-6 gap-y-4 border-t border-obc-border pt-4 text-[12px] sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
                      Email
                    </dt>
                    <dd className="mt-1 flex items-start gap-2 break-all font-medium text-obc-charcoal">
                      <Mail
                        size={13}
                        className="mt-0.5 shrink-0 text-obc-green"
                      />
                      {selectedCustomer.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
                      Telepon
                    </dt>
                    <dd className="mt-1 flex items-start gap-2 font-medium text-obc-charcoal">
                      <Phone
                        size={13}
                        className="mt-0.5 shrink-0 text-obc-green"
                      />
                      {selectedCustomer.phone || "Belum ditambahkan"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
                      Username
                    </dt>
                    <dd className="mt-1 font-medium text-obc-charcoal">
                      {selectedCustomer.username || "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
                      Metode masuk
                    </dt>
                    <dd className="mt-1 capitalize font-medium text-obc-charcoal">
                      {selectedCustomer.authProvider || "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
                      Terdaftar
                    </dt>
                    <dd className="mt-1 font-medium text-obc-charcoal">
                      {formatDate(selectedCustomer.createdAt, true)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
                      Login terakhir
                    </dt>
                    <dd className="mt-1 font-medium text-obc-charcoal">
                      {formatDate(selectedCustomer.lastLoginAt, true)}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
                      ID pelanggan
                    </dt>
                    <dd className="mt-1 break-all font-mono text-[11px] text-obc-muted">
                      {selectedCustomer.id}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

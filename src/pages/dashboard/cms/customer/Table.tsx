import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Eye,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import {
  getCustomerAvatarUrl,
  type CustomerRecord,
} from "../../services/cms/customerService";
import CustomerDetailModal from "./ModalDetail";

type Props = {
  customers: CustomerRecord[];
  loading: boolean;
};

export default function CustomerTable({ customers, loading }: Props) {
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerRecord | null>(null);

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
          <table className="w-full min-w-215 text-left">
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
      <CustomerDetailModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </>
  );
}

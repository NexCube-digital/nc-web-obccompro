import { useEffect } from "react";
import {
  BookOpen,
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
  customer: CustomerRecord | null;
  onClose: () => void;
};

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

function formatDate(value: string | null, withTime = false) {
  return value
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
}

function CustomerAvatar({ customer }: { customer: CustomerRecord }) {
  const avatarUrl = getCustomerAvatarUrl(customer.avatarUrl);
  const initials = customer.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return avatarUrl ? (
    <img
      src={avatarUrl}
      alt=""
      className="size-14 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
    />
  ) : (
    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#E7F5D0] font-heading text-[15px] font-bold text-[#1F3320] ring-2 ring-white shadow-sm">
      {initials || <Users size={18} />}
    </span>
  );
}

export default function CustomerDetailModal({ customer, onClose }: Props) {
  useEffect(() => {
    if (!customer) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [customer, onClose]);

  if (!customer) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
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
            <CustomerAvatar customer={customer} />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-obc-green">
                Profil pelanggan
              </p>
              <h2
                id="customer-detail-title"
                className="mt-1 truncate font-heading text-lg font-bold text-obc-charcoal"
              >
                {customer.name}
              </h2>
              <span
                className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[customer.status]}`}
              >
                {statusLabels[customer.status]}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
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
                {customer._count.bookings}
              </p>
              <p className="text-[10px] text-obc-muted sm:text-[11px]">Booking</p>
            </div>
            <div className="rounded-lg bg-[#F1EFE8] p-3">
              <ShieldCheck size={16} className="text-[#68665F]" />
              <p className="mt-2 font-heading text-xl font-bold text-obc-charcoal">
                {customer._count.memberships}
              </p>
              <p className="text-[10px] text-obc-muted sm:text-[11px]">Membership</p>
            </div>
            <div className="rounded-lg bg-[#FBF0D3] p-3">
              <Star size={16} className="text-[#8A6100]" />
              <p className="mt-2 font-heading text-xl font-bold text-obc-charcoal">
                {customer._count.reviews}
              </p>
              <p className="text-[10px] text-obc-muted sm:text-[11px]">Ulasan</p>
            </div>
          </div>
          <section className="mt-5">
            <h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal">
              <UserRound size={15} className="text-obc-green" />
              Informasi akun
            </h3>
            <dl className="mt-3 grid gap-x-6 gap-y-4 border-t border-obc-border pt-4 text-[12px] sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">Email</dt>
                <dd className="mt-1 flex items-start gap-2 break-all font-medium text-obc-charcoal">
                  <Mail size={13} className="mt-0.5 shrink-0 text-obc-green" />
                  {customer.email}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">Telepon</dt>
                <dd className="mt-1 flex items-start gap-2 font-medium text-obc-charcoal">
                  <Phone size={13} className="mt-0.5 shrink-0 text-obc-green" />
                  {customer.phone || "Belum ditambahkan"}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">Username</dt>
                <dd className="mt-1 font-medium text-obc-charcoal">{customer.username || "-"}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">Metode masuk</dt>
                <dd className="mt-1 capitalize font-medium text-obc-charcoal">{customer.authProvider || "-"}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">Terdaftar</dt>
                <dd className="mt-1 font-medium text-obc-charcoal">{formatDate(customer.createdAt, true)}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">Login terakhir</dt>
                <dd className="mt-1 font-medium text-obc-charcoal">{formatDate(customer.lastLoginAt, true)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">ID pelanggan</dt>
                <dd className="mt-1 break-all font-mono text-[11px] text-obc-muted">{customer.id}</dd>
              </div>
            </dl>
          </section>
        </div>
      </section>
    </div>
  );
}

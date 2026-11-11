import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Eye,
  Mail,
  Search,
  ShieldAlert,
  UserRound,
  Users,
} from "lucide-react";
import Pagination from "../../components/common/Pagination";
import ThemedSelect from "../../components/common/ThemedSelect";
import { toast } from "sonner";
import { accountService, type Staff, type StaffStatus } from "../../services/admin/AccountService";
import StaffModal from "./StaffModal";

const PAGE_SIZE = 10;
const statusLabels: Record<StaffStatus, string> = {
  active: "Aktif",
  inactive: "Nonaktif",
  suspended: "Ditangguhkan",
};
const roleLabels: Record<Staff["role"], string> = {
  super_admin: "Super admin",
  admin: "Admin",
  marketing: "Marketing",
  sport: "Sport",
};
const statusClasses: Record<StaffStatus, string> = {
  active: "!bg-[#E7F5D0] !text-[#1F3320]",
  inactive: "!bg-[#F1EFE8] !text-obc-muted",
  suspended: "!bg-[#FDF2F2] !text-[#B42318]",
};

function Summary({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_3px_rgba(31,51,32,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(31,51,32,0.08)]">
      <div className="flex items-center gap-3">
        <span className={`grid size-10 place-items-center rounded-lg ${tone}`}>
          <Icon size={18} />
        </span>
        <div>
          <p className="text-[12px] text-obc-muted">{label}</p>
          <p className="font-heading text-[22px] font-bold text-obc-charcoal">
            {value.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StaffTable() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StaffStatus>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    accountService
      .getStaffList()
      .then((data) => {
        if (!cancelled) setStaff(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setStaff([]);
          toast.error(
            error instanceof Error ? error.message : "Gagal memuat data staff.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleStaff = useMemo(
    () => staff.filter((user) => user.role !== "super_admin"),
    [staff],
  );

  const counts = useMemo(
    () => ({
      all: visibleStaff.length,
      active: visibleStaff.filter((user) => user.status === "active").length,
      inactive: visibleStaff.filter((user) => user.status === "inactive")
        .length,
      suspended: visibleStaff.filter((user) => user.status === "suspended")
        .length,
    }),
    [visibleStaff],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return visibleStaff.filter((user) => {
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const searchable = [user.name, user.email, user.role]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && searchable.includes(normalizedQuery);
    });
  }, [query, statusFilter, visibleStaff]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
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
  const avatar = (user: Staff, size = "size-11") =>
    user.avatarUrl ? (
      <img
        src={user.avatarUrl}
        alt=""
        className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm`}
      />
    ) : (
      <span
        className={`grid ${size} shrink-0 place-items-center rounded-full bg-[#E7F5D0] font-heading text-[13px] font-bold text-[#1F3320] ring-2 ring-white shadow-sm`}
      >
        {initialsFor(user.name) || <Users size={16} />}
      </span>
    );

  const updateStatus = async (user: Staff, status: StaffStatus) => {
    try {
      const updated = await accountService.updateStaff(user.id, { status });
      setStaff((current) =>
        current.map((item) =>
          item.id === updated.id ? { ...item, status: updated.status } : item,
        ),
      );
      toast.success(`Status ${user.name} diperbarui.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui status staff.",
      );
    }
  };

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Summary
          label="Total staff"
          value={counts.all}
          icon={Users}
          tone="bg-[#E7F5D0] text-[#1F3320]"
        />
        <Summary
          label="Staff aktif"
          value={counts.active}
          icon={BadgeCheck}
          tone="bg-[#EAF4F0] text-[#296049]"
        />
        <Summary
          label="Staff nonaktif"
          value={counts.inactive}
          icon={UserRound}
          tone="bg-[#F1EFE8] text-[#68665F]"
        />
        <Summary
          label="Staff ditangguhkan"
          value={counts.suspended}
          icon={ShieldAlert}
          tone="bg-[#FDF2F2] text-[#B42318]"
        />
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_2px_12px_rgba(31,51,32,0.04)]">
        <div className="flex flex-col gap-4 border-b border-obc-border bg-[#FDFCF7] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div
            role="tablist"
            aria-label="Filter status staff"
            className="flex gap-1 overflow-x-auto rounded-xl border border-obc-border bg-[#FDFCF7] p-1"
          >
            {(["all", "active", "inactive", "suspended"] as const).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={`shrink-0 rounded-lg px-3 py-2 text-[12px] font-medium transition-colors ${statusFilter === status ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}
                >
                  {status === "all" ? "Semua" : statusLabels[status]}{" "}
                  <span className="ml-1">{counts[status]}</span>
                </button>
              ),
            )}
          </div>
          <label className="relative block w-full sm:max-w-70">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Cari nama, email, role..."
              className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[13px] outline-none transition-colors focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left">
            <thead>
              <tr className="border-b border-obc-border bg-white font-heading text-[10px] font-semibold uppercase tracking-wide text-obc-muted">
                <th className="px-5 py-3.5">Staff</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Bergabung</th>
                <th className="px-5 py-3.5">Status akun</th>
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
                      Memuat data staff...
                    </span>
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-obc-border transition-colors hover:bg-[#F8FAF4]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {avatar(user)}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-obc-charcoal">
                            {user.name}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-obc-muted">
                            <Mail size={12} className="shrink-0" />
                            {user.email}
                          </p>
                          {user.teamProfile?.position && (
                            <p className="mt-0.5 truncate text-[10px] text-obc-green">
                              {user.teamProfile.position}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-md bg-[#F3F8E8] px-2.5 py-1.5 text-[11px] font-semibold text-[#1F3320]">
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[12px] text-obc-charcoal">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-obc-green" />
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <ThemedSelect
                        label={`Status akun ${user.name}`}
                        value={user.status}
                        options={(
                          ["active", "inactive", "suspended"] as StaffStatus[]
                        ).map((status) => ({
                          value: status,
                          label: statusLabels[status],
                        }))}
                        onValueChange={(status) =>
                          updateStatus(user, status as StaffStatus)
                        }
                        className={`h-8 w-fit rounded-full border-0 px-2.5 py-1.5 text-[11px] font-semibold ${statusClasses[user.status]}`}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedStaff(user)}
                          title={`Lihat detail ${user.name}`}
                          aria-label={`Lihat detail ${user.name}`}
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
                      Staff tidak ditemukan
                    </p>
                    <p className="mt-1 text-[12px] text-obc-muted">
                      Ubah kata kunci atau filter status untuk mencoba lagi.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          itemLabel="staff"
          className="flex flex-col gap-3 border-t border-obc-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        />
      </section>
      <StaffModal
        staff={selectedStaff}
        onClose={() => setSelectedStaff(null)}
      />
    </>
  );
}

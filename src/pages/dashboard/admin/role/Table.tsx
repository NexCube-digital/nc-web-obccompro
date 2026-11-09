import {
  Activity,
  CalendarDays,
  ChevronDown,
  KeyRound,
  Megaphone,
  Pencil,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  PERMISSION_LABELS,
  ROLE_LABELS,
  type RolePermission,
} from "./roleService";

type Props = {
  roles: RolePermission[];
  loading: boolean;
  onEdit: (rolePermission: RolePermission) => void;
};

const roleIcons: Record<string, typeof ShieldCheck> = {
  admin: KeyRound,
  marketing: Megaphone,
  sport: Activity,
};

function formatUpdatedAt(value: string) {
  if (!value) return "Belum diperbarui";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Belum diperbarui"
    : date.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

export default function RolePermissionTable({ roles, loading, onEdit }: Props) {
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>(
    {},
  );
  const visibleRoles = roles.filter(
    (rolePermission) => rolePermission.role !== "super_admin",
  );
  const totalPermissions = visibleRoles.reduce(
    (total, rolePermission) => total + rolePermission.permissions.length,
    0,
  );

  return (
    <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-obc-border bg-[#FDFCF7] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">
            <ShieldCheck size={18} />
          </span>
          <div>
            <h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">
              Daftar role
            </h2>
            <p className="mt-0.5 text-[12px] text-obc-muted">
              Ringkasan role dan akses yang berlaku
            </p>
          </div>
        </div>
        <div className="flex gap-2 text-[11px] font-medium">
          <span className="rounded-full border border-obc-border bg-white px-3 py-1.5 text-obc-charcoal">
            {visibleRoles.length.toLocaleString("id-ID")} role
          </span>
          <span className="rounded-full bg-[#F3F8E8] px-3 py-1.5 text-obc-green">
            {totalPermissions.toLocaleString("id-ID")} akses aktif
          </span>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 text-left">
          <thead>
            <tr className="border-b border-obc-border bg-white font-heading text-[10px] font-semibold uppercase tracking-wide text-obc-muted">
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Jumlah akses</th>
              <th className="px-5 py-3.5">Permission aktif</th>
              <th className="px-5 py-3.5">Terakhir diperbarui</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
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
                    Memuat role dan permission...
                  </span>
                </td>
              </tr>
            ) : visibleRoles.length ? (
              visibleRoles.map((rolePermission) => {
                const RoleIcon = roleIcons[rolePermission.role] ?? ShieldCheck;
                const expanded = expandedRoles[rolePermission.role] ?? false;
                const shownPermissions = expanded
                  ? rolePermission.permissions
                  : rolePermission.permissions.slice(0, 5);
                return (
                  <tr
                    key={rolePermission.role}
                    className="border-t border-obc-border transition-colors hover:bg-[#F8FAF4]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#F3F8E8] text-obc-green">
                          <RoleIcon size={17} />
                        </span>
                        <div>
                          <p className="font-semibold text-obc-charcoal">
                            {ROLE_LABELS[rolePermission.role] ??
                              rolePermission.role}
                          </p>
                          <p className="mt-0.5 text-[10px] text-obc-muted">
                            {rolePermission.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex min-w-9 items-center justify-center rounded-md bg-[#F1EFE8] px-2.5 py-1.5 font-heading text-[12px] font-bold text-obc-charcoal">
                        {rolePermission.permissions.length}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex max-w-130 flex-wrap items-center gap-1.5">
                        {shownPermissions.map((permission) => (
                          <span
                            key={permission}
                            className="rounded-md border border-obc-border bg-white px-2.5 py-1 text-[11px] text-obc-charcoal"
                          >
                            {PERMISSION_LABELS[permission] ?? permission}
                          </span>
                        ))}
                        {rolePermission.permissions.length > 5 && (
                          <button
                            type="button"
                            aria-expanded={expanded}
                            onClick={() =>
                              setExpandedRoles((current) => ({
                                ...current,
                                [rolePermission.role]: !expanded,
                              }))
                            }
                            className="inline-flex items-center gap-1 rounded-md bg-[#F3F8E8] px-2.5 py-1 text-[11px] font-semibold text-obc-green transition-colors hover:bg-[#E7F5D0]"
                          >
                            {expanded
                              ? "Tampilkan lebih sedikit"
                              : `Selengkapnya (+${rolePermission.permissions.length - 5})`}
                            <ChevronDown
                              size={13}
                              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                        {!rolePermission.permissions.length && (
                          <span className="text-[12px] text-obc-muted">
                            Tidak ada akses aktif
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[11px] text-obc-muted">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={13} className="text-obc-green" />
                        {formatUpdatedAt(rolePermission.updatedAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onEdit(rolePermission)}
                        aria-label={`Atur permission ${ROLE_LABELS[rolePermission.role] ?? rolePermission.role}`}
                        title="Atur permission"
                        className="inline-grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:border-obc-green hover:bg-[#F3F8E8] hover:text-obc-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDF178]"
                      >
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <span className="mx-auto grid size-11 place-items-center rounded-full bg-[#F3F8E8] text-obc-green">
                    <Users size={19} />
                  </span>
                  <p className="mt-3 text-[13px] font-semibold text-obc-charcoal">
                    Belum ada data role
                  </p>
                  <p className="mt-1 text-[12px] text-obc-muted">
                    Role dan permission akan tampil di sini setelah tersedia.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

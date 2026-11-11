import { useEffect } from "react";
import {
	BriefcaseBusiness,
	CalendarDays,
	Clock3,
	Mail,
	Phone,
	ShieldCheck,
	UserRound,
	Users,
	X,
} from "lucide-react";
import type { Staff, StaffStatus } from "../../services/admin/AccountService";

type Props = {
	staff: Staff | null;
	onClose: () => void;
};

const roleLabels: Record<Staff["role"], string> = {
	super_admin: "Super admin",
	admin: "Admin",
	marketing: "Marketing",
	sport: "Sport",
};

const statusLabels: Record<StaffStatus, string> = {
	active: "Aktif",
	inactive: "Nonaktif",
	suspended: "Ditangguhkan",
};

const statusClasses: Record<StaffStatus, string> = {
	active: "!bg-[#E7F5D0] !text-[#1F3320]",
	inactive: "!bg-[#F1EFE8] !text-obc-muted",
	suspended: "!bg-[#FDF2F2] !text-[#B42318]",
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

function Avatar({ staff }: { staff: Staff }) {
	const initials = staff.name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();

	return staff.avatarUrl ? (
		<img
			src={staff.avatarUrl}
			alt=""
			className="size-14 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
		/>
	) : (
		<span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#E7F5D0] font-heading text-[15px] font-bold text-[#1F3320] ring-2 ring-white shadow-sm">
			{initials || <Users size={18} />}
		</span>
	);
}

export default function StaffModal({ staff, onClose }: Props) {
	useEffect(() => {
		if (!staff) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose, staff]);

	if (!staff) return null;

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
				aria-labelledby="staff-detail-title"
				className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-obc-border bg-white shadow-2xl"
			>
				<header className="flex items-start justify-between gap-4 border-b border-obc-border bg-[#FDFCF7] px-5 py-4 sm:px-6">
					<div className="flex min-w-0 items-center gap-3">
						<Avatar staff={staff} />
						<div className="min-w-0">
							<p className="text-[10px] font-semibold uppercase tracking-wide text-obc-green">
								Profil staff
							</p>
							<h2
								id="staff-detail-title"
								className="mt-1 truncate font-heading text-lg font-bold text-obc-charcoal"
							>
								{staff.name}
							</h2>
							<div className="mt-1.5 flex flex-wrap gap-1.5">
								<span className="rounded-full bg-[#F3F8E8] px-2.5 py-1 text-[10px] font-bold text-[#1F3320]">
									{roleLabels[staff.role]}
								</span>
								<span
									className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[staff.status]}`}
								>
									{statusLabels[staff.status]}
								</span>
							</div>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Tutup detail staff"
						className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal"
					>
						<X size={17} />
					</button>
				</header>
				<div className="space-y-5 p-5 sm:p-6">
					<section>
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
									<Mail size={13} className="mt-0.5 shrink-0 text-obc-green" />
									{staff.email}
								</dd>
							</div>
							<div>
								<dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
									Telepon
								</dt>
								<dd className="mt-1 flex items-start gap-2 font-medium text-obc-charcoal">
									<Phone size={13} className="mt-0.5 shrink-0 text-obc-green" />
									{staff.phone || "Belum ditambahkan"}
								</dd>
							</div>
							<div>
								<dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
									Bergabung
								</dt>
								<dd className="mt-1 flex items-center gap-2 font-medium text-obc-charcoal">
									<CalendarDays size={13} className="text-obc-green" />
									{formatDate(staff.createdAt, true)}
								</dd>
							</div>
							<div>
								<dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
									Login terakhir
								</dt>
								<dd className="mt-1 flex items-center gap-2 font-medium text-obc-charcoal">
									<Clock3 size={13} className="text-obc-green" />
									{formatDate(staff.lastLoginAt, true)}
								</dd>
							</div>
							<div className="sm:col-span-2">
								<dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
									ID staff
								</dt>
								<dd className="mt-1 break-all font-mono text-[11px] text-obc-muted">
									{staff.id}
								</dd>
							</div>
						</dl>
					</section>
					<section>
						<h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal">
							<BriefcaseBusiness size={15} className="text-obc-green" />
							Profil tim
						</h3>
						<dl className="mt-3 grid gap-x-6 gap-y-4 border-t border-obc-border pt-4 text-[12px] sm:grid-cols-2">
							<div>
								<dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
									Posisi
								</dt>
								<dd className="mt-1 font-medium text-obc-charcoal">
									{staff.teamProfile?.position || "Belum diisi"}
								</dd>
							</div>
							<div>
								<dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
									Keahlian
								</dt>
								<dd className="mt-1 font-medium text-obc-charcoal">
									{staff.teamProfile?.expertise || "Belum diisi"}
								</dd>
							</div>
							<div className="sm:col-span-2">
								<dt className="text-[10px] font-medium uppercase tracking-wide text-obc-muted">
									Bio
								</dt>
								<dd className="mt-1 whitespace-pre-line leading-5 text-obc-charcoal">
									{staff.bio || "Belum ada bio."}
								</dd>
							</div>
						</dl>
					</section>
					<div className="flex items-start gap-2 rounded-lg bg-[#F3F8E8] p-3 text-[11px] text-obc-muted">
						<ShieldCheck size={14} className="mt-0.5 shrink-0 text-obc-green" />
						<span>
							Status akun saat ini:{" "}
							<strong className="font-semibold text-obc-charcoal">
								{statusLabels[staff.status]}
							</strong>
						</span>
					</div>
				</div>
			</section>
		</div>
	);
}

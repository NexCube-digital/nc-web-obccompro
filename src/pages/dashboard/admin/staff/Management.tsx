import { useState } from "react";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import StaffForm from "./StaffForm";
import StaffTable from "./StaffTable";

export default function Management() {
	const [showForm, setShowForm] = useState(false);

	return (
		<DashboardPageLayout
			breadcrumb="Staff"
			title="Manajemen staff"
			description="Kelola akun staff, role, status, dan profil tim."
		>
			<div className="mb-5 flex justify-end">
				{!showForm && (
					<button
						onClick={() => setShowForm(true)}
						className="rounded-lg bg-gradient-to-r from-[#404F14] to-[#9AAD3E] px-5 py-2 text-[13px] font-semibold text-white hover:shadow-md"
					>
						+ Tambah staff
					</button>
				)}
			</div>

			<div className="flex flex-col gap-5 lg:gap-6">
				{showForm && (
					<div className="rounded-2xl border border-obc-border bg-white p-5 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-7">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="font-heading text-[17px] font-semibold text-[#343133]">Tambah staff baru</h2>
							<button
								onClick={() => setShowForm(false)}
								className="rounded-lg border border-obc-border px-4 py-2 text-[13px] font-medium text-[#343133] hover:bg-[#FDFCF7]"
							>
								Batal
							</button>
						</div>
						<StaffForm onCreated={() => setShowForm(false)} />
					</div>
				)}

				{!showForm && <StaffTable />}
			</div>
		</DashboardPageLayout>
	);
}


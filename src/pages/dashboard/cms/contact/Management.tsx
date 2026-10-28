import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import ContactTable from "./ContactTable";

export default function Management() {
	return (
		<DashboardPageLayout
			breadcrumb="Kontak"
			title="Enquiry kontak"
			description="Tinjau dan kelola permintaan yang dikirim melalui website perusahaan."
		>
			<ContactTable />
		</DashboardPageLayout>
	);
}


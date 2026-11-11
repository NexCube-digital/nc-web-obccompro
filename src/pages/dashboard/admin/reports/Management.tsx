import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import ReportForm from "./Form";
import ReportDetailModal from "./ReportDetailModal";
import ReportTable from "./Table";
import {
  reportService,
  type ReportRecord,
} from "../../services/admin/reportService";

export default function Management() {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    reportService
      .getReports()
      .then((data) => {
        if (active)
          setReports(data.filter((report) => report.type !== "clients"));
      })
      .catch((error: unknown) => {
        if (active) toast.error(getApiErrorMessage(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleGenerated = (report: ReportRecord) => {
    if (report.type === "clients") return;
    setReports((current) => [
      report,
      ...current.filter((item) => item.id !== report.id),
    ]);
    setSelectedReport(report);
  };

  const handleViewReport = (report: ReportRecord) => {
    setSelectedReport(report);
  };

  return (
    <DashboardPageLayout
      breadcrumb="Laporan"
      title="Manajemen laporan"
      description="Generate dan tinjau laporan invoice serta keuangan."
    >
      <div className="mb-4">
        <ReportForm onGenerated={handleGenerated} />
      </div>
      <ReportTable
        reports={reports}
        loading={loading}
        onView={handleViewReport}
      />
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </DashboardPageLayout>
  );
}

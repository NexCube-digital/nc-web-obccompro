import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../components/layouts/Sidebar";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import {
  dashboardService,
} from "../services/admin/DashboardService";
import { accountService } from "../services/admin/AccountService";
import { unitbisnisService } from "../services/cms/unitbisnisService";
import { sportService } from "../services/sport/SportService";
import { authService } from "../../../services/auth";
import { toast } from "sonner";
import DashboardOverview from "./DashboardOverview";
import DashboardActivity from "./DashboardActivity";

async function getActiveResourceDistribution() {
  const pageSize = 100;
  const firstPage = await sportService.getResources({
    page: 1,
    limit: pageSize,
    status: "active",
  });

  const remainingPages = await Promise.allSettled(
    Array.from(
      { length: Math.max(0, firstPage.meta.totalPages - 1) },
      (_, index) =>
        sportService.getResources({
          page: index + 2,
          limit: pageSize,
          status: "active",
        }),
    ),
  );

  const pages = [
    firstPage,
    ...remainingPages.flatMap((result) => result.status === "fulfilled" ? [result.value] : []),
  ];
  const resources = pages.flatMap((page) => page.data);
  const counts = new Map<string, number>();

  for (const resource of resources) {
    const sportTypes =
      Array.isArray(resource.sportTypes) && resource.sportTypes.length
        ? resource.sportTypes
        : ["other"];

    for (const sportType of sportTypes) {
      counts.set(sportType, (counts.get(sportType) ?? 0) + 1);
    }
  }

  return {
    distribution: [...counts]
      .map(([sport, count]) => ({ sport, count }))
      .sort((first, second) => second.count - first.count),
    hasPartialFailure: remainingPages.some((result) => result.status === "rejected"),
  };
}

async function loadDashboardData() {
  const results = await Promise.allSettled([
    dashboardService.getSummary(),
    dashboardService.getComproSummary(),
    dashboardService.getMedia(),
    dashboardService.getCustomers(),
    accountService.getStaffList(),
    unitbisnisService.getUnits(),
    getActiveResourceDistribution(),
  ]);
  const [sport, compro, media, customers, staff, businessUnits, resourceDistribution] = results;

  return {
    summary: sport.status === "fulfilled" ? sport.value : null,
    comproSummary: compro.status === "fulfilled" ? compro.value : null,
    mediaCount: media.status === "fulfilled" ? media.value.length : null,
    customerCount: customers.status === "fulfilled" ? customers.value.pagination.total : null,
    activeStaffCount: staff.status === "fulfilled"
      ? staff.value.filter((user) => user.status === "active" && user.role !== "super_admin").length
      : null,
    activeBusinessUnitCount: businessUnits.status === "fulfilled"
      ? businessUnits.value.filter((unit) => unit.status === "active").length
      : null,
    activeResourceDistribution: resourceDistribution.status === "fulfilled"
      ? resourceDistribution.value.distribution
      : null,
    hasPartialFailure: results.some((result) => result.status === "rejected") ||
      (resourceDistribution.status === "fulfilled" && resourceDistribution.value.hasPartialFailure),
  };
}

/* ───────────── Halaman ───────────── */
export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = authService.getCurrentSession()?.user;
  const {
    data: dashboardData,
    isPending: loading,
    isFetchedAfterMount,
  } = useQuery({
    queryKey: ["admin-dashboard-summary", user?.id ?? null, user?.tenantId ?? null],
    queryFn: loadDashboardData,
    enabled: Boolean(user),
    staleTime: 30_000,
  });

  const summary = dashboardData?.summary ?? null;
  const comproSummary = dashboardData?.comproSummary ?? null;
  const mediaCount = dashboardData?.mediaCount ?? null;
  const customerCount = dashboardData?.customerCount ?? null;
  const activeStaffCount = dashboardData?.activeStaffCount ?? null;
  const activeBusinessUnitCount = dashboardData?.activeBusinessUnitCount ?? null;
  const activeResourceDistribution = dashboardData?.activeResourceDistribution ?? null;

  useEffect(() => {
    if (dashboardData?.hasPartialFailure && isFetchedAfterMount) {
      toast.error("Sebagian data dashboard gagal dimuat");
    }
  }, [dashboardData, isFetchedAfterMount]);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) setCollapsed((v) => !v);
    else setMobileOpen((v) => !v);
  };

  return (
    <div className="min-h-screen bg-obc-ivory font-body text-obc-charcoal">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onExpand={() => setCollapsed(false)}
      />

      <div
        className={`flex min-h-screen min-w-0 flex-col transition-[margin] duration-200 ${
          collapsed ? "lg:ml-19" : "lg:ml-64.5"
        }`}
      >
        <Header onToggleSidebar={toggleSidebar} />

        <main className="min-w-0 flex-1 px-3 py-5 sm:px-6 sm:py-6">
          {/* Judul halaman */}
          <div className="mb-6">
            <div>
              <p className="font-body text-[13px] text-obc-muted">
                Dashboard <span className="mx-1">/</span>
                <span className="font-medium text-obc-charcoal">Ringkasan</span>
              </p>
              <h1 className="mt-2 font-heading text-[24px] font-semibold tracking-[-0.01em] text-obc-charcoal sm:text-[32px]">
                Ringkasan operasional
              </h1>
              <p className="mt-1 font-body text-[14px] text-obc-muted">
                Data operasional terbaru dari OBC Sport dan website perusahaan.
              </p>
            </div>
          </div>

          <DashboardOverview
            summary={summary}
            comproSummary={comproSummary}
            mediaCount={mediaCount}
            customerCount={customerCount}
            activeStaffCount={activeStaffCount}
            activeBusinessUnitCount={activeBusinessUnitCount}
            loading={loading}
          />
          <DashboardActivity
            bookings={summary?.recentBookings ?? []}
            resourceDistribution={activeResourceDistribution}
            loading={loading}
          />
        </main>

        <Footer />
      </div>
    </div>
  );
}

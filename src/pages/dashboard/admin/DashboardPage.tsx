import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import {
  dashboardService,
  type ComproDashboardSummary,
  type DashboardSummary,
} from "../services/admin/DashboardService";
import { accountService } from "../services/admin/AccountService";
import { unitbisnisService } from "../services/cms/unitbisnisService";
import { sportService } from "../services/sport/SportService";
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
  const remainingPages = await Promise.all(
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
  const resources = [firstPage, ...remainingPages].flatMap((page) => page.data);
  const counts = new Map<string, number>();

  for (const resource of resources) {
    const sportTypes = new Set(
      resource.sportTypes.length ? resource.sportTypes : ["other"],
    );
    for (const sportType of sportTypes)
      counts.set(sportType, (counts.get(sportType) ?? 0) + 1);
  }

  return [...counts]
    .map(([sport, count]) => ({ sport, count }))
    .sort((first, second) => second.count - first.count);
}

/* ───────────── Halaman ───────────── */
export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [comproSummary, setComproSummary] =
    useState<ComproDashboardSummary | null>(null);
  const [mediaCount, setMediaCount] = useState<number | null>(null);
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [activeStaffCount, setActiveStaffCount] = useState<number | null>(null);
  const [activeBusinessUnitCount, setActiveBusinessUnitCount] = useState<
    number | null
  >(null);
  const [activeResourceDistribution, setActiveResourceDistribution] = useState<
    { sport: string; count: number }[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const results = await Promise.allSettled([
        dashboardService.getSummary(),
        dashboardService.getComproSummary(),
        dashboardService.getMedia(),
        dashboardService.getCustomers(),
        accountService.getStaffList(),
        unitbisnisService.getUnits(),
        getActiveResourceDistribution(),
      ]);
      if (cancelled) return;

      const [
        sport,
        compro,
        media,
        customers,
        staff,
        businessUnits,
        resourceDistribution,
      ] = results;
      if (sport.status === "fulfilled") setSummary(sport.value);
      if (compro.status === "fulfilled") setComproSummary(compro.value);
      if (media.status === "fulfilled") setMediaCount(media.value.length);
      if (customers.status === "fulfilled")
        setCustomerCount(customers.value.pagination.total);
      if (staff.status === "fulfilled")
        setActiveStaffCount(
          staff.value.filter(
            (user) => user.status === "active" && user.role !== "super_admin",
          ).length,
        );
      if (businessUnits.status === "fulfilled")
        setActiveBusinessUnitCount(
          businessUnits.value.filter((unit) => unit.status === "active").length,
        );
      if (resourceDistribution.status === "fulfilled")
        setActiveResourceDistribution(resourceDistribution.value);
      if (results.some((result) => result.status === "rejected")) {
        toast.error("Sebagian data dashboard gagal dimuat");
      }
      setLoading(false);
    }
    load();

    return () => {
      cancelled = true;
    };
  }, []);

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

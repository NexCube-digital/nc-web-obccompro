import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  breadcrumb: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function DashboardPageLayout({
  breadcrumb,
  title,
  description,
  children,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) setCollapsed((value) => !value);
    else setMobileOpen((value) => !value);
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
          collapsed ? "lg:ml-[76px]" : "lg:ml-[258px]"
        }`}
      >
        <Header onToggleSidebar={toggleSidebar} />
        <main className="min-w-0 flex-1 px-3 py-5 sm:px-6 sm:py-6">
          <div className="mb-6">
            <p className="font-body text-[13px] text-obc-muted">
              Dashboard <span className="mx-1">/</span>
              <span className="font-medium text-obc-charcoal">{breadcrumb}</span>
            </p>
            <h1 className="mt-2 font-heading text-[24px] font-semibold text-obc-charcoal sm:text-[32px]">
              {title}
            </h1>
            <p className="mt-1 font-body text-[14px] text-obc-muted">
              {description}
            </p>
          </div>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
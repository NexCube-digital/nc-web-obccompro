import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-obc-bg lg:flex-row">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={sidebarMobileOpen}
        onCloseMobile={() => setSidebarMobileOpen(false)}
        onExpand={() => setSidebarCollapsed(false)}
      />
      <div className={`flex flex-1 flex-col overflow-hidden transition-[margin] duration-200 ${
        sidebarCollapsed ? "lg:ml-[76px]" : "lg:ml-[258px]"
      }`}>
        <Header
          onMenuToggle={() => setSidebarMobileOpen(!sidebarMobileOpen)}
          onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

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
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-obc-bg lg:flex-row">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={sidebarMobileOpen}
        onCloseMobile={() => setSidebarMobileOpen(false)}
        onExpand={() => setSidebarCollapsed(false)}
      />
      <div className={`flex min-h-0 flex-1 flex-col overflow-hidden transition-[margin] duration-200 ${
        sidebarCollapsed ? "lg:ml-[76px]" : "lg:ml-[258px]"
      }`}>
        <Header
          onToggleSidebar={() => setSidebarMobileOpen((open) => !open)}
        />
        <main className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

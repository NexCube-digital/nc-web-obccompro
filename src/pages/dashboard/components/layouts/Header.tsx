import { Bell, Menu, Search, Sun } from "lucide-react";

type Props = { onToggleSidebar: () => void };

export default function Header({ onToggleSidebar }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-[60px] items-center gap-3 border-b border-obc-border bg-white px-3 sm:px-6">
      <button
        onClick={onToggleSidebar}
        aria-label="Buka/tutup menu"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-obc-border text-obc-charcoal transition-colors hover:bg-obc-hover-surface"
      >
        <Menu size={16} />
      </button>

      {/* Pencarian */}
      <label className="relative hidden w-full max-w-[320px] sm:block">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted"
        />
        <input
          type="search"
          placeholder="Cari apa saja..."
          className="h-9 w-full rounded-lg border border-obc-border bg-obc-ivory pl-9 pr-12 font-body text-[13px] text-obc-charcoal outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-obc-border bg-white px-1.5 py-0.5 font-body text-[10px] text-obc-muted">
          ⌘K
        </kbd>
      </label>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          aria-label="Cari"
          className="grid h-9 w-9 place-items-center rounded-lg border border-obc-border text-obc-charcoal transition-colors hover:bg-obc-hover-surface sm:hidden"
        >
          <Search size={16} />
        </button>
        <button
          aria-label="Ganti tema"
          className="grid h-9 w-9 place-items-center rounded-lg border border-obc-border text-obc-charcoal transition-colors hover:bg-obc-hover-surface"
        >
          <Sun size={16} />
        </button>
        <button
          aria-label="Notifikasi"
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-obc-border text-obc-charcoal transition-colors hover:bg-obc-hover-surface"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-obc-red ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2.5 pl-1">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-obc-green font-heading text-[12px] font-semibold text-[#CDF178]">
            AO
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="font-heading text-[13px] font-semibold text-obc-charcoal">
              Admin OBC
            </p>
            <p className="font-body text-[11px] text-obc-muted">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
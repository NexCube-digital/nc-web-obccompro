import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LoaderCircle, LogOut, Menu, Search, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TransitionLink, { navigateWithTransition } from "../../../../components/common/TransitionLink";
import { authService } from "../../../../services/auth";
import { getProfilePhotoUrl } from "../../../../services/accountService";
import { getAdminNotifications, type AdminNotification } from "../../../../services/notificationService";

type Props = { onToggleSidebar: () => void };

export default function Header({ onToggleSidebar }: Props) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => authService.getCurrentSession()?.user ?? null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncUser = () => setUser(authService.getCurrentSession()?.user ?? null);
    window.addEventListener("storage", syncUser);
    window.addEventListener("obc:auth-session-updated", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("obc:auth-session-updated", syncUser);
    };
  }, []);

  const accountName = user?.name || "Pengguna OBC";
  const accountRole = user?.role
    .replace(/[_-]/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Pengguna";
  const accountInitials = accountName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    try {
      await authService.logout();
    } catch {
      // Clear the local session and leave the dashboard even if the API is unavailable.
    }
    setUser(null);
    await navigateWithTransition("/login", navigate, { replace: true });
  };

  useEffect(() => {
    if (!notificationsOpen) return;

    let active = true;

    const loadNotifications = async () => {
      setNotificationsLoading(true);
      try {
        const items = await getAdminNotifications();
        if (active) setNotifications(items);
      } finally {
        if (active) setNotificationsLoading(false);
      }
    };

    void loadNotifications();
    const intervalId = window.setInterval(() => void loadNotifications(), 60_000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [notificationsOpen]);

  useEffect(() => {
    if (!profileMenuOpen && !notificationsOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;
      const insideProfileMenu = profileMenuRef.current?.contains(target);
      const insideNotifications = notificationsRef.current?.contains(target);
      if (!insideProfileMenu && !insideNotifications) {
        setProfileMenuOpen(false);
        setNotificationsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileMenuOpen, notificationsOpen]);

  return (
    <header className="sticky top-0 z-20 flex h-15 items-center gap-3 border-b border-obc-border bg-white px-3 sm:px-6">
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
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            aria-label="Notifikasi aktivitas sistem"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setProfileMenuOpen(false);
            }}
            className="relative grid h-9 w-9 place-items-center rounded-lg border border-obc-border text-obc-charcoal transition-colors hover:bg-obc-hover-surface"
          >
            <Bell size={16} />
            {notifications.some((notification) => !notification.isRead) && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-obc-red" aria-hidden="true" />
            )}
          </button>

          {notificationsOpen && (
            <section
              aria-label="Notifikasi aktivitas sistem"
              className="absolute right-0 top-full z-30 mt-2 w-85 max-w-[calc(100vw-24px)] overflow-hidden rounded-lg border border-obc-border bg-white shadow-[0_8px_24px_rgba(52,49,51,0.14)]"
            >
              <div className="border-b border-obc-border px-4 py-3">
                <h2 className="font-heading text-[14px] font-semibold text-obc-charcoal">Aktivitas sistem</h2>
              </div>
              {notificationsLoading ? (
                <div className="flex justify-center py-8"><LoaderCircle size={20} className="animate-spin text-obc-green" /></div>
              ) : notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-xs text-obc-muted">Belum ada aktivitas.</p>
              ) : (
                <ul className="max-h-[min(60vh,360px)] overflow-y-auto">
                  {notifications.map((notification) => (
                    <li key={notification.id} className={`border-b border-obc-border px-4 py-3 last:border-b-0 ${notification.isRead ? "bg-white" : "bg-obc-ivory"}`}>
                      <button
                        type="button"
                        onClick={() => {
                          if (notification.actionUrl) navigate(notification.actionUrl);
                          setNotificationsOpen(false);
                        }}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-heading text-xs font-bold text-obc-charcoal">{notification.title}</h3>
                          <time className="shrink-0 text-[10px] text-obc-muted" dateTime={notification.createdAt}>
                            {new Date(notification.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </time>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-obc-muted">{notification.body}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
            aria-label={`Menu akun ${accountName}`}
            onClick={() => {
              setProfileMenuOpen((open) => !open);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 rounded-lg p-1 text-left transition-colors hover:bg-obc-hover-surface"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-obc-green font-heading text-[12px] font-semibold text-[#CDF178]">
              {user?.avatarUrl ? (
                <img
                  src={getProfilePhotoUrl(user.avatarUrl)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : accountInitials || "U"}
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-heading text-[13px] font-semibold text-obc-charcoal">
                {accountName}
              </span>
              <span className="block font-body text-[11px] text-obc-muted">{accountRole}</span>
            </span>
            <ChevronDown size={14} className="hidden text-obc-muted sm:block" />
          </button>

          {profileMenuOpen && (
            <div
              role="menu"
              aria-label="Menu akun"
              className="absolute right-0 top-full z-30 mt-2 w-47.5 overflow-hidden rounded-lg border border-obc-border bg-white py-1 shadow-[0_8px_24px_rgba(52,49,51,0.14)]"
            >
              <TransitionLink
                role="menuitem"
                to="/settingaccount"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 font-body text-[13px] text-obc-charcoal transition-colors hover:bg-obc-hover-surface"
              >
                <Settings size={16} className="text-obc-muted" />
                Pengaturan
              </TransitionLink>
              <div className="mx-3 border-t border-obc-border" />
              <button
                role="menuitem"
                type="button"
                onClick={() => void handleLogout()}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-body text-[13px] text-obc-red transition-colors hover:bg-obc-hover-surface"
              >
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
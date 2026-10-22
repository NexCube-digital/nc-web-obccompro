import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TransitionLink, { navigateWithTransition } from "../../../../components/common/TransitionLink";
import { authService } from "../../../../services/auth";
import { getProfilePhotoUrl } from "../../../../services/accountService";
import { createAdminNotification, type AdminNotificationType } from "../../../../services/notificationService";

type Props = { onToggleSidebar: () => void };

export default function Header({ onToggleSidebar }: Props) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => authService.getCurrentSession()?.user ?? null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationBody, setNotificationBody] = useState("");
  const [notificationType, setNotificationType] = useState<AdminNotificationType>("info");
  const [notificationCustomerId, setNotificationCustomerId] = useState("");
  const [notificationActionUrl, setNotificationActionUrl] = useState("");
  const [sendingNotification, setSendingNotification] = useState(false);
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

  const handleSendNotification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!notificationCustomerId.trim() && !window.confirm("Kirim notifikasi ini ke semua pelanggan?")) return;

    setSendingNotification(true);
    try {
      await createAdminNotification({
        customerId: notificationCustomerId.trim() || null,
        title: notificationTitle.trim(),
        body: notificationBody.trim(),
        type: notificationType,
        actionUrl: notificationActionUrl.trim() || null,
      });
      setNotificationTitle("");
      setNotificationBody("");
      setNotificationCustomerId("");
      setNotificationActionUrl("");
      setNotificationType("info");
      toast.success("Notifikasi berhasil dikirim.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengirim notifikasi.");
    } finally {
      setSendingNotification(false);
    }
  };

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
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            aria-label="Notifikasi"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setProfileMenuOpen(false);
            }}
            className="grid h-9 w-9 place-items-center rounded-lg border border-obc-border text-obc-charcoal transition-colors hover:bg-obc-hover-surface"
          >
            <Bell size={16} />
          </button>

          {notificationsOpen && (
            <section
              aria-label="Notifikasi"
              className="absolute right-0 top-full z-30 mt-2 w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-lg border border-obc-border bg-white shadow-[0_8px_24px_rgba(52,49,51,0.14)]"
            >
              <div className="border-b border-obc-border px-4 py-3">
                <h2 className="font-heading text-[14px] font-semibold text-obc-charcoal">
                  Kirim notifikasi
                </h2>
              </div>
              <form onSubmit={handleSendNotification} className="space-y-3 p-4">
                <label className="block text-[12px] font-medium text-obc-charcoal">Judul
                  <input required maxLength={255} value={notificationTitle} onChange={(event) => setNotificationTitle(event.target.value)} className="mt-1 h-9 w-full rounded-lg border border-obc-border bg-obc-ivory px-3 text-[12px] outline-none focus:border-obc-green" />
                </label>
                <label className="block text-[12px] font-medium text-obc-charcoal">Isi notifikasi
                  <textarea required maxLength={2000} rows={3} value={notificationBody} onChange={(event) => setNotificationBody(event.target.value)} className="mt-1 w-full resize-y rounded-lg border border-obc-border bg-obc-ivory px-3 py-2 text-[12px] outline-none focus:border-obc-green" />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-[12px] font-medium text-obc-charcoal">Jenis
                    <select value={notificationType} onChange={(event) => setNotificationType(event.target.value as AdminNotificationType)} className="mt-1 h-9 w-full rounded-lg border border-obc-border bg-obc-ivory px-2 text-[12px] outline-none focus:border-obc-green">
                      <option value="info">Info</option><option value="promo">Promo</option><option value="booking">Booking</option><option value="payment">Pembayaran</option><option value="membership">Membership</option><option value="system">Sistem</option>
                    </select>
                  </label>
                  <label className="block text-[12px] font-medium text-obc-charcoal">ID pelanggan <span className="font-normal text-obc-muted">(opsional)</span>
                    <input value={notificationCustomerId} onChange={(event) => setNotificationCustomerId(event.target.value)} pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}" title="Masukkan UUID pelanggan yang valid, atau kosongkan untuk broadcast." placeholder="Kosong = semua pelanggan" className="mt-1 h-9 w-full rounded-lg border border-obc-border bg-obc-ivory px-2 text-[11px] outline-none focus:border-obc-green" />
                  </label>
                </div>
                <label className="block text-[12px] font-medium text-obc-charcoal">URL aksi <span className="font-normal text-obc-muted">(opsional)</span>
                  <input maxLength={500} value={notificationActionUrl} onChange={(event) => setNotificationActionUrl(event.target.value)} placeholder="/booking atau https://..." className="mt-1 h-9 w-full rounded-lg border border-obc-border bg-obc-ivory px-3 text-[12px] outline-none focus:border-obc-green" />
                </label>
                <button type="submit" disabled={sendingNotification} className="h-9 w-full rounded-lg bg-obc-green px-3 text-[12px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:opacity-60">
                  {sendingNotification ? "Mengirim..." : "Kirim notifikasi"}
                </button>
              </form>
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
                <img src={getProfilePhotoUrl(user.avatarUrl)} alt="" className="h-full w-full object-cover" />
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
              className="absolute right-0 top-full z-30 mt-2 w-[190px] overflow-hidden rounded-lg border border-obc-border bg-white py-1 shadow-[0_8px_24px_rgba(52,49,51,0.14)]"
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
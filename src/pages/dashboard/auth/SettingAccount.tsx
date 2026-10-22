import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import {
  Camera,
  KeyRound,
  Mail,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import Sidebar from "../components/layouts/Sidebar";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import { changePassword, getProfile, getProfilePhotoUrl, updateProfile, uploadProfilePhoto, type AccountProfile } from "../../../services/accountService";
import { getApiErrorMessage } from "../../../services/api";

/* ───────────── Helper ───────────── */
const cardCls =
  "rounded-2xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)]";

const inputCls =
  "h-11 w-full rounded-xl border border-obc-border bg-obc-ivory px-3.5 font-body text-[14px] text-obc-charcoal placeholder:text-obc-muted outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]";

const btnPrimary =
  "flex h-10 items-center justify-center gap-2 rounded-xl bg-obc-green px-4 font-heading text-[13px] font-medium text-white transition-colors hover:bg-obc-green-hover";

const btnOutline =
  "flex h-10 items-center justify-center gap-2 rounded-xl border border-obc-border bg-white px-4 font-heading text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-hover-surface";

const tabs = ["Profil", "Keamanan"] as const;
type Tab = (typeof tabs)[number];

/* ───────────── Komponen kecil ───────────── */
function CardTitle({
  title,
  sub,
  aside,
}: {
  title: string;
  sub?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">{title}</h2>
        {aside}
      </div>
      {sub && <p className="mt-1 font-body text-[13px] text-obc-muted">{sub}</p>}
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
  className = "",
}: {
  label: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center gap-1.5 font-heading text-[13px] font-medium text-obc-charcoal">
        {Icon && <Icon size={14} className="text-obc-muted" />}
        {label}
      </span>
      {children}
    </label>
  );
}

function Pill({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "lime" }) {
  const cls = tone === "lime" ? "bg-[#CDF178] text-[#1F3320]" : "bg-[#E7F5D0] text-[#0A730A]";
  return (
    <span className={`rounded-full px-2.5 py-1 font-heading text-[11px] font-semibold ${cls}`}>
      {children}
    </span>
  );
}

/* ───────────── Tab: Profil ───────────── */
function ProfilTab({
  firstName,
  lastName,
  email,
  phone,
  bio,
  role,
  avatarUrl,
  loading,
  saving,
  uploadingPhoto,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onBioChange,
  onPhotoSelect,
  onReset,
  onSave,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  role: string;
  avatarUrl: string | null;
  loading: boolean;
  saving: boolean;
  uploadingPhoto: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onPhotoSelect: (file: File) => void;
  onReset: () => void;
  onSave: () => void;
}) {
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onPhotoSelect(file);
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* Kartu avatar */}
      <div className={`${cardCls} h-fit p-5 text-center sm:p-6`}>
        <div className="relative mx-auto h-[88px] w-[88px]">
          {avatarUrl ? (
            <img src={getProfilePhotoUrl(avatarUrl)} alt={`Foto profil ${firstName} ${lastName}`} className="h-full w-full rounded-2xl object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center rounded-2xl bg-[#1F3320] font-heading text-[30px] font-bold text-[#CDF178]">
              {`${firstName} ${lastName}`.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "?"}
            </div>
          )}
          <button
            type="button"
            aria-label="Ganti foto profil"
            onClick={() => photoInputRef.current?.click()}
            disabled={loading || uploadingPhoto}
            className="absolute -bottom-1.5 -right-1.5 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-obc-green text-white transition-colors hover:bg-obc-green-hover"
          >
            {uploadingPhoto ? <span className="text-[10px]">...</span> : <Camera size={14} />}
          </button>
          <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="sr-only" />
        </div>
        <p className="mt-4 font-heading text-[18px] font-semibold text-obc-charcoal">{`${firstName} ${lastName}`.trim() || "Memuat profil..."}</p>
        <p className="font-body text-[13px] text-obc-muted">Staf OBC Sport</p>
        <div className="mt-3">
          <Pill tone="lime">{role || "Akun"}</Pill>
        </div>
        <p className="mt-4 border-t border-obc-border pt-4 font-body text-[12px] text-obc-muted">
          JPG, PNG, atau WebP, maksimal 2 MB.
        </p>
      </div>

      {/* Form informasi pribadi */}
      <div className={`${cardCls} min-w-0 p-4 sm:p-6`}>
        <CardTitle title="Informasi pribadi" sub="Data ini tampil di akun admin OBC Sport." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama depan" icon={User}>
            <input className={inputCls} value={firstName} onChange={(event) => onFirstNameChange(event.target.value)} disabled={loading} />
          </Field>
          <Field label="Nama belakang">
            <input className={inputCls} value={lastName} onChange={(event) => onLastNameChange(event.target.value)} disabled={loading} />
          </Field>
          <Field label="Email" icon={Mail}>
            <input type="email" className={`${inputCls} cursor-not-allowed opacity-70`} value={email} readOnly />
          </Field>
          <Field label="No. telepon" icon={Phone}>
            <input type="tel" className={inputCls} value={phone} onChange={(event) => onPhoneChange(event.target.value)} disabled={loading} />
          </Field>
          <Field label="Bio" className="sm:col-span-2">
            <textarea
              rows={4}
              className={`${inputCls} h-auto resize-none py-3`}
              value={bio}
              onChange={(event) => onBioChange(event.target.value)}
              disabled={loading}
            />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className={btnOutline} onClick={onReset} disabled={saving || loading}>Batal</button>
          <button type="button" className={btnPrimary} onClick={onSave} disabled={saving || loading}>
            {saving ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Tab: Keamanan ───────────── */
function KeamananTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Semua kolom kata sandi wajib diisi.");
      return;
    }
    if (newPassword.length < 12 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      toast.error("Kata sandi baru harus minimal 12 karakter dan mengandung huruf kecil, huruf besar, serta angka.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi baru tidak sama.");
      return;
    }

    setUpdatingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Kata sandi berhasil diperbarui.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <section className="grid max-w-[760px] gap-4">
      {/* Ubah kata sandi */}
      <div className={`${cardCls} p-4 sm:p-6`}>
        <CardTitle title="Ubah kata sandi" sub="Gunakan minimal 8 karakter dengan kombinasi huruf dan angka." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kata sandi saat ini" icon={KeyRound} className="sm:col-span-2">
            <input type="password" className={inputCls} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" />
          </Field>
          <Field label="Kata sandi baru">
            <input type="password" className={inputCls} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Minimal 12 karakter" autoComplete="new-password" />
          </Field>
          <Field label="Konfirmasi kata sandi">
            <input type="password" className={inputCls} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Ulangi kata sandi baru" autoComplete="new-password" />
          </Field>
        </div>
        <div className="mt-6">
          <button type="button" className={btnPrimary} onClick={handlePasswordUpdate} disabled={updatingPassword}>
            {updatingPassword ? "Memperbarui..." : "Perbarui kata sandi"}
          </button>
        </div>
      </div>


      
    </section>
  );
}

/* ───────────── Halaman ───────────── */
export default function SettingAccount() {
  const [collapsed, setCollapsed] = useState(false); // PC: rail ikon
  const [mobileOpen, setMobileOpen] = useState(false); // mobile: drawer
  const [tab, setTab] = useState<Tab>("Profil");
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        const [first, ...rest] = data.name.trim().split(/\s+/);
        setFirstName(first ?? "");
        setLastName(rest.join(" "));
        setPhone(data.phone ?? "");
        setBio(data.bio ?? "");
      })
      .catch((error: unknown) => toast.error(getApiErrorMessage(error)))
      .finally(() => {
        if (active) setLoadingProfile(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleProfileSave = async () => {
    const name = `${firstName} ${lastName}`.trim();
    if (name.length < 2) {
      toast.error("Nama minimal 2 karakter.");
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await updateProfile({ name, phone: phone || null, bio: bio || null });
      setProfile(updated);
      toast.success("Perubahan profil berhasil disimpan.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleProfileReset = () => {
    if (!profile) return;
    const [first, ...rest] = profile.name.trim().split(/\s+/);
    setFirstName(first ?? "");
    setLastName(rest.join(" "));
    setPhone(profile.phone ?? "");
    setBio(profile.bio ?? "");
  };

  const handlePhotoSelect = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format foto harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2 MB.");
      return;
    }

    setUploadingPhoto(true);
    try {
      const updated = await uploadProfilePhoto(file);
      setProfile(updated);
      toast.success("Foto profil berhasil diperbarui.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setUploadingPhoto(false);
    }
  };

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
          collapsed ? "lg:ml-[76px]" : "lg:ml-[258px]"
        }`}
      >
        <Header onToggleSidebar={toggleSidebar} />

        <main className="min-w-0 flex-1 px-3 py-5 sm:px-6 sm:py-6">
          {/* Judul halaman */}
          <div className="mb-5">
            <p className="font-body text-[13px] text-obc-muted">
              Akun <span className="mx-1">/</span>
              <span className="font-medium text-obc-charcoal">{tab}</span>
            </p>
            <h1 className="mt-2 font-heading text-[24px] font-semibold tracking-[-0.01em] text-obc-charcoal sm:text-[32px]">
              Pengaturan akun
            </h1>
            <p className="mt-1 font-body text-[14px] text-obc-muted">
              Kelola profil dan keamanan akun admin kamu.
            </p>
          </div>

          {/* Tab */}
          <div
            role="tablist"
            className="mb-5 flex gap-1 overflow-x-auto border-b border-obc-border"
          >
            {tabs.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t)}
                  className={`-mb-px shrink-0 border-b-2 px-4 py-3 font-heading text-[14px] font-medium transition-colors ${
                    active
                      ? "border-obc-green text-obc-green"
                      : "border-transparent text-obc-muted hover:text-obc-charcoal"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {tab === "Profil" ? (
            <ProfilTab
              firstName={firstName}
              lastName={lastName}
              email={profile?.email ?? ""}
              phone={phone}
              bio={bio}
              role={profile?.role ?? ""}
              avatarUrl={profile?.avatarUrl ?? null}
              loading={loadingProfile}
              saving={savingProfile}
              uploadingPhoto={uploadingPhoto}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              onPhoneChange={setPhone}
              onBioChange={setBio}
              onPhotoSelect={handlePhotoSelect}
              onReset={handleProfileReset}
              onSave={handleProfileSave}
            />
          ) : <KeamananTab />}
        </main>

        <Footer />
      </div>
    </div>
  );
}
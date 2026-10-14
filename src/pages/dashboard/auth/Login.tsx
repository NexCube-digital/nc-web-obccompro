import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import obcLogoLight from "../../../assets/logo/obclogo.webp";
import obcLogo from "../../../assets/logo/LOGO-OBC.png";
import { getApiErrorMessage } from "../../../services/api";
import { authService } from "../../../services/auth";

/* ───────────── Halaman Login OBC ───────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ingat, setIngat] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.login({ email, password }, ingat);
      toast.success("Berhasil masuk.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "h-[46px] w-full rounded-xl border border-obc-border bg-white px-4 font-body text-[14px] text-obc-charcoal outline-none transition placeholder:text-obc-muted focus:border-obc-green focus:ring-2 focus:ring-obc-green/20 [@media(max-height:640px)]:h-[42px]";

  return (
    <div className="flex h-screen supports-[height:100dvh]:h-dvh overflow-hidden bg-obc-ivory font-body text-obc-charcoal">
      {/* ── Panel kiri (hanya tampil di layar besar) ── */}
      <aside
        className="relative hidden h-full min-h-0 w-[53%] flex-col justify-between overflow-hidden px-12 py-12 text-white [@media(max-height:760px)]:py-8 [@media(max-height:640px)]:py-5 lg:flex"
        style={{
          background:
            "linear-gradient(160deg, #0C170D 0%, #111F12 45%, #0A110B 100%)",
        }}
      >
        {/* Cahaya dekoratif */}
        <div
          className="pointer-events-none absolute -right-24 -top-20 h-[460px] w-[460px] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, #2F5A1E 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-24 h-[380px] w-[380px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #CDF178 0%, transparent 70%)" }}
        />

        {/* Logo */}
        <div className="relative">
          <img src={obcLogoLight} alt="OBC Onny Barber Center" className="h-auto w-[150px]" />
        </div>

        {/* Headline */}
        <div className="relative">
          <h1 className="max-w-[460px] font-heading text-[46px] font-bold leading-[1.08] tracking-[-0.02em]">
            Satu ekosistem untuk berbagai kebutuhan.
          </h1>
          <p className="mt-5 max-w-[440px] font-body text-[16px] leading-relaxed text-white/60">
            OBC Group menghadirkan layanan olahraga, hospitality, kuliner, personal care, dan ruang acara untuk menemani berbagai aktivitas Anda.
          </p>
        </div>

        {/* Cakupan layanan OBC */}
        <figure className="relative max-w-[440px] rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
          <figcaption>
            <p className="font-heading text-[14px] font-semibold text-[#CDF178]">Beragam layanan, satu keluarga.</p>
            <p className="mt-2 font-body text-[13px] leading-relaxed text-white/60">
              Sport Center, Guest House, Villa, Foodcourt, Laundry, hingga Event Space.
            </p>
          </figcaption>
        </figure>
      </aside>

      {/* ── Panel kanan: formulir ── */}
      <main className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-5 py-10 [@media(max-height:760px)]:py-5 [@media(max-height:640px)]:py-3 sm:px-10">
        <div className="w-full max-w-[380px]">
          {/* Logo versi mobile */}
          <div className="mb-8 flex items-center gap-2.5 [@media(max-height:760px)]:mb-5 [@media(max-height:640px)]:mb-3 lg:hidden">
            <img src={obcLogo} alt="OBC Onny Barber Center" className="h-auto w-[132px] [@media(max-height:640px)]:w-[112px]" />
          </div>

          <h2 className="font-heading text-[30px] font-bold tracking-[-0.01em] [@media(max-height:640px)]:text-[24px]">Selamat datang di OBC Group</h2>
          <p className="mt-2 font-body text-[14px] text-obc-muted">
            Masuk untuk mengakses area pengelolaan berbagai unit bisnis OBC.
          </p>

          

          {/* Pemisah */}
          <div className="my-6 flex items-center gap-4 [@media(max-height:760px)]:my-4 [@media(max-height:640px)]:my-3">
            <span className="h-px flex-1 bg-obc-border" />
            <span className="h-px flex-1 bg-obc-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 [@media(max-height:760px)]:space-y-3 [@media(max-height:640px)]:space-y-2">
            <div>
              <label htmlFor="email" className="mb-1.5 block font-heading text-[13px] font-medium text-obc-charcoal">
                Alamat email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@obc.co.id"
                className={inputCls}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="font-heading text-[13px] font-medium text-obc-charcoal">
                  Kata sandi
                </label>
                <a href="/lupa-password" className="font-heading text-[13px] font-medium text-obc-green hover:underline">
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-obc-muted transition-colors hover:bg-obc-hover-surface hover:text-obc-charcoal"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 pt-1 font-body text-[13px] text-obc-muted">
              <input
                type="checkbox"
                checked={ingat}
                onChange={(e) => setIngat(e.target.checked)}
                className="h-[18px] w-[18px] cursor-pointer rounded border-obc-border accent-[#004000]"
              />
              Ingat saya
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-[48px] w-full items-center justify-center rounded-xl bg-obc-green font-heading text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(0,64,0,0.45)] transition-colors hover:bg-obc-green-hover disabled:cursor-not-allowed disabled:opacity-70 [@media(max-height:640px)]:h-[44px]"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          
        </div>
      </main>
    </div>
  );
}
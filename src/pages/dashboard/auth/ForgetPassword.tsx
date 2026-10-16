import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import TransitionLink from "../../../components/common/TransitionLink";
import obcLogoLight from "../../../assets/logo/obclogo.webp";
import obcLogo from "../../../assets/logo/LOGO-OBC.png";

export default function ForgetPasswordPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		setLoading(true);
		// TODO: hubungkan ke layanan reset kata sandi.
		setTimeout(() => {
			setLoading(false);
			setSubmitted(true);
		}, 800);
	};

	const inputCls =
		"h-[46px] w-full rounded-xl border border-obc-border bg-white px-4 font-body text-[14px] text-obc-charcoal outline-none transition placeholder:text-obc-muted focus:border-obc-green focus:ring-2 focus:ring-obc-green/20 [@media(max-height:640px)]:h-[42px]";

	return (
		<div className="flex h-screen supports-[height:100dvh]:h-dvh overflow-hidden bg-obc-ivory font-body text-obc-charcoal">
			<aside
				className="relative hidden h-full min-h-0 w-[53%] flex-col justify-between overflow-hidden px-12 py-12 text-white [@media(max-height:760px)]:py-8 [@media(max-height:640px)]:py-5 lg:flex"
				style={{
					background:
						"linear-gradient(160deg, #0C170D 0%, #111F12 45%, #0A110B 100%)",
				}}
			>
				<div
					className="pointer-events-none absolute -right-24 -top-20 h-[460px] w-[460px] rounded-full opacity-60 blur-3xl"
					style={{ background: "radial-gradient(circle, #2F5A1E 0%, transparent 70%)" }}
				/>
				<div
					className="pointer-events-none absolute -bottom-32 -left-24 h-[380px] w-[380px] rounded-full opacity-40 blur-3xl"
					style={{ background: "radial-gradient(circle, #CDF178 0%, transparent 70%)" }}
				/>

				<div className="relative">
					<img src={obcLogoLight} alt="OBC Onny Barber Center" className="h-auto w-[150px]" />
				</div>

				<div className="relative">
					<h1 className="max-w-[460px] font-heading text-[46px] font-bold leading-[1.08] tracking-[-0.02em]">
						Kata sandi baru, langkah baru bersama OBC.
					</h1>
					<p className="mt-5 max-w-[440px] font-body text-[16px] leading-relaxed text-white/60">
						Kami membantu Anda kembali mengakses layanan dan aktivitas di ekosistem OBC Group.
					</p>
				</div>

				<div className="relative max-w-[440px] rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
					<p className="font-heading text-[14px] font-semibold text-[#CDF178]">
						Beragam layanan, satu keluarga.
					</p>
					<p className="mt-2 font-body text-[13px] leading-relaxed text-white/60">
						Sport Center, Guest House, Villa, Foodcourt, Laundry, hingga Event Space.
					</p>
				</div>
			</aside>

			<main className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-5 py-10 [@media(max-height:760px)]:py-5 [@media(max-height:640px)]:py-3 sm:px-10">
				<div className="w-full max-w-[380px]">
					<div className="mb-8 [@media(max-height:760px)]:mb-5 [@media(max-height:640px)]:mb-3 lg:hidden">
						<img
							src={obcLogo}
							alt="OBC Onny Barber Center"
							className="h-auto w-[132px] [@media(max-height:640px)]:w-[112px]"
						/>
					</div>

					<h2 className="font-heading text-[30px] font-bold tracking-[-0.01em] [@media(max-height:640px)]:text-[24px]">
						Lupa kata sandi?
					</h2>
					<p className="mt-2 font-body text-[14px] leading-relaxed text-obc-muted">
						Masukkan email yang terhubung dengan akun OBC Anda. Kami akan mengirim petunjuk untuk mengatur ulang kata sandi.
					</p>

					{submitted ? (
						<div className="mt-7 rounded-xl border border-obc-border bg-white p-5" role="status">
							<p className="font-heading text-[15px] font-semibold text-obc-charcoal">
								Periksa email Anda
							</p>
							<p className="mt-2 break-all font-body text-[14px] leading-relaxed text-obc-muted">
								Jika {email} terdaftar, petunjuk untuk mengatur ulang kata sandi akan dikirim ke alamat tersebut.
							</p>
							<button
								type="button"
								onClick={() => setSubmitted(false)}
								className="mt-4 font-heading text-[13px] font-semibold text-obc-green hover:underline"
							>
								Gunakan email lain
							</button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="mt-7 space-y-4 [@media(max-height:760px)]:mt-5 [@media(max-height:640px)]:mt-4 [@media(max-height:640px)]:space-y-3">
							<div>
								<label
									htmlFor="email"
									className="mb-1.5 block font-heading text-[13px] font-medium text-obc-charcoal"
								>
									Alamat email
								</label>
								<input
									id="email"
									type="email"
									autoComplete="email"
									required
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									placeholder="nama@obc.co.id"
									className={inputCls}
								/>
							</div>
							<button
								type="submit"
								disabled={loading}
								className="flex h-[48px] w-full items-center justify-center rounded-xl bg-obc-green font-heading text-[14px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(0,64,0,0.45)] transition-colors hover:bg-obc-green-hover disabled:cursor-not-allowed disabled:opacity-70 [@media(max-height:640px)]:h-[44px]"
							>
								{loading ? "Memproses..." : "Kirim petunjuk reset"}
							</button>
						</form>
					)}

					<TransitionLink
						to="/login"
						className="mt-6 inline-flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-green hover:underline [@media(max-height:760px)]:mt-4 [@media(max-height:640px)]:mt-3"
					>
						<ArrowLeft size={16} />
						Kembali ke halaman masuk
					</TransitionLink>
				</div>
			</main>
		</div>
	);
}

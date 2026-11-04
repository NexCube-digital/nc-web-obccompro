import { useEffect, useState } from "react";
import { storeAuthSession } from "../../../services/api";
import type { AuthSession } from "../../../services/auth";

const SPORT_ORIGINS = import.meta.env.VITE_SPORT_APP_URL
	? [new URL(import.meta.env.VITE_SPORT_APP_URL).origin]
	: ["http://localhost:5173", "http://127.0.0.1:5173"];

interface StaffSessionMessage {
	type: "OBC_STAFF_SESSION";
	session: AuthSession;
	rememberMe: boolean;
}

interface HandoffMessage {
	type: string;
	session?: AuthSession;
	rememberMe?: boolean;
}

function isValidStaffSession(value: unknown): value is AuthSession {
	if (!value || typeof value !== "object") return false;
	const session = value as Partial<AuthSession>;
	return Boolean(
		typeof session.accessToken === "string" &&
		typeof session.refreshToken === "string" &&
		session.user &&
		typeof session.user.role === "string",
	);
}

export default function StaffAuthBridge() {
	const [error, setError] = useState(() => !window.opener);

	useEffect(() => {
		const opener = window.opener;
		if (!opener) return;
		let completed = false;
		let readyInterval = 0;
		let handshakeTimeout = 0;
		const stopHandshake = () => {
			completed = true;
			window.clearInterval(readyInterval);
			window.clearTimeout(handshakeTimeout);
		};
		const announceReady = () => {
			if (completed) return;
			for (const origin of SPORT_ORIGINS) {
				opener.postMessage({ type: "OBC_STAFF_BRIDGE_READY" }, origin);
			}
		};
		readyInterval = window.setInterval(announceReady, 500);
		handshakeTimeout = window.setTimeout(() => {
			stopHandshake();
			setError(true);
		}, 20_000);

		const handleMessage = (event: MessageEvent<HandoffMessage>) => {
			if (!SPORT_ORIGINS.includes(event.origin) || event.source !== opener) return;
			if (event.data?.type !== "OBC_STAFF_SESSION") return;

			const message = event.data as StaffSessionMessage;
			if (!isValidStaffSession(message.session)) {
				stopHandshake();
				opener.postMessage({ type: "OBC_STAFF_BRIDGE_ERROR" }, event.origin);
				setError(true);
				return;
			}

			try {
				storeAuthSession(message.session, message.rememberMe === true);
				stopHandshake();
				opener.postMessage({ type: "OBC_STAFF_SESSION_STORED" }, event.origin);
				window.close();
			} catch {
				stopHandshake();
				opener.postMessage({ type: "OBC_STAFF_BRIDGE_ERROR" }, event.origin);
				setError(true);
			}
		};

		window.addEventListener("message", handleMessage);
		announceReady();
		return () => {
			stopHandshake();
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	return (
		<main className="grid min-h-screen place-items-center bg-obc-ivory px-6 text-center font-body text-obc-charcoal">
			<p role={error ? "alert" : "status"}>
				{error
					? "Login staff tidak dapat diteruskan. Tutup jendela ini dan coba lagi."
					: "Menghubungkan sesi staff ke dashboard OBC..."}
			</p>
		</main>
	);
}
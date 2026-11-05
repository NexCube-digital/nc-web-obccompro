export interface MidtransCardData {
	card_number: string;
	card_exp_month: string;
	card_exp_year: string;
	card_cvv: string;
}

interface CardTokenResponse {
	token_id?: string;
	status_message?: string;
}

interface CardTokenCallbacks {
	onSuccess: (response: CardTokenResponse) => void;
	onFailure: (response: CardTokenResponse) => void;
	onError: (response: CardTokenResponse) => void;
}

interface AuthenticationCallbacks {
	performAuthentication: (redirectUrl: string) => void;
	onSuccess: (response: CardTokenResponse) => void;
	onPending: (response: CardTokenResponse) => void;
	onFailure: (response: CardTokenResponse) => void;
}

interface MidtransNew3ds {
	getCardToken: (card: MidtransCardData, callbacks: CardTokenCallbacks) => void;
	authenticate: (redirectUrl: string, callbacks: AuthenticationCallbacks) => void;
}

declare global {
	interface Window {
		MidtransNew3ds?: MidtransNew3ds;
	}
}

let cardScriptPromise: Promise<void> | undefined;

async function loadCardScript() {
	if (window.MidtransNew3ds) return;
	if (cardScriptPromise) return cardScriptPromise;

	const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
	if (!clientKey) throw new Error('VITE_MIDTRANS_CLIENT_KEY belum dikonfigurasi.');

	const script = document.createElement('script');
	script.src = 'https://api.midtrans.com/v2/assets/js/midtrans-new-3ds.min.js';
	script.async = true;
	script.dataset.environment = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true' ? 'production' : 'sandbox';
	script.dataset.clientKey = clientKey;

	cardScriptPromise = new Promise((resolve, reject) => {
		script.onload = () => window.MidtransNew3ds ? resolve() : reject(new Error('Midtrans belum siap.'));
		script.onerror = () => reject(new Error('Script pembayaran kartu tidak dapat dimuat.'));
		document.head.appendChild(script);
	});

	try {
		await cardScriptPromise;
	} catch (error) {
		cardScriptPromise = undefined;
		throw error;
	}
}

export async function tokenizeMidtransCard(card: MidtransCardData): Promise<string> {
	await loadCardScript();
	if (!window.MidtransNew3ds) throw new Error('Midtrans belum siap.');

	return new Promise((resolve, reject) => {
		window.MidtransNew3ds?.getCardToken(card, {
			onSuccess: (response) => response.token_id
				? resolve(response.token_id)
				: reject(new Error(response.status_message ?? 'Token kartu tidak diterima.')),
			onFailure: (response) => reject(new Error(response.status_message ?? 'Data kartu tidak valid.')),
			onError: (response) => reject(new Error(response.status_message ?? 'Tokenisasi kartu gagal.')),
		});
	});
}

export async function authenticateMidtransCard(redirectUrl: string, callbacks: AuthenticationCallbacks) {
	await loadCardScript();
	if (!window.MidtransNew3ds) throw new Error('Midtrans belum siap.');
	window.MidtransNew3ds.authenticate(redirectUrl, callbacks);
}

const DIRECT_CHANNELS = [
	'qris', 'gopay', 'shopeepay', 'bca_va', 'bni_va', 'bri_va', 'mandiri_va', 'permata_va', 'alfamart', 'indomaret',
] as const;

export type DirectChannel = (typeof DIRECT_CHANNELS)[number];

export interface DirectPaymentInfo {
	orderId: string;
	transactionId: string;
	channel: DirectChannel;
	status: string;
	expiryTime?: string;
	vaNumber?: string;
	bankName?: string;
	billerCode?: string;
	billKey?: string;
	paymentCode?: string;
	storeName?: string;
	qrUrl?: string;
	deeplinkUrl?: string;
}

interface MidtransChargeDetails {
	obc_payment_channel?: string;
	order_id?: string;
	transaction_id?: string;
	transaction_status?: string;
	payment_type?: string;
	expiry_time?: string;
	va_numbers?: { bank: string; va_number: string }[];
	permata_va_number?: string;
	bill_key?: string;
	biller_code?: string;
	payment_code?: string;
	store?: string;
	actions?: { name: string; url: string }[];
}

export function parsePersistedDirectPayment(raw: unknown): DirectPaymentInfo | null {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
	const data = raw as MidtransChargeDetails;
	let channel = data.obc_payment_channel;
	const paymentType = data.payment_type?.toLowerCase();
	const bank = data.va_numbers?.[0]?.bank.toLowerCase();

	if (!DIRECT_CHANNELS.includes(channel as DirectChannel)) {
		if (paymentType === 'qris') channel = 'qris';
		else if (paymentType === 'gopay') channel = 'gopay';
		else if (paymentType === 'shopeepay') channel = 'shopeepay';
		else if (data.bill_key || data.biller_code) channel = 'mandiri_va';
		else if (data.permata_va_number) channel = 'permata_va';
		else if (bank === 'bca' || bank === 'bni' || bank === 'bri') channel = `${bank}_va`;
		else if (paymentType === 'cstore') channel = data.store?.toLowerCase().includes('indo') ? 'indomaret' : 'alfamart';
	}

	if (!DIRECT_CHANNELS.includes(channel as DirectChannel)) return null;
	const action = (name: string) => data.actions?.find((item) => item.name === name)?.url;
	const va = data.va_numbers?.[0];
	return {
		orderId: data.order_id ?? '',
		transactionId: data.transaction_id ?? '',
		channel: channel as DirectChannel,
		status: data.transaction_status ?? 'pending',
		expiryTime: data.expiry_time,
		vaNumber: va?.va_number ?? data.permata_va_number,
		bankName: va?.bank?.toUpperCase(),
		billerCode: data.biller_code,
		billKey: data.bill_key,
		paymentCode: data.payment_code,
		storeName: data.store,
		qrUrl: action('generate-qr-code'),
		deeplinkUrl: action('deeplink-redirect'),
	};
}
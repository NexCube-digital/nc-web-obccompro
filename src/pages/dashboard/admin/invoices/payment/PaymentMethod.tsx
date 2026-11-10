import { WalletCards } from "lucide-react";
import alfamartIcon from "../../../../../assets/images/payment/alfamart.webp";
import bcaIcon from "../../../../../assets/images/payment/bca.webp";
import bniIcon from "../../../../../assets/images/payment/bni.webp";
import briIcon from "../../../../../assets/images/payment/bri.webp";
import codIcon from "../../../../../assets/images/payment/cod.webp";
import creditCardIcon from "../../../../../assets/images/payment/creditcard.webp";
import danaIcon from "../../../../../assets/images/payment/dana.webp";
import gopayIcon from "../../../../../assets/images/payment/gopay.webp";
import indomaretIcon from "../../../../../assets/images/payment/indomaret.webp";
import mandiriIcon from "../../../../../assets/images/payment/mandiri.webp";
import ovoIcon from "../../../../../assets/images/payment/ovo.webp";
import permataIcon from "../../../../../assets/images/payment/permata.webp";
import qrisIcon from "../../../../../assets/images/payment/qris.webp";
import shopeepayIcon from "../../../../../assets/images/payment/shopepay.webp";
import type { InvoicePaymentMethod } from "../../../services/admin/invoiceService";

const paymentMethodGroups: {
  label: string;
  methods: {
    id: InvoicePaymentMethod;
    name: string;
    description: string;
    image: string;
  }[];
}[] = [
  {
    label: "QRIS & E-WALLET",
    methods: [
      {
        id: "qris",
        name: "QRIS",
        description: "Pembayaran dengan scan kode QR",
        image: qrisIcon,
      },
      {
        id: "gopay",
        name: "GoPay",
        description: "Konfirmasi melalui aplikasi GoPay",
        image: gopayIcon,
      },
      {
        id: "shopeepay",
        name: "ShopeePay",
        description: "Bayar melalui saldo ShopeePay",
        image: shopeepayIcon,
      },
      {
        id: "ovo",
        name: "OVO",
        description: "Konfirmasi melalui aplikasi OVO",
        image: ovoIcon,
      },
      {
        id: "dana",
        name: "DANA",
        description: "Bayar melalui saldo DANA",
        image: danaIcon,
      },
    ],
  },
  {
    label: "KARTU",
    methods: [
      {
        id: "credit_card",
        name: "Kartu kredit / debit",
        description: "Pembayaran aman dengan kartu",
        image: creditCardIcon,
      },
    ],
  },
  {
    label: "VIRTUAL ACCOUNT",
    methods: [
      {
        id: "bca_va",
        name: "BCA Virtual Account",
        description: "Transfer ke nomor VA BCA",
        image: bcaIcon,
      },
      {
        id: "bni_va",
        name: "BNI Virtual Account",
        description: "Transfer ke nomor VA BNI",
        image: bniIcon,
      },
      {
        id: "bri_va",
        name: "BRI Virtual Account",
        description: "Transfer ke nomor VA BRI",
        image: briIcon,
      },
      {
        id: "mandiri_va",
        name: "Mandiri Virtual Account",
        description: "Transfer ke nomor VA Mandiri",
        image: mandiriIcon,
      },
      {
        id: "permata_va",
        name: "Permata Virtual Account",
        description: "Transfer ke nomor VA Permata",
        image: permataIcon,
      },
    ],
  },
  {
    label: "GERAI RETAIL",
    methods: [
      {
        id: "alfamart",
        name: "Alfamart",
        description: "Bayar melalui kasir Alfamart",
        image: alfamartIcon,
      },
      {
        id: "indomaret",
        name: "Indomaret",
        description: "Bayar melalui kasir Indomaret",
        image: indomaretIcon,
      },
    ],
  },
  {
    label: "PEMBAYARAN LANGSUNG",
    methods: [
      {
        id: "cod",
        name: "Cash on Delivery (COD)",
        description: "Pembayaran dilakukan langsung di lokasi saat kedatangan.",
        image: codIcon,
      },
    ],
  },
];

export function getPaymentMethodLabel(value: InvoicePaymentMethod | "") {
  return (
    paymentMethodGroups
      .flatMap((group) => group.methods)
      .find((method) => method.id === value)?.name ?? "Belum dipilih"
  );
}

interface PaymentMethodProps {
  value: InvoicePaymentMethod | "";
  onChange: (value: InvoicePaymentMethod) => void;
}

export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <section className="rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5">
      <div className="mb-4 flex items-center gap-3 border-b border-obc-border pb-4">
        <span className="grid size-9 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">
          <WalletCards size={17} />
        </span>
        <div>
          <h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">
            Informasi pembayaran
          </h3>
          <p className="mt-0.5 text-[12px] text-obc-muted">
            Pilih metode pembayaran yang akan dicantumkan pada invoice.
          </p>
        </div>
      </div>
      <div
        role="radiogroup"
        aria-label="Metode pembayaran invoice"
        className="space-y-4"
      >
        {paymentMethodGroups.map((group) => (
          <div key={group.label}>
            <h4 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-obc-green">
              {group.label}
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {group.methods.map(({ id, name, description, image }) => {
                const selected = value === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onChange(id)}
                    className={`flex min-h-19 min-w-0 items-center gap-3 rounded-lg border bg-white px-3 py-2.5 text-left transition-colors ${selected ? "border-2 border-obc-green bg-[#F3F8E8]" : "border-obc-border hover:border-obc-green hover:bg-[#FDFCF7]"}`}
                  >
                    <span className="grid h-10 w-14 shrink-0 place-items-center">
                      <img
                        src={image}
                        alt=""
                        aria-hidden="true"
                        className="block h-8 w-full object-contain"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="wrap-break-word block text-[13px] font-semibold text-obc-charcoal">
                        {name}
                      </span>
                      <span className="mt-1 block text-[11px] leading-4 text-obc-muted">
                        {description}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid size-4 shrink-0 place-items-center rounded-full ${selected ? "border-2 border-obc-green" : "border border-obc-border"}`}
                    >
                      {selected && (
                        <span className="size-2 rounded-full bg-obc-green" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

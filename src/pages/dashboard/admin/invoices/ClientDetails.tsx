import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, UserRound } from "lucide-react";
import { useDebouncedValue } from "../../components/hooks/useDebouncedValue";
import type { CustomerRecord } from "../../services/cms/customerService";

type ClientMode = "manual" | "registered";

type Props = {
  clientMode: ClientMode;
  onClientModeChange: (mode: ClientMode) => void;
  customers: CustomerRecord[];
  customersLoading: boolean;
  selectedCustomerId: string;
  selectedRegisteredCustomer: CustomerRecord | null;
  onChooseContact: (customerId: string) => void;
  clientName: string;
  onClientNameChange: (value: string) => void;
  clientEmail: string;
  onClientEmailChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  invoiceNumber: string;
  onInvoiceNumberChange: (value: string) => void;
  invoiceExists: boolean;
  inputClass: string;
};

export default function InvoiceClientDetails({
  clientMode,
  onClientModeChange,
  customers,
  customersLoading,
  selectedCustomerId,
  selectedRegisteredCustomer,
  onChooseContact,
  clientName,
  onClientNameChange,
  clientEmail,
  onClientEmailChange,
  phone,
  onPhoneChange,
  invoiceNumber,
  onInvoiceNumberChange,
  invoiceExists,
  inputClass,
}: Props) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const customerPickerRef = useRef<HTMLDivElement>(null);
  const debouncedCustomerSearch = useDebouncedValue(customerSearch, 300);
  const filteredCustomers = useMemo(() => {
    const query = debouncedCustomerSearch.trim().toLocaleLowerCase("id-ID");
    return customers.filter((customer) =>
      [customer.name, customer.email, customer.phone ?? ""]
        .join(" ")
        .toLocaleLowerCase("id-ID")
        .includes(query),
    );
  }, [customers, debouncedCustomerSearch]);

  useEffect(() => {
    if (!customerPickerOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !customerPickerRef.current?.contains(event.target)
      ) {
        setCustomerPickerOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [customerPickerOpen]);

  const changeClientMode = (mode: ClientMode) => {
    setCustomerSearch("");
    setCustomerPickerOpen(false);
    onClientModeChange(mode);
  };

  const chooseContact = (customerId: string) => {
    onChooseContact(customerId);
    setCustomerSearch("");
    setCustomerPickerOpen(false);
  };

  return (
    <section className="rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5">
      <div className="mb-4 flex items-center gap-3 border-b border-obc-border pb-4">
        <span className="grid size-9 place-items-center rounded-lg bg-obc-ivory text-obc-green">
          <UserRound size={17} />
        </span>
        <div>
          <h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">
            Data klien
          </h3>
          <p className="mt-0.5 text-[12px] text-obc-muted">
            Informasi penerima tagihan.
          </p>
        </div>
      </div>
      <div
        className="grid grid-cols-2 gap-1 rounded-lg bg-[#F1F3EE] p-1"
        role="group"
        aria-label="Sumber data klien"
      >
        <button
          type="button"
          aria-pressed={clientMode === "registered"}
          onClick={() => changeClientMode("registered")}
          className={`h-10 rounded-md px-3 text-[12px] font-semibold transition-colors ${clientMode === "registered" ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}
        >
          Pelanggan terdaftar
        </button>
        <button
          type="button"
          aria-pressed={clientMode === "manual"}
          onClick={() => changeClientMode("manual")}
          className={`h-10 rounded-md px-3 text-[12px] font-semibold transition-colors ${clientMode === "manual" ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}
        >
          Isi manual
        </button>
      </div>
      {clientMode === "registered" && (
        <div ref={customerPickerRef} className="relative mt-4">
          <span className="text-[13px] font-medium text-obc-charcoal">
            Pilih pelanggan
          </span>
          <button
            type="button"
            aria-label="Cari dan pilih pelanggan terdaftar"
            aria-expanded={customerPickerOpen}
            aria-controls="invoice-customer-options"
            disabled={customersLoading || !customers.length}
            onClick={() => {
              setCustomerSearch("");
              setCustomerPickerOpen((open) => !open);
            }}
            className="mt-1 flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-left text-[13px] outline-none transition-colors hover:border-obc-green focus-visible:ring-2 focus-visible:ring-[#CDF178] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              className={`min-w-0 truncate ${selectedRegisteredCustomer ? "font-medium text-obc-charcoal" : "text-obc-muted"}`}
            >
              {customersLoading
                ? "Memuat pelanggan..."
                : selectedRegisteredCustomer
                  ? `${selectedRegisteredCustomer.name} · ${selectedRegisteredCustomer.email}`
                  : customers.length
                    ? "Cari nama, email, atau telepon..."
                    : "Belum ada pelanggan terdaftar"}
            </span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-obc-green transition-transform ${customerPickerOpen ? "rotate-180" : ""}`}
            />
          </button>
          {customerPickerOpen && (
            <div
              id="invoice-customer-options"
              className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-obc-border bg-white shadow-[0_12px_30px_rgba(31,51,32,0.16)]"
            >
              <label className="relative block border-b border-obc-border p-2">
                <Search
                  size={15}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-obc-muted"
                />
                <input
                  autoFocus
                  value={customerSearch}
                  onChange={(event) => setCustomerSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setCustomerPickerOpen(false);
                  }}
                  placeholder="Cari nama, email, atau telepon..."
                  className="h-10 w-full rounded-md border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[12px] outline-none focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]"
                />
              </label>
              <div
                role="listbox"
                aria-label="Hasil pelanggan"
                className="max-h-60 overflow-y-auto p-1.5"
              >
                {filteredCustomers.length ? (
                  filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      role="option"
                      aria-selected={selectedCustomerId === customer.id}
                      onClick={() => chooseContact(customer.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[#F3F8E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[12px] font-semibold text-obc-charcoal">
                          {customer.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-obc-muted">
                          {customer.email}
                          {customer.phone ? ` · ${customer.phone}` : ""}
                        </span>
                      </span>
                      {selectedCustomerId === customer.id && (
                        <Check size={15} className="shrink-0 text-obc-green" />
                      )}
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-6 text-center text-[12px] text-obc-muted">
                    {customersLoading
                      ? "Memuat pelanggan..."
                      : debouncedCustomerSearch
                        ? "Pelanggan tidak ditemukan."
                        : "Belum ada pelanggan terdaftar."}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {clientMode === "registered" && selectedCustomerId ? (
        <dl className="mt-4 grid gap-3 rounded-lg border border-obc-border bg-[#FDFCF7] p-4 text-[12px] sm:grid-cols-3">
          <div>
            <dt className="text-[10px] text-obc-muted">Nama</dt>
            <dd className="mt-1 font-semibold text-obc-charcoal">{clientName}</dd>
          </div>
          <div>
            <dt className="text-[10px] text-obc-muted">Email</dt>
            <dd className="mt-1 break-all font-semibold text-obc-charcoal">
              {clientEmail}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] text-obc-muted">Telepon</dt>
            <dd className="mt-1 font-semibold text-obc-charcoal">{phone || "-"}</dd>
          </div>
        </dl>
      ) : clientMode === "manual" ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-[13px] font-medium">
            Nama klien
            <input
              required
              value={clientName}
              onChange={(event) => onClientNameChange(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="text-[13px] font-medium">
            Email klien
            <input
              required
              type="email"
              value={clientEmail}
              onChange={(event) => onClientEmailChange(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="text-[13px] font-medium">
            Telepon
            <input
              required
              type="tel"
              inputMode="numeric"
              pattern="(?:08[1-9][0-9]{7,10}|628[1-9][0-9]{7,10})"
              title="Masukkan nomor telepon Indonesia yang valid menggunakan digit saja"
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value.replace(/\D/g, ""))}
              className={inputClass}
            />
          </label>
        </div>
      ) : (
        <p
          role="status"
          className="mt-4 rounded-lg border border-dashed border-obc-border px-4 py-6 text-center text-[12px] text-obc-muted"
        >
          Pilih pelanggan terdaftar untuk mengisi data klien.
        </p>
      )}
      <label className="mt-4 block text-[13px] font-medium">
        Nomor invoice
        <input
          disabled={invoiceExists}
          placeholder={invoiceExists ? "" : "Otomatis dibuat jika kosong"}
          value={invoiceNumber}
          onChange={(event) => onInvoiceNumberChange(event.target.value)}
          className={inputClass}
        />
      </label>
    </section>
  );
}

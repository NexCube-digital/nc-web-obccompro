const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const idNumberFormatter = new Intl.NumberFormat("id-ID");

const compactIdrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const bookingDateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

export function formatIdr(value: number): string {
  return idrFormatter.format(value);
}

export function formatRupiah(value: number): string {
  return `Rp${idNumberFormatter.format(value)}`;
}

export function formatCompactIdr(value?: number): string {
  return value === undefined ? "—" : compactIdrFormatter.format(value);
}

export function formatIdDate(
  value: string | null,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
  fallback = "-",
): string {
  return value ? new Date(value).toLocaleDateString("id-ID", options) : fallback;
}

export function formatShortIdDate(value: string | null, fallback = "-"): string {
  return formatIdDate(value, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }, fallback);
}

export function formatLongIdDate(value: string | null, fallback = "-"): string {
  return formatIdDate(value, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }, fallback);
}

export function formatProfileDate(value: string | null, withTime = false): string {
  return formatIdDate(
    value,
    withTime
      ? {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
    "Belum pernah",
  );
}

export function formatIdDateTime(value: string | null, fallback = "-"): string {
  return value
    ? new Date(value).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : fallback;
}

export function formatBookingDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString(
    "id-ID",
    bookingDateOptions,
  );
}

export function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getInitials(name: string, limit = 2): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, limit)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
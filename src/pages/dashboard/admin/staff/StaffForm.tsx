import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import ThemedSelect from "../../components/common/ThemedSelect";
import { accountService, type Staff, type StaffRole } from "../../services/admin/AccountService";

type StaffFormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: StaffRole | "";
};

const getInitialValues = (staff?: Staff): StaffFormValues => ({
  name: staff?.name ?? "",
  email: staff?.email ?? "",
  phone: staff?.phone ?? "",
  password: "",
  role: staff?.role ?? "",
});

const inputClass =
  "h-11 w-full rounded-xl border border-obc-border bg-white px-3 text-[13px] text-[#343133] outline-none focus:border-[#404F14] focus:ring-2 focus:ring-[#CDF178]";

export default function StaffForm({
  staff,
  onCreated,
  onSaved,
}: {
  staff?: Staff;
  onCreated?: () => void;
  onSaved?: () => void;
}) {
  const [values, setValues] = useState<StaffFormValues>(() => getInitialValues(staff));
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof StaffFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values.role) {
      toast.error("Role staff wajib dipilih.");
      return;
    }
    if ((!staff || values.password) && (values.password.length < 8 || values.password.length > 128)) {
      toast.error("Password harus berisi 8-128 karakter.");
      return;
    }
    const phone = values.phone.replace(/[\s-]/g, "");
    if (phone && !/^(\+62|62|0)[0-9]{8,14}$/.test(phone)) {
      toast.error("Format nomor telepon tidak valid.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        role: values.role,
        phone: phone || null,
      };
      if (staff) {
        await accountService.updateStaff(staff.id, {
          ...payload,
          ...(values.password ? { password: values.password } : {}),
        });
        toast.success("Data staff berhasil diperbarui.");
        onSaved?.();
      } else {
        await accountService.createStaff({ ...payload, password: values.password });
        toast.success("Staff berhasil ditambahkan.");
        setValues(getInitialValues());
        onCreated?.();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menambahkan staff.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full rounded-2xl border border-obc-border bg-white p-5 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-7">
      <h2 className="font-heading text-[17px] font-semibold text-obc-charcoal">
        Informasi staff
      </h2>
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid items-start gap-x-5 gap-y-4 sm:grid-cols-2"
      >
        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-[13px] font-semibold">Nama staff *</span>
          <input
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            className={inputClass}
            placeholder="Nama lengkap"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[13px] font-semibold">Email *</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            className={inputClass}
            placeholder="nama@email.com"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[13px] font-semibold">Nomor telepon</span>
          <input
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={inputClass}
            placeholder="08xxxxxxxxxx"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[13px] font-semibold">
            {staff ? "Password baru" : "Password awal *"}
          </span>
          <input
            required={!staff}
            type="password"
            minLength={staff && !values.password ? undefined : 8}
            maxLength={128}
            autoComplete="new-password"
            value={values.password}
            onChange={(event) => update("password", event.target.value)}
            className={inputClass}
            placeholder={staff ? "Kosongkan jika tidak diubah" : undefined}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[13px] font-semibold">Role *</span>
          <ThemedSelect
            label="Role staff"
            value={values.role || "unselected"}
            options={[
              { value: "unselected", label: "Pilih role" },
              { value: "admin", label: "Admin" },
              { value: "marketing", label: "Marketing" },
              { value: "sport", label: "Sport" },
            ]}
            onValueChange={(value) =>
              update("role", value === "unselected" ? "" : value)
            }
            className="h-11 w-full rounded-xl text-[13px]"
          />
        </label>
        <div className="flex justify-end sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-obc-green px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:cursor-wait disabled:opacity-60"
          >
            <Send size={16} /> {submitting ? "Menyimpan..." : staff ? "Simpan perubahan" : "Simpan staff"}
          </button>
        </div>
      </form>
    </section>
  );
}

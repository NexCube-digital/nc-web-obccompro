export default function Footer() {
  return (
    <footer className="flex flex-col gap-1 border-t border-obc-border px-4 py-4 font-body text-[12px] text-obc-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p>© {new Date().getFullYear()} PT. Onny Barber Center (OBC Group). Hak cipta dilindungi.</p>
      <p>Dashboard Admin Compro &amp; OBC Sport</p>
    </footer>
  );
}
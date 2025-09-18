export default function SiteFooter() {
  return (
    <footer className="mt-8 bg-[color:var(--color-secondary)]/60 border-t border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm flex flex-col sm:flex-row items-center sm:justify-between gap-3">
        <p className="text-center">© {new Date().getFullYear()} MammalsID • Belajar mamalia Indonesia dengan cara yang seru!</p>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-[color:var(--color-primary)] text-white text-xs">Anak</span>
          <span className="px-3 py-1 rounded-full bg-[color:var(--color-tertiary-orange)] text-white text-xs">Edukasi</span>
        </div>
      </div>
    </footer>
  )
}

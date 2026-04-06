export function Footer() {
  return (
    <footer className="py-16 border-t border-elevated bg-obsidian">
      <div className="max-w-6xl mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-playfair text-[11px] tracking-[0.35em] text-warm-white/20 uppercase">
            Javier Bosco
          </span>
          <span className="font-inter font-light text-[8px] text-smoke tracking-[0.25em] uppercase">
            Real Estate · Madrid
          </span>
        </div>

        <div className="w-12 h-px bg-elevated hidden md:block" />

        <p className="font-inter font-light text-[8px] text-smoke tracking-[0.2em] uppercase">
          © 2025 · Off&#8209;Market. On&#8209;Point.
        </p>
      </div>
    </footer>
  );
}

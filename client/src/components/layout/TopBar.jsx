const socials = [
  { name: 'X', path: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
  { name: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { name: 'LinkedIn', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z' },
  { name: 'Instagram', path: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01' },
]

export default function TopBar() {
  return (
    <div className="print:hidden bg-navy-950 border-b border-white/10 text-white/90 text-sm">
      <div className="mx-auto max-w-7xl px-6 h-11 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span>(042) 61683419</span>
          <span className="hidden sm:inline">support@advault.com</span>
          <span className="hidden md:inline">Mon - Sat 8:00 - 17:30</span>
        </div>
        <div className="flex items-center gap-5">
          {socials.map((s) => (
            <a key={s.name} href="#" aria-label={s.name} className="text-white hover:text-brand-500 hover:-translate-y-0.5 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

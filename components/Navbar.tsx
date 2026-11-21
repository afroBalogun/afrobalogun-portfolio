"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import LagosStamp from "@/components/LagosStamp";

const navLinks = [
  { title: "About", href: "/about" },
  { title: "Works", href: "/works" },
  { title: "Playground", href: "/playground" },
  { title: "Contact", href: "/contact" },
];
const POSTER = "font-display font-extrabold [font-stretch:62%] uppercase";
// the /afroBalogun wordmark: the display face after an orange slash; on hover the slash straightens and stretches
// across the word into its highlight, and the word turns ink on it
const WORDMARK = "group relative inline-flex pl-[0.55em] pr-[0.15em] font-display font-bold tracking-tight transition-colors duration-300 hover:text-ink focus-visible:text-ink focus-visible:outline-none";
const Slash = () => <span aria-hidden className="absolute left-[0.12em] inset-y-[0.08em] w-[0.16em] -skew-x-[18deg] bg-[#FF8A3D] transition-[left,width,transform] duration-500 ease-[cubic-bezier(.34,1.3,.64,1)] group-hover:left-0 group-hover:w-full group-hover:skew-x-0 group-focus-visible:left-0 group-focus-visible:w-full group-focus-visible:skew-x-0 motion-reduce:transition-none" />;

// The nav.
// From 1024px up: a floating dock, one ink capsule at the top centre: the logo at one end, Contact as a violet pill at
//   the other, and the other links between them (a lime blob slides under the hovered one and rests on the current page).
// Below that: the logo top-left and a MENU pill top-right that opens a full-screen lime overlay growing out of it as
//   a circle, with huge numbered links that slide in one after another and turn violet on hover, and a violet
//   panel with email, résumé and the Lagos time. Escape, a link or Close shuts it.
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dockHover, setDockHover] = useState<number | null>(null);
  const [blob, setBlob] = useState<{ left: number; width: number } | null>(null);
  const dockLinks = useRef<(HTMLAnchorElement | null)[]>([]);
  const pathname = usePathname();

  // once the page scrolls, a backdrop sits behind the logo and button so content stops running through them
  useEffect(() => {
    // ...except over sections marked data-nav-bare, where the nav sits straight on their colour
    const onScroll = () => setScrolled(window.scrollY > 8 && !document.elementFromPoint(window.innerWidth / 2, 2)?.closest("[data-nav-bare]"));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // while open: Escape closes, and the page behind doesn't scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = prev; };
  }, [open]);

  // the dock's blob rests under the current page and slides to whichever link is hovered or focused
  const activeIndex = navLinks.findIndex((l) => pathname.startsWith(l.href));
  const blobIndex = dockHover ?? (activeIndex >= 0 ? activeIndex : null);
  useEffect(() => {
    const el = blobIndex === null ? null : dockLinks.current[blobIndex];
    // shortcut: measured on change only, so a resize leaves a resting blob slightly off until the next hover
    setBlob(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
  }, [blobIndex]);

  if (pathname.includes("admin")) return null;
  const close = () => setOpen(false);

  return (
    <nav aria-label="Main">
      {/* Scroll backdrop */}
      <div aria-hidden className={`lg:hidden fixed top-0 inset-x-0 z-50 h-16 md:h-24 bg-primary/85 backdrop-blur-md pointer-events-none transition-opacity duration-300 ${scrolled && !open ? "opacity-100" : "opacity-0"}`} />

      <menu className="lg:hidden fixed top-6 md:top-10 left-0 px-4 sm:px-6 md:px-8 lg:px-12 z-50 font-display">
        <Link href="/" onClick={close} className={`${WORDMARK} text-lg text-ink`}><Slash /><span className="relative">afroBalogun</span></Link>
      </menu>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="site-menu"
        className={`lg:hidden fixed top-4 md:top-8 right-4 sm:right-6 md:right-8 z-50 flex items-center gap-3 rounded-full pl-5 pr-4 py-2.5 font-inter text-sm font-medium transition-[background-color,color] duration-300 ease-[cubic-bezier(.34,1.8,.64,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet ${open ? "bg-violet text-cream" : "bg-ink text-cream"}`}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden className="relative block w-5 h-2.5">
          <span className={`absolute left-0 w-full h-0.5 bg-current transition-[top,rotate] duration-300 ${open ? "top-1 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 w-full h-0.5 bg-current transition-[top,rotate] duration-300 ${open ? "top-1 -rotate-45" : "top-2"}`} />
        </span>
      </button>

      {/* desktop dock */}
      <div className="hidden lg:flex fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[min(48rem,calc(100vw-6rem))] items-center justify-between gap-6 rounded-full bg-ink text-cream pl-6 pr-2 py-2 font-inter text-sm shadow-[0_12px_32px_rgba(0,0,0,.25)]">
        <Link href="/" className={`${WORDMARK} text-lg`}><Slash /><span className="relative">afroBalogun</span></Link>
        <div className="relative flex" onMouseLeave={() => setDockHover(null)}>
          <span aria-hidden className="absolute inset-y-0 rounded-full bg-lime transition-[left,width,opacity] duration-500 ease-[cubic-bezier(.34,1.3,.64,1)] motion-reduce:transition-none" style={{ left: blob?.left ?? 0, width: blob?.width ?? 0, opacity: blob ? 1 : 0 }} />
          {navLinks.slice(0, -1).map((link, i) => (
            <Link
              key={link.href}
              ref={(el) => { dockLinks.current[i] = el }}
              href={link.href}
              aria-current={i === activeIndex ? "page" : undefined}
              onMouseEnter={() => setDockHover(i)}
              onFocus={() => setDockHover(i)}
              onBlur={() => setDockHover(null)}
              className={`relative rounded-full px-4 py-2 font-medium outline-none transition-colors duration-300 ${i === blobIndex ? "text-ink" : "text-cream"}`}
            >
              {link.title}
            </Link>
          ))}
        </div>
        {/* Contact, the way in, as a pill of its own (lime when you're on it) */}
        <Link
          href="/contact"
          aria-current={activeIndex === navLinks.length - 1 ? "page" : undefined}
          className={`rounded-full px-5 py-2 font-medium transition-colors duration-300 hover:bg-lime hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime ${activeIndex === navLinks.length - 1 ? "bg-lime text-ink" : "bg-violet text-cream"}`}
        >
          Contact
        </Link>
      </div>

      {/* the overlay grows out of the button as a circle */}
      <div
        id="site-menu"
        inert={!open}
        className={`lg:hidden fixed inset-0 z-40 flex flex-col md:flex-row bg-lime text-ink transition-[clip-path] duration-700 ease-[cubic-bezier(.76,0,.24,1)] motion-reduce:transition-none ${open ? "[clip-path:circle(150%_at_calc(100%-4rem)_3rem)]" : "[clip-path:circle(0%_at_calc(100%-4rem)_3rem)]"}`}
      >
        <ul className="flex-1 flex flex-col justify-center gap-[1.5vh] px-4 sm:px-6 lg:px-12 pt-24 pb-8">
          {navLinks.map((link, i) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                {/* the slide-in is on this wrapper (with its stagger), the hover colour on the link (without it) */}
                <span
                  className={`block transition-[translate,opacity] duration-500 ease-out motion-reduce:transition-none ${open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
                  style={{ transitionDelay: open ? `${250 + i * 70}ms` : "0ms" }}
                >
                  <Link
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={`group inline-flex items-baseline gap-3 md:gap-5 ${POSTER} leading-[0.88] text-[min(15vw,15vh)] transition-colors duration-300 hover:text-violet focus-visible:text-violet focus-visible:outline-none`}
                  >
                    <span className="font-mono text-sm md:text-base font-bold tracking-widest">0{i + 1}</span>
                    {link.title}
                    {active && <span aria-hidden className="text-violet text-[0.5em] self-start">✱</span>}
                  </Link>
                </span>
              </li>
            );
          })}
        </ul>

        {/* the violet panel: the other ways in */}
        <div
          className={`flex flex-col justify-end gap-6 bg-violet text-cream px-4 sm:px-6 py-8 md:w-[32%] md:p-10 lg:p-12 transition-[translate] duration-700 ease-[cubic-bezier(.76,0,.24,1)] motion-reduce:transition-none ${open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}`}
          style={{ transitionDelay: open ? "200ms" : "0ms" }}
        >
          <p className="font-mono text-xs uppercase tracking-widest opacity-70">Say hi</p>
          <a href="mailto:temiruto14@gmail.com" className="font-display font-semibold tracking-tight text-[clamp(1.25rem,2vw,3.5rem)] leading-tight underline-offset-4 hover:underline break-all">temiruto14@gmail.com</a>
          <a href="/Obasa-Temiloluwa-Resume.pdf" target="_blank" rel="noopener noreferrer" className="w-fit font-mono text-xs uppercase tracking-widest underline underline-offset-4 hover:text-lime">Résumé (pdf) →</a>
          <LagosStamp className="font-mono text-xs uppercase tracking-widest" />
        </div>
      </div>
    </nav>
  );
}

"use client"

// Contact, in the site's language, one screen tall: a mono top line (label, where I work from), LET'S TALK in the tall condensed letters with
// the hero's highlight labels on it, the email large with a lime marker that fills on hover, the other ways in as big
// rows that flood with their colour on hover, and a bottom bar. The rows and email are plain links (keyboard-first).

const LINKS = [
  { label: "LinkedIn", detail: "Temiloluwa Obasa", href: "https://www.linkedin.com/in/temiloluwa-obasa-786b7817b/", hover: "hover:bg-violet hover:text-cream focus-visible:bg-violet focus-visible:text-cream", external: true },
  { label: "GitHub", detail: "afroBalogun", href: "https://github.com/afroBalogun", hover: "hover:bg-lime focus-visible:bg-lime", external: true },
  { label: "Phone", detail: "+234 706 967 5136", href: "tel:+2347069675136", hover: "hover:bg-[#FF8A3D] focus-visible:bg-[#FF8A3D]" },
  { label: "Résumé", detail: "PDF", href: "/Obasa-Temiloluwa-Resume.pdf", hover: "hover:bg-lime focus-visible:bg-lime", external: true },
]

export default function Contact() {
  return (
    <main className="h-svh min-h-[34rem] overflow-hidden bg-cream text-ink flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 pt-24 md:pt-28 pb-6">
      {/* top line */}
      <div className="flex items-start justify-between gap-6 font-mono text-2xs sm:text-xs uppercase tracking-widest">
        <p><span className="text-[#FF8A3D]">/</span> contact</p>
        <p className="text-right">Based in Lagos,<br />working worldwide</p>
      </div>

      {/* headline, with the hero's highlight labels on it */}
      <div className="relative mt-[3svh] w-fit">
        <h1 className="font-display font-extrabold [font-stretch:62%] uppercase leading-[0.82] text-[clamp(3.5rem,min(15vw,19svh),30rem)]">Let&apos;s talk</h1>
        <p aria-hidden className="max-md:mt-4 md:absolute md:right-0 md:-top-[0.4em] md:translate-x-[10%] font-inter font-black uppercase leading-[1.25] tracking-tight text-[clamp(0.85rem,min(1.5vw,2.4svh),2.5rem)] md:text-right">
          <span className="relative inline-block bg-lime px-[0.2em] -rotate-2">Available<sup className="absolute -right-[0.55em] -top-[0.15em] text-violet text-[0.8em]">*</sup></span><br />
          <span className="bg-violet text-cream px-[0.2em]">for new projects</span>
        </p>
      </div>

      {/* the email, the main way in */}
      <a
        href="mailto:temiruto14@gmail.com"
        className="mt-[3.5svh] w-fit font-display font-semibold tracking-tight text-[clamp(1.4rem,min(3.6vw,5.5svh),7rem)] leading-none bg-no-repeat bg-bottom bg-[length:100%_30%] bg-[linear-gradient(#BCF975,#BCF975)] transition-[background-size] duration-500 ease-[cubic-bezier(.65,0,.35,1)] hover:bg-[length:100%_100%] focus-visible:bg-[length:100%_100%] outline-none"
      >
        temiruto14@gmail.com
      </a>

      {/* the other ways in */}
      <ul className="mt-[4svh] border-t-2 border-ink">
        {LINKS.map((l) => (
          <li key={l.label} className="border-b border-ink/25">
            <a
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`group flex items-center justify-between gap-6 px-2 -mx-2 py-[1.3svh] outline-none transition-colors duration-300 ${l.hover}`}
            >
              <span className="font-display font-extrabold [font-stretch:62%] uppercase leading-none text-[clamp(1.4rem,min(2.6vw,4.2svh),4.5rem)]">{l.label}</span>
              <span className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
                <span className="max-sm:hidden opacity-70">{l.detail}</span>
                <span aria-hidden className="text-base transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* bottom bar */}
      <div className="mt-auto pt-6 flex justify-between items-end font-mono text-2xs uppercase tracking-widest">
        <span className="opacity-60">© {new Date().getFullYear()}</span>
        <span><span className="text-[#FF8A3D]">/</span>afroBalogun</span>
      </div>
    </main>
  )
}

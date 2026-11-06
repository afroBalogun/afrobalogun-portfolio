"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { title: "about", href: "/about", angle: 45 },
  { title: "works", href: "/works", angle: 135 },
  { title: "playground", href: "/playground", angle: 225 },
  { title: "contact", href: "/contact", angle: 315 },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [radius, setRadius] = useState(180);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const pathname = usePathname()

  useGSAP(() => {
    if (pathname !== "/") return

    // fromTo, not from: on "/" they start at opacity-0 in the HTML so they don't flash before the intro
    gsap.fromTo(["button", "menu"], { opacity: 0, y: -8 }, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.15,
      delay: 2.3
    })
  }, { scope: navRef, dependencies: [pathname] })


  useEffect(() => {
    const updateRadius = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 // grows past 1920 wide
      setRadius((window.innerWidth < 768 ? 140 : 180) * rem);
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // once the page scrolls, a backdrop sits behind the menu so content stops running through the links
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);


  const adminpathname = usePathname().includes("admin")

  return (
    <nav className={`${adminpathname ? "hidden" : ""}`} ref={navRef}>
      {/* Scroll backdrop: separate from <menu> so the menu's mix-blend-difference text still blends over it */}
      <div
        aria-hidden
        className={`fixed top-0 inset-x-0 z-50 h-16 md:h-24 bg-primary/85 backdrop-blur-md pointer-events-none transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* Floating menu trigger - bottom right corner */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`${pathname === "/" ? "opacity-0" : ""} fixed bottom-8 right-8 md:hidden md:right-12 z-50 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group animate-pulse-slow rounded-full bg-primary text-gray-600 shadow-lg focus:outline-none`}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {/* Outer brush circle - pulses */}
        <div
          className={`absolute inset-0 transition-all duration-700 ${menuOpen ? 'scale-110 opacity-20' : 'scale-100 opacity-10'
            }`}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Inner brush stroke background */}
        <div
          className={`absolute inset-2 transition-all duration-500 ${menuOpen ? 'scale-95 opacity-25' : 'scale-100 opacity-15 group-hover:opacity-20'
            }`}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path
              d="M50,15 Q70,25 80,45 Q90,65 80,85 Q70,95 50,95 Q30,95 20,85 Q10,75 15,55 Q20,35 40,20 Q45,15 50,15"
              fill="currentColor"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Center label - transforms between "menu" and × */}
        <span
          className={`relative z-10 font-mono font-semibold transition-all duration-500 ${menuOpen ? 'rotate-90 text-xl' : 'rotate-0 text-2xs uppercase tracking-widest'
            }`}
        >
          {menuOpen ? '×' : 'menu'}
        </span>
      </button>

      {/* Backdrop blur overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-700 ${menuOpen
          ? 'backdrop-blur-md bg-primary/80 opacity-100'
          : 'backdrop-blur-none opacity-0 pointer-events-none'
          }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Orbital menu items - centered on screen */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
        {navLinks.map((link, index) => {
          const isHovered = hoveredIndex === index;
          const orbitRadius = menuOpen ? radius : 0;
          const angleRad = (link.angle * Math.PI) / 180;
          const x = Math.cos(angleRad) * orbitRadius;
          const y = Math.sin(angleRad) * orbitRadius;

          return (
            <Link
              key={index}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="absolute pointer-events-auto"
              style={{
                left: '50%',
                top: '50%',
                transform: menuOpen
                  ? `translate(calc(-50% + ${x}px), calc(-50% + ${-y}px)) scale(1)`
                  : 'translate(-50%, -50%) scale(0)',
                transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 80}ms`,
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {/* Link container with brush stroke */}
              <div className="relative group">
                {/* Brush stroke background */}
                <div
                  className="absolute -z-10 transition-all duration-400"
                  style={{
                    inset: '-80% -60%',
                    opacity: isHovered ? 0.18 : 0.08,
                    transform: isHovered
                      ? 'scale(1.1) rotate(0deg)'
                      : 'scale(0.95) rotate(-8deg)',
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 200 200"
                    className="w-full h-full"
                  >
                    {index % 2 === 0 ? (
                      <ellipse
                        cx="100"
                        cy="100"
                        rx="85"
                        ry="75"
                        fill="white"
                        transform={`rotate(${index * 15} 100 100)`}
                      />
                    ) : (
                      <path
                        d="M100,30 Q140,50 150,90 Q160,130 130,160 Q100,180 70,160 Q40,140 40,100 Q40,60 70,40 Q85,28 100,30"
                        fill="currentColor"
                      />
                    )}
                  </svg>
                </div>

                {/* Link text */}
                <span
                  className={`
                                        relative z-10 inline-block px-4 py-2 text-sm md:text-base 
                                        font-medium capitalize whitespace-nowrap
                                        transition-all duration-300
                                        ${isHovered ? 'scale-110' : 'scale-100'}
                                    `}
                >
                  {link.title}
                </span>

                {/* Connecting line to center - points back to origin (0,0) which is screen center */}
                <div
                  className="absolute top-1/2 left-1/2 -z-20 origin-left transition-all duration-500"
                  style={{
                    width: orbitRadius,
                    height: 1,
                    background: `linear-gradient(to right, transparent 0%, currentColor 100%)`,
                    transform: `rotate(${link.angle + 180}deg)`,
                    opacity: menuOpen ? 0.15 : 0,
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      <menu className={`${pathname === "/" ? "opacity-0" : ""} fixed top-6 md:top-10 left-0 w-full px-4 sm:px-6 md:px-8 lg:px-12  z-50 flex justify-between items-center font-mono text-white mix-blend-difference`}>
        {/* Logo Container */}
        <Link
          href="/"
          className="relative group transition-opacity hover:opacity-80"
        >
          <span className="relative z-10 text-sm font-semibold">
            (/afroBalogun)
          </span>

          {/* Refined Brush stroke underline */}
          <div className="absolute -bottom-1 left-0 w-full h-2 -z-10 opacity-0 group-hover:opacity-20 transition-all duration-500 scale-x-90 group-hover:scale-x-100">
            <svg width="100%" height="100%" viewBox="0 0 200 30" preserveAspectRatio="none">
              <path
                d="M2,20 Q50,5 100,15 Q150,25 198,15"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </Link>

        {/* Links Container */}
        <div className="hidden md:flex gap-12 lg:gap-20">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="relative group text-sm capitalize tracking-tight"
            >
              <span className="relative z-10">{link.title}</span>

              {/* Brush stroke underline */}
              <div className="absolute -bottom-1 left-0 w-full h-2 -z-10 opacity-0 group-hover:opacity-20 transition-all duration-500 scale-x-75 group-hover:scale-x-100">
                <svg width="100%" height="100%" viewBox="0 0 200 30" preserveAspectRatio="none">
                  <path
                    d="M5,15 Q60,5 100,12 Q140,20 195,15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </menu>

    </nav>
  );
}
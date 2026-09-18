"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ═══ Couleurs navbar + footer selon la page ═══
const PAGE_THEMES: Record<string, { nav: string; navBorder: string; logo: string; text: string; hover: string; footer: string; footerBorder: string }> = {
  "/": { nav: "bg-black/95", navBorder: "border-yellow-400/30", logo: "from-yellow-400 to-orange-500", text: "text-yellow-300", hover: "hover:bg-yellow-400/10", footer: "bg-black/80", footerBorder: "border-yellow-400/20" },
  "/chat": { nav: "bg-amber-50/95", navBorder: "border-amber-300", logo: "from-yellow-400 to-amber-500", text: "text-amber-800", hover: "hover:bg-amber-200/50", footer: "bg-amber-50", footerBorder: "border-amber-300" },
  "/builder": { nav: "bg-white/95", navBorder: "border-orange-200", logo: "from-yellow-400 to-orange-500", text: "text-orange-700", hover: "hover:bg-orange-100", footer: "bg-white/90", footerBorder: "border-orange-200" },
  "/agents": { nav: "bg-blue-950/95", navBorder: "border-blue-400/30", logo: "from-blue-500 to-red-500", text: "text-blue-200", hover: "hover:bg-blue-500/10", footer: "bg-blue-950/90", footerBorder: "border-blue-400/20" },
  "/guide": { nav: "bg-[#0a0f1e]/95", navBorder: "border-cyan-400/30", logo: "from-cyan-400 to-blue-500", text: "text-cyan-300", hover: "hover:bg-cyan-400/10", footer: "bg-[#0a0f1e]/90", footerBorder: "border-cyan-400/20" },
  "/connectors": { nav: "bg-pink-950/95", navBorder: "border-pink-400/30", logo: "from-pink-400 to-pink-600", text: "text-pink-300", hover: "hover:bg-pink-400/10", footer: "bg-pink-950/90", footerBorder: "border-pink-400/20" },
  "/enterprise": { nav: "bg-emerald-950/95", navBorder: "border-emerald-400/30", logo: "from-emerald-400 to-emerald-600", text: "text-emerald-300", hover: "hover:bg-emerald-400/10", footer: "bg-emerald-950/90", footerBorder: "border-emerald-400/20" },
  "/entreprise": { nav: "bg-emerald-950/95", navBorder: "border-emerald-400/30", logo: "from-emerald-400 to-emerald-600", text: "text-emerald-300", hover: "hover:bg-emerald-400/10", footer: "bg-emerald-950/90", footerBorder: "border-emerald-400/20" },
  "/about": { nav: "bg-black/95", navBorder: "border-white/20", logo: "from-purple-500 via-pink-500 to-orange-500", text: "text-white", hover: "hover:bg-white/10", footer: "bg-black/80", footerBorder: "border-white/10" },
  "/contact": { nav: "bg-[#1a0f2e]/95", navBorder: "border-purple-400/30", logo: "from-purple-500 via-fuchsia-500 to-violet-500", text: "text-purple-200", hover: "hover:bg-purple-500/10", footer: "bg-[#1a0f2e]/90", footerBorder: "border-purple-400/20" },
};

const DEFAULT_THEME = PAGE_THEMES["/"];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // Trouve la couleur correspondant à la page
  let theme = DEFAULT_THEME;
  for (const key of Object.keys(PAGE_THEMES)) {
    if (pathname === key || pathname.startsWith(key + "/")) {
      theme = PAGE_THEMES[key];
    }
  }

  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-black">
          <nav className={`h-14 border-b ${theme.navBorder} ${theme.nav} backdrop-blur-md sticky top-0 z-50 transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 gap-2">
                            {/* Logo BARRY AI */}
              <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                <div className={`relative w-9 h-9 rounded-xl bg-gradient-to-br ${theme.logo} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-3`}>
                  <span className="text-white font-black text-lg leading-none select-none" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    B
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className={`font-black tracking-widest text-sm ${theme.text} transition-colors duration-300`}>
                  BARRY<span className="opacity-60 ml-1">AI</span>
                </span>
              </Link>

              {/* Liens navbar */}
              <div className="flex items-center gap-1 text-xs overflow-x-auto">
                <NavLink href="/" theme={theme}>Accueil</NavLink>
                <NavLink href="/chat" theme={theme}>Chat IA</NavLink>
                <NavLink href="/agents" theme={theme}>Agents</NavLink>
                <NavLink href="/builder" theme={theme}>Building</NavLink>
                <NavLink href="/guide" theme={theme}>Coach IA</NavLink>
                <NavLink href="/connectors" theme={theme}>Connecteurs</NavLink>
                <NavLink href="/entreprise" theme={theme}>Entreprise</NavLink>
                <NavLink href="/about" theme={theme}>À propos</NavLink>
                <NavLink href="/contact" theme={theme}>Contact</NavLink>
              </div>

              {/* CTA */}
              <Link
                href="/builder"
                className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${theme.logo} text-white font-bold text-xs whitespace-nowrap flex-shrink-0 shadow-md transition-all duration-300`}
              >
                Créer
              </Link>
            </div>
          </nav>

          <main className="flex-1">{children}</main>

          <footer className={`border-t ${theme.footerBorder} ${theme.footer} py-4 px-6 transition-colors duration-300`}>
            <div className={`max-w-7xl mx-auto flex items-center justify-between text-xs ${theme.text} opacity-70`}>
              <p>© 2026 BARRY AI · Tous droits reserves</p>
              <div className="flex gap-4">
                <Link href="/about" className={theme.hover + " px-2 py-1 rounded transition-all"}>
                  À propos
                </Link>
                <Link href="/entreprise" className={theme.hover + " px-2 py-1 rounded transition-all"}>
                  Entreprise
                </Link>
                <Link href="/contact" className={theme.hover + " px-2 py-1 rounded transition-all"}>
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

function NavLink({
  href,
  theme,
  children,
}: {
  href: string;
  theme: typeof DEFAULT_THEME;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg ${theme.text} ${theme.hover} transition-all whitespace-nowrap`}
    >
      {children}
    </Link>
  );
}
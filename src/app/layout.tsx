"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/useAuth";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const PAGE_THEMES: Record<
  string,
  {
    nav: string;
    navBorder: string;
    logo: string;
    text: string;
    hover: string;
    footer: string;
    footerBorder: string;
  }
> = {
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
  "/pricing": { nav: "bg-white/95", navBorder: "border-zinc-200", logo: "from-yellow-400 to-orange-500", text: "text-zinc-700", hover: "hover:bg-zinc-100", footer: "bg-white/90", footerBorder: "border-zinc-200" },
  "/account": { nav: "bg-white/95", navBorder: "border-zinc-200", logo: "from-yellow-400 to-orange-500", text: "text-zinc-700", hover: "hover:bg-zinc-100", footer: "bg-white/90", footerBorder: "border-zinc-200" },
  "/signup": { nav: "bg-white/95", navBorder: "border-zinc-200", logo: "from-yellow-400 to-orange-500", text: "text-zinc-700", hover: "hover:bg-zinc-100", footer: "bg-white/90", footerBorder: "border-zinc-200" },
  "/signin": { nav: "bg-white/95", navBorder: "border-zinc-200", logo: "from-yellow-400 to-orange-500", text: "text-zinc-700", hover: "hover:bg-zinc-100", footer: "bg-white/90", footerBorder: "border-zinc-200" },
  "/blocked": { nav: "bg-white/95", navBorder: "border-zinc-200", logo: "from-yellow-400 to-orange-500", text: "text-zinc-700", hover: "hover:bg-zinc-100", footer: "bg-white/90", footerBorder: "border-zinc-200" },
};

const DEFAULT_THEME = PAGE_THEMES["/"];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body
        className={inter.className}
        style={{
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <LanguageProvider>
          <LayoutContent>{children}</LayoutContent>
        </LanguageProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  let theme = DEFAULT_THEME;
  for (const key of Object.keys(PAGE_THEMES)) {
    if (pathname === key || pathname.startsWith(key + "/")) {
      theme = PAGE_THEMES[key];
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <nav
        className={`h-14 border-b ${theme.navBorder} ${theme.nav} backdrop-blur-md sticky top-0 z-50 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 gap-2">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div
              className={`relative w-8 h-8 rounded-xl bg-gradient-to-br ${theme.logo} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-3`}
            >
              <span
                className="text-white font-black text-base leading-none select-none"
                style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
              >
                B
              </span>
            </div>
            <span
              className={`font-bold tracking-tight text-[15px] ${theme.text} transition-colors duration-300`}
            >
              BARRY<span className="opacity-60 font-medium ml-1">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 text-[13px] overflow-x-auto">
            <NavLink href="/" theme={theme}>Accueil</NavLink>
            <NavLink href="/chat" theme={theme}>Chat IA</NavLink>
            <NavLink href="/agents" theme={theme}>Agents</NavLink>
            <NavLink href="/builder" theme={theme}>Building</NavLink>
            <NavLink href="/guide" theme={theme}>Coach IA</NavLink>
            <NavLink href="/connectors" theme={theme}>Connecteurs</NavLink>
            <NavLink href="/entreprise" theme={theme}>Entreprise</NavLink>
            <NavLink href="/pricing" theme={theme}>Tarifs</NavLink>
            <NavLink href="/about" theme={theme}>À propos</NavLink>
            <NavLink href="/contact" theme={theme}>Contact</NavLink>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {user ? (
              <Link
                href="/account"
                className={`px-3.5 py-1.5 rounded-lg border ${theme.navBorder} ${theme.text} font-medium text-[13px] whitespace-nowrap transition-all duration-300 hover:opacity-80`}
              >
                Mon compte
              </Link>
            ) : (
              <Link
                href="/signin"
                className={`px-3.5 py-1.5 rounded-lg border ${theme.navBorder} ${theme.text} font-medium text-[13px] whitespace-nowrap transition-all duration-300 hover:opacity-80`}
              >
                Connexion
              </Link>
            )}
            <Link
              href="/builder"
              className={`px-3.5 py-1.5 rounded-lg bg-gradient-to-r ${theme.logo} text-white font-semibold text-[13px] whitespace-nowrap shadow-md transition-all duration-300 hover:opacity-90`}
            >
              Créer
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer
        className={`border-t ${theme.footerBorder} ${theme.footer} py-4 px-6 transition-colors duration-300`}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between text-[12px] ${theme.text} opacity-70`}
        >
          <p>© 2026 BARRY AI · Tous droits réservés</p>
          <div className="flex gap-4">
            <Link
              href="/about"
              className={theme.hover + " px-2 py-1 rounded transition-all"}
            >
              À propos
            </Link>
            <Link
              href="/entreprise"
              className={theme.hover + " px-2 py-1 rounded transition-all"}
            >
              Entreprise
            </Link>
            <Link
              href="/contact"
              className={theme.hover + " px-2 py-1 rounded transition-all"}
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
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
      className={`px-3 py-1.5 rounded-lg ${theme.text} ${theme.hover} transition-all whitespace-nowrap font-medium hover:opacity-100 opacity-90`}
    >
      {children}
    </Link>
  );
}
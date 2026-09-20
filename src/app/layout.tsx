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

  // Pages qui ont leur propre fond (pas de fond global)
  const isFullscreenPage = pathname === "/";

  return (
    <div
      className={
        "min-h-screen flex flex-col " +
        (isFullscreenPage ? "bg-black" : "bg-gradient-to-br from-slate-50 via-white to-orange-50")
      }
    >
      {/* ═══ HEADER ═══ */}
      <nav className="h-16 sticky top-0 z-50 border-b border-gray-200/60 backdrop-blur-xl bg-white/75">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 gap-2">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-orange-500/50">
              <span
                className="text-white font-black text-lg leading-none select-none"
                style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
              >
                B
              </span>
              {/* Petit éclat */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black tracking-tight text-[15px] text-gray-900">
                BARRY AI
              </span>
              <span className="text-[9px] tracking-[0.15em] text-gray-400 font-medium mt-0.5">
                CRÉATEUR PRO
              </span>
            </div>
          </Link>

          {/* NAV */}
          <div className="hidden lg:flex items-center gap-0.5 text-[13px]">
            <NavLink href="/">Accueil</NavLink>
            <NavLink href="/chat">Chat IA</NavLink>
            <NavLink href="/agents">Agents</NavLink>
            <NavLink href="/builder">Building</NavLink>
            <NavLink href="/guide">Coach IA</NavLink>
            <NavLink href="/connectors">Connecteurs</NavLink>
            <NavLink href="/entreprise">Entreprise</NavLink>
            <NavLink href="/pricing">Tarifs</NavLink>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <Link
                href="/account"
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold text-[13px] whitespace-nowrap transition-all duration-300 hover:bg-gray-50 hover:border-gray-300"
              >
                Mon compte
              </Link>
            ) : (
              <Link
                href="/signin"
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold text-[13px] whitespace-nowrap transition-all duration-300 hover:bg-gray-50 hover:border-gray-300"
              >
                Connexion
              </Link>
            )}
            <Link
              href="/builder"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-[13px] whitespace-nowrap shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50"
            >
              ✨ Créer
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ CONTENU ═══ */}
      <main className="flex-1">{children}</main>

      {/* ═══ FOOTER ═══ */}
      {!isFullscreenPage && (
        <footer className="border-t border-gray-200/60 bg-white/70 backdrop-blur-sm py-6 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-gray-500">
            <p>
              <strong className="text-gray-900 font-bold">© 2026 BARRY AI</strong>
              {" · "}
              Tous droits réservés
            </p>
            <div className="flex gap-1">
              <FooterLink href="/about">À propos</FooterLink>
              <FooterLink href="/entreprise">Entreprise</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={
        "px-3 py-2 rounded-lg transition-all whitespace-nowrap font-semibold " +
        (isActive
          ? "text-orange-600 bg-orange-50"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100")
      }
    >
      {children}
    </Link>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all font-medium"
    >
      {children}
    </Link>
  );
}
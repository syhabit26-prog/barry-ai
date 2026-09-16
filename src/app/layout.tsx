import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BARRY AI - Créez site, jeu, app en 15s",
  description: "Plateforme IA tout-en-un : sites web, jeux, apps, boutiques e-commerce.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-black">
          <nav className="h-14 border-b border-yellow-400/30 bg-black/95 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 gap-2">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
                <span className="font-black tracking-wider text-sm text-yellow-300">
                  BARRY AI
                </span>
              </Link>

              {/* Liens navbar */}
              <div className="flex items-center gap-1 text-xs overflow-x-auto">
                <NavLink href="/">Accueil</NavLink>
                <NavLink href="/chat">Chat IA</NavLink>
                <NavLink href="/agents">Agents</NavLink>
                <NavLink href="/builder">Building</NavLink>
                <NavLink href="/guide">Coach IA</NavLink>
                <NavLink href="/connectors">Connecteurs</NavLink>
                <NavLink href="/entreprise">Entreprise</NavLink>
                <NavLink href="/about">À propos</NavLink>
                <NavLink href="/contact">Contact</NavLink>
              </div>

              {/* CTA */}
              <Link
                href="/builder"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-xs whitespace-nowrap flex-shrink-0"
              >
                Créer
              </Link>
            </div>
          </nav>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-yellow-400/20 bg-black/80 py-4 px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-yellow-500/60">
              <p>© 2026 BARRY AI · Tous droits reserves</p>
              <div className="flex gap-4">
                <Link href="/about" className="hover:text-yellow-400">
                  À propos
                </Link>
                <Link href="/entreprise" className="hover:text-yellow-400">
                  Entreprise
                </Link>
                <Link href="/contact" className="hover:text-yellow-400">
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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-yellow-300 hover:bg-yellow-400/10 transition-all whitespace-nowrap"
    >
      {children}
    </Link>
  );
}
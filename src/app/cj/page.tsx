"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, ShoppingCart, BarChart3, Search, RefreshCw,
  TrendingUp, DollarSign, Star, ArrowRight,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
  sku: string;
  category: string;
};

type Tab = "products" | "orders" | "stats";

const CATEGORIES = [
  { label: "Sneakers", value: "sneakers" },
  { label: "Bijoux", value: "bijoux" },
  { label: "Montres", value: "montres" },
  { label: "Tech", value: "tech" },
  { label: "Sacs", value: "sacs" },
  { label: "Lunettes", value: "lunettes" },
  { label: "Vêtements", value: "vetements" },
  { label: "Cosmétiques", value: "cosmetiques" },
  { label: "Parfums", value: "parfums" },
  { label: "Chaussures", value: "chaussures" },
  { label: "Casques", value: "casques" },
  { label: "Gaming", value: "gaming" },
  { label: "Maison", value: "maison" },
  { label: "Sport", value: "sport" },
  { label: "Voyage", value: "voyage" },
  { label: "Musique", value: "musique" },
];

export default function CJPage() {
  const [tab, setTab] = useState<Tab>("products");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("sneakers");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(5000);

  const loadProducts = async (kw: string, cat?: string) => {
    setLoading(true);
    try {
      const url = cat
        ? `/api/products/random?count=20&category=${encodeURIComponent(cat)}`
        : `/api/products/all?search=${encodeURIComponent(kw)}&limit=100`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.ok) {
        setProducts(data.products || []);
        if (data.total) setTotalProducts(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRandom = (cat: string) => {
    setLoading(true);
    fetch(`/api/products/random?count=20&category=${encodeURIComponent(cat)}&_=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setProducts(data.products || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRandom(category);
  }, [category]);

  const handleSearch = () => {
    if (search.trim()) loadProducts(search.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-[#1a0a14] to-black text-white relative overflow-hidden">

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-pink-500/20 blur-[150px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-fuchsia-500/15 blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full bg-rose-500/15 blur-[140px]" />
      </div>

      <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-pink-500/40">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-300 to-fuchsia-300 bg-clip-text text-transparent">
                Bibliothèque Produits
              </h1>
              <p className="text-pink-200/60 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {totalProducts} produits disponibles · Tous thèmes
              </p>
            </div>
          </div>

          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 hover:to-fuchsia-500 text-white font-bold shadow-lg shadow-pink-500/30 transition-all self-start md:self-auto"
          >
            Créer une boutique
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat icon={<Package className="w-5 h-5" />} label="Catalogue" value={totalProducts.toString()} />
          <Stat icon={<ShoppingCart className="w-5 h-5" />} label="Commandes" value="0" />
          <Stat icon={<DollarSign className="w-5 h-5" />} label="Revenus" value="0 €" />
          <Stat icon={<TrendingUp className="w-5 h-5" />} label="Marge moy." value="35%" />
        </div>

        {/* ONGLETS */}
        <div className="flex gap-2 mb-8 border-b border-pink-400/20">
          <TabButton active={tab === "products"} onClick={() => setTab("products")} icon={<Package className="w-4 h-4" />}>
            Produits
          </TabButton>
          <TabButton active={tab === "orders"} onClick={() => setTab("orders")} icon={<ShoppingCart className="w-4 h-4" />}>
            Commandes
          </TabButton>
          <TabButton active={tab === "stats"} onClick={() => setTab("stats")} icon={<BarChart3 className="w-4 h-4" />}>
            Statistiques
          </TabButton>
        </div>

        {tab === "products" && (
          <div>
            <div className="mb-6 flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-black/60 border border-pink-400/30 rounded-2xl px-4 py-3 focus-within:border-pink-400 transition-all">
                  <Search className="w-4 h-4 text-pink-400/70" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Rechercher parmi 5000 produits..."
                    className="flex-1 bg-transparent text-sm outline-none placeholder-pink-300/40 text-pink-50"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-400 text-white font-bold text-sm shadow-lg shadow-pink-500/30 transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Chercher
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => { setCategory(c.value); setSearch(""); }}
                    className={
                      "text-xs px-3 py-1.5 rounded-full border transition-all " +
                      (category === c.value
                        ? "border-pink-400 bg-pink-400/20 text-pink-200 shadow-md shadow-pink-500/20"
                        : "border-pink-400/20 text-pink-300/70 hover:border-pink-400/50 hover:bg-pink-400/5")
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-pink-200/60">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                Chargement...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-pink-200/60">Aucun produit trouvé</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="group p-4 rounded-2xl border border-pink-400/30 bg-black/60 backdrop-blur hover:border-pink-400/70 hover:shadow-lg hover:shadow-pink-500/20 transition-all"
                    >
                      <div className="relative aspect-square rounded-xl bg-white mb-3 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/300x300/fdf2f8/be185d?text=Produit";
                          }}
                        />
                        {p.badge && (
                          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-pink-100 mb-1 line-clamp-2 min-h-[40px]">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-pink-300/60 mb-2">
                        <Star className="w-3 h-3 fill-pink-400 text-pink-400" />
                        <span>{p.rating.toFixed(1)}</span>
                        <span>· {p.reviews} avis</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-black text-pink-300">{p.price.toFixed(2)} €</span>
                        {p.oldPrice > p.price && (
                          <span className="text-xs text-pink-300/40 line-through">{p.oldPrice.toFixed(2)} €</span>
                        )}
                      </div>
                      <Link
                        href="/builder"
                        className="block w-full text-center py-2 rounded-xl bg-gradient-to-r from-pink-500/20 to-fuchsia-600/20 border border-pink-400/40 hover:from-pink-500 hover:to-fuchsia-600 text-pink-200 hover:text-white font-bold text-xs transition-all"
                      >
                        Ajouter à ma boutique
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <button
                    onClick={() => loadRandom(category)}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500/20 to-fuchsia-600/20 border border-pink-400/40 hover:from-pink-500 hover:to-fuchsia-600 text-pink-200 hover:text-white font-bold text-sm transition-all"
                  >
                    🔄 Voir 20 autres produits
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {tab === "orders" && (
          <div className="text-center py-20 text-pink-200/60">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <h3 className="text-xl font-bold mb-2">Aucune commande</h3>
            <p className="text-sm">Crée une boutique et commence à vendre.</p>
          </div>
        )}

        {tab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard title="Ventes ce mois" value="0 €" desc="Aucune vente encore" />
            <StatCard title="Catalogue total" value={totalProducts.toString()} desc="Produits disponibles" />
            <StatCard title="Taux de marge moyen" value="35%" desc="Sur tes produits" />
            <StatCard title="Satisfaction client" value="—" desc="En attente de commandes" />
          </div>
        )}

      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl border border-pink-400/30 bg-black/40 backdrop-blur">
      <div className="flex items-center gap-2 text-pink-400 mb-2">
        {icon}
        <span className="text-[10px] text-pink-300/60 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-black bg-gradient-to-r from-pink-300 to-fuchsia-300 bg-clip-text text-transparent">
        {value}
      </div>
    </div>
  );
}

function StatCard({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl border border-pink-400/30 bg-black/60 backdrop-blur">
      <div className="text-xs text-pink-300/60 uppercase tracking-wider mb-2">{title}</div>
      <div className="text-3xl font-black text-pink-300 mb-2">{value}</div>
      <div className="text-xs text-pink-200/50">{desc}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "px-4 py-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 " +
        (active
          ? "text-pink-200 border-pink-400"
          : "text-pink-300/50 border-transparent hover:text-pink-300")
      }
    >
      {icon}
      {children}
    </button>
  );
}
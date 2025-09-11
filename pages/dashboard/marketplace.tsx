// pages/dashboard/marketplace.tsx
import React, { useMemo, useState } from "react";
import Link from "next/link";
import PrivateLayout from "../../components/layout/PrivateLayout";

type Item = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "Plantillas" | "Dashboards" | "SOPs" | "Packs" | "Integraciones";
  badge?: "Nuevo" | "Más vendido" | "Actualizado";
  rating: number;
  sales: number;
  price: number; // 0 => Gratis
  includes: string[];
  image?: string;
  tags: string[];
};

const ITEMS: Item[] = [
  {
    id: "i1",
    slug: "pack-sops-operaciones",
    title: "Pack SOPs — Operaciones",
    subtitle: "Procedimientos listos para adaptar: producción, QA y entregas",
    category: "SOPs",
    badge: "Más vendido",
    rating: 4.8,
    sales: 1820,
    price: 59,
    includes: ["20 SOPs editables", "Checklist auditoría", "Formato de capacitación"],
    image: "/img/marketplace/sops.jpg",
    tags: ["Procesos", "Calidad", "Eficiencia"],
  },
  {
    id: "i2",
    slug: "dashboard-ejecutivo-kpis",
    title: "Dashboard Ejecutivo KPIs",
    subtitle: "Google Sheets + Data Studio para dirección",
    category: "Dashboards",
    badge: "Actualizado",
    rating: 4.7,
    sales: 1350,
    price: 39,
    includes: ["Plantilla Sheets", "Conector DS", "Guía de instalación"],
    image: "/img/marketplace/dashboard.jpg",
    tags: ["KPIs", "OKRs", "Análisis"],
  },
  {
    id: "i3",
    slug: "plantillas-finanzas",
    title: "Plantillas Finanzas",
    subtitle: "Flujo de caja, presupuesto y punto de equilibrio",
    category: "Plantillas",
    badge: "Nuevo",
    rating: 4.6,
    sales: 920,
    price: 29,
    includes: ["Cashflow semanal", "Budget anual", "BEA automático"],
    image: "/img/marketplace/finanzas.jpg",
    tags: ["Cashflow", "Presupuesto", "Pricing"],
  },
  {
    id: "i4",
    slug: "pack-ventas-b2b",
    title: "Pack Ventas B2B",
    subtitle: "Playbook + scripts + CRM base",
    category: "Packs",
    rating: 4.9,
    sales: 1500,
    price: 69,
    includes: ["Playbook PDF", "Plantilla CRM", "Guión discovery"],
    image: "/img/marketplace/ventas.jpg",
    tags: ["Pipeline", "CRM", "Cierre"],
  },
  {
    id: "i5",
    slug: "integracion-zapier-starter",
    title: "Integración Zapier — Starter",
    subtitle: "Automatiza alta de leads y seguimiento",
    category: "Integraciones",
    rating: 4.5,
    sales: 460,
    price: 49,
    includes: ["Zaps preconfigurados", "Guía video", "Soporte 30 días"],
    image: "/img/marketplace/zapier.jpg",
    tags: ["No-code", "Automations", "Leads"],
  },
  {
    id: "i6",
    slug: "plantilla-okrs-direccion",
    title: "Plantilla OKRs — Dirección",
    subtitle: "Plan 90 días con rituales y mediciones",
    category: "Plantillas",
    rating: 4.7,
    sales: 1110,
    price: 19,
    includes: ["OKRs trimestrales", "Agenda rituales", "Board Kanban"],
    image: "/img/marketplace/okrs.jpg",
    tags: ["OKRs", "Prioridades", "Ejecución"],
  },
];

const Star: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg viewBox="0 0 20 20" className={`w-4 h-4 ${filled ? "fill-yellow-400" : "fill-gray-300"}`}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.98 8.72c-.783-.57-.38-1.81.588-1.81H8.03a1 1 0 00.95-.69l1.07-3.292z"/>
  </svg>
);
const Rating: React.FC<{ value: number }> = ({ value }) => {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => <Star key={n} filled={n <= full} />)}
      <span className="text-xs text-gray-600 ml-1">{value.toFixed(1)}</span>
    </div>
  );
};

const ItemCard: React.FC<{ it: Item; onAdd: (id: string) => void }> = ({ it, onAdd }) => {
  const isFree = it.price === 0;
  return (
    <div className="group relative rounded-2xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="h-40 w-full bg-gray-100">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${it.image || "/img/marketplace/placeholder.jpg"})` }} />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 border">{it.category}</span>
            {it.badge && <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-600 text-white">{it.badge}</span>}
          </div>
          <div className="text-sm font-bold">{isFree ? <span className="text-emerald-600">Gratis</span> : <span className="text-indigo-700">${it.price}</span>}</div>
        </div>
        <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug">{it.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{it.subtitle}</p>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <Rating value={it.rating} />
          <span>🛒 {it.sales.toLocaleString()} ventas</span>
        </div>
        <ul className="text-xs text-gray-700 bg-gray-50 border rounded p-2">
          {it.includes.slice(0,3).map((x, i) => <li key={i}>• {x}</li>)}
        </ul>
        <div className="flex flex-wrap gap-1">
          {it.tags.map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">#{t}</span>)}
        </div>
        <div className="pt-2 flex gap-2">
          <Link href={`/dashboard/marketplace/${it.slug}`} className="px-3 py-2 rounded-xl border hover:bg-gray-50 text-sm">
            Ver detalles
          </Link>
          <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:opacity-95" onClick={() => onAdd(it.id)}>
            {isFree ? "Obtener" : "Agregar al carrito"}
          </button>
        </div>
      </div>
      <div className="absolute -right-16 top-4 rotate-45 bg-indigo-600 text-white text-xs px-14 py-1 opacity-0 group-hover:opacity-100 transition">
        Listo para usar
      </div>
    </div>
  );
};

const MarketplacePage: React.FC = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("Todos");
  const [sort, setSort] = useState<string>("relevance");
  const cats = useMemo(() => ["Todos", ...Array.from(new Set(ITEMS.map(i => i.category)))], []);

  const filtered = useMemo(() => {
    let list = ITEMS.slice();

    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(s) ||
          i.subtitle.toLowerCase().includes(s) ||
          i.tags.some((t) => t.toLowerCase().includes(s))
      );
    }
    if (category !== "Todos") list = list.filter((i) => i.category === category);

    switch (sort) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "sales":
        list.sort((a, b) => b.sales - a.sales);
        break;
      case "priceAsc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)) || b.rating - a.rating);
    }

    return list;
  }, [q, category, sort]);

  const onAdd = (id: string) => {
    alert(`(DEMO) Agregado al carrito: ${id}`);
  };

  return (
    <PrivateLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500">Marketplace</div>
              <h1 className="text-2xl font-extrabold text-gray-900">Plantillas, SOPs y herramientas</h1>
              <p className="text-sm text-gray-600">Recursos que aceleran la ejecución sin reinventar la rueda.</p>
            </div>
            <Link className="px-3 py-2 rounded-xl border text-sm bg-white hover:bg-gray-50" href="/dashboard/inicio">
              ⟵ Volver a inicio
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6">
              <div className="flex items-center gap-2 bg-white rounded-xl border px-3 py-2">
                <span className="text-gray-400">🔎</span>
                <input
                  className="w-full outline-none text-sm"
                  placeholder="Buscar por título, tema o tag…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <select className="w-full bg-white rounded-xl border px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                {cats.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-3">
              <select className="w-full bg-white rounded-xl border px-3 py-2 text-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="relevance">Relevancia</option>
                <option value="rating">Mejor calificados</option>
                <option value="sales">Más vendidos</option>
                <option value="priceAsc">Precio: menor a mayor</option>
                <option value="priceDesc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {["OKRs", "Cashflow", "CRM", "SOPs", "Automations"].map((t) => (
              <button key={t} onClick={() => setQ(t)} className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-gray-50">
                #{t}
              </button>
            ))}
            <button
              onClick={() => { setQ(""); setCategory("Todos"); setSort("relevance"); }}
              className="text-xs px-3 py-1 rounded-full border bg-gray-50"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {filtered.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-gray-600">
              No encontramos recursos con esos filtros.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((it) => <ItemCard key={it.id} it={it} onAdd={onAdd} />)}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4 pb-10">
          <div className="rounded-2xl border bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-lg font-bold">¿Quieres un bundle a la medida?</div>
              <p className="text-sm opacity-90">Cuéntanos tu necesidad y armamos un paquete con descuento.</p>
            </div>
            <Link href="/dashboard/mentoria" className="px-4 py-2 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50">
              Hablar con un mentor
            </Link>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default MarketplacePage;

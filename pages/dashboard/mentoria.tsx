// pages/dashboard/mentoria.tsx
import React, { useMemo, useState } from "react";
import Link from "next/link";

type Mentor = {
  id: string;
  slug: string;
  name: string;
  headline: string;
  avatar?: string;
  expertise: ("Estrategia" | "Finanzas" | "Operaciones" | "Ventas" | "RRHH" | "Tecnología")[];
  rating: number; // 0..5
  sessions: number; // total sesiones realizadas
  priceHour: number; // USD
  languages: ("ES" | "EN")[];
  responseTime: "Rápido" | "Normal";
  isTop?: boolean;
  shortBio: string;
  tags: string[];
};

const MENTORS: Mentor[] = [
  {
    id: "m1",
    slug: "ana-campos",
    name: "Ana Campos",
    headline: "OKRs, crecimiento y tableros ejecutivos",
    avatar: "/img/mentores/ana.jpg",
    expertise: ["Estrategia", "Tecnología"],
    rating: 4.9,
    sessions: 320,
    priceHour: 85,
    languages: ["ES", "EN"],
    responseTime: "Rápido",
    isTop: true,
    shortBio:
      "10+ años escalando PyMEs. Especialista en OKRs, analítica y ejecución de ciclos 90 días.",
    tags: ["OKRs", "KPIs", "Crecimiento"],
  },
  {
    id: "m2",
    slug: "diego-ruiz",
    name: "Diego Ruiz",
    headline: "Flujo de caja, pricing y presupuesto",
    avatar: "/img/mentores/diego.jpg",
    expertise: ["Finanzas"],
    rating: 4.8,
    sessions: 210,
    priceHour: 70,
    languages: ["ES"],
    responseTime: "Normal",
    shortBio:
      "CFO fractional. Te ayuda a ordenar la casa financiera: cashflow, forecasting y pricing.",
    tags: ["Cashflow", "Forecast", "Pricing"],
  },
  {
    id: "m3",
    slug: "sofia-luna",
    name: "Sofía Luna",
    headline: "Ventas B2B, prospección e implementación de CRM",
    avatar: "/img/mentores/sofia.jpg",
    expertise: ["Ventas"],
    rating: 4.7,
    sessions: 415,
    priceHour: 75,
    languages: ["ES", "EN"],
    responseTime: "Rápido",
    isTop: true,
    shortBio:
      "Consultora comercial. Optimiza pipeline, playbooks y rituales de ventas para previsibilidad.",
    tags: ["CRM", "Pipeline", "Negociación"],
  },
  {
    id: "m4",
    slug: "marco-perez",
    name: "Marco Pérez",
    headline: "Lean operations y mejora continua",
    avatar: "/img/mentores/marco.jpg",
    expertise: ["Operaciones"],
    rating: 4.6,
    sessions: 180,
    priceHour: 60,
    languages: ["ES"],
    responseTime: "Normal",
    shortBio:
      "Black Belt Lean. Reduce desperdicios y tiempos de ciclo. Diseño e implementación de SOPs.",
    tags: ["Lean", "VSM", "SOPs"],
  },
  {
    id: "m5",
    slug: "valeria-rios",
    name: "Valeria Ríos",
    headline: "Cultura, liderazgo y performance del equipo",
    avatar: "/img/mentores/valeria.jpg",
    expertise: ["RRHH"],
    rating: 4.8,
    sessions: 260,
    priceHour: 65,
    languages: ["ES"],
    responseTime: "Rápido",
    shortBio:
      "Psicóloga organizacional. Modelos de competencias, feedback y evaluaciones de desempeño.",
    tags: ["Cultura", "Liderazgo", "Evaluación"],
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

const MentorCard: React.FC<{ m: Mentor; onBook: (id: string) => void }> = ({ m, onBook }) => {
  return (
    <div className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="p-4 flex items-start gap-4">
        <img
          src={m.avatar || "/img/mentores/placeholder.jpg"}
          alt={m.name}
          className="w-16 h-16 rounded-2xl object-cover border"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-bold text-gray-900">{m.name}</h3>
              {m.isTop && <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-600 text-white">Top Mentor</span>}
            </div>
            <Rating value={m.rating} />
          </div>
          <p className="text-sm text-gray-700 mt-0.5">{m.headline}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {m.expertise.map((e) => (
              <span key={e} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 border">{e}</span>
            ))}
            {m.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                #{t}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{m.shortBio}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-700">
            <span>💬 {m.sessions.toLocaleString()} sesiones</span>
            <span>🕒 Respuesta: {m.responseTime}</span>
            <span>🌐 Idiomas: {m.languages.join(", ")}</span>
            <span className="ml-auto font-semibold text-indigo-700">${m.priceHour}/h</span>
          </div>
          <div className="mt-3 flex gap-2">
            <Link href={`/dashboard/mentoria/${m.slug}`} className="px-3 py-2 rounded-xl border hover:bg-gray-50 text-sm">
              Ver perfil
            </Link>
            <button
              className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:opacity-95"
              onClick={() => onBook(m.id)}
            >
              Reservar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MentoriaPage: React.FC = () => {
  const [q, setQ] = useState("");
  const [expertise, setExpertise] = useState<string>("Todos");
  const [lang, setLang] = useState<string>("Todos");
  const [sort, setSort] = useState<string>("featured");

  const expertiseOptions = ["Todos", "Estrategia", "Finanzas", "Operaciones", "Ventas", "RRHH", "Tecnología"];
  const langOptions = ["Todos", "ES", "EN"];

  const filtered = useMemo(() => {
    let list = MENTORS.slice();

    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(s) ||
          m.headline.toLowerCase().includes(s) ||
          m.tags.some((t) => t.toLowerCase().includes(s))
      );
    }
    if (expertise !== "Todos") list = list.filter((m) => m.expertise.includes(expertise as any));
    if (lang !== "Todos") list = list.filter((m) => m.languages.includes(lang as any));

    switch (sort) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "priceAsc":
        list.sort((a, b) => a.priceHour - b.priceHour);
        break;
      case "priceDesc":
        list.sort((a, b) => b.priceHour - a.priceHour);
        break;
      case "sessions":
        list.sort((a, b) => b.sessions - a.sessions);
        break;
      default:
        list.sort((a, b) => Number(b.isTop) - Number(a.isTop) || b.rating - a.rating);
    }

    return list;
  }, [q, expertise, lang, sort]);

  const onBook = (id: string) => {
    alert(`(DEMO) Abriendo calendario para mentor ${id}…`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500">Mentoría</div>
              <h1 className="text-2xl font-extrabold text-gray-900">Encuentra a tu mentor</h1>
              <p className="text-sm text-gray-600">
                Agenda 1:1 con expertos en estrategia, finanzas, ventas, talento y más.
              </p>
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
                  placeholder="Buscar nombre, tema o tag…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <select className="w-full bg-white rounded-xl border px-3 py-2 text-sm" value={expertise} onChange={(e) => setExpertise(e.target.value)}>
                {expertiseOptions.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <select className="w-full bg-white rounded-xl border px-3 py-2 text-sm" value={lang} onChange={(e) => setLang(e.target.value)}>
                {langOptions.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <select className="w-full bg-white rounded-xl border px-3 py-2 text-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Relevancia</option>
                <option value="rating">Mejor calificados</option>
                <option value="sessions">Más sesiones</option>
                <option value="priceAsc">Precio: menor a mayor</option>
                <option value="priceDesc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {["OKRs", "Cashflow", "CRM", "SOPs", "Cultura"].map((t) => (
              <button key={t} onClick={() => setQ(t)} className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-gray-50">
                #{t}
              </button>
            ))}
            <button
              onClick={() => {
                setQ(""); setExpertise("Todos"); setLang("Todos"); setSort("featured");
              }}
              className="text-xs px-3 py-1 rounded-full border bg-gray-50"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Listado */}
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-gray-600">
              No encontramos mentores con esos filtros.
            </div>
          ) : (
            filtered.map((m) => <MentorCard key={m.id} m={m} onBook={onBook} />)
          )}
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4 pb-10">
          <div className="rounded-2xl border bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-lg font-bold">¿No sabes a quién elegir?</div>
              <p className="text-sm opacity-90">Completa tu diagnóstico y te recomendamos el mentor ideal.</p>
            </div>
            <Link href="/dashboard/diagnostico/general" className="px-4 py-2 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50">
              Realizar diagnóstico
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentoriaPage;

// pages/dashboard/cursos.tsx
import React, { useMemo, useState } from "react";
import Link from "next/link";
import PrivateLayout from "../../components/layout/PrivateLayout";

type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "Estrategia" | "Finanzas" | "Operaciones" | "Ventas" | "RRHH" | "Tecnología";
  level: "Básico" | "Intermedio" | "Avanzado";
  rating: number; // 0..5
  students: number;
  duration: string; // "3h 20m"
  lessons: number;
  tags: string[];
  image?: string; // demo path
  price: number; // 0 => Gratis
  featured?: boolean;
};

const DEMO_COURSES: Course[] = [
  {
    id: "c1",
    slug: "plan-estrategico-90-dias",
    title: "Plan Estratégico en 90 días",
    subtitle: "Del diagnóstico a la ejecución con KPIs y tableros",
    category: "Estrategia",
    level: "Intermedio",
    rating: 4.8,
    students: 1240,
    duration: "4h 10m",
    lessons: 28,
    tags: ["OKRs", "KPIs", "Crecimiento"],
    image: "/img/cursos/estrategia.jpg",
    price: 0,
    featured: true,
  },
  {
    id: "c2",
    slug: "flujo-de-caja-para-pymes",
    title: "Flujo de caja para PyMEs",
    subtitle: "Gestiona liquidez, pronósticos y decisiones tácticas",
    category: "Finanzas",
    level: "Básico",
    rating: 4.6,
    students: 980,
    duration: "2h 55m",
    lessons: 19,
    tags: ["Cashflow", "Forecast", "Presupuesto"],
    image: "/img/cursos/finanzas.jpg",
    price: 49,
  },
  {
    id: "c3",
    slug: "ventas-consultivas-b2b",
    title: "Ventas Consultivas B2B",
    subtitle: "Prospección, discovery y cierres de alto valor",
    category: "Ventas",
    level: "Avanzado",
    rating: 4.9,
    students: 2120,
    duration: "5h 05m",
    lessons: 34,
    tags: ["CRM", "Pipeline", "Negociación"],
    image: "/img/cursos/ventas.jpg",
    price: 79,
    featured: true,
  },
  {
    id: "c4",
    slug: "operaciones-lean",
    title: "Operaciones Lean",
    subtitle: "Elimina desperdicios y acelera tiempos de ciclo",
    category: "Operaciones",
    level: "Intermedio",
    rating: 4.5,
    students: 640,
    duration: "3h 20m",
    lessons: 22,
    tags: ["Kaizen", "5S", "VSM"],
    image: "/img/cursos/operaciones.jpg",
    price: 39,
  },
  {
    id: "c5",
    slug: "gestion-de-talento-y-liderazgo",
    title: "Gestión de Talento y Liderazgo",
    subtitle: "Contratación, cultura y feedback efectivo",
    category: "RRHH",
    level: "Básico",
    rating: 4.4,
    students: 720,
    duration: "2h 30m",
    lessons: 16,
    tags: ["Cultura", "Evaluación", "eNPS"],
    image: "/img/cursos/rrhh.jpg",
    price: 0,
  },
  {
    id: "c6",
    slug: "transformacion-digital-pyme",
    title: "Transformación Digital para PyME",
    subtitle: "Stack mínimo, automatización y analítica",
    category: "Tecnología",
    level: "Intermedio",
    rating: 4.7,
    students: 860,
    duration: "3h 45m",
    lessons: 24,
    tags: ["No-code", "Data", "Automations"],
    image: "/img/cursos/tecnologia.jpg",
    price: 59,
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

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] px-2 py-0.5 rounded-full border bg-gray-50 text-gray-700 border-gray-200">{children}</span>
);

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const isFree = course.price === 0;
  return (
    <div className="group relative rounded-2xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      {/* imagen */}
      <div className="h-40 w-full bg-gray-100">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${course.image || "/img/cursos/placeholder.jpg"})`,
          }}
        />
      </div>

      {/* contenido */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge>{course.category}</Badge>
            <Badge>{course.level}</Badge>
            {course.featured && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                Destacado
              </span>
            )}
          </div>
          <div className="text-sm font-bold">
            {isFree ? (
              <span className="text-emerald-600">Gratis</span>
            ) : (
              <span className="text-indigo-700">${course.price}</span>
            )}
          </div>
        </div>

        <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{course.subtitle}</p>

        <div className="flex items-center justify-between text-xs text-gray-600">
          <Rating value={course.rating} />
          <div className="flex items-center gap-3">
            <span>👤 {course.students.toLocaleString()}</span>
            <span>⏱ {course.duration}</span>
            <span>▶ {course.lessons} lecciones</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {course.tags.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="pt-2 flex gap-2">
          <Link
            href={`/dashboard/cursos/${course.slug}`}
            className="px-3 py-2 rounded-xl border hover:bg-gray-50 text-sm"
          >
            Ver detalles
          </Link>
          <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:opacity-95">
            {isFree ? "Inscribirme" : "Comprar"}
          </button>
        </div>
      </div>

      {/* cinta hover */}
      <div className="absolute -right-16 top-4 rotate-45 bg-indigo-600 text-white text-xs px-14 py-1 opacity-0 group-hover:opacity-100 transition">
        {isFree ? "Acceso inmediato" : "Certificado incluido"}
      </div>
    </div>
  );
};

const CursosPage: React.FC = () => {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("Todos");
  const [level, setLevel] = useState<string>("Todos");
  const [sort, setSort] = useState<string>("relevance");

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(DEMO_COURSES.map((c) => c.category)))],
    []
  );
  const levels = ["Todos", "Básico", "Intermedio", "Avanzado"];

  const filtered = useMemo(() => {
    let list = DEMO_COURSES.slice();

    // Búsqueda
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(s) ||
          c.subtitle.toLowerCase().includes(s) ||
          c.tags.some((t) => t.toLowerCase().includes(s))
      );
    }

    // Filtros
    if (category !== "Todos") list = list.filter((c) => c.category === category);
    if (level !== "Todos") list = list.filter((c) => c.level === (level as Course["level"]));

    // Orden
    switch (sort) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "students":
        list.sort((a, b) => b.students - a.students);
        break;
      case "priceAsc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        list.sort((a, b) => b.price - a.price);
        break;
      default: // relevance: featured primero, luego rating
        list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
    }

    return list;
  }, [q, category, level, sort]);

  return (
    <PrivateLayout>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs text-gray-500">Aprendizaje</div>
              <h1 className="text-2xl font-extrabold text-gray-900">Catálogo de cursos</h1>
              <p className="text-sm text-gray-600">
                Entrenamientos prácticos para acelerar tu empresa. Nuevos cursos cada mes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                className="px-3 py-2 rounded-xl border text-sm bg-white hover:bg-gray-50"
                href="/dashboard/inicio"
              >
                ⟵ Volver a inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Controles */}
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
            <div className="md:col-span-2">
              <select
                className="w-full bg-white rounded-xl border px-3 py-2 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <select
                className="w-full bg-white rounded-xl border px-3 py-2 text-sm"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <select
                className="w-full bg-white rounded-xl border px-3 py-2 text-sm"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="relevance">Relevancia</option>
                <option value="rating">Mejor calificados</option>
                <option value="students">Más inscritos</option>
                <option value="priceAsc">Precio: menor a mayor</option>
                <option value="priceDesc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {/* chips rápidas */}
          <div className="mt-3 flex flex-wrap gap-2">
            {["KPIs", "Cashflow", "Ventas", "Procesos", "Cultura", "No-code"].map((t) => (
              <button
                key={t}
                onClick={() => setQ(t)}
                className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-gray-50"
              >
                #{t}
              </button>
            ))}
            <button
              onClick={() => {
                setQ("");
                setCategory("Todos");
                setLevel("Todos");
                setSort("relevance");
              }}
              className="text-xs px-3 py-1 rounded-full border bg-gray-50"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Grid de cursos */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {filtered.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-gray-600">
              No encontramos cursos con esos filtros. Prueba con otros términos o limpia los filtros.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
        </div>

        {/* Sección de CTA */}
        <div className="max-w-6xl mx-auto px-4 pb-10">
          <div className="rounded-2xl border bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-lg font-bold">¿No sabes por dónde empezar?</div>
              <p className="text-sm opacity-90">
                Toma el diagnóstico general y te recomendaremos una ruta de aprendizaje personalizada.
              </p>
            </div>
            <Link
              href="/dashboard/diagnostico/general"
              className="px-4 py-2 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50"
            >
              Realizar diagnóstico
            </Link>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default CursosPage;

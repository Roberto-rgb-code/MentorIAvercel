// pages/dashboard/inicio.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  FaHeartbeat, FaClipboardCheck, FaComments, FaCalendarAlt,
  FaChalkboardTeacher, FaShoppingBasket, FaChartLine, FaUserTie, FaArrowRight,
  FaUserCheck, FaUsers, FaFileSignature
} from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// ==== Recharts (carga segura en cliente) ====
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const LineChart            = dynamic(() => import("recharts").then(m => m.LineChart),           { ssr: false });
const Line                 = dynamic(() => import("recharts").then(m => m.Line),                { ssr: false });
const XAxis                = dynamic(() => import("recharts").then(m => m.XAxis),               { ssr: false });
const YAxis                = dynamic(() => import("recharts").then(m => m.YAxis),               { ssr: false });
const CartesianGrid        = dynamic(() => import("recharts").then(m => m.CartesianGrid),       { ssr: false });
const Tooltip              = dynamic(() => import("recharts").then(m => m.Tooltip),             { ssr: false });
const BarChart             = dynamic(() => import("recharts").then(m => m.BarChart),            { ssr: false });
const Bar                  = dynamic(() => import("recharts").then(m => m.Bar),                 { ssr: false });
const PieChart             = dynamic(() => import("recharts").then(m => m.PieChart),            { ssr: false });
const Pie                  = dynamic(() => import("recharts").then(m => m.Pie),                 { ssr: false });
const Cell                 = dynamic(() => import("recharts").then(m => m.Cell),                { ssr: false });
const AreaChart            = dynamic(() => import("recharts").then(m => m.AreaChart),           { ssr: false });
const Area                 = dynamic(() => import("recharts").then(m => m.Area),                { ssr: false });
const Legend               = dynamic(() => import("recharts").then(m => m.Legend),              { ssr: false });

// ==== CONFIG ====
const BRAND = {
  bg: "#293A49",
  a: "#70B5E2",
  b: "#37B6FF",
  white: "#ffffff",
  grid: "rgba(255,255,255,0.12)",
  axis: "rgba(255,255,255,0.7)",
};
const SERIES = [BRAND.a, BRAND.b, "#9EEAF9", "#A5B4FC", "#FDE68A"];

gsap.registerPlugin(ScrollTrigger);

// ==== TYPES ====
type UserRole = "emprendedor" | "consultor" | "empresa" | "universidad" | "gobierno" | "";

type BaseMetrics = {
  kpis: { label: string; value: string; icon: React.ReactNode }[];
  sessionsByWeek: { week: string; sessions: number }[];
  diagnosticsBreakdown: { type: string; count: number }[];
  revenueByProduct?: { name: string; value: number }[];
  courseProgress?: { course: string; completion: number }[];
};

// ==== MOCK DATA LAYER (reemplaza por Firestore cuando quieras) ====
async function getDashboardMetrics(uid: string, role: UserRole): Promise<BaseMetrics> {
  const weeks = ["W-7","W-6","W-5","W-4","W-3","W-2","W-1","W"];
  const rnd = (min:number,max:number)=> Math.floor(Math.random()*(max-min+1))+min;

  if (role === "consultor") {
    return {
      kpis: [
        { label: "Sesiones agendadas", value: `${rnd(4,10)} próximas`, icon: <FaCalendarAlt /> },
        { label: "Clientes activos", value: `${rnd(6,14)}`, icon: <FaUsers /> },
        { label: "Cursos creados", value: `${rnd(2,8)}`, icon: <FaChalkboardTeacher /> },
        { label: "Propuestas enviadas", value: `${rnd(1,6)}`, icon: <FaFileSignature /> },
      ],
      sessionsByWeek: weeks.map((w)=>({ week: w, sessions: rnd(6,18) })),
      diagnosticsBreakdown: [
        { type: "General", count: rnd(5,20) },
        { type: "Profundo", count: rnd(2,10) },
        { type: "Emergencia", count: rnd(0,5) },
      ],
      revenueByProduct: [
        { name: "Mentorías", value: rnd(8,20) * 1000 },
        { name: "Cursos", value: rnd(4,12) * 1000 },
        { name: "Marketplace", value: rnd(6,18) * 1000 },
      ],
      courseProgress: [
        { course: "OKRs para PyMEs", completion: rnd(35,95) },
        { course: "Finanzas Exprés", completion: rnd(35,95) },
        { course: "Ventas B2B", completion: rnd(35,95) },
      ],
    };
  }
  // Emprendedor
  return {
    kpis: [
      { label: "Diagnósticos completados", value: `${rnd(6,18)}`, icon: <FaChartLine /> },
      { label: "Sesiones de mentoría", value: `${rnd(2,6)} esta semana`, icon: <FaUserTie /> },
      { label: "Cursos activos", value: `${rnd(1,5)}`, icon: <FaChalkboardTeacher /> },
      { label: "Pedidos marketplace", value: `${rnd(0,4)}`, icon: <FaShoppingBasket /> },
    ],
    sessionsByWeek: weeks.map((w)=>({ week: w, sessions: rnd(3,12) })),
    diagnosticsBreakdown: [
      { type: "General", count: rnd(4,12) },
      { type: "Profundo", count: rnd(1,6) },
      { type: "Emergencia", count: rnd(0,3) },
    ],
    revenueByProduct: [
      { name: "Ahorros (operación)", value: rnd(3,10) * 1000 },
      { name: "Ingresos extra", value: rnd(2,8) * 1000 },
      { name: "Subsidios/Créditos", value: rnd(1,6) * 1000 },
    ],
    courseProgress: [
      { course: "Primeros 90 días", completion: rnd(20,95) },
      { course: "Caja y Flujo", completion: rnd(20,95) },
      { course: "Marketing 101", completion: rnd(20,95) },
    ],
  };
}

// ==== UI SHARED ====
const particlesOptions = {
  background: { color: { value: BRAND.bg } },
  fpsLimit: 60,
  particles: {
    number: { value: 40, density: { enable: true, area: 800 } },
    color: { value: [BRAND.a, BRAND.b, BRAND.white] },
    shape: { type: "circle" },
    opacity: { value: 0.15 },
    size: { value: { min: 1, max: 2 } },
    links: { enable: true, distance: 120, opacity: 0.1, color: BRAND.a },
    move: { enable: true, speed: 0.8, outModes: { default: "bounce" } },
  },
  interactivity: {
    events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" }, resize: true },
    modes: { grab: { distance: 160, links: { opacity: 0.2 } }, push: { quantity: 2 } },
  },
  detectRetina: true,
};

const cardVariant = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const ModuleGrid: React.FC = () => (
  <div className="dash-hero-cta mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
    {[
      { href: "/dashboard/diagnostico", label: "Diagnóstico", sub: "General / Profundo / Emergencia", Icon: FaClipboardCheck, color: BRAND.a },
      { href: "/dashboard/mentoria", label: "Mentoría", sub: "Agenda y matching", Icon: FaUserTie, color: BRAND.b },
      { href: "/dashboard/cursos", label: "Cursos", sub: "Catálogo y progreso", Icon: FaChalkboardTeacher, color: BRAND.a },
      { href: "/dashboard/marketplace", label: "Marketplace", sub: "Servicios profesionales", Icon: FaShoppingBasket, color: BRAND.b },
      { href: "/dashboard/ayuda", label: "Ayuda", sub: "Asistente y FAQs", Icon: FaComments, color: BRAND.a },
      { href: "/dashboard/pagos", label: "Pagos", sub: "Planes y facturación", Icon: FaCalendarAlt, color: BRAND.b },
    ].map((m) => (
      <Link key={m.href} href={m.href}
        className="group rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/80 backdrop-blur-sm p-3 hover:bg-[#293A49] hover:shadow-lg transition">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center h-9 w-9 rounded-lg" style={{ backgroundColor: `${m.color}33`, color: m.color }}>
            <m.Icon />
          </span>
          <div>
            <div className="text-sm font-semibold text-white">{m.label}</div>
            <div className="text-xs text-gray-300 group-hover:text-gray-200">{m.sub}</div>
          </div>
        </div>
      </Link>
    ))}
  </div>
);

const SectionShell: React.FC<{ title?: string; children: React.ReactNode; className?: string }>
= ({ title, children, className }) => (
  <section className={`py-6 ${className || ""}`}>
    <div className="mx-auto max-w-7xl px-4">
      {title && <h3 className="text-xl font-bold text-white mb-3">{title}</h3>}
      <div className="rounded-2xl border border-[#70B5E2]/30 bg-[#293A49]/90 backdrop-blur-sm p-6 shadow-xl">
        {children}
      </div>
    </div>
  </section>
);

const HeroShell: React.FC<{ title: React.ReactNode; subtitle: string; children?: React.ReactNode; }>
= ({ title, subtitle, children }) => (
  <section className="relative pt-10 md:pt-14 pb-6">
    <div className="mx-auto max-w-7xl px-4">
      <div className="rounded-2xl border border-[#70B5E2]/30 bg-[#293A49]/90 backdrop-blur-sm p-6 md:p-10 shadow-xl">
        <h1 className="dash-hero-title text-3xl md:text-4xl font-extrabold tracking-tight text-white">{title}</h1>
        <p className="dash-hero-sub mt-2 text-gray-200 md:text-lg">{subtitle}</p>
        {children}
      </div>
    </div>
  </section>
);

// ==== CHARTS ====
const ChartCard: React.FC<{ title: string; children: React.ReactNode }>
= ({ title, children }) => (
  <div className="rounded-xl border border-white/10 bg-[#1F2A36]/70 p-4">
    <div className="text-sm text-white/80 font-semibold mb-2">{title}</div>
    <div style={{ height: 260 }}>
      {children}
    </div>
  </div>
);

// ====== ROLE DASHBOARDS ======
const EntrepreneurDashboard: React.FC<{ metrics: BaseMetrics }>
= ({ metrics }) => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const setSectionRef = (i: number) => (el: HTMLElement | null) => { sectionRefs.current[i] = el; };

  useEffect(() => {
    gsap.fromTo(".dash-hero-title", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
    gsap.fromTo(".dash-hero-sub", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: "power3.out" });
    gsap.fromTo(".dash-hero-cta", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.25, ease: "power2.out" });
    sectionRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } });
    });
  }, []);

  return (
    <>
      <HeroShell
        title={<>Bienvenido a tu Panel — <span style={{ color: BRAND.a }}>MenthIA</span> <span className="text-sm font-normal opacity-80 align-middle ml-2">Perfil: Emprendedor</span></>}
        subtitle="Centraliza tu operación: lanza diagnósticos, gestiona mentorías, aprende con cursos y contrata servicios."
      >
        <ModuleGrid />
      </HeroShell>

      {/* KPIs */}
      <section ref={setSectionRef(0)} className="py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.kpis.map((kpi, i) => (
              <motion.div key={kpi.label} variants={cardVariant} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.35, delay: i * 0.05 }} className="rounded-2xl border border-[#70B5E2]/30 bg-[#293A49]/90 backdrop-blur-sm p-5 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="grid place-items-center h-10 w-10 rounded-xl" style={{ backgroundColor: `${BRAND.a}33`, color: BRAND.a }}>{kpi.icon}</div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-300">{kpi.label}</div>
                    <div className="text-xl font-bold text-white">{kpi.value}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gráficos */}
      <SectionShell title="Métricas clave">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Sesiones por semana">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.sessionsByWeek} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid stroke={BRAND.grid} strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <YAxis stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <Tooltip contentStyle={{ background: "#17202A", border: "1px solid #253244", color: "#fff" }} />
                <Line type="monotone" dataKey="sessions" stroke={SERIES[0]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Diagnósticos por tipo">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.diagnosticsBreakdown} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid stroke={BRAND.grid} strokeDasharray="3 3" />
                <XAxis dataKey="type" stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <YAxis stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <Tooltip contentStyle={{ background: "#17202A", border: "1px solid #253244", color: "#fff" }} />
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {metrics.diagnosticsBreakdown.map((_, i) => (<Cell key={i} fill={SERIES[i % SERIES.length]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Impacto económico (estimado)">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ background: "#17202A", border: "1px solid #253244", color: "#fff" }} />
                <Legend wrapperStyle={{ color: BRAND.axis }} />
                <Pie data={metrics.revenueByProduct} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {metrics.revenueByProduct?.map((_, i) => (<Cell key={i} fill={SERIES[i % SERIES.length]} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Progreso de cursos">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.courseProgress} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SERIES[1]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={SERIES[1]} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={BRAND.grid} strokeDasharray="3 3" />
                <XAxis dataKey="course" stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <YAxis domain={[0, 100]} stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <Tooltip contentStyle={{ background: "#17202A", border: "1px solid #253244", color: "#fff" }} />
                <Area type="monotone" dataKey="completion" stroke={SERIES[1]} fill="url(#gradA)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </SectionShell>

      {/* CTA diagnósticos */}
      <SectionShell>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
              <span className="grid place-items-center h-10 w-10 rounded-xl" style={{ backgroundColor: BRAND.b, color: BRAND.white }}><FaHeartbeat /></span>
              Comienza un nuevo diagnóstico
            </h2>
            <p className="mt-2 text-gray-200">Evalúa tu empresa y recibe un reporte accionable.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <Link href="/dashboard/diagnostico/general"   className="group rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/80 px-4 py-3 text-sm font-semibold text-white hover:bg-[#293A49] hover:shadow-lg transition">General   <FaArrowRight className="inline ml-2 opacity-60 group-hover:translate-x-0.5 transition" /></Link>
            <Link href="/dashboard/diagnostico/profundo"  className="group rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/80 px-4 py-3 text-sm font-semibold text-white hover:bg-[#293A49] hover:shadow-lg transition">Profundo  <FaArrowRight className="inline ml-2 opacity-60 group-hover:translate-x-0.5 transition" /></Link>
            <Link href="/dashboard/diagnostico/emergencia" className="group rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/80 px-4 py-3 text-sm font-semibold text-white hover:bg-[#293A49] hover:shadow-lg transition">Emergencia<FaArrowRight className="inline ml-2 opacity-60 group-hover:translate-x-0.5 transition" /></Link>
          </div>
        </div>
      </SectionShell>
    </>
  );
};

const ConsultantDashboard: React.FC<{ metrics: BaseMetrics }>
= ({ metrics }) => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const setSectionRef = (i: number) => (el: HTMLElement | null) => { sectionRefs.current[i] = el; };

  useEffect(() => {
    gsap.fromTo(".dash-hero-title", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
    gsap.fromTo(".dash-hero-sub",   { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: "power3.out" });
    gsap.fromTo(".dash-hero-cta",   { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.25, ease: "power2.out" });
    sectionRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } });
    });
  }, []);

  return (
    <>
      <HeroShell
        title={<>Tu Panel — <span style={{ color: BRAND.a }}>MenthIA</span> <span className="text-sm font-normal opacity-80 align-middle ml-2">Perfil: Consultor</span></>}
        subtitle="Gestiona disponibilidad, agenda mentorías, da seguimiento a clientes y publica ofertas en el marketplace."
      >
        <ModuleGrid />
      </HeroShell>

      {/* KPIs */}
      <section ref={setSectionRef(0)} className="py-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.kpis.map((kpi, i) => (
              <motion.div key={kpi.label} variants={cardVariant} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.35, delay: i * 0.05 }} className="rounded-2xl border border-[#70B5E2]/30 bg-[#293A49]/90 backdrop-blur-sm p-5 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="grid place-items-center h-10 w-10 rounded-xl" style={{ backgroundColor: `${BRAND.a}33`, color: BRAND.a }}>{kpi.icon}</div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-300">{kpi.label}</div>
                    <div className="text-xl font-bold text-white">{kpi.value}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gráficos */}
      <SectionShell title="Métricas de servicios">
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Sesiones (últimas 8 semanas)">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.sessionsByWeek} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid stroke={BRAND.grid} strokeDasharray="3 3" />
                <XAxis dataKey="week" stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <YAxis stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <Tooltip contentStyle={{ background: "#17202A", border: "1px solid #253244", color: "#fff" }} />
                <Line type="monotone" dataKey="sessions" stroke={SERIES[0]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Tipo de diagnósticos entregados">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.diagnosticsBreakdown} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid stroke={BRAND.grid} strokeDasharray="3 3" />
                <XAxis dataKey="type" stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <YAxis stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <Tooltip contentStyle={{ background: "#17202A", border: "1px solid #253244", color: "#fff" }} />
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {metrics.diagnosticsBreakdown.map((_, i) => (<Cell key={i} fill={SERIES[i % SERIES.length]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Ingresos por producto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ background: "#17202A", border: "1px solid #253244", color: "#fff" }} />
                <Legend wrapperStyle={{ color: BRAND.axis }} />
                <Pie data={metrics.revenueByProduct} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {metrics.revenueByProduct?.map((_, i) => (<Cell key={i} fill={SERIES[i % SERIES.length]} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Progreso de cohortes/cursos">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.courseProgress} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SERIES[1]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={SERIES[1]} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={BRAND.grid} strokeDasharray="3 3" />
                <XAxis dataKey="course" stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <YAxis domain={[0, 100]} stroke={BRAND.axis} tick={{ fill: BRAND.axis }} />
                <Tooltip contentStyle={{ background: "#17202A", border: "1px solid #253244", color: "#fff" }} />
                <Area type="monotone" dataKey="completion" stroke={SERIES[1]} fill="url(#gradB)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </SectionShell>

      {/* CTAs */}
      <SectionShell>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
              <span className="grid place-items-center h-10 w-10 rounded-xl" style={{ backgroundColor: BRAND.b, color: BRAND.white }}><FaUserCheck /></span>
              Disponibilidad & agenda
            </h2>
            <p className="mt-2 text-gray-200">Sincroniza tu calendario y habilita matching automático.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
            <Link href="/dashboard/mentoria" className="rounded-xl bg-[#37B6FF] text-white px-4 py-3 text-sm font-semibold hover:bg-[#70B5E2] transition">Configurar disponibilidad</Link>
            <Link href="/dashboard/mentoria" className="rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/50 text-white px-4 py-3 text-sm font-semibold hover:bg-[#293A49]/80 transition">Ver mentorías</Link>
          </div>
        </div>
      </SectionShell>
    </>
  );
};

// ====== MAIN PAGE ======
const InicioDashboard: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [role, setRole] = useState<UserRole>("");
  const [loadingRole, setLoadingRole] = useState(true);
  const [metrics, setMetrics] = useState<BaseMetrics | null>(null);

  const particlesInit = useCallback(async (engine: any) => { await loadSlim(engine); }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.id));
        const r = (snap.exists() ? (snap.data().role as UserRole) : "") || "";
        setRole(r);
        const m = await getDashboardMetrics(user.id, r || "emprendedor");
        setMetrics(m);
      } catch (e) {
        console.error("Error cargando rol/metrics:", e);
      } finally {
        setLoadingRole(false);
      }
    };
    run();
  }, [user]);

  const isLoadingAny = loading || loadingRole || !metrics;

  return (
    <>
      <Particles id="tsparticles-dashboard" init={particlesInit} options={particlesOptions as any} className="fixed inset-0 -z-10" />

      <main className="min-h-screen bg-transparent text-white" style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        {isLoadingAny && (
          <section className="pt-16">
            <div className="mx-auto max-w-7xl px-4">
              <div className="rounded-2xl border border-[#70B5E2]/30 bg-[#293A49]/70 backdrop-blur-sm p-8 animate-pulse">
                <div className="h-6 w-1/3 bg-white/20 rounded mb-3" />
                <div className="h-4 w-2/3 bg-white/10 rounded" />
              </div>
            </div>
          </section>
        )}

        {!isLoadingAny && user && !role && (
          <section className="pt-16">
            <div className="mx-auto max-w-3xl px-4">
              <div className="rounded-2xl border border-amber-300/40 bg-[#293A49]/90 backdrop-blur-sm p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-2">Completa tu perfil</h2>
                <p className="text-gray-200">
                  No encontramos un <span className="font-semibold">role</span> en tu perfil. Regresa al registro o actualiza tu perfil para elegir:{" "}
                  <span style={{ color: BRAND.a }} className="font-semibold">Emprendedor</span> o{" "}
                  <span style={{ color: BRAND.a }} className="font-semibold">Consultor</span>.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link href="/register" className="rounded-lg" style={{ backgroundColor: BRAND.a, color: BRAND.white, padding: '0.5rem 1rem', fontWeight: 600 }}>Ir al registro</Link>
                  <Link href="/perfil" className="rounded-lg border border-[#70B5E2]/30 bg-[#293A49]/50 text-white px-4 py-2 text-sm font-semibold hover:bg-[#293A49]/80 transition">Editar perfil</Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {!isLoadingAny && user && role && metrics && (
          role === "consultor" ? <ConsultantDashboard metrics={metrics} /> : <EntrepreneurDashboard metrics={metrics} />
        )}
      </main>
    </>
  );
};

export default InicioDashboard;

// pages/dashboard/inicio.tsx
"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import PrivateLayout from "@/components/layout/PrivateLayout";
import { motion } from "framer-motion";
import {
  FaHeartbeat,
  FaClipboardCheck,
  FaStethoscope,
  FaComments,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaShoppingBasket,
  FaChartLine,
  FaUserTie,
  FaArrowRight,
} from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Partículas
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

gsap.registerPlugin(ScrollTrigger);

const InicioDashboard: React.FC = () => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // particles
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    background: { color: { value: "#F8FAFC" } }, // slate-50
    fpsLimit: 60,
    particles: {
      number: { value: 60, density: { enable: true, area: 800 } },
      color: { value: ["#3B82F6", "#06B6D4", "#22C55E"] }, // blue/cyan/green
      shape: { type: "circle" },
      opacity: { value: 0.25 },
      size: { value: { min: 1, max: 3 } },
      links: { enable: true, distance: 120, opacity: 0.15 },
      move: { enable: true, speed: 1.2, outModes: { default: "bounce" } },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: { grab: { distance: 160, links: { opacity: 0.25 } }, push: { quantity: 2 } },
    },
    detectRetina: true,
  };

  useEffect(() => {
    // animaciones on-enter
    gsap.fromTo(
      ".dash-hero-title",
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
    );
    gsap.fromTo(
      ".dash-hero-sub",
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: "power3.out" }
    );
    gsap.fromTo(
      ".dash-hero-cta",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.7, delay: 0.25, ease: "power2.out" }
    );

    // animaciones por sección al hacer scroll
    sectionRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
    });
  }, []);

  // variantes framer
  const card = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <PrivateLayout>
      {/* Fondo partículas */}
      <Particles id="tsparticles-dashboard" init={particlesInit} options={particlesOptions as any} className="fixed inset-0 -z-10" />

      <main className="min-h-screen bg-transparent text-slate-800">
        {/* HERO */}
        <section className="relative pt-10 md:pt-14 pb-6">
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 md:p-10 shadow-sm">
              <h1 className="dash-hero-title text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                Bienvenido a tu Panel — <span className="text-blue-600">MenthIA</span>
              </h1>
              <p className="dash-hero-sub mt-2 text-slate-600 md:text-lg">
                Centraliza tu operación: inicia diagnósticos, gestiona mentorías, sube cursos y ofrece servicios en el marketplace.
              </p>

              {/* accesos rápidos */}
              <div className="dash-hero-cta mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Link
                  href="/dashboard/diagnostico"
                  className="group rounded-xl border border-slate-200 bg-white p-3 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-blue-50 text-blue-600">
                      <FaClipboardCheck />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Diagnóstico</div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-600">General / Profundo / Emergencia</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/mentoria"
                  className="group rounded-xl border border-slate-200 bg-white p-3 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600">
                      <FaUserTie />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Mentoría</div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-600">Agenda y matching</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/cursos"
                  className="group rounded-xl border border-slate-200 bg-white p-3 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-violet-50 text-violet-600">
                      <FaChalkboardTeacher />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Cursos</div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-600">Catálogo y progreso</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/marketplace"
                  className="group rounded-xl border border-slate-200 bg-white p-3 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-cyan-50 text-cyan-600">
                      <FaShoppingBasket />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Marketplace</div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-600">Servicios profesionales</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/ayuda"
                  className="group rounded-xl border border-slate-200 bg-white p-3 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-amber-50 text-amber-600">
                      <FaComments />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Ayuda</div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-600">Asistente y FAQs</div>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/pagos"
                  className="group rounded-xl border border-slate-200 bg-white p-3 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-rose-50 text-rose-600">
                      <FaCalendarAlt />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Pagos</div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-600">Planes y facturación</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* KPIs / estado */}
        <section
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
          className="py-4"
        >
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Diagnósticos completados", value: "12", icon: <FaChartLine /> },
                { label: "Sesiones de mentoría", value: "4 esta semana", icon: <FaUserTie /> },
                { label: "Cursos activos", value: "3", icon: <FaChalkboardTeacher /> },
                { label: "Pedidos en marketplace", value: "2", icon: <FaShoppingBasket /> },
              ].map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  variants={card}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid place-items-center h-10 w-10 rounded-xl bg-slate-50 text-slate-700">
                      {kpi.icon}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">{kpi.label}</div>
                      <div className="text-xl font-bold text-slate-900">{kpi.value}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lanzar diagnóstico */}
        <section
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          className="py-10"
        >
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 md:p-10 shadow-sm">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-blue-600 text-white">
                      <FaHeartbeat />
                    </span>
                    Comienza un nuevo diagnóstico
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Evalúa tu empresa en minutos y recibe un reporte accionable. Elige el nivel según tu necesidad.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                  <Link
                    href="/dashboard/diagnostico/general"
                    className="group rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:border-blue-300 hover:shadow transition"
                  >
                    General <FaArrowRight className="inline ml-2 opacity-60 group-hover:translate-x-0.5 transition" />
                  </Link>
                  <Link
                    href="/dashboard/diagnostico/profundo"
                    className="group rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:border-blue-300 hover:shadow transition"
                  >
                    Profundo <FaArrowRight className="inline ml-2 opacity-60 group-hover:translate-x-0.5 transition" />
                  </Link>
                  <Link
                    href="/dashboard/diagnostico/emergencia"
                    className="group rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:border-blue-300 hover:shadow transition"
                  >
                    Emergencia <FaArrowRight className="inline ml-2 opacity-60 group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mentoría */}
        <section
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
          className="py-8"
        >
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200/60 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid place-items-center h-10 w-10 rounded-xl bg-emerald-600 text-white">
                    <FaUserTie />
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Mentoría: agenda y matching</h3>
                </div>
                <p className="text-slate-600">
                  Conecta con consultores verificados, define objetivos y recibe seguimiento. Integra tu Google Calendar
                  para evitar choques de agenda.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/dashboard/mentoria" className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700">
                    Ver mentorías
                  </Link>
                  <Link href="/dashboard/mentoria" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">
                    Configurar disponibilidad
                  </Link>
                </div>
              </div>

              {/* Cursos & Marketplace */}
              <div className="rounded-2xl border border-violet-200/60 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid place-items-center h-10 w-10 rounded-xl bg-violet-600 text-white">
                    <FaChalkboardTeacher />
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Cursos & Marketplace</h3>
                </div>
                <p className="text-slate-600">
                  Sube cursos (video en S3), gestiona progreso de alumnos y ofrece servicios especializados desde el marketplace.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/dashboard/cursos" className="rounded-lg bg-violet-600 text-white px-4 py-2 text-sm font-semibold hover:bg-violet-700">
                    Ir a cursos
                  </Link>
                  <Link href="/dashboard/marketplace" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">
                    Ver marketplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips operativos */}
        <section
          ref={(el) => {
            sectionRefs.current[3] = el;
          }}
          className="py-10"
        >
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Atajos útiles</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/dashboard/diagnostico/historico" className="rounded-xl border border-slate-200 p-4 hover:shadow transition">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-blue-50 text-blue-600">
                      <FaStethoscope />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Ver históricos</div>
                      <div className="text-xs text-slate-500">Resultados y PDFs</div>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/ayuda" className="rounded-xl border border-slate-200 p-4 hover:shadow transition">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-amber-50 text-amber-600">
                      <FaComments />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Asistente</div>
                      <div className="text-xs text-slate-500">FAQ y soporte</div>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/pagos" className="rounded-xl border border-slate-200 p-4 hover:shadow transition">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-rose-50 text-rose-600">
                      <FaCalendarAlt />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Planes</div>
                      <div className="text-xs text-slate-500">Suscripciones y checkout</div>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/marketplace" className="rounded-xl border border-slate-200 p-4 hover:shadow transition">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-cyan-50 text-cyan-600">
                      <FaShoppingBasket />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Ofrece servicios</div>
                      <div className="text-xs text-slate-500">Publica tu oferta</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer corto */}
        <section className="pb-10">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-xs text-slate-500 text-center">
              © {new Date().getFullYear()} MenthIA — Plataforma para diagnóstico, mentoría y cursos.
            </div>
          </div>
        </section>
      </main>
    </PrivateLayout>
  );
};

export default InicioDashboard;

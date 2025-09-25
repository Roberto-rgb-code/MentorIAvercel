// pages/dashboard/inicio.tsx
"use client";
import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
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
    background: { color: { value: "#293A49" } },
    fpsLimit: 60,
    particles: {
      number: { value: 40, density: { enable: true, area: 800 } },
      color: { value: ["#70B5E2", "#37B6FF", "#ffffff"] },
      shape: { type: "circle" },
      opacity: { value: 0.15 },
      size: { value: { min: 1, max: 2 } },
      links: { enable: true, distance: 120, opacity: 0.1, color: "#70B5E2" },
      move: { enable: true, speed: 0.8, outModes: { default: "bounce" } },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: { grab: { distance: 160, links: { opacity: 0.2 } }, push: { quantity: 2 } },
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
    <>
      {/* Fondo partículas */}
      <Particles id="tsparticles-dashboard" init={particlesInit} options={particlesOptions as any} className="fixed inset-0 -z-10" />
      
      <main className="min-h-screen bg-transparent text-white" style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        {/* HERO */}
        <section className="relative pt-10 md:pt-14 pb-6">
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-2xl border border-[#70B5E2]/30 bg-[#293A49]/90 backdrop-blur-sm p-6 md:p-10 shadow-xl">
              <h1 className="dash-hero-title text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Bienvenido a tu Panel — <span className="text-[#70B5E2]">MenthIA</span>
              </h1>
              <p className="dash-hero-sub mt-2 text-gray-200 md:text-lg">
                Centraliza tu operación: inicia diagnósticos, gestiona mentorías, sube cursos y ofrece servicios en el marketplace.
              </p>
              {/* accesos rápidos */}
              <div className="dash-hero-cta mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Link
                  href="/dashboard/diagnostico"
                  className="group rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/80 backdrop-blur-sm p-3 hover:bg-[#293A49] hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-[#70B5E2]/20 text-[#70B5E2]">
                      <FaClipboardCheck />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">Diagnóstico</div>
                      <div className="text-xs text-gray-300 group-hover:text-gray-200">General / Profundo / Emergencia</div>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/dashboard/mentoria"
                  className="group rounded-xl border border-[#37B6FF]/30 bg-[#293A49]/80 backdrop-blur-sm p-3 hover:bg-[#293A49] hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-[#37B6FF]/20 text-[#37B6FF]">
                      <FaUserTie />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">Mentoría</div>
                      <div className="text-xs text-gray-300 group-hover:text-gray-200">Agenda y matching</div>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/dashboard/cursos"
                  className="group rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/80 backdrop-blur-sm p-3 hover:bg-[#293A49] hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-[#70B5E2]/20 text-[#70B5E2]">
                      <FaChalkboardTeacher />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">Cursos</div>
                      <div className="text-xs text-gray-300 group-hover:text-gray-200">Catálogo y progreso</div>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/dashboard/marketplace"
                  className="group rounded-xl border border-[#37B6FF]/30 bg-[#293A49]/80 backdrop-blur-sm p-3 hover:bg-[#293A49] hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-[#37B6FF]/20 text-[#37B6FF]">
                      <FaShoppingBasket />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">Marketplace</div>
                      <div className="text-xs text-gray-300 group-hover:text-gray-200">Servicios profesionales</div>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/dashboard/ayuda"
                  className="group rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/80 backdrop-blur-sm p-3 hover:bg-[#293A49] hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-[#70B5E2]/20 text-[#70B5E2]">
                      <FaComments />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">Ayuda</div>
                      <div className="text-xs text-gray-300 group-hover:text-gray-200">Asistente y FAQs</div>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/dashboard/pagos"
                  className="group rounded-xl border border-[#37B6FF]/30 bg-[#293A49]/80 backdrop-blur-sm p-3 hover:bg-[#293A49] hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-[#37B6FF]/20 text-[#37B6FF]">
                      <FaCalendarAlt />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">Pagos</div>
                      <div className="text-xs text-gray-300 group-hover:text-gray-200">Planes y facturación</div>
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
                  className="rounded-2xl border border-[#70B5E2]/30 bg-[#293A49]/90 backdrop-blur-sm p-5 shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid place-items-center h-10 w-10 rounded-xl bg-[#70B5E2]/20 text-[#70B5E2]">
                      {kpi.icon}
                    </div>
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

        {/* Lanzar diagnóstico */}
        <section
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          className="py-10"
        >
          <div className="mx-auto max-w-7xl px-4">
            <div className="rounded-2xl border border-[#70B5E2]/30 bg-gradient-to-br from-[#293A49]/95 via-[#70B5E2]/10 to-[#37B6FF]/10 backdrop-blur-sm p-6 md:p-10 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-[#37B6FF] text-white">
                      <FaHeartbeat />
                    </span>
                    Comienza un nuevo diagnóstico
                  </h2>
                  <p className="mt-2 text-gray-200">
                    Evalúa tu empresa en minutos y recibe un reporte accionable. Elige el nivel según tu necesidad.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                  <Link
                    href="/dashboard/diagnostico/general"
                    className="group rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/80 backdrop-blur-sm px-4 py-3 text-sm font-semibold text-white hover:bg-[#293A49] hover:shadow-lg transition"
                  >
                    General <FaArrowRight className="inline ml-2 opacity-60 group-hover:translate-x-0.5 transition" />
                  </Link>
                  <Link
                    href="/dashboard/diagnostico/profundo"
                    className="group rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/80 backdrop-blur-sm px-4 py-3 text-sm font-semibold text-white hover:bg-[#293A49] hover:shadow-lg transition"
                  >
                    Profundo <FaArrowRight className="inline ml-2 opacity-60 group-hover:translate-x-0.5 transition" />
                  </Link>
                  <Link
                    href="/dashboard/diagnostico/emergencia"
                    className="group rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/80 backdrop-blur-sm px-4 py-3 text-sm font-semibold text-white hover:bg-[#293A49] hover:shadow-lg transition"
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
              <div className="rounded-2xl border border-[#37B6FF]/30 bg-[#293A49]/90 backdrop-blur-sm p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid place-items-center h-10 w-10 rounded-xl bg-[#37B6FF] text-white">
                    <FaUserTie />
                  </span>
                  <h3 className="text-xl font-bold text-white">Mentoría: agenda y matching</h3>
                </div>
                <p className="text-gray-200">
                  Conecta con consultores verificados, define objetivos y recibe seguimiento. Integra tu Google Calendar
                  para evitar choques de agenda.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/dashboard/mentoria" className="rounded-lg bg-[#37B6FF] text-white px-4 py-2 text-sm font-semibold hover:bg-[#70B5E2] transition">
                    Ver mentorías
                  </Link>
                  <Link href="/dashboard/mentoria" className="rounded-lg border border-[#70B5E2]/30 bg-[#293A49]/50 text-white px-4 py-2 text-sm font-semibold hover:bg-[#293A49]/80 transition">
                    Configurar disponibilidad
                  </Link>
                </div>
              </div>
              {/* Cursos & Marketplace */}
              <div className="rounded-2xl border border-[#70B5E2]/30 bg-[#293A49]/90 backdrop-blur-sm p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid place-items-center h-10 w-10 rounded-xl bg-[#70B5E2] text-white">
                    <FaChalkboardTeacher />
                  </span>
                  <h3 className="text-xl font-bold text-white">Cursos & Marketplace</h3>
                </div>
                <p className="text-gray-200">
                  Sube cursos (video en S3), gestiona progreso de alumnos y ofrece servicios especializados desde el marketplace.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/dashboard/cursos" className="rounded-lg bg-[#70B5E2] text-white px-4 py-2 text-sm font-semibold hover:bg-[#37B6FF] transition">
                    Ir a cursos
                  </Link>
                  <Link href="/dashboard/marketplace" className="rounded-lg border border-[#70B5E2]/30 bg-[#293A49]/50 text-white px-4 py-2 text-sm font-semibold hover:bg-[#293A49]/80 transition">
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
            <div className="rounded-2xl border border-[#70B5E2]/30 bg-[#293A49]/90 backdrop-blur-sm p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Atajos útiles</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/dashboard/diagnostico/historico" className="rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/60 backdrop-blur-sm p-4 hover:bg-[#293A49]/80 hover:shadow-lg transition">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-[#70B5E2]/20 text-[#70B5E2]">
                      <FaStethoscope />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">Ver históricos</div>
                      <div className="text-xs text-gray-300">Resultados y PDFs</div>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/ayuda" className="rounded-xl border border-[#37B6FF]/30 bg-[#293A49]/60 backdrop-blur-sm p-4 hover:bg-[#293A49]/80 hover:shadow-lg transition">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-[#37B6FF]/20 text-[#37B6FF]">
                      <FaComments />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">Asistente</div>
                      <div className="text-xs text-gray-300">FAQ y soporte</div>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/pagos" className="rounded-xl border border-[#70B5E2]/30 bg-[#293A49]/60 backdrop-blur-sm p-4 hover:bg-[#293A49]/80 hover:shadow-lg transition">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-[#70B5E2]/20 text-[#70B5E2]">
                      <FaCalendarAlt />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">Planes</div>
                      <div className="text-xs text-gray-300">Suscripciones y checkout</div>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/marketplace" className="rounded-xl border border-[#37B6FF]/30 bg-[#293A49]/60 backdrop-blur-sm p-4 hover:bg-[#293A49]/80 hover:shadow-lg transition">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg bg-[#37B6FF]/20 text-[#37B6FF]">
                      <FaShoppingBasket />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">Ofrece servicios</div>
                      <div className="text-xs text-gray-300">Publica tu oferta</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default InicioDashboard;
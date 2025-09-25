// pages/demo-dashboard.tsx
import React, { useEffect, useRef } from "react";
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
  FaEye,
} from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DemoDashboard: React.FC = () => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    gsap.fromTo(".dash-hero-title", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
    gsap.fromTo(".dash-hero-sub", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: "power3.out" });
    gsap.fromTo(".dash-hero-cta", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.25, ease: "power2.out" });

    sectionRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
      });
    });
  }, []);

  const card = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <>
      <div className="min-h-screen bg-[#293A49]" style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <main className="text-white/90">
          <div className="bg-[#37B6FF]/20 border-b border-[#37B6FF]/30 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 py-3 text-center">
              <p className="text-sm text-[#70B5E2] flex items-center justify-center gap-2">
                <FaEye /> Esta es una vista de demostracion. <Link href="/register" className="underline hover:text-[#37B6FF] font-semibold">Registrate</Link> para acceder a tu dashboard personalizado
              </p>
            </div>
          </div>

          <section className="relative pt-10 md:pt-14 pb-6">
            <div className="mx-auto max-w-7xl px-4">
              <div className="rounded-2xl border border-[#70B5E2]/30 bg-white/5 backdrop-blur-sm p-6 md:p-10">
                <h1 className="dash-hero-title text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  Bienvenido a tu Panel - <span className="text-[#70B5E2]">MenthIA</span>
                </h1>
                <p className="dash-hero-sub mt-2 text-gray-300 md:text-lg">
                  Centraliza tu operacion: inicia diagnosticos, gestiona mentorias, sube cursos y ofrece servicios en el marketplace.
                </p>
                <div className="dash-hero-cta mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { icon: FaClipboardCheck, title: "Diagnostico", desc: "General / Profundo / Emergencia", color: "bg-[#70B5E2]/20 text-[#70B5E2]" },
                    { icon: FaUserTie, title: "Mentoria", desc: "Agenda y matching", color: "bg-[#37B6FF]/20 text-[#37B6FF]" },
                    { icon: FaChalkboardTeacher, title: "Cursos", desc: "Catalogo y progreso", color: "bg-[#70B5E2]/20 text-[#70B5E2]" },
                    { icon: FaShoppingBasket, title: "Marketplace", desc: "Servicios profesionales", color: "bg-[#37B6FF]/20 text-[#37B6FF]" },
                    { icon: FaComments, title: "Ayuda", desc: "Asistente y FAQs", color: "bg-[#70B5E2]/20 text-[#70B5E2]" },
                    { icon: FaCalendarAlt, title: "Pagos", desc: "Planes y facturacion", color: "bg-[#37B6FF]/20 text-[#37B6FF]" },
                  ].map((item, idx) => (
                    <div key={idx} className="group rounded-xl border border-[#70B5E2]/30 bg-white/5 p-3 opacity-75 cursor-not-allowed">
                      <div className="flex items-center gap-3">
                        <span className={`grid place-items-center h-9 w-9 rounded-lg ${item.color}`}>
                          <item.icon />
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-white">{item.title}</div>
                          <div className="text-xs text-gray-400">{item.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section ref={(el) => { sectionRefs.current[0] = el; }} className="py-4">
            <div className="mx-auto max-w-7xl px-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Diagnosticos completados", value: "12", icon: <FaChartLine /> },
                  { label: "Sesiones de mentoria", value: "4 esta semana", icon: <FaUserTie /> },
                  { label: "Cursos activos", value: "3", icon: <FaChalkboardTeacher /> },
                  { label: "Pedidos en marketplace", value: "2", icon: <FaShoppingBasket /> },
                ].map((kpi, i) => (
                  <motion.div key={kpi.label} variants={card} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.35, delay: i * 0.05 }} className="rounded-2xl border border-[#70B5E2]/30 bg-white/5 backdrop-blur-sm p-5">
                    <div className="flex items-start gap-3">
                      <div className="grid place-items-center h-10 w-10 rounded-xl bg-[#70B5E2]/20 text-[#70B5E2]">{kpi.icon}</div>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">{kpi.label}</div>
                        <div className="text-xl font-bold text-white">{kpi.value}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section ref={(el) => { sectionRefs.current[1] = el; }} className="py-10">
            <div className="mx-auto max-w-7xl px-4">
              <div className="rounded-2xl border border-[#70B5E2]/30 bg-gradient-to-br from-[#70B5E2]/10 to-[#37B6FF]/10 backdrop-blur-sm p-6 md:p-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
                      <span className="grid place-items-center h-10 w-10 rounded-xl bg-[#37B6FF] text-white"><FaHeartbeat /></span>
                      Comienza un nuevo diagnostico
                    </h2>
                    <p className="mt-2 text-gray-300">Evalua tu empresa en minutos y recibe un reporte accionable. Elige el nivel segun tu necesidad.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                    {["General", "Profundo", "Emergencia"].map((type) => (
                      <button key={type} className="rounded-xl border border-[#70B5E2]/30 bg-white/5 px-4 py-3 text-sm font-semibold text-white opacity-75 cursor-not-allowed">
                        {type} <FaArrowRight className="inline ml-2 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section ref={(el) => { sectionRefs.current[2] = el; }} className="py-8">
            <div className="mx-auto max-w-7xl px-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#70B5E2]/30 bg-white/5 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-[#37B6FF] text-white"><FaUserTie /></span>
                    <h3 className="text-xl font-bold text-white">Mentoria: agenda y matching</h3>
                  </div>
                  <p className="text-gray-300">Conecta con consultores verificados, define objetivos y recibe seguimiento. Integra tu Google Calendar para evitar choques de agenda.</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="rounded-lg bg-[#37B6FF] text-white px-4 py-2 text-sm font-semibold opacity-75 cursor-not-allowed">Ver mentorias</button>
                    <button className="rounded-lg border border-[#70B5E2]/30 px-4 py-2 text-sm font-semibold text-white opacity-75 cursor-not-allowed">Configurar disponibilidad</button>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#70B5E2]/30 bg-white/5 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-[#70B5E2] text-white"><FaChalkboardTeacher /></span>
                    <h3 className="text-xl font-bold text-white">Cursos & Marketplace</h3>
                  </div>
                  <p className="text-gray-300">Sube cursos (video en S3), gestiona progreso de alumnos y ofrece servicios especializados desde el marketplace.</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="rounded-lg bg-[#70B5E2] text-white px-4 py-2 text-sm font-semibold opacity-75 cursor-not-allowed">Ir a cursos</button>
                    <button className="rounded-lg border border-[#70B5E2]/30 px-4 py-2 text-sm font-semibold text-white opacity-75 cursor-not-allowed">Ver marketplace</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="mx-auto max-w-4xl px-4">
              <div className="rounded-2xl border border-[#37B6FF]/30 bg-gradient-to-br from-[#37B6FF]/20 to-[#70B5E2]/20 backdrop-blur-sm p-8 md:p-12 text-center">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Listo para comenzar?</h3>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Registrate ahora y obten acceso completo a tu dashboard personalizado con todas las herramientas de MenthIA</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register" className="rounded-xl bg-[#37B6FF] text-white px-8 py-4 text-lg font-bold hover:bg-[#70B5E2] transition-colors shadow-lg">Crear Cuenta Gratis</Link>
                  <Link href="/login" className="rounded-xl border border-[#70B5E2]/30 bg-white/5 text-white px-8 py-4 text-lg font-semibold hover:bg-white/10 transition-colors">Ya tengo cuenta</Link>
                </div>
              </div>
            </div>
          </section>

          <footer className="border-t border-white/10 py-8">
            <div className="mx-auto max-w-7xl px-4">
              <div className="text-xs text-gray-400 text-center">2025 MenthIA - Plataforma para diagnostico, mentoria y cursos.</div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default DemoDashboard;
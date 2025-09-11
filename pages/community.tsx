// pages/community.tsx
import React, { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  FaQuestionCircle,
  FaNewspaper,
  FaCalendarAlt,
  FaGift,
  FaStar,
  FaQuoteRight,
  FaUserPlus,
} from "react-icons/fa";
import { gsap } from "gsap";

// Partículas (sin Three)
import Particles from "react-tsparticles";
import type { Engine, Container } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const ParticleBackground: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);
  const particlesLoaded = useCallback(async (_c?: Container) => {}, []);
  return (
    <div className="fixed inset-0 -z-10">
      <Particles
        id="tsparticles-community"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          detectRetina: true,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              push: { quantity: 3 },
              repulse: { distance: 120, duration: 0.4 },
            },
          },
          particles: {
            number: { value: 110, density: { enable: true, area: 900 } },
            color: { value: ["#93C5FD", "#A5B4FC", "#C7D2FE"] },
            links: {
              enable: true,
              color: "#A5B4FC",
              distance: 150,
              opacity: 0.25,
              width: 1,
            },
            move: { enable: true, speed: 0.8, outModes: { default: "bounce" } },
            opacity: { value: 0.35 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
        }}
        className="w-full h-full"
      />
    </div>
  );
};

const CommunityPage: React.FC = () => {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrada suave de bloques
    gsap.fromTo(
      ".community-card",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power2.out" }
    );
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.15 }
      );
    }
  }, []);

  const cards = [
    {
      title: "Preguntas & Respuestas",
      desc: "Resuelve dudas, comparte experiencia y aprende con la comunidad.",
      icon: <FaQuestionCircle />,
      action: () => router.push("/community/qna"),
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Noticias",
      desc: "Tendencias, herramientas y cambios que importan a emprendedores.",
      icon: <FaNewspaper />,
      action: () => router.push("/community/news"),
      color: "from-sky-500 to-cyan-500",
    },
    {
      title: "Eventos",
      desc: "Meetups, workshops y sesiones en vivo. Conecta y crece.",
      icon: <FaCalendarAlt />,
      action: () => router.push("/community/events"),
      color: "from-fuchsia-500 to-rose-500",
    },
    {
      title: "Recompensas",
      desc: "Gana puntos por ayudar. Canjéalos por recursos y mentorías.",
      icon: <FaGift />,
      action: () => router.push("/community/rewards"),
      color: "from-emerald-500 to-green-500",
    },
  ];

  const testimonials = [
    {
      quote:
        "En 3 semanas lancé mi MVP gracias a feedback real en el canal de Q&A.",
      name: "María G.",
    },
    {
      quote:
        "Los eventos de pitch me dieron claridad y contactos clave para levantar capital.",
      name: "Luis P.",
    },
    {
      quote:
        "La comunidad es súper activa. Aprendí a medir mis métricas de crecimiento.",
      name: "Ana R.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-sky-50 to-white">
      <ParticleBackground />

      {/* Blobs suaves */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-[28rem] h-[28rem] rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 w-[24rem] h-[24rem] rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      {/* Hero */}
      <header className="relative z-10">
        <div className="max-w-6xl mx-auto px-5 pt-10 flex items-center justify-between">
          <div
            className="text-2xl font-bold text-indigo-900 cursor-pointer"
            onClick={() => router.push("/")}
          >
            MenthIA
          </div>
          <button
            onClick={() => router.push("/dashboard/inicio")}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Ir al Dashboard
          </button>
        </div>

        <div
          ref={heroRef}
          className="max-w-6xl mx-auto px-5 pt-12 pb-6 text-center"
        >
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold text-indigo-900"
          >
            Comunidad de Emprendedores & Creadores
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-3 text-gray-600 max-w-2xl mx-auto"
          >
            Aprende, comparte y crece con personas que están construyendo
            productos reales. Únete a Q&A, revisa noticias y participa en
            eventos en vivo.
          </motion.p>
        </div>
      </header>

      {/* Tarjetas principales */}
      <main className="relative z-10">
        <section className="max-w-6xl mx-auto px-5 py-6 grid gap-5 md:grid-cols-2">
          {cards.map((c, i) => (
            <div
              key={i}
              className="community-card rounded-2xl border bg-white shadow hover:shadow-lg transition overflow-hidden"
            >
              <div
                className={`h-2 bg-gradient-to-r ${c.color} opacity-80`}
                aria-hidden
              />
              <div className="p-5 flex items-start gap-4">
                <div
                  className={`text-white text-xl p-3 rounded-xl bg-gradient-to-br ${c.color} shadow`}
                >
                  {c.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-indigo-900">
                    {c.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{c.desc}</p>
                  <div className="mt-3">
                    <button
                      onClick={c.action}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                    >
                      Entrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Highlights / ventajas */}
        <section className="max-w-6xl mx-auto px-5 py-8">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="community-card rounded-2xl border bg-white p-5 shadow">
              <div className="text-amber-500 text-xl mb-2">
                <FaStar />
              </div>
              <h4 className="text-indigo-900 font-semibold">Mentoría de pares</h4>
              <p className="text-gray-600 mt-1">
                Respuestas rápidas y contextuales de emprendedores que ya pasaron
                por ahí.
              </p>
            </div>
            <div className="community-card rounded-2xl border bg-white p-5 shadow">
              <div className="text-indigo-500 text-xl mb-2">
                <FaUserPlus />
              </div>
              <h4 className="text-indigo-900 font-semibold">Networking real</h4>
              <p className="text-gray-600 mt-1">
                Conecta con perfiles afines, encuentra co-founders y primeros
                clientes.
              </p>
            </div>
            <div className="community-card rounded-2xl border bg-white p-5 shadow">
              <div className="text-rose-500 text-xl mb-2">
                <FaQuoteRight />
              </div>
              <h4 className="text-indigo-900 font-semibold">Feedback accionable</h4>
              <p className="text-gray-600 mt-1">
                Pide revisión de pitch, landing o pricing y obtén mejoras
                concretas.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="max-w-6xl mx-auto px-5 py-10">
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="community-card rounded-2xl border bg-white p-5 shadow"
              >
                <div className="text-indigo-600 text-xl">
                  <FaQuoteRight />
                </div>
                <p className="text-gray-700 mt-3 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="text-sm text-gray-500 mt-2">— {t.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="max-w-6xl mx-auto px-5 pb-16">
          <div className="rounded-2xl border bg-white p-6 shadow text-center">
            <h3 className="text-xl font-bold text-indigo-900">
              ¿Listo para participar?
            </h3>
            <p className="text-gray-600 mt-1">
              Únete a una conversación o crea la tuya. Tu experiencia puede
              ayudar a alguien hoy.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => router.push("/community/qna")}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Ir a Q&A
              </button>
              <button
                onClick={() => router.push("/dashboard/inicio")}
                className="px-5 py-2 rounded-xl border font-semibold hover:bg-indigo-50 transition"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 py-6 text-sm text-gray-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} MenthIA — Comunidad</span>
          <div className="flex items-center gap-4">
            <button className="hover:text-gray-800">Privacidad</button>
            <button className="hover:text-gray-800">Términos</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommunityPage;

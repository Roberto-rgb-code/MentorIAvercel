// pages/community.tsx
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/router";
import PrivateLayout from "@/components/layout/PrivateLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaQuestionCircle,
  FaNewspaper,
  FaCalendarAlt,
  FaGift,
  FaStar,
  FaQuoteRight,
  FaUserPlus,
  FaUsers,
  FaComments,
  FaTrophy,
  FaFire,
  FaArrowRight,
  FaHeart,
  FaEye,
  FaChevronRight,
  FaPlay,
  FaCheckCircle,
  FaBolt
} from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Partículas
import Particles from "react-tsparticles";
import type { Engine, Container } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

gsap.registerPlugin(ScrollTrigger);

const ParticleBackground: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);
  
  return (
    <div className="fixed inset-0 -z-10">
      <Particles
        id="tsparticles-community"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          detectRetina: true,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "bubble" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              push: { quantity: 3 },
              bubble: { distance: 200, size: 8, duration: 0.4, opacity: 0.6 },
            },
          },
          particles: {
            number: { value: 80, density: { enable: true, area: 800 } },
            color: { value: ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981"] },
            links: {
              enable: true,
              color: "#3B82F6",
              distance: 150,
              opacity: 0.2,
              width: 1,
            },
            move: { enable: true, speed: 1.2, outModes: { default: "bounce" } },
            opacity: { value: 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 4 } },
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
  const statsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [hoveredTestimonial, setHoveredTestimonial] = useState<number | null>(null);

  useEffect(() => {
    // Animaciones GSAP mejoradas
    gsap.fromTo(
      ".community-card",
      { y: 40, opacity: 0, scale: 0.9 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        stagger: 0.1, 
        duration: 0.8, 
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".community-cards-container",
          start: "top 80%",
        }
      }
    );

    gsap.fromTo(
      ".benefit-card",
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.1, 
        duration: 0.6, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".benefits-container",
          start: "top 75%",
        }
      }
    );

    gsap.fromTo(
      ".testimonial-card",
      { y: 30, opacity: 0, rotateY: 15 },
      { 
        y: 0, 
        opacity: 1, 
        rotateY: 0,
        stagger: 0.1, 
        duration: 0.7, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".testimonials-container",
          start: "top 75%",
        }
      }
    );

    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      );
    }

    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.6, 
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, []);

  const mainCards = [
    {
      title: "Preguntas & Respuestas",
      desc: "Resuelve dudas, comparte experiencia y aprende con expertos de la industria.",
      icon: <FaQuestionCircle />,
      action: () => router.push("/community/qna"),
      color: "from-blue-500 to-indigo-600",
      accent: "border-blue-200",
      stats: "2,847 preguntas activas",
      badge: "Más popular",
      badgeColor: "bg-blue-100 text-blue-700"
    },
    {
      title: "Noticias & Tendencias",
      desc: "Mantente al día con las últimas tendencias y cambios que impactan tu industria.",
      icon: <FaNewspaper />,
      action: () => router.push("/community/news"),
      color: "from-cyan-500 to-blue-500",
      accent: "border-cyan-200",
      stats: "156 artículos esta semana",
      badge: "Actualizado",
      badgeColor: "bg-cyan-100 text-cyan-700"
    },
    {
      title: "Eventos & Networking",
      desc: "Meetups exclusivos, workshops y sesiones en vivo con líderes de la industria.",
      icon: <FaCalendarAlt />,
      action: () => router.push("/community/events"),
      color: "from-purple-500 to-pink-500",
      accent: "border-purple-200",
      stats: "12 eventos próximos",
      badge: "Exclusivo",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    {
      title: "Recompensas & Logros",
      desc: "Gana puntos por contribuir, desbloquea beneficios y accede a mentorías premium.",
      icon: <FaGift />,
      action: () => router.push("/community/rewards"),
      color: "from-emerald-500 to-green-600",
      accent: "border-emerald-200",
      stats: "847 miembros premiados",
      badge: "Gamificado",
      badgeColor: "bg-emerald-100 text-emerald-700"
    },
  ];

  const communityStats = [
    { icon: <FaUsers />, number: "12,847", label: "Miembros activos", color: "text-blue-600" },
    { icon: <FaComments />, number: "45,623", label: "Conversaciones", color: "text-purple-600" },
    { icon: <FaTrophy />, number: "1,284", label: "Expertos verificados", color: "text-yellow-600" },
    { icon: <FaFire />, number: "98%", label: "Satisfacción", color: "text-red-500" },
  ];

  const benefits = [
    {
      icon: <FaStar />,
      title: "Mentoría de Élite",
      desc: "Acceso directo a emprendedores exitosos y expertos de la industria con experiencia comprobada.",
      color: "text-yellow-500"
    },
    {
      icon: <FaBolt />,
      title: "Respuestas Rápidas",
      desc: "Obtén feedback en tiempo real de una comunidad activa disponible 24/7.",
      color: "text-blue-500"
    },
    {
      icon: <FaCheckCircle />,
      title: "Contenido Verificado",
      desc: "Información curada y verificada por expertos para garantizar calidad y precisión.",
      color: "text-green-500"
    },
  ];

  const testimonials = [
    {
      quote: "En solo 3 semanas logré validar mi idea y conseguir mis primeros 100 usuarios gracias al feedback increíble de la comunidad.",
      name: "María González",
      role: "CEO, TechStartup",
      avatar: "M",
      color: "bg-gradient-to-br from-pink-400 to-red-500"
    },
    {
      quote: "Los eventos de pitch me conectaron con inversionistas clave. Levanté mi Serie A gracias a los contactos que hice aquí.",
      name: "Luis Hernández",
      role: "Founder, FinTech",
      avatar: "L",
      color: "bg-gradient-to-br from-blue-400 to-indigo-500"
    },
    {
      quote: "La comunidad es súper activa y siempre hay alguien dispuesto a ayudar. Aprendí más aquí que en cualquier curso.",
      name: "Ana Rodríguez",
      role: "Product Manager",
      avatar: "A",
      color: "bg-gradient-to-br from-purple-400 to-pink-500"
    },
  ];

  return (
    <PrivateLayout>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
        <ParticleBackground />

        {/* Elementos decorativos mejorados */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-blue-200/20 to-indigo-200/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-[35rem] h-[35rem] rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] rounded-full bg-gradient-to-br from-cyan-200/10 to-blue-200/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Hero Section mejorado */}
        <section className="relative z-10 pt-8 pb-8">
          <div ref={heroRef} className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200"
            >
              <FaFire className="text-orange-500" />
              <span>Comunidad más activa de LATAM</span>
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent leading-tight mb-6"
            >
              Comunidad de{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Emprendedores
              </span>
              {" "}& Creadores
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              Conecta con más de <strong>12,000 emprendedores</strong>, accede a mentoría de élite 
              y participa en eventos exclusivos. Tu próximo gran breakthrough está a una conversación de distancia.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <button
                onClick={() => router.push("/community/qna")}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Unirse a la Comunidad</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push("/community/events")}
                className="group bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
              >
                <FaPlay />
                <span>Ver Eventos</span>
              </button>
            </motion.div>
          </div>

          {/* Stats mejoradas */}
          <div ref={statsRef} className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {communityStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`${stat.color} text-3xl mb-3 group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tarjetas principales mejoradas */}
        <main className="relative z-10 py-12">
          <section className="max-w-7xl mx-auto px-6">
            <div className="community-cards-container grid gap-6 md:grid-cols-2 xl:grid-cols-2">
              {mainCards.map((card, i) => (
                <motion.div
                  key={i}
                  className="community-card group relative"
                  onHoverStart={() => setActiveCard(i)}
                  onHoverEnd={() => setActiveCard(null)}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`rounded-3xl border-2 ${card.accent} bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`${card.badgeColor} px-3 py-1 rounded-full text-xs font-semibold`}>
                        {card.badge}
                      </span>
                    </div>

                    {/* Gradient header */}
                    <div className={`h-2 bg-gradient-to-r ${card.color}`} />
                    
                    <div className="p-8">
                      <div className="flex items-start gap-6">
                        <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {card.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            {card.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed mb-4">
                            {card.desc}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 font-medium">
                              {card.stats}
                            </span>
                            
                            <button
                              onClick={card.action}
                              className={`group/btn bg-gradient-to-r ${card.color} text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2`}
                            >
                              <span>Explorar</span>
                              <FaChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Benefits section mejorada */}
          <section className="max-w-7xl mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir nuestra comunidad?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Más que una red social, somos un ecosistema diseñado para acelerar tu crecimiento profesional
              </p>
            </motion.div>

            <div className="benefits-container grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  className="benefit-card bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                  whileHover={{ y: -5 }}
                >
                  <div className={`${benefit.color} text-4xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {benefit.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Testimonials mejorados */}
          <section className="max-w-7xl mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Historias de éxito reales
              </h2>
              <p className="text-lg text-gray-600">
                Descubre cómo otros emprendedores han transformado sus ideas en realidades exitosas
              </p>
            </motion.div>

            <div className="testimonials-container grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  className="testimonial-card group relative"
                  onHoverStart={() => setHoveredTestimonial(i)}
                  onHoverEnd={() => setHoveredTestimonial(null)}
                  whileHover={{ y: -5, rotateY: 2 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <div className="text-blue-500 text-2xl mb-4">
                      <FaQuoteRight />
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <FaHeart className={`text-red-400 transition-all duration-300 ${hoveredTestimonial === i ? 'scale-125 text-red-500' : ''}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Sección de Referidos */}
          <section className="max-w-7xl mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Invita y gana recompensas
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comparte MenthIA con tus contactos y obtén beneficios exclusivos por cada persona que se una
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Información del programa */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-200"
              >
                <div className="text-emerald-600 text-3xl mb-4">
                  <FaGift />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Programa de Referidos</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <span className="text-gray-700">Comparte tu código único</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <span className="text-gray-700">Tu contacto se registra con tu código</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <span className="text-gray-700">Ambos reciben 30 días premium gratis</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-xl border border-emerald-200">
                  <div className="text-sm text-gray-600 mb-2">Tu código de referido:</div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded-lg font-mono text-sm">MENTOR2024-USER123</code>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors">
                      Copiar
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Recompensas */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl">
                      <FaTrophy />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">1-5 referidos</h4>
                      <p className="text-gray-600">30 días premium + badge exclusivo</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                      <FaStar />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">6-15 referidos</h4>
                      <p className="text-gray-600">3 meses premium + mentoría 1-a-1</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
                      <FaBolt />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">16+ referidos</h4>
                      <p className="text-gray-600">1 año premium + acceso VIP</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Sección de Cupones */}
          <section className="max-w-6xl mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
            >
              {/* Elementos decorativos */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-3 h-3 bg-white/20 rounded-full"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-white/30 rounded-full"></div>
                <div className="absolute bottom-6 left-8 w-4 h-4 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-12 right-6 w-2 h-2 bg-white/25 rounded-full"></div>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <FaGift />
                  <span>Oferta especial</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ¿Tienes un cupón de descuento?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Introduce tu código promocional y obtén acceso premium con descuentos exclusivos
                </p>

                <div className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Introduce tu código aquí..."
                      className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                      Aplicar
                    </button>
                  </div>
                  
                  <div className="mt-4 text-sm text-white/80">
                    Ejemplos de códigos: <span className="font-mono bg-white/20 px-2 py-1 rounded">PREMIUM30</span>, <span className="font-mono bg-white/20 px-2 py-1 rounded">MENTOR50</span>
                  </div>
                </div>

                {/* Cupones populares */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-yellow-300 text-lg mb-2">
                      <FaStar />
                    </div>
                    <div className="font-bold">NUEVO2024</div>
                    <div className="text-sm text-white/80">50% descuento primer mes</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-green-300 text-lg mb-2">
                      <FaCheckCircle />
                    </div>
                    <div className="font-bold">ESTUDIANTE</div>
                    <div className="text-sm text-white/80">30% descuento permanente</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-orange-300 text-lg mb-2">
                      <FaFire />
                    </div>
                    <div className="font-bold">ANUAL</div>
                    <div className="text-sm text-white/80">2 meses gratis</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* CTA final mejorado */}
          <section className="max-w-6xl mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 text-center shadow-2xl"
            >
              {/* Elementos decorativos */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-3 h-3 bg-white/20 rounded-full"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-white/30 rounded-full"></div>
                <div className="absolute bottom-6 left-8 w-4 h-4 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-12 right-6 w-2 h-2 bg-white/25 rounded-full"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  ¿Listo para dar el siguiente paso?
                </h3>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Únete a miles de emprendedores que ya están construyendo el futuro. 
                  Tu próxima gran oportunidad te está esperando.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => router.push("/community/qna")}
                    className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <FaComments />
                    <span>Ir a Q&A</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button
                    onClick={() => router.push("/dashboard/inicio")}
                    className="group bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
                  >
                    <FaEye />
                    <span>Explorar Dashboard</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </section>
        </main>

        {/* Footer simplificado */}
        <footer className="relative z-10 border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                  M
                </div>
                <span className="text-lg font-bold text-gray-900">MenthIA Comunidad</span>
              </div>
              
              <div className="text-sm text-gray-600 text-center md:text-left">
                © {new Date().getFullYear()} MenthIA. Construyendo el futuro juntos.
              </div>
              
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Privacidad
                </button>
                <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Términos
                </button>
                <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Soporte
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PrivateLayout>
  );
};

export default CommunityPage;
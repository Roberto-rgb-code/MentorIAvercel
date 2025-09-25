// pages/community.tsx
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/router";
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

gsap.registerPlugin(ScrollTrigger);

const CommunityPage: React.FC = () => {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [hoveredTestimonial, setHoveredTestimonial] = useState<number | null>(null);

  // Efecto de partículas con Canvas - bolitas blancas + favicon grande
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Cargar imagen del favicon
    const img = new Image();
    img.src = '/favicon.png';
    
    // Partículas de fondo (bolitas blancas)
    const backgroundParticles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Partículas con imagen del favicon
    const faviconParticles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    // Crear bolitas blancas de fondo - movimiento hacia la derecha
    const bgCount = 200;
    for (let i = 0; i < bgCount; i++) {
      backgroundParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 5, // Velocidad hacia la derecha
        vy: 0, // Sin movimiento vertical
        size: 3,
        opacity: 1
      });
    }

    let imageLoaded = false;
    
    img.onload = () => {
      imageLoaded = true;
      // Primera imagen del favicon
      faviconParticles.push({
        x: -100,
        y: canvas.height * 0.55,
        vx: 10,
        vy: 0,
        size: 80,
        rotation: Math.random() * 360,
        rotationSpeed: 10
      });
    };

    // Timer para agregar más favicons cada 7 segundos
    const addFaviconInterval = setInterval(() => {
      if (imageLoaded) {
        faviconParticles.push({
          x: -100,
          y: Math.random() * canvas.height,
          vx: 10,
          vy: 0,
          size: 80,
          rotation: Math.random() * 360,
          rotationSpeed: 10
        });
      }
    }, 7000);

    const animate = () => {
      // Fondo negro
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar bolitas blancas de fondo moviéndose a la derecha
      backgroundParticles.forEach((particle) => {
        particle.x += particle.vx;

        // Si sale por la derecha, reiniciar desde la izquierda (outMode: out)
        if (particle.x > canvas.width) {
          particle.x = 0;
          particle.y = Math.random() * canvas.height;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Dibujar favicons (por encima de las bolitas)
      if (imageLoaded) {
        faviconParticles.forEach((particle, index) => {
          particle.x += particle.vx;
          particle.rotation += particle.rotationSpeed;

          // Si sale por la derecha, eliminar (outMode: destroy)
          if (particle.x > canvas.width + 100) {
            faviconParticles.splice(index, 1);
            return;
          }

          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          ctx.drawImage(
            img, 
            -particle.size / 2, 
            -particle.size / 2, 
            particle.size, 
            particle.size
          );
          ctx.restore();
        });
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(addFaviconInterval);
    };
  }, []);

  useEffect(() => {
    // Animaciones GSAP
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
      color: "from-[#293A49] to-[#70B5E2]",
      accent: "border-[#70B5E2]/30",
      stats: "2,847 preguntas activas",
      badge: "Más popular",
      badgeColor: "bg-[#70B5E2]/20 text-[#293A49]"
    },
    {
      title: "Noticias & Tendencias",
      desc: "Mantente al día con las últimas tendencias y cambios que impactan tu industria.",
      icon: <FaNewspaper />,
      action: () => router.push("/community/news"),
      color: "from-[#37B6FF] to-[#293A49]",
      accent: "border-[#37B6FF]/30",
      stats: "156 artículos esta semana",
      badge: "Actualizado",
      badgeColor: "bg-[#37B6FF]/20 text-[#293A49]"
    },
    {
      title: "Eventos & Networking",
      desc: "Meetups exclusivos, workshops y sesiones en vivo con líderes de la industria.",
      icon: <FaCalendarAlt />,
      action: () => router.push("/community/events"),
      color: "from-[#70B5E2] to-[#37B6FF]",
      accent: "border-[#70B5E2]/30",
      stats: "12 eventos próximos",
      badge: "Exclusivo",
      badgeColor: "bg-[#70B5E2]/20 text-[#293A49]"
    },
    {
      title: "Recompensas & Logros",
      desc: "Gana puntos por contribuir, desbloquea beneficios y accede a mentorías premium.",
      icon: <FaGift />,
      action: () => router.push("/community/rewards"),
      color: "from-[#293A49] to-[#37B6FF]",
      accent: "border-[#37B6FF]/30",
      stats: "847 miembros premiados",
      badge: "Gamificado",
      badgeColor: "bg-[#37B6FF]/20 text-[#293A49]"
    },
  ];

  const communityStats = [
    { icon: <FaUsers />, number: "12,847", label: "Miembros activos", color: "text-[#70B5E2]" },
    { icon: <FaComments />, number: "45,623", label: "Conversaciones", color: "text-[#37B6FF]" },
    { icon: <FaTrophy />, number: "1,284", label: "Expertos verificados", color: "text-[#70B5E2]" },
    { icon: <FaFire />, number: "98%", label: "Satisfacción", color: "text-[#37B6FF]" },
  ];

  const benefits = [
    {
      icon: <FaStar />,
      title: "Mentoría de Élite",
      desc: "Acceso directo a emprendedores exitosos y expertos de la industria con experiencia comprobada.",
      color: "text-[#70B5E2]"
    },
    {
      icon: <FaBolt />,
      title: "Respuestas Rápidas",
      desc: "Obtén feedback en tiempo real de una comunidad activa disponible 24/7.",
      color: "text-[#37B6FF]"
    },
    {
      icon: <FaCheckCircle />,
      title: "Contenido Verificado",
      desc: "Información curada y verificada por expertos para garantizar calidad y precisión.",
      color: "text-[#70B5E2]"
    },
  ];

  const testimonials = [
    {
      quote: "En solo 3 semanas logré validar mi idea y conseguir mis primeros 100 usuarios gracias al feedback increíble de la comunidad.",
      name: "María González",
      role: "CEO, TechStartup",
      avatar: "M",
      color: "bg-gradient-to-br from-[#70B5E2] to-[#37B6FF]"
    },
    {
      quote: "Los eventos de pitch me conectaron con inversionistas clave. Levanté mi Serie A gracias a los contactos que hice aquí.",
      name: "Luis Hernández",
      role: "Founder, FinTech",
      avatar: "L",
      color: "bg-gradient-to-br from-[#37B6FF] to-[#293A49]"
    },
    {
      quote: "La comunidad es súper activa y siempre hay alguien dispuesto a ayudar. Aprendí más aquí que en cualquier curso.",
      name: "Ana Rodríguez",
      role: "Product Manager",
      avatar: "A",
      color: "bg-gradient-to-br from-[#293A49] to-[#70B5E2]"
    },
  ];

  return (
    <>
      <style jsx global>{`
        .particles-canvas {
          position: absolute;
          inset: 0;
          background: #000000;
        }
      `}</style>

      <div className="min-h-screen relative overflow-hidden bg-[#000000]" style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        {/* Canvas de partículas */}
        <div className="fixed inset-0 z-0">
          <canvas ref={canvasRef} className="particles-canvas"></canvas>
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="relative z-10 pt-8 pb-8">
            <div ref={heroRef} className="max-w-7xl mx-auto px-6 text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center space-x-2 bg-[#70B5E2]/20 backdrop-blur-sm text-[#70B5E2] px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-[#70B5E2]/30"
              >
                <FaFire className="text-[#37B6FF]" />
                <span>Comunidad más activa de LATAM</span>
              </motion.div>
              
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
              >
                Comunidad de{" "}
                <span className="text-[#70B5E2]">
                  Emprendedores
                </span>
                {" "}& Creadores
              </motion.h1>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8"
              >
                Conecta con más de <strong className="text-[#37B6FF]">12,000 emprendedores</strong>, accede a mentoría de élite 
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
                  className="group bg-[#37B6FF] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Unirse a la Comunidad</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => router.push("/community/events")}
                  className="group bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
                >
                  <FaPlay />
                  <span>Ver Eventos</span>
                </button>

                <button
                  onClick={() => router.push("/demo-dashboard")}
                  className="group bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
                >
                  <FaEye />
                  <span>Explorar Dashboard</span>
                </button>
              </motion.div>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {communityStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className={`${stat.color} text-3xl mb-3 group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Tarjetas principales */}
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
                    <div className={`rounded-3xl border-2 ${card.accent} bg-white/10 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                      <div className="absolute top-4 right-4 z-10">
                        <span className={`${card.badgeColor} px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm`}>
                          {card.badge}
                        </span>
                      </div>
                      <div className={`h-2 bg-gradient-to-r ${card.color}`} />
                      
                      <div className="p-8">
                        <div className="flex items-start gap-6">
                          <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {card.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#70B5E2] transition-colors">
                              {card.title}
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-4">
                              {card.desc}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400 font-medium">
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

            {/* Benefits section */}
            <section className="max-w-7xl mx-auto px-6 py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  ¿Por qué elegir nuestra comunidad?
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Más que una red social, somos un ecosistema diseñado para acelerar tu crecimiento profesional
                </p>
              </motion.div>

              <div className="benefits-container grid md:grid-cols-3 gap-8">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    className="benefit-card bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                    whileHover={{ y: -5 }}
                  >
                    <div className={`${benefit.color} text-4xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {benefit.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">{benefit.title}</h4>
                    <p className="text-gray-300 leading-relaxed">{benefit.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-7xl mx-auto px-6 py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Historias de éxito reales
                </h2>
                <p className="text-lg text-gray-300">
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
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                      <div className="text-[#70B5E2] text-2xl mb-4">
                        <FaQuoteRight />
                      </div>
                      
                      <p className="text-gray-200 leading-relaxed mb-6 italic">
                        "{testimonial.quote}"
                      </p>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{testimonial.name}</div>
                          <div className="text-sm text-gray-400">{testimonial.role}</div>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <FaHeart className={`text-[#37B6FF] transition-all duration-300 ${hoveredTestimonial === i ? 'scale-125 text-[#70B5E2]' : ''}`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* CTA final */}
            <section className="max-w-6xl mx-auto px-6 py-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#293A49] to-[#37B6FF] p-12 text-center shadow-2xl"
              >
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    ¿Listo para dar el siguiente paso?
                  </h3>
                  <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                    Únete a miles de emprendedores que ya están construyendo el futuro. 
                    Tu próxima gran oportunidad te está esperando.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => router.push("/community/qna")}
                      className="group bg-white text-[#293A49] px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                    >
                      <FaComments />
                      <span>Ir a Q&A</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default CommunityPage;
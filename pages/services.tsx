// pages/services.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaChartLine, FaHandshake, FaGraduationCap, FaStore, FaUsers,
  FaUserPlus, FaArrowRight, FaChevronDown, FaChevronUp,
  FaChevronLeft, FaChevronRight, FaBrain, FaRocket
} from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

// Datos de los servicios con colores de MENTHIA
const servicesData = [
  {
    id: 'diagnostics',
    title: 'Diagnósticos Predictivos',
    description: 'Radiografía 360° con IA: detecta cuellos de botella y oportunidades ocultas; supervisadas por un experto humano, con reportes ejecutivos.',
    icon: FaBrain,
    color: 'from-[#293A49] to-[#70B5E2]',
    details: [
      'Diagnóstico general básico (sin costo al registrarte)',
      'Diagnóstico de emergencia (para casos que requieren solución rápida, incluye 1:1)',
      'Diagnóstico Avanzado (Parte de lo general a un problema específico, incluye 1:1)',
    ]
  },
  {
    id: 'mentoring',
    title: 'Mentoría personalizada de Alto Impacto (Humano-IA)',
    description: 'Sesiones virtuales con asesor experto asistido por diagnósticos IA, con plan de acción y métricas automáticas.',
    icon: FaHandshake,
    color: 'from-[#37B6FF] to-[#293A49]',
    details: [
      'Asesorías virtuales por hora 1:1',
      'Diversidad de asesores especializados',
      'Diferentes niveles expertos',
    ]
  },
  {
    id: 'courses',
    title: 'Cursos Especializados',
    description: 'Talleres prácticos en línea con casos de uso impartidos por asesores de la red.',
    icon: FaGraduationCap,
    color: 'from-[#70B5E2] to-[#37B6FF]',
    details: [
      'Cápsulas gratuitas',
      'Cursos desarrollados por expertos',
      'Talleres prácticos online',
      'Certificaciones (si aplica)',
    ]
  },
  {
    id: 'ecosystem',
    title: 'Ecosistema Comercial',
    description: 'Marketplace integral: proveedores, clientes y alianzas recomendadas por IA.',
    icon: FaStore,
    color: 'from-[#293A49] to-[#37B6FF]',
    details: [
      'Proveedores verificados',
      'Precios especiales para la comunidad',
      'Alianzas recomendadas por IA',
    ]
  },
  {
    id: 'community',
    title: 'Comunidad Ejecutiva',
    description: 'Conecta con personas de valor con problemas y soluciones reales.',
    icon: FaUsers,
    color: 'from-[#70B5E2] to-[#293A49]',
    details: [
      'Red de contactos',
      'Networking',
      'Eventos exclusivos',
      'Contenidos de valor',
      'Programa de referidos',
    ]
  },
];

const Services = () => {
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Efecto de partículas con Canvas - configuración parallax/grab
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      opacityDirection: number;
    }> = [];

    const particleCount = 100;
    const maxDistance = 150;
    const moveSpeed = 2;

    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * moveSpeed,
        vy: (Math.random() - 0.5) * moveSpeed,
        size: Math.random() * 9 + 1, // entre 1 y 10
        opacity: Math.random() * 0.4 + 0.1, // entre 0.1 y 0.5
        opacityDirection: Math.random() > 0.5 ? 1 : -1
      });
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      // Push mode - agregar 4 partículas en el click
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 30,
          y: e.clientY + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * moveSpeed,
          vy: (Math.random() - 0.5) * moveSpeed,
          size: Math.random() * 9 + 1,
          opacity: Math.random() * 0.4 + 0.1,
          opacityDirection: Math.random() > 0.5 ? 1 : -1
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Parallax suave (smooth: 10)
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;

      // Actualizar y dibujar partículas
      particles.forEach((particle, i) => {
        // Movimiento base
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rebotar en los bordes (out mode)
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Animación de opacidad (speed: 3)
        particle.opacity += particle.opacityDirection * 0.03;
        if (particle.opacity >= 0.5) {
          particle.opacity = 0.5;
          particle.opacityDirection = -1;
        }
        if (particle.opacity <= 0.1) {
          particle.opacity = 0.1;
          particle.opacityDirection = 1;
        }

        // Efecto parallax (force: 60, smooth: 10)
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 400) { // grab distance
          const force = 60 / 10000; // parallax force
          particle.x += dx * force * (particle.size / 5); // partículas más grandes se mueven más
          particle.y += dy * force * (particle.size / 5);
        }

        // Dibujar partícula (blanca)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Dibujar líneas de conexión (grab mode con hover)
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            // Líneas más visibles cerca del mouse (grab effect)
            const mouseDistToLine = Math.sqrt(
              Math.pow(mouseX - (particle.x + otherParticle.x) / 2, 2) +
              Math.pow(mouseY - (particle.y + otherParticle.y) / 2, 2)
            );
            
            let lineOpacity = 0.4 * (1 - distance / maxDistance);
            if (mouseDistToLine < 400) {
              lineOpacity = Math.min(1, lineOpacity * (1 + (400 - mouseDistToLine) / 400));
            }

            ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Animaciones de entrada (hero + CTA)
  useEffect(() => {
    gsap.fromTo('.hero-services-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' });
    gsap.fromTo('.hero-services-description', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.4, delay: 0.4, ease: 'power3.out' });
    gsap.fromTo('.hero-services-subtitle', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.4, delay: 0.6, ease: 'power3.out' });
    gsap.fromTo('.hero-services-cta', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.2, delay: 0.8, ease: 'elastic.out(1, 0.8)' });

    serviceRefs.current.forEach((el) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 100, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'back.out(1.7)',
            scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 20%', toggleActions: 'play none none reverse' },
          },
        );
      }
    });

    gsap.fromTo(
      '.final-cta-section',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.final-cta-section', start: 'top 85%', toggleActions: 'play none none reverse' } },
    );
  }, []);

  const toggleDetails = (id: string) => setExpandedService(expandedService === id ? null : id);

  // ------------------ CAROUSEL (adaptado a React) ------------------
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const indicatorsRef = useRef<HTMLDivElement | null>(null);

  const debounce = (fn: (...args: any[]) => void, delay = 250) => {
    let t: any;
    return (...args: any[]) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  const updateClasses = useCallback((idx: number) => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next');
      if (i === idx) card.classList.add('is-active');
      else if (i === idx - 1) card.classList.add('is-prev');
      else if (i === idx + 1) card.classList.add('is-next');
      else if (i < idx - 1) card.classList.add('is-far-prev');
      else if (i > idx + 1) card.classList.add('is-far-next');
    });

    if (indicatorsRef.current) {
      const dots = Array.from(indicatorsRef.current.querySelectorAll<HTMLDivElement>('.indicator'));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
    }
  }, []);

  const computeTranslateX = useCallback((idx: number) => {
    const track = trackRef.current;
    const container = containerRef.current;
    const firstCard = cardRefs.current[0];
    if (!track || !container || !firstCard) return 0;

    const cardWidth = firstCard.offsetWidth;
    const cardMarginX = 25 * 2;
    const amountToMove = idx * (cardWidth + cardMarginX);
    const containerCenter = container.offsetWidth / 2;
    const cardCenter = cardWidth / 2;
    const targetTranslateX = containerCenter - cardCenter - amountToMove - 25;
    return targetTranslateX;
  }, []);

  const moveToIndex = useCallback((idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(idx, servicesData.length - 1));
    const tx = computeTranslateX(clamped);
    track.style.transform = `translateX(${tx}px)`;
    setCurrentIndex(clamped);
    updateClasses(clamped);
    requestAnimationFrame(() => {
      animateActiveCard();
    });
  }, [computeTranslateX, updateClasses]);

  const initialize = useCallback(() => {
    const start = Math.min(2, servicesData.length - 1);
    moveToIndex(start);
  }, [moveToIndex]);

  useEffect(() => {
    initialize();
    const onResize = debounce(() => {
      moveToIndex(currentIndex);
    }, 250);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = () => {
    if (currentIndex < servicesData.length - 1) moveToIndex(currentIndex + 1);
  };
  const prev = () => {
    if (currentIndex > 0) moveToIndex(currentIndex - 1);
  };

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < servicesData.length - 1;

  // ---- Efectos "HUD" de la tarjeta activa (scan line) ----
  const animateActiveCard = () => {
    const active = cardRefs.current[currentIndex];
    if (!active) return;
    const header = active.querySelector<HTMLDivElement>('.card-header');
    if (!header) return;

    const scanLine = document.createElement('div');
    scanLine.style.cssText = `
      position: absolute; left: 0; top: 0; height: 2px; width: 100%;
      background: linear-gradient(90deg, transparent, rgba(112,181,226,0.8), rgba(112,181,226,0.8), transparent);
      opacity: 0.7; z-index: 10; pointer-events: none; animation: scanAnimation 2s ease-in-out;
    `;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scanAnimation {
        0% { top: 0; }
        75% { top: calc(100% - 2px); }
        100% { top: calc(100% - 2px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    header.appendChild(scanLine);
    setTimeout(() => {
      if (scanLine.parentElement) header.removeChild(scanLine);
      if (style.parentNode) style.parentNode.removeChild(style);
    }, 2000);
  };

  // Función para click en tarjeta
  const handleCardClick = (idx: number) => {
    if (idx !== currentIndex) {
      moveToIndex(idx);
    }
  };

  return (
    <>
      {/* Estilos con colores MENTHIA */}
      <style jsx global>{`
        :root {
          --menthia-navy: #293A49;
          --menthia-blue: #70B5E2;
          --menthia-light-blue: #37B6FF;
          --menthia-white: #ffffff;
          --glow-primary: rgba(112, 181, 226, 0.7);
          --glow-secondary: rgba(55, 182, 255, 0.6);
        }
        
        /* Efecto de partículas con Canvas */
        .particles-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
        }
        
        .particles-canvas {
          position: absolute;
          inset: 0;
          background: #293A49;
        }
        
        .carousel-container {
          width: 90%;
          max-width: 1100px;
          position: relative;
          perspective: 2000px;
          padding: 3rem 0;
          z-index: 10;
          margin: 0 auto;
        }
        
        .carousel-track {
          display: flex;
          transition: transform 0.75s cubic-bezier(0.21, 0.61, 0.35, 1);
          transform-style: preserve-3d;
          will-change: transform;
        }
        
        .carousel-card {
          min-width: 320px;
          max-width: 320px;
          margin: 0 25px;
          background: linear-gradient(135deg, rgba(41,58,73,0.85), rgba(15,23,42,0.9));
          border-radius: 1.2rem;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 15px 25px rgba(0,0,0,0.5), 0 0 30px rgba(112,181,226,0.2);
          transition: all 0.6s cubic-bezier(0.21, 0.61, 0.35, 1);
          transform-origin: center center;
          position: relative;
          border: 1px solid rgba(112,181,226,0.2);
          cursor: pointer;
        }
        
        .carousel-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, transparent 0%, var(--menthia-light-blue) 25%, var(--menthia-blue) 50%, var(--menthia-light-blue) 75%, transparent 100%);
          z-index: -1;
          border-radius: 1.3rem;
          filter: blur(8px);
          opacity: 0;
          transition: opacity 0.5s ease;
          animation: borderGlow 6s linear infinite;
        }
        
        @keyframes borderGlow {
          0% { background-position: 0% 50%; opacity: 0.3; }
          50% { background-position: 100% 50%; opacity: 0.5; }
          100% { background-position: 0% 50%; opacity: 0.3; }
        }
        
        .carousel-card.is-active::before { 
          opacity: 1; 
          background-size: 300% 300%; 
        }
        
        .carousel-card:not(.is-active) { 
          transform: scale(0.8) rotateY(35deg) translateZ(-100px); 
          opacity: 0.45; 
          filter: saturate(0.6) brightness(0.7); 
        }
        
        .carousel-card.is-prev { 
          transform-origin: right center; 
          transform: scale(0.75) rotateY(45deg) translateX(-80px) translateZ(-150px); 
        }
        
        .carousel-card.is-next { 
          transform-origin: left center; 
          transform: scale(0.75) rotateY(-45deg) translateX(80px) translateZ(-150px); 
        }
        
        .carousel-card.is-active { 
          transform: scale(1) rotateY(0) translateZ(0); 
          opacity: 1; 
          z-index: 20; 
          box-shadow: 0 25px 50px rgba(0,0,0,0.5), 0 0 40px var(--glow-primary), inset 0 0 20px rgba(112,181,226,0.1); 
          filter: saturate(1.2) brightness(1.1); 
        }

        .card-header {
          position: relative;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          border-bottom: 1px solid rgba(112,181,226,0.25);
        }
        
        .card-header .title {
          margin-top: .75rem;
          font-weight: 800;
          letter-spacing: .3px;
          font-family: 'Avenir', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .card-header::after {
          content:''; 
          position:absolute; 
          inset:0;
          background: linear-gradient(120deg, rgba(112,181,226,0.1), transparent 70%),
                      radial-gradient(circle at 80% 20%, rgba(55,182,255,0.15), transparent 50%);
          pointer-events:none;
        }

        .card-content { 
          padding: 1.5rem; 
          color: #f1f5f9; 
        }
        
        .card-title { 
          font-family: 'Avenir', -apple-system, BlinkMacSystemFont, sans-serif; 
          margin-bottom: .5rem; 
          letter-spacing: .6px; 
          position: relative; 
          display: inline-block; 
        }
        
        .card-title::after { 
          content: attr(data-text); 
          position: absolute; 
          top:0; 
          left:0; 
          color: transparent; 
          -webkit-text-stroke: .5px; 
          filter: blur(3px); 
          opacity:0; 
          transition: opacity .3s ease; 
        }
        
        .carousel-card.is-active .card-title::after { 
          opacity: .8; 
        }

        .card-description { 
          font-size:.95rem; 
          line-height:1.6; 
          color: rgba(241,245,249,0.85); 
          font-weight:300; 
        }

        .details {
          margin-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 1rem;
        }
        
        .details ul { 
          margin-top: .5rem; 
        }
        
        .details .cta {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
        }

        .carousel-button {
          position:absolute; 
          top:50%; 
          transform: translateY(-50%);
          background: rgba(41,58,73,0.5); 
          color: var(--menthia-light-blue); 
          border:1px solid rgba(112,181,226,0.4);
          border-radius: 9999px; 
          width:48px; 
          height:48px; 
          display:flex; 
          justify-content:center; 
          align-items:center;
          cursor:pointer; 
          z-index:20; 
          transition: all .3s ease; 
          backdrop-filter: blur(5px); 
          box-shadow: 0 0 15px rgba(112,181,226,0.2);
        }
        
        .carousel-button:hover { 
          background: rgba(112,181,226,0.3); 
          color: var(--menthia-white); 
          transform: translateY(-50%) scale(1.1); 
          box-shadow: 0 0 20px rgba(112,181,226,0.4); 
        }
        
        .carousel-button:active { 
          transform: translateY(-50%) scale(.95); 
        }
        
        .carousel-button.prev { 
          left: -24px; 
        }
        
        .carousel-button.next { 
          right: -24px; 
        }

        .carousel-indicators { 
          display:flex; 
          justify-content:center; 
          gap:10px; 
          margin-top:2rem; 
        }
        
        .indicator { 
          width:24px; 
          height:4px; 
          background: rgba(112,181,226,0.2); 
          border-radius:2px; 
          cursor:pointer; 
          transition: all .3s ease; 
        }
        
        .indicator.active { 
          background: var(--menthia-light-blue); 
          box-shadow: 0 0 10px var(--menthia-light-blue); 
        }

        @media (max-width: 768px) {
          .carousel-button { 
            width:40px; 
            height:40px; 
          }
          .carousel-button.prev { 
            left: 5px; 
          }
          .carousel-button.next { 
            right: 5px; 
          }
          .carousel-card { 
            min-width: 260px; 
            max-width: 260px; 
            margin: 0 15px; 
          }
          .carousel-card:not(.is-active) { 
            transform: scale(0.85) rotateY(25deg); 
          }
          .carousel-card.is-prev { 
            transform: scale(0.8) rotateY(30deg) translateX(-40px); 
          }
          .carousel-card.is-next { 
            transform: scale(0.8) rotateY(-30deg) translateX(40px); 
          }
          .card-header { 
            height: 160px; 
          }
        }
      `}</style>

      <div className="relative min-h-screen bg-[#293A49] text-gray-100 overflow-hidden" style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        {/* Canvas de partículas interactivo */}
        <div className="particles-bg">
          <canvas ref={canvasRef} className="particles-canvas"></canvas>
        </div>
        
        <div className="relative z-10">
          {/* Hero */}
          <section className="min-h-[80vh] flex items-center justify-center text-center overflow-hidden relative">
            <div className="relative z-10 p-4 max-w-6xl mx-auto">
              <h1 className="hero-services-title text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
                Soluciones Integrales <span className="text-[#37B6FF]">a tu medida</span>
              </h1>
              <p className="hero-services-description text-lg md:text-xl text-gray-200 mb-10 max-w-4xl mx-auto">
                Plataforma digital creada para potenciar el talento humano usando herramientas de IA que fortalecen tu negocio.
              </p>
              <div className="hero-services-cta">
                <Link
                  href="/register"
                  className="inline-block bg-[#37B6FF] text-white font-bold py-4 px-12 rounded-full text-lg md:text-xl shadow-lg hover:bg-[#70B5E2] transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  <FaUserPlus className="inline-block mr-3" /> Únete hoy
                </Link>
              </div>
            </div>
          </section>

          {/* Carrusel Servicios */}
          <section id="services-grid" className="py-16 md:py-24 container mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-10">
              Servicios inteligentes a tu Medida
            </h2>

            <div className="carousel-container" ref={containerRef}>
              <div className="carousel-track" ref={trackRef}>
                {servicesData.map((s, i) => {
                  const Icon = s.icon;
                  const titleColor = 'text-[#70B5E2]';
                  const buttonBg = 'bg-[#37B6FF] hover:bg-[#70B5E2]';

                  return (
                    <div
                      key={s.id}
                      className={`carousel-card ${i === 0 ? 'is-active' : ''}`}
                      ref={(el) => { if (el) cardRefs.current[i] = el; }}
                      onClick={() => handleCardClick(i)}
                    >
                      {/* HEADER con icono y gradiente */}
                      <div className={`card-header bg-gradient-to-br ${s.color}`}>
                        <div className="flex flex-col items-center justify-center">
                          <Icon className="text-white drop-shadow-lg" size={64} />
                          <div className={`title ${titleColor} text-xl`}>{s.title}</div>
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="card-content">
                        <h3
                          className="card-title text-lg font-bold text-[#70B5E2]"
                          data-text={s.title}
                        >
                          {s.title}
                        </h3>
                        <p className="card-description">{s.description}</p>

                        {/* Botón Ver detalles / Probar ahora */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDetails(s.id);
                          }}
                          className={`neo-btn mt-4 w-full ${buttonBg} text-white py-2.5 px-4 rounded-full font-semibold transition-colors duration-200 shadow-md flex items-center justify-center`}
                          type="button"
                        >
                          {expandedService === s.id ? (
                            <>Ver menos <FaChevronUp className="ml-2" /></>
                          ) : (
                            <>Ver detalles <FaChevronDown className="ml-2" /></>
                          )}
                        </button>

                        {/* Detalles desplegables + CTA a Registro */}
                        {expandedService === s.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="details"
                          >
                            <h4 className="text-base font-semibold text-[#70B5E2] mb-2">¿Qué incluye?</h4>
                            <ul className="list-disc list-inside text-gray-300 space-y-1">
                              {s.details.map((d, k) => (
                                <li key={k} className="flex items-start">
                                  <FaArrowRight className="text-[#37B6FF] text-sm mr-2 mt-1 flex-shrink-0" /> {d}
                                </li>
                              ))}
                            </ul>

                            <div className="cta">
                              <Link
                                href="/register"
                                className="inline-flex items-center justify-center bg-white text-[#293A49] font-bold py-2.5 px-6 rounded-full text-sm shadow-lg hover:bg-gray-100 transition-all"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FaRocket className="mr-2" /> Probar ahora
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botones */}
              <button
                className="carousel-button prev"
                onClick={prev}
                disabled={!canPrev}
                aria-label="Anterior"
                style={{ opacity: canPrev ? 1 : .4, cursor: canPrev ? 'pointer' : 'not-allowed' }}
              >
                <FaChevronLeft />
              </button>
              <button
                className="carousel-button next"
                onClick={next}
                disabled={!canNext}
                aria-label="Siguiente"
                style={{ opacity: canNext ? 1 : .4, cursor: canNext ? 'pointer' : 'not-allowed' }}
              >
                <FaChevronRight />
              </button>

              {/* Indicadores */}
              <div className="carousel-indicators" ref={indicatorsRef}>
                {servicesData.map((_, idx) => (
                  <div
                    key={idx}
                    className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => moveToIndex(idx)}
                    aria-label={`Ir al slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="final-cta-section py-16 md:py-24 bg-gradient-to-r from-[#293A49] to-[#37B6FF] text-center shadow-inner-2xl rounded-3xl mx-4 md:mx-auto max-w-6xl mb-16 p-8 md:p-12 relative z-10">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                ¡Impulsa tu Negocio Hoy Mismo!
              </h2>
              <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto mb-10">
                Regístrate en MenthIA y comienza a transformar tus ideas en éxito con el apoyo de nuestra comunidad y expertos.
              </p>
              <Link
                href="/register"
                className="inline-block bg-white text-[#293A49] font-bold py-4 px-12 rounded-full text-lg md:text-xl shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <FaUserPlus className="inline-block mr-3" /> REGÍSTRATE AHORA Y RECIBE SIN COSTO UN DIAGNÓSTICO DE TU NEGOCIO
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Services;
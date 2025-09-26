// pages/index.tsx
import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaUsers, FaLightbulb, FaRocket, FaHandshake, FaBullseye, FaEye, FaHeart,
  FaUserPlus, FaArrowRight, FaChartLine, FaGraduationCap, FaStore, FaGem, FaBrain, FaCogs,
  FaBriefcase, FaNetworkWired, FaTools, FaShieldAlt, FaRegLightbulb, FaConnectdevelop, FaChartBar, FaGlobe, FaSearchDollar,
  FaPlay, FaCreditCard, FaCheck, FaMapMarkerAlt, FaHandHoldingHeart
} from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { ISourceOptions } from "tsparticles-engine";

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  // Partículas estilo red/conexiones con colores MentHIA
  const heroParticlesOptions: ISourceOptions = {
    background: {
      color: { value: "#ffffff" },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "grab" },
        resize: true,
      },
      modes: {
        grab: {
          distance: 200,
          links: { opacity: 0.8 }
        },
        push: { quantity: 3 },
      },
    },
    particles: {
      color: { value: ["#293A49", "#70B5E2", "#37B6FF"] },
      links: {
        color: "#70B5E2",
        distance: 150,
        enable: true,
        opacity: 0.4,
        width: 1.5,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "bounce" },
        random: false,
        speed: 1.5,
        straight: false,
      },
      number: { 
        density: { enable: true, area: 800 }, 
        value: 80 
      },
      opacity: {
        value: { min: 0.3, max: 0.7 },
        animation: { 
          enable: true, 
          speed: 1, 
          minimumValue: 0.2, 
          sync: false 
        },
      },
      shape: { type: "circle" },
      size: {
        value: { min: 2, max: 5 },
        animation: { 
          enable: true, 
          speed: 2, 
          minimumValue: 1, 
          sync: false 
        },
      },
    },
    detectRetina: true,
  };

  useEffect(() => {
    gsap.fromTo(".hero-home-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" });
    gsap.fromTo(".hero-home-description", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.4, delay: 0.4, ease: "power3.out" });
    gsap.fromTo(".hero-home-cta", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.2, delay: 0.8, ease: "elastic.out(1, 0.8)" });

    sectionRefs.current.forEach((el) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    gsap.utils.toArray<HTMLElement>(".value-item").forEach((item, i) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 2.5s ease-in-out infinite; }
        .card-custom {
          background-color: #ffffff; 
          padding: 1.5rem; 
          border-radius: 1rem; 
          color: #293A49;
          border: 2px solid #70B5E2; 
          transition: all 0.3s ease-in-out;
          box-shadow: 0 4px 12px rgba(55, 182, 255, 0.15);
        }
        .card-custom:hover { 
          transform: translateY(-5px) scale(1.03); 
          box-shadow: 0 10px 25px rgba(55, 182, 255, 0.3);
          border-color: #37B6FF;
        }
        .value-item {
          transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          background-color: #ffffff; 
          border: 2px solid #70B5E2; 
          color: #293A49;
          box-shadow: 0 4px 12px rgba(112, 181, 226, 0.15);
        }
        .value-item:hover { 
          background-color: rgba(55, 182, 255, 0.1); 
          transform: translateY(-5px) scale(1.03); 
          box-shadow: 0 10px 25px rgba(55, 182, 255, 0.35);
          border-color: #37B6FF;
        }
        .cta-secondary {
          background-color: transparent; 
          border: 2px solid #293A49; 
          color: #293A49;
          transition: all 0.3s ease-in-out;
        }
        .cta-secondary:hover { 
          background-color: #293A49; 
          color: white; 
        }
        .menthia-gradient {
          background: linear-gradient(135deg, #293A49 0%, #37B6FF 100%);
        }
        .menthia-text-gradient {
          background: linear-gradient(135deg, #37B6FF 0%, #70B5E2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .about-menthia-section {
          background: linear-gradient(135deg, rgba(55, 182, 255, 0.05) 0%, rgba(112, 181, 226, 0.05) 100%);
          border: 2px solid #70B5E2;
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex items-center justify-center text-center overflow-hidden relative p-4">
          <Particles 
            id="tsparticles-hero" 
            init={particlesInit} 
            options={heroParticlesOptions} 
            className="absolute inset-0 z-0" 
          />
          <div className="relative z-20 p-4 max-w-6xl mx-auto">
            <h1 className="hero-home-title text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6 drop-shadow-md">
              Mentores expertos <span className="menthia-text-gradient">+ IA</span> para <span className="menthia-text-gradient">escalar tu negocio en un solo lugar.</span>
            </h1>
            <p className="hero-home-description text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto">
              Talento humano que usa tecnología que conecta datos, algoritmos <b>y experiencia para tomar decisiones más rápidas</b> y rentables.
            </p>
            <div className="hero-home-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="inline-block menthia-gradient font-bold py-4 px-12 rounded-full text-lg md:text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out animate-float"
                style={{ color: '#000000' }}
              >
                <FaUserPlus className="inline-block mr-3" /> Potenciar mi negocio hoy
              </Link>
              <Link
                href="/demo"
                className="inline-block cta-secondary font-bold py-4 px-8 rounded-full text-lg md:text-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <FaPlay className="inline-block mr-3" /> Ver cómo funciona (2 min)
              </Link>
            </div>
            <div className="mt-6 text-sm text-gray-600 flex items-center justify-center gap-4">
              <div className="flex items-center">
                <FaCreditCard className="mr-2 text-green-600" />
                <span>Facilidad de pago</span>
              </div>
              <div className="flex items-center">
                <FaCheck className="mr-2 text-green-600" />
                <span>Demo guiada + recomendaciones personalizadas</span>
              </div>
            </div>
          </div>
        </section>

        {/* Qué es MentHIA Section */}
        <section
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="py-20 md:py-32 px-4 container mx-auto text-center about-menthia-section rounded-2xl shadow-lg my-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ color: '#37B6FF' }}>
            Qué es MentHIA: Tu socio estratégico
          </h2>
          
          <div className="max-w-5xl mx-auto space-y-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <p className="text-xl font-bold text-black leading-relaxed mb-8">
                MenTHIA se fundó en Guadalajara, Jalisco por un equipo interdisciplinario con talento experto mexicano, con el fin de abordar la necesidad de asesoría especializada en el ecosistema emprendedor latinoamericano.
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <p className="text-xl font-bold text-black leading-relaxed mb-8">
                Es una Plataforma digital innovadora que conecta a PYMEs y Emprendedores en Mexico y Latinoamérica, con mentores especializados utilizando inteligencia artificial avanzada, ofreciendo soluciones personalizadas, accesibles y flexibles
              </p>
            </motion.div>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Link
                href="/register"
                className="inline-block font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                style={{ backgroundColor: '#37B6FF', color: '#ffffff' }}
              >
                <FaUserPlus className="inline-block mr-3" /> Regístrate AQUÍ
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Soluciones Estratégicas */}
        <section
          ref={(el) => { sectionRefs.current[1] = el; }}
          className="py-20 md:py-32 px-4 container mx-auto text-center bg-gray-50 rounded-2xl shadow-lg my-16 border-2 border-gray-200"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ color: '#37B6FF' }}>
            MentHIA: Tu Ventaja Competitiva para Pymes y emprendedores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <motion.div 
              className="card-custom flex items-start p-8"
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaBrain className="text-5xl mr-6 flex-shrink-0" style={{ color: '#37B6FF' }} />
              <div>
                <h3 className="text-2xl font-bold mb-3 text-black">
                  Diagnósticos empresariales personalizados
                </h3>
                <p className="text-gray-700">
                  Nuestra plataforma digital analiza la información de tu empresa usando algoritmos de inteligencia artificial, entrenada para brindarte un diagnóstico certero para tu empresa.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="card-custom flex items-start p-8"
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaUsers className="text-5xl mr-6 flex-shrink-0" style={{ color: '#70B5E2' }} />
              <div>
                <h3 className="text-2xl font-bold mb-3 text-black">
                  Asesoría especializada flexible a distancia por expertos
                </h3>
                <p className="text-gray-700">
                  Contamos con una base de asesores que usan la información obtenida de la inteligencia artificial de tu negocio, para brindarte recomendaciones específicas y reales.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="card-custom flex items-start p-8"
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaCreditCard className="text-5xl mr-6 flex-shrink-0" style={{ color: '#37B6FF' }} />
              <div>
                <h3 className="text-2xl font-bold mb-3 text-black">
                  Costo asequible
                </h3>
                <p className="text-gray-700">
                  Consolidamos asesores, cursos, inteligencia artificial, membresias y más en un solo espacio trabajando para ti y tu negocio todo de forma virtual
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="card-custom flex items-start p-8"
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaTools className="text-5xl mr-6 flex-shrink-0" style={{ color: '#70B5E2' }} />
              <div>
                <h3 className="text-2xl font-bold mb-3 text-black">
                  Recursos Educativos y Herramientas Digitales a la medida
                </h3>
                <p className="text-gray-700">
                  Contamos con una biblioteca de talleres y herramientas en diversos temas empresariales útiles para tu formación, crecimiento y capacitación.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="card-custom flex items-start p-8"
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaHandshake className="text-5xl mr-6 flex-shrink-0" style={{ color: '#37B6FF' }} />
              <div>
                <h3 className="text-2xl font-bold mb-3 text-black">
                  Comunidad
                </h3>
                <p className="text-gray-700">
                  Nuestra comunidad crea alianzas estratégicas entre empresarios y asesores creando un enlace perfecto
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link
              href="/register"
              className="inline-block font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out"
              style={{ backgroundColor: '#37B6FF', color: '#ffffff' }}
            >
              <FaUserPlus className="inline-block mr-3" /> Regístrate y recibe un diagnóstico sin costo para tu negocio
            </Link>
          </motion.div>
        </section>

        {/* Tu Ventaja Competitiva */}
        <section
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="py-20 md:py-32 px-4 container mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ color: '#37B6FF' }}>
            Tu Ventaja Competitiva como ASESOR
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div 
              className="card-custom flex items-start p-8 rounded-lg shadow-lg" 
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaChartLine className="text-5xl mr-6 flex-shrink-0" style={{ color: '#37B6FF' }} />
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-3 text-black">
                  Acceso a un Mercado Amplio y en Crecimiento
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Acceder a miles de PYMES y emprendedores</li>
                  <li>• Flujo constante de clientes</li>
                  <li>• Expandir tu base de clientes</li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              className="card-custom flex items-start p-8 rounded-lg shadow-lg" 
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaGlobe className="text-5xl mr-6 flex-shrink-0" style={{ color: '#70B5E2' }} />
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-3 text-black">
                  Flexibilidad y Control sobre tu Horario de Trabajo
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Elegir tu carga de trabajo</li>
                  <li>• Optimizar tu tiempo</li>
                  <li>• Asesorar desde cualquier lugar del mundo</li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              className="card-custom flex items-start p-8 rounded-lg shadow-lg" 
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaSearchDollar className="text-5xl mr-6 flex-shrink-0" style={{ color: '#37B6FF' }} />
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-3 text-black">
                  Ingresos Escalables y Modelos de Remuneración Flexibles
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Ingresos adicionales escalables</li>
                  <li>• Pago por proyectos o por horas</li>
                  <li>• Esquema de recompensas</li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              className="card-custom flex items-start p-8 rounded-lg shadow-lg" 
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaTools className="text-5xl mr-6 flex-shrink-0" style={{ color: '#70B5E2' }} />
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-3 text-black">
                  Herramientas y Recursos para el Éxito Profesional
                </h3>
                <p className="text-gray-700">
                  Accede a herramientas especializadas y recursos exclusivos que potenciarán tu trabajo como asesor profesional.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="card-custom flex items-start p-8 rounded-lg shadow-lg" 
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaGem className="text-5xl mr-6 flex-shrink-0" style={{ color: '#37B6FF' }} />
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-3 text-black">
                  Desarrollo de Marca Personal y Reputación
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Construir tu marca personal</li>
                  <li>• Acceder a oportunidades de visibilidad</li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              className="card-custom flex items-start p-8 rounded-lg shadow-lg" 
              whileHover={{ scale: 1.02 }} 
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <FaNetworkWired className="text-5xl mr-6 flex-shrink-0" style={{ color: '#70B5E2' }} />
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-3 text-black">
                  Comunidad de Expertos y Networking
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Oportunidad de conectar</li>
                  <li>• Accederás a eventos</li>
                </ul>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link
              href="/register"
              className="inline-block font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out"
              style={{ backgroundColor: '#37B6FF', color: '#ffffff' }}
            >
              <FaUserPlus className="inline-block mr-3" /> Regístrate y empieza a recibir los beneficios como Asesor
            </Link>
          </motion.div>
        </section>

        {/* Misión, Visión, Valores */}
        <section
          ref={(el) => { sectionRefs.current[3] = el; }}
          className="py-20 md:py-32 px-4 container mx-auto text-center bg-white rounded-2xl shadow-lg my-16 border-2 border-gray-200"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 flex items-center justify-center" style={{ color: '#293A49' }}>
            <FaEye className="text-5xl mr-4" style={{ color: '#37B6FF' }} /> Nuestra Esencia: Impulsando el Liderazgo
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Misión */}
            <motion.div className="value-item p-8 rounded-lg shadow-md flex flex-col items-center" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
              <FaBullseye className="text-6xl mb-4" style={{ color: '#37B6FF' }} />
              <h3 className="text-3xl font-bold mb-3" style={{ color: '#293A49' }}>Misión</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Empoderar a emprendedores y pequeñas empresas de América Latina a través de una plataforma híbrida que combina
                inteligencia artificial con la experiencia humana, ofreciendo asesoría personalizada, diagnósticos inteligentes
                y herramientas prácticas que impulsan la innovación, el crecimiento y la competitividad empresarial.
              </p>
            </motion.div>

            {/* Visión */}
            <motion.div className="value-item p-8 rounded-lg shadow-md flex flex-col items-center" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
              <FaEye className="text-6xl mb-4" style={{ color: '#70B5E2' }} />
              <h3 className="text-3xl font-bold mb-3" style={{ color: '#293A49' }}>Visión</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Ser la plataforma líder en mentoría empresarial inteligente en América Latina, revolucionando el acceso a la consultoría
                mediante un modelo accesible, escalable y profundamente humano, que transforme a las PYMES en motores de desarrollo
                económico sostenible.
              </p>
            </motion.div>

            {/* Valores */}
            <motion.div className="value-item p-8 rounded-lg shadow-md flex flex-col items-center" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
              <FaHeart className="text-6xl mb-4" style={{ color: '#37B6FF' }} />
              <h3 className="text-3xl font-bold mb-3" style={{ color: '#293A49' }}>Valores</h3>
              <ul className="list-none text-gray-700 text-lg space-y-2 text-left">
                <li className="flex items-center"><FaArrowRight className="mr-2" style={{ color: '#37B6FF' }} /> Excelencia</li>
                <li className="flex items-center"><FaArrowRight className="mr-2" style={{ color: '#37B6FF' }} /> Colaboración</li>
                <li className="flex items-center"><FaArrowRight className="mr-2" style={{ color: '#37B6FF' }} /> Empatía</li>
                <li className="flex items-center"><FaArrowRight className="mr-2" style={{ color: '#37B6FF' }} /> Responsabilidad Social</li>
                <li className="flex items-center"><FaArrowRight className="mr-2" style={{ color: '#37B6FF' }} /> Humanidad</li>
                <li className="flex items-center"><FaArrowRight className="mr-2" style={{ color: '#37B6FF' }} /> Alta tecnología e Innovación</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* CTA final */}
        <section
          ref={(el) => { sectionRefs.current[4] = el; }}
          className="py-20 md:py-32 menthia-gradient text-center shadow-2xl rounded-3xl mx-4 md:mx-auto max-w-6xl mb-16 p-8 md:p-12 relative z-10"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              ¿Listo para Escalar tu Influencia y Rentabilidad?
            </h2>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-10">
              Únete a la red de élite de MentHIA y <b>transforma tu visión en resultados tangibles y duraderos.</b>
            </p>
            <Link
              href="/register"
              className="inline-block bg-white font-bold py-4 px-12 rounded-full text-lg md:text-xl shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 ease-in-out"
              style={{ color: '#293A49' }}
            >
              <FaUserPlus className="inline-block mr-3" />  Registrate ahora y recibe sin costo un diagnostico de tu negocio
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
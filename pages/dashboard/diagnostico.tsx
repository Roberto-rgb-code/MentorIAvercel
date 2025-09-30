import { useRouter } from 'next/router';
import {
  FaUserTie,
  FaBuilding,
  FaExclamationTriangle,
  FaArrowRight,
  FaClock,
  FaChartLine,
  FaMicroscope,
  FaFire,
  FaRocket,
  FaGem,
  FaShieldAlt,
  FaLightbulb,
  FaCog
} from 'react-icons/fa';
import React, { useRef, useEffect, useState } from 'react';

const EnhancedParticlesBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) return;

    let renderer: any;
    let camera: any;
    let scene: any;
    let particleSystems: any[] = [];
    let animationId = 0;

    let cleanup = () => {};

    (async () => {
      const THREE: any = await import('three');

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current!.appendChild(renderer.domElement);

      const createParticleSystem = (count: number, size: number, color: number, range: number) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * range;
          positions[i * 3 + 1] = (Math.random() - 0.5) * range;
          positions[i * 3 + 2] = (Math.random() - 0.5) * range;

          const colorObj = new THREE.Color(color);
          colors[i * 3] = colorObj.r;
          colors[i * 3 + 1] = colorObj.g;
          colors[i * 3 + 2] = colorObj.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size,
          vertexColors: true,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        return new THREE.Points(geometry, material);
      };

      const mainParticles = createParticleSystem(2000, 0.02, 0x70B5E2, 15);
      const accentParticles = createParticleSystem(800, 0.015, 0x37B6FF, 12);
      const glowParticles = createParticleSystem(400, 0.025, 0x4293A49, 8);

      particleSystems = [mainParticles, accentParticles, glowParticles];
      particleSystems.forEach((system) => scene.add(system));

      camera.position.z = 5;

      let time = 0;

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        time += 0.005;

        particleSystems.forEach((system, index) => {
          system.rotation.x = Math.sin(time * 0.5) * 0.1 + index * 0.1;
          system.rotation.y = Math.cos(time * 0.3) * 0.1 + index * 0.2;
          system.rotation.z += 0.0005 * (index + 1);
        });

        const targetX = mouseX.current * 0.0002;
        const targetY = mouseY.current * 0.0002;

        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (targetY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };
      animate();

      const onWindowResize = () => {
        if (!renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      const onMouseMove = (event: MouseEvent) => {
        mouseX.current = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY.current = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      window.addEventListener('resize', onWindowResize);
      window.addEventListener('mousemove', onMouseMove);

      cleanup = () => {
        window.removeEventListener('resize', onWindowResize);
        window.removeEventListener('mousemove', onMouseMove);

        cancelAnimationFrame(animationId);

        if (renderer && renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }

        particleSystems.forEach((system) => {
          system.geometry && system.geometry.dispose && system.geometry.dispose();
          if (system.material) {
            if (Array.isArray(system.material)) {
              system.material.forEach((m: any) => m && m.dispose && m.dispose());
            } else {
              system.material.dispose && system.material.dispose();
            }
          }
        });

        renderer && renderer.dispose && renderer.dispose();
      };
    })();

    return () => {
      cleanup();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};

const DiagnosticCard: React.FC<{
  type: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  secondaryIcon: React.ReactNode;
  accentIcon: React.ReactNode;
  gradient: string;
  glowColor: string;
  buttonText: string;
  estimatedTime: string;
  priority: string;
  onClick: () => void;
}> = ({
  type,
  title,
  subtitle,
  description,
  icon,
  secondaryIcon,
  accentIcon,
  gradient,
  glowColor,
  buttonText,
  estimatedTime,
  priority,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${gradient} border-0`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Seleccionar ${title}`}
      style={{
        boxShadow: isHovered
          ? `0 20px 40px -12px ${glowColor}50, 0 0 30px ${glowColor}30`
          : '0 8px 20px rgba(0,0,0,0.15)',
        fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000" />

      <div className="absolute top-0 right-0 w-28 h-28">
        <div 
          className="absolute top-4 right-4 text-2xl transform rotate-12 drop-shadow-2xl"
          style={{ color: type === 'general' ? '#4ade80' : type === 'emergencia' ? '#f87171' : '#60a5fa', opacity: 0.5 }}
        >
          {secondaryIcon}
        </div>
        <div 
          className="absolute top-8 right-12 text-lg transform -rotate-12 drop-shadow-xl"
          style={{ color: type === 'general' ? '#4ade80' : type === 'emergencia' ? '#f87171' : '#60a5fa', opacity: 0.4 }}
        >
          {accentIcon}
        </div>
      </div>

      <div className="absolute top-5 left-5 z-10">
        <div className="px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-white/20 shadow-md">
          {priority}
        </div>
      </div>

      <div className="relative p-7 pt-14 text-white h-full flex flex-col">
        <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-white bg-opacity-95 backdrop-blur-sm mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/10 shadow-md">
          <div 
            className="text-3xl drop-shadow-2xl"
            style={{ color: type === 'general' ? '#3b82f6' : type === 'emergencia' ? '#ef4444' : '#06b6d4' }}
          >
            {icon}
          </div>
        </div>

        <div className="flex-grow">
          <div className="mb-3">
            <h2 className="text-2xl font-bold mb-1 tracking-tight">{title}</h2>
            <h3 className="text-lg font-semibold text-white text-opacity-95">
              {subtitle}
            </h3>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-1 px-2 py-1 bg-black/20 backdrop-blur-sm rounded-lg text-xs font-medium border border-white/10">
              <FaClock className="text-xs" />
              {estimatedTime}
            </div>
            <div className="h-1 w-1 bg-white/60 rounded-full" />
            <div className="text-xs font-medium opacity-75">Recomendado</div>
          </div>

          <p className="text-sm leading-relaxed opacity-90 mb-6 text-white">
            {description}
          </p>
        </div>

        <button className="group/btn relative w-full flex items-center justify-center gap-3 px-6 py-3 bg-white bg-opacity-95 hover:bg-opacity-100 text-gray-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover/btn:opacity-100 transform -translate-x-full group-hover/btn:translate-x-full transition-all duration-700" />
          <span className="relative z-10">{buttonText}</span>
          <FaArrowRight
            className={`relative z-10 text-sm transition-all duration-300 ${
              isHovered ? 'translate-x-2 scale-110' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
};

const Diagnostico: React.FC = () => {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleSelectDiagnostico = (type: string) => {
    setSelectedCard(type);
    setTimeout(() => {
      router.push(`/dashboard/diagnostico/${type}`);
    }, 200);
  };

  const diagnosticOptions = [
    {
      type: 'general',
      title: 'Crecimiento 360',
      subtitle: 'Diagnóstico General',
      description:
        'Evaluación global gratuita más plan de acción a seguir, recomendado por la IA. Descubre fortalezas ocultas e identifica oportunidades de crecimiento estratégico.',
      icon: <FaUserTie />,
      secondaryIcon: <FaRocket />,
      accentIcon: <FaLightbulb />,
      gradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
      glowColor: '#70B5E2',
      buttonText: 'Iniciar Análisis',
      estimatedTime: '15-20 min',
      priority: 'RECOMENDADO'
    },
    {
      type: 'emergencia',
      title: 'Crisis Now',
      subtitle: 'Diagnóstico de Emergencia',
      description:
        'Consultor en front posterior con respuesta táctica usando IA para estabilizar tu negocio. Dudas rápidas y puntuales más entrevista de 1 hora con asesor experto.',
      icon: <FaExclamationTriangle />,
      secondaryIcon: <FaFire />,
      accentIcon: <FaShieldAlt />,
      gradient: 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800',
      glowColor: '#4293A49',
      buttonText: 'Resolver Crisis',
      estimatedTime: '5-10 min',
      priority: 'URGENTE'
    },
    {
      type: 'profundo',
      title: 'Estrategia Avanzada',
      subtitle: 'Diagnóstico Profundo',
      description:
        'Evaluación global más evaluación específica por área (áreas por escoger). Incluye reporte ejecutivo, plan de acción diseñado por experto y entrevista de 1 hora.',
      icon: <FaBuilding />,
      secondaryIcon: <FaGem />,
      accentIcon: <FaCog />,
      gradient: 'bg-gradient-to-br from-sky-400 via-sky-500 to-cyan-500',
      glowColor: '#37B6FF',
      buttonText: 'Análisis Específico',
      estimatedTime: '30-45 min',
      priority: 'AVANZADO'
    }
  ];

  return (
    <>
      <EnhancedParticlesBackground />

      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/40 via-white/60 to-cyan-50/40 z-0" />
      <div className="fixed inset-0 bg-gradient-to-t from-slate-50/50 via-transparent to-blue-50/30 z-0" />

      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-slate-700 rounded-full text-sm font-semibold mb-8 shadow-md backdrop-blur-sm border border-blue-200">
            <FaChartLine className="text-base" />
            Herramientas de Diagnóstico Empresarial
            <FaMicroscope className="text-base" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 tracking-tight">
            Elige tu{' '}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent">
              Diagnóstico Inteligente
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Asesoría integral, humana e inteligente para tu negocio.{' '}
            <span className="text-blue-600 font-semibold">Cada diagnóstico</span>{' '}
            está diseñado para brindarte insights específicos y resultados accionables.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
            {diagnosticOptions.map((option) => (
              <DiagnosticCard
                key={option.type}
                {...option}
                onClick={() => handleSelectDiagnostico(option.type)}
              />
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-white/60 via-white/70 to-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/40">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-semibold mb-3">
                <FaLightbulb />
                Guía de Selección
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                ¿Primera vez? Te ayudamos a decidir
              </h3>
              <p className="text-slate-600 text-base">
                Si no estás seguro, el <strong className="text-blue-600">Diagnóstico General</strong>{' '}
                es perfecto para comenzar tu transformación empresarial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="text-center p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                <div className="w-11 h-11 mx-auto mb-3 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                  <FaFire className="text-white text-lg" />
                </div>
                <h4 className="font-semibold text-slate-700 mb-2">Crisis Inmediata</h4>
                <p className="text-slate-600 text-sm">
                  Problemas que requieren atención urgente
                </p>
              </div>

              <div className="text-center p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <div className="w-11 h-11 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <FaRocket className="text-white text-lg" />
                </div>
                <h4 className="font-semibold text-blue-700 mb-2">Crecimiento Estratégico</h4>
                <p className="text-blue-600 text-sm">
                  Evaluación completa y plan de acción
                </p>
              </div>

              <div className="text-center p-5 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200">
                <div className="w-11 h-11 mx-auto mb-3 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <FaGem className="text-white text-lg" />
                </div>
                <h4 className="font-semibold text-sky-700 mb-2">Análisis Exhaustivo</h4>
                <p className="text-sky-600 text-sm">
                  Insights profundos y transformación total
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Diagnostico;
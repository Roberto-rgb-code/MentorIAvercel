// pages/community/qna.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaQuestionCircle, 
  FaSearch, 
  FaFilter, 
  FaThumbsUp, 
  FaComment, 
  FaEye,
  FaStar,
  FaFire,
  FaClock,
  FaCheckCircle,
  FaArrowUp,
  FaPlus
} from 'react-icons/fa';

const QnAPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [sortBy, setSortBy] = useState('recientes');

  // Canvas de partículas (reutilizado del community.tsx)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const img = new Image();
    img.src = '/favicon.png';
    
    const backgroundParticles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const faviconParticles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const bgCount = 200;
    for (let i = 0; i < bgCount; i++) {
      backgroundParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 5,
        vy: 0,
        size: 3,
        opacity: 1
      });
    }

    let imageLoaded = false;
    
    img.onload = () => {
      imageLoaded = true;
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
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      backgroundParticles.forEach((particle) => {
        particle.x += particle.vx;
        if (particle.x > canvas.width) {
          particle.x = 0;
          particle.y = Math.random() * canvas.height;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (imageLoaded) {
        faviconParticles.forEach((particle, index) => {
          particle.x += particle.vx;
          particle.rotation += particle.rotationSpeed;
          if (particle.x > canvas.width + 100) {
            faviconParticles.splice(index, 1);
            return;
          }
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          ctx.drawImage(img, -particle.size / 2, -particle.size / 2, particle.size, particle.size);
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

  const categories = [
    { id: 'todas', name: 'Todas', icon: <FaQuestionCircle /> },
    { id: 'marketing', name: 'Marketing', icon: <FaFire /> },
    { id: 'ventas', name: 'Ventas', icon: <FaStar /> },
    { id: 'finanzas', name: 'Finanzas', icon: <FaCheckCircle /> },
    { id: 'tech', name: 'Tecnología', icon: <FaArrowUp /> },
  ];

  const questions = [
    {
      id: 1,
      title: '¿Cómo escalo mi startup con presupuesto limitado?',
      author: 'María González',
      avatar: 'M',
      category: 'marketing',
      views: 1247,
      answers: 12,
      upvotes: 34,
      isResolved: false,
      tags: ['startup', 'presupuesto', 'crecimiento'],
      time: 'hace 2 horas'
    },
    {
      id: 2,
      title: '¿Cuál es la mejor estrategia de pricing para SaaS B2B?',
      author: 'Luis Hernández',
      avatar: 'L',
      category: 'ventas',
      views: 892,
      answers: 8,
      upvotes: 28,
      isResolved: true,
      tags: ['saas', 'pricing', 'b2b'],
      time: 'hace 5 horas'
    },
    {
      id: 3,
      title: '¿Cómo validar product-market fit en LATAM?',
      author: 'Ana Rodríguez',
      avatar: 'A',
      category: 'marketing',
      views: 2103,
      answers: 15,
      upvotes: 47,
      isResolved: false,
      tags: ['pmf', 'latam', 'validación'],
      time: 'hace 1 día'
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
        <div className="fixed inset-0 z-0">
          <canvas ref={canvasRef} className="particles-canvas"></canvas>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <section className="pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center space-x-2 bg-[#70B5E2]/20 backdrop-blur-sm text-[#70B5E2] px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-[#70B5E2]/30">
                  <FaQuestionCircle />
                  <span>2,847 preguntas activas</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Preguntas & Respuestas
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Resuelve dudas, comparte experiencia y aprende con expertos de la industria
                </p>
              </motion.div>

              {/* Search & Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar preguntas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#70B5E2] transition-all"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#70B5E2] transition-all"
                >
                  <option value="recientes" className="bg-[#293A49]">Más recientes</option>
                  <option value="populares" className="bg-[#293A49]">Más populares</option>
                  <option value="resueltas" className="bg-[#293A49]">Resueltas</option>
                  <option value="sinrespuesta" className="bg-[#293A49]">Sin respuesta</option>
                </select>

                <button className="bg-gradient-to-r from-[#70B5E2] to-[#37B6FF] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                  <FaPlus />
                  <span>Nueva Pregunta</span>
                </button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-3 mb-12">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategory(cat.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      filterCategory === cat.id
                        ? 'bg-gradient-to-r from-[#70B5E2] to-[#37B6FF] text-white shadow-lg'
                        : 'bg-white/10 backdrop-blur-sm text-gray-300 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Questions List */}
          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <motion.div
                    key={q.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-[#70B5E2] to-[#37B6FF] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {q.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title & Status */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-xl font-semibold text-white group-hover:text-[#70B5E2] transition-colors">
                            {q.title}
                          </h3>
                          {q.isResolved && (
                            <span className="flex items-center space-x-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0">
                              <FaCheckCircle />
                              <span>Resuelta</span>
                            </span>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                          <span>{q.author}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <FaClock className="text-xs" />
                            {q.time}
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {q.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-white/10 text-gray-300 px-3 py-1 rounded-lg text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-gray-400">
                          <span className="flex items-center gap-2 hover:text-[#70B5E2] transition-colors cursor-pointer">
                            <FaThumbsUp />
                            <span className="text-sm font-medium">{q.upvotes}</span>
                          </span>
                          <span className="flex items-center gap-2 hover:text-[#37B6FF] transition-colors cursor-pointer">
                            <FaComment />
                            <span className="text-sm font-medium">{q.answers} respuestas</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <FaEye />
                            <span className="text-sm font-medium">{q.views} vistas</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default QnAPage;
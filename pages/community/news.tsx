// pages/community/news.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaNewspaper,
  FaClock,
  FaBookmark,
  FaShare,
  FaEye,
  FaFire,
  FaChevronRight,
} from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';

type BGParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
};

type FaviconParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
};

const NewsPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('todas');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // HiDPI support
    const setCanvasSize = () => {
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setCanvasSize();

    const img = new Image();
    img.src = '/favicon.png';

    const backgroundParticles: BGParticle[] = [];
    const faviconParticles: FaviconParticle[] = [];

    const bgCount = 200;
    for (let i = 0; i < bgCount; i++) {
      backgroundParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: 5,
        vy: 0,
        size: 3,
        opacity: 1,
      });
    }

    let imageLoaded = false;

    img.onload = () => {
      imageLoaded = true;
      faviconParticles.push({
        x: -100,
        y: window.innerHeight * 0.55,
        vx: 10,
        vy: 0,
        size: 80,
        rotation: Math.random() * 360,
        rotationSpeed: 10,
      });
    };

    const addFaviconInterval = setInterval(() => {
      if (!imageLoaded) return;
      faviconParticles.push({
        x: -100,
        y: Math.random() * window.innerHeight,
        vx: 10,
        vy: 0,
        size: 80,
        rotation: Math.random() * 360,
        rotationSpeed: 10,
      });
    }, 7000);

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // BG particles
      for (let i = 0; i < backgroundParticles.length; i++) {
        const p = backgroundParticles[i];
        p.x += p.vx;
        if (p.x > window.innerWidth) {
          p.x = 0;
          p.y = Math.random() * window.innerHeight;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Favicon particles (iterate backwards to safely splice)
      if (imageLoaded) {
        for (let i = faviconParticles.length - 1; i >= 0; i--) {
          const p = faviconParticles[i];
          p.x += p.vx;
          p.rotation += p.rotationSpeed;
          if (p.x > window.innerWidth + 100) {
            faviconParticles.splice(i, 1);
            continue;
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () => setCanvasSize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(addFaviconInterval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const categories = [
    { id: 'todas', name: 'Todas' },
    { id: 'tendencias', name: 'Tendencias' },
    { id: 'startups', name: 'Startups' },
    { id: 'ia', name: 'IA & Tech' },
    { id: 'finanzas', name: 'Finanzas' },
  ];

  const articles = [
    {
      id: 1,
      title: 'El boom de la IA generativa en LATAM: Oportunidades para startups',
      excerpt:
        'Descubre cómo las startups latinoamericanas están aprovechando la IA generativa para revolucionar sus industrias...',
      category: 'ia',
      readTime: '5 min',
      views: 3847,
      image:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      author: 'TechCrunch LATAM',
      date: 'Hace 2 horas',
      isTrending: true,
    },
    {
      id: 2,
      title: 'Nuevas regulaciones fintech en México: Lo que debes saber',
      excerpt:
        'Las autoridades mexicanas anuncian cambios importantes en la regulación de servicios financieros digitales...',
      category: 'finanzas',
      readTime: '8 min',
      views: 2134,
      image:
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
      author: 'Bloomberg LATAM',
      date: 'Hace 4 horas',
      isTrending: false,
    },
    {
      id: 3,
      title:
        'Startup brasileña levanta $50M Serie B para expansión regional',
      excerpt:
        'La plataforma de e-commerce B2B logra una ronda liderada por Sequoia Capital...',
      category: 'startups',
      readTime: '6 min',
      views: 5621,
      image:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
      author: 'Forbes',
      date: 'Hace 6 horas',
      isTrending: true,
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

      <div
        className="min-h-screen relative overflow-hidden bg-[#000000]"
        style={{
          fontFamily:
            'Avenir, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
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
                <div className="inline-flex items-center space-x-2 bg-[#37B6FF]/20 backdrop-blur-sm text-[#37B6FF] px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-[#37B6FF]/30">
                  <FaFire />
                  <span>156 artículos esta semana</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Noticias & Tendencias
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Mantente al día con las últimas tendencias y cambios que
                  impactan tu industria
                </p>
              </motion.div>

              {/* Categories */}
              <div className="flex flex-wrap gap-3 justify-center mb-12">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-[#37B6FF] to-[#70B5E2] text-white shadow-lg'
                        : 'bg-white/10 backdrop-blur-sm text-gray-300 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Article */}
          <section className="pb-12">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 group cursor-pointer"
              >
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <FiTrendingUp />
                    Destacado
                  </span>
                </div>

                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative h-80 lg:h-auto overflow-hidden">
                    <img
                      src={articles[0].image}
                      alt={articles[0].title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <span>{articles[0].author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-xs" />
                        {articles[0].date}
                      </span>
                      <span>•</span>
                      <span>{articles[0].readTime} lectura</span>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-[#37B6FF] transition-colors">
                      {articles[0].title}
                    </h2>

                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {articles[0].excerpt}
                    </p>

                    <div className="flex items-center gap-6 text-gray-400">
                      <span className="flex items-center gap-2">
                        <FaEye />
                        <span className="text-sm">
                          {articles[0].views.toLocaleString()} vistas
                        </span>
                      </span>
                      <button className="flex items-center gap-2 hover:text-[#37B6FF] transition-colors">
                        <FaBookmark />
                        <span className="text-sm">Guardar</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-[#70B5E2] transition-colors">
                        <FaShare />
                        <span className="text-sm">Compartir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Articles Grid */}
          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(1).map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 group cursor-pointer"
                  >
                    {article.isTrending && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
                          <FaFire />
                          Trending
                        </span>
                      </div>
                    )}

                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#37B6FF] transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FaEye />
                          {article.views.toLocaleString()}
                        </span>
                        <button className="text-[#37B6FF] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Leer más
                          <FaChevronRight className="text-xs" />
                        </button>
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

export default NewsPage;

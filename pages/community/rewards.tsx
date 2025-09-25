// pages/community/rewards.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaGift,
  FaTrophy,
  FaStar,
  FaMedal,
  FaCrown,
  FaFire,
  FaArrowUp,
  FaCheckCircle,
  FaLock,
  FaBolt,
} from 'react-icons/fa';

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

const RewardsPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  const [userPoints, setUserPoints] = useState<number>(1247);
  const [userLevel, setUserLevel] = useState<number>(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // HiDPI rendering
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
      // Background
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

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(addFaviconInterval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const achievements = [
    {
      id: 1,
      title: 'Primer Paso',
      desc: 'Completa tu perfil',
      icon: <FaCheckCircle />,
      points: 50,
      unlocked: true,
      color: 'from-green-400 to-emerald-500',
    },
    {
      id: 2,
      title: 'Experto Colaborador',
      desc: 'Responde 10 preguntas',
      icon: <FaStar />,
      points: 100,
      unlocked: true,
      color: 'from-yellow-400 to-orange-500',
    },
    {
      id: 3,
      title: 'Networker Pro',
      desc: 'Asiste a 5 eventos',
      icon: <FaTrophy />,
      points: 200,
      unlocked: false,
      progress: 60,
      color: 'from-blue-400 to-cyan-500',
    },
    {
      id: 4,
      title: 'Influencer',
      desc: 'Consigue 1000 upvotes',
      icon: <FaCrown />,
      points: 500,
      unlocked: false,
      progress: 30,
      color: 'from-purple-400 to-pink-500',
    },
  ];

  const rewards = [
    {
      id: 1,
      title: '30min Mentoría Premium',
      desc: 'Sesión 1:1 con un experto verificado',
      points: 500,
      icon: <FaStar />,
      available: true,
      claimed: 234,
    },
    {
      id: 2,
      title: 'Acceso VIP Eventos',
      desc: 'Acceso prioritario a todos los eventos del mes',
      points: 1000,
      icon: <FaCrown />,
      available: true,
      claimed: 89,
    },
    {
      id: 3,
      title: 'Badge Verificado',
      desc: 'Insignia de miembro verificado en tu perfil',
      points: 1500,
      icon: <FaCheckCircle />,
      available: false,
      claimed: 45,
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Carlos Méndez', points: 4823, avatar: 'C' },
    { rank: 2, name: 'Ana García', points: 3912, avatar: 'A' },
    { rank: 3, name: 'Luis Torres', points: 3401, avatar: 'L' },
    { rank: 4, name: 'María López', points: 2847, avatar: 'M' },
    { rank: 5, name: 'Tú', points: userPoints, avatar: 'T', isUser: true },
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
        style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        <div className="fixed inset-0 z-0">
          <canvas ref={canvasRef} className="particles-canvas" />
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
                  <span>847 miembros premiados</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Recompensas & Logros
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Gana puntos por contribuir, desbloquea beneficios y accede a mentorías premium
                </p>
              </motion.div>

              {/* User Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-[#70B5E2] to-[#37B6FF] rounded-2xl p-6 text-center text-white"
                >
                  <div className="text-4xl mb-2">
                    <FaBolt />
                  </div>
                  <div className="text-3xl font-bold mb-1">{userPoints}</div>
                  <div className="text-sm opacity-90">Puntos Totales</div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center text-white"
                >
                  <div className="text-4xl mb-2 text-[#70B5E2]">
                    <FaMedal />
                  </div>
                  <div className="text-3xl font-bold mb-1">Nivel {userLevel}</div>
                  <div className="text-sm text-gray-300">Rango Actual</div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center text-white"
                >
                  <div className="text-4xl mb-2 text-[#37B6FF]">
                    <FaTrophy />
                  </div>
                  <div className="text-3xl font-bold mb-1">8/12</div>
                  <div className="text-sm text-gray-300">Logros Desbloqueados</div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Achievements */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaTrophy className="text-[#70B5E2]" />
                    Logros
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative rounded-2xl p-6 ${
                          achievement.unlocked
                            ? 'bg-white/10 backdrop-blur-sm border border-white/20'
                            : 'bg-white/5 backdrop-blur-sm border border-white/10 opacity-60'
                        }`}
                      >
                        {!achievement.unlocked && (
                          <div className="absolute top-4 right-4">
                            <FaLock className="text-gray-500" />
                          </div>
                        )}

                        <div
                          className={`text-4xl mb-4 bg-gradient-to-br ${achievement.color} bg-clip-text text-transparent`}
                        >
                          {achievement.icon}
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
                        <p className="text-sm text-gray-400 mb-3">{achievement.desc}</p>

                        {achievement.unlocked ? (
                          <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                            <FaCheckCircle />
                            <span>+{achievement.points} puntos</span>
                          </div>
                        ) : achievement.progress !== undefined ? (
                          <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progreso</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className={`bg-gradient-to-r ${achievement.color} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">{achievement.points} puntos</div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Rewards */}
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaGift className="text-[#37B6FF]" />
                    Canjear Recompensas
                  </h2>

                  <div className="space-y-4">
                    {rewards.map((reward, index) => (
                      <motion.div
                        key={reward.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#70B5E2] to-[#37B6FF] rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                            {reward.icon}
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">{reward.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">{reward.desc}</p>
                            <div className="text-xs text-gray-500">
                              {reward.claimed} personas lo han canjeado
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-bold text-[#70B5E2] mb-2">{reward.points}</div>
                            <button
                              disabled={!reward.available || userPoints < reward.points}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                reward.available && userPoints >= reward.points
                                  ? 'bg-gradient-to-r from-[#70B5E2] to-[#37B6FF] text-white hover:shadow-lg transform hover:scale-105'
                                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {!reward.available
                                ? 'Bloqueado'
                                : userPoints < reward.points
                                ? 'Insuficiente'
                                : 'Canjear'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Leaderboard */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <FaTrophy className="text-yellow-400" />
                    Top Contribuidores
                  </h2>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <div className="space-y-4">
                      {leaderboard.map((user, index) => (
                        <motion.div
                          key={user.rank}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                            (user as any).isUser
                              ? 'bg-gradient-to-r from-[#70B5E2]/20 to-[#37B6FF]/20 border border-[#70B5E2]/30'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              user.rank === 1
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                                : user.rank === 2
                                ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                                : user.rank === 3
                                ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                                : 'bg-white/10 text-gray-400'
                            }`}
                          >
                            {user.rank}
                          </div>

                          <div className="w-10 h-10 bg-gradient-to-br from-[#70B5E2] to-[#37B6FF] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {user.avatar}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold ${(user as any).isUser ? 'text-[#70B5E2]' : 'text-white'}`}>
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-400">{user.points.toLocaleString()} puntos</div>
                          </div>

                          {user.rank <= 3 && (
                            <div className="text-xl">{user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}</div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                      <p className="text-sm text-gray-400 mb-2">¿Quieres subir en el ranking?</p>
                      <button className="text-[#37B6FF] text-sm font-semibold hover:text-[#70B5E2] transition-colors flex items-center gap-1 mx-auto">
                        <span>Descubre cómo ganar más puntos</span>
                        <FaArrowUp className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* How to Earn Points */}
                  <div className="mt-6 bg-gradient-to-br from-[#293A49] to-[#37B6FF]/20 backdrop-blur-sm border border-[#37B6FF]/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <FaBolt className="text-[#37B6FF]" />
                      Gana Puntos
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-8 h-8 bg-[#37B6FF]/20 rounded-lg flex items-center justify-center text-[#37B6FF] font-bold flex-shrink-0">
                          +10
                        </div>
                        <span>Por cada respuesta útil</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-8 h-8 bg-[#70B5E2]/20 rounded-lg flex items-center justify-center text-[#70B5E2] font-bold flex-shrink-0">
                          +25
                        </div>
                        <span>Por asistir a eventos</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 font-bold flex-shrink-0">
                          +50
                        </div>
                        <span>Por respuesta aceptada</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default RewardsPage;

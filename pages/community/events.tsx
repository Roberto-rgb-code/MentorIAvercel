// pages/community/events.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUsers,
  FaVideo,
  FaStar,
  FaTicketAlt,
  FaCheckCircle,
  FaFire
} from 'react-icons/fa';

const EventsPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedType, setSelectedType] = useState('todos');

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

  const eventTypes = [
    { id: 'todos', name: 'Todos' },
    { id: 'workshops', name: 'Workshops' },
    { id: 'meetups', name: 'Meetups' },
    { id: 'webinars', name: 'Webinars' },
    { id: 'networking', name: 'Networking' },
  ];

  const events = [
    {
      id: 1,
      title: 'Pitch Night: Conecta con Inversionistas',
      type: 'networking',
      date: '15 Oct 2025',
      time: '18:00 - 21:00',
      location: 'Ciudad de México',
      mode: 'Presencial',
      attendees: 47,
      maxAttendees: 50,
      price: 'Gratis',
      host: 'MentHIA',
      hostAvatar: 'M',
      featured: true,
      tags: ['Inversión', 'Networking', 'Startups']
    },
    {
      id: 2,
      title: 'Workshop: Growth Hacking para SaaS',
      type: 'workshops',
      date: '18 Oct 2025',
      time: '16:00 - 19:00',
      location: 'Online',
      mode: 'Virtual',
      attendees: 124,
      maxAttendees: 200,
      price: '$299 MXN',
      host: 'Carlos Méndez',
      hostAvatar: 'C',
      featured: false,
      tags: ['Marketing', 'SaaS', 'Growth']
    },
    {
      id: 3,
      title: 'Meetup: IA en el Emprendimiento',
      type: 'meetups',
      date: '20 Oct 2025',
      time: '19:00 - 22:00',
      location: 'Guadalajara',
      mode: 'Presencial',
      attendees: 28,
      maxAttendees: 30,
      price: 'Gratis',
      host: 'Tech Community GDL',
      hostAvatar: 'T',
      featured: true,
      tags: ['IA', 'Tech', 'Comunidad']
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
                  <FaCalendarAlt />
                  <span>12 eventos próximos</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Eventos & Networking
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Meetups exclusivos, workshops y sesiones en vivo con líderes de la industria
                </p>
              </motion.div>

              {/* Event Types */}
              <div className="flex flex-wrap gap-3 justify-center mb-12">
                {eventTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                      selectedType === type.id
                        ? 'bg-gradient-to-r from-[#70B5E2] to-[#37B6FF] text-white shadow-lg'
                        : 'bg-white/10 backdrop-blur-sm text-gray-300 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Events List */}
          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 group"
                  >
                    {event.featured && (
                      <div className="bg-gradient-to-r from-[#70B5E2] to-[#37B6FF] px-4 py-2">
                        <div className="flex items-center gap-2 text-white text-sm font-semibold">
                          <FaStar />
                          <span>Evento Destacado</span>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#70B5E2] transition-colors">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="text-xs" />
                              {event.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <FaClock className="text-xs" />
                              {event.time}
                            </span>
                          </div>
                        </div>

                        <div className="w-12 h-12 bg-gradient-to-br from-[#70B5E2] to-[#37B6FF] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {event.hostAvatar}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3 text-gray-300">
                          {event.mode === 'Virtual' ? (
                            <FaVideo className="text-[#37B6FF]" />
                          ) : (
                            <FaMapMarkerAlt className="text-[#70B5E2]" />
                          )}
                          <span className="text-sm">{event.location}</span>
                          <span className="bg-white/10 px-2 py-1 rounded text-xs">{event.mode}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-300">
                          <FaUsers className="text-[#37B6FF]" />
                          <span className="text-sm">
                            {event.attendees}/{event.maxAttendees} asistentes
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-white/10 text-gray-300 px-3 py-1 rounded-lg text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <div className="text-sm text-gray-400">Precio</div>
                          <div className="text-lg font-bold text-[#70B5E2]">{event.price}</div>
                        </div>

                        <button className="bg-gradient-to-r from-[#70B5E2] to-[#37B6FF] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                          <FaTicketAlt />
                          <span>Registrarse</span>
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

export default EventsPage;
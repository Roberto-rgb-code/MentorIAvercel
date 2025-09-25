// components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="text-white relative overflow-hidden"
      style={{ 
        backgroundColor: '#293A49',
        fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Background decorativo */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #37B6FF 0%, transparent 50%), 
                           radial-gradient(circle at 80% 20%, #7085E2 0%, transparent 50%), 
                           radial-gradient(circle at 40% 80%, #37B6FF 0%, transparent 50%)`
        }}
      />
      
      <div className="relative z-10">
        {/* Contenido principal */}
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 pt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 xl:gap-32">
            
            {/* Brand Section - Más prominente */}
            <div className="lg:col-span-4 xl:col-span-4">
              <div className="space-y-6">
                {/* Logo mejorado */}
                <div className="flex items-center group">
                  <div 
                    className="p-4 rounded-2xl mr-4 shadow-lg transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #37B6FF 0%, #7085E2 100%)',
                      boxShadow: '0 8px 32px rgba(55, 182, 255, 0.25)'
                    }}
                  >
                    <span 
                      className="text-white font-bold text-2xl"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      M
                    </span>
                  </div>
                  <div>
                    <h2 
                      className="text-3xl font-bold text-white"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      MentHIA
                    </h2>
                    <p 
                      className="text-sm font-medium"
                      style={{ 
                        color: '#37B6FF',
                        fontFamily: 'Avenir, sans-serif'
                      }}
                    >
                      Inteligencia + Humanidad
                    </p>
                  </div>
                </div>

                {/* Descripción mejorada */}
                <div className="space-y-4">
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ 
                      color: '#B8C5D1',
                      fontFamily: 'Avenir, sans-serif',
                      lineHeight: '1.7'
                    }}
                  >
                    <span className="font-semibold text-white">Asesoría integral, humana e inteligente</span> para tu negocio.
                  </p>
                  <p 
                    className="leading-relaxed"
                    style={{ 
                      color: '#8B9AAB',
                      fontFamily: 'Avenir, sans-serif',
                      lineHeight: '1.6'
                    }}
                  >
                    Mentores expertos + IA para escalar tu empresa con decisiones 
                    más rápidas y rentables. Construyendo el futuro juntos.
                  </p>
                </div>

                {/* Redes sociales mejoradas */}
                <div className="flex space-x-5 pt-2">
                  {[
                    { icon: "facebook", href: "#" },
                    { icon: "twitter", href: "#" },
                    { icon: "linkedin", href: "#" },
                    { icon: "instagram", href: "#" }
                  ].map((social, index) => (
                    <a 
                      key={index}
                      href={social.href} 
                      className="group relative"
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{ 
                          backgroundColor: 'rgba(55, 182, 255, 0.1)',
                          border: '1px solid rgba(55, 182, 255, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(55, 182, 255, 0.2)';
                          e.currentTarget.style.borderColor = '#37B6FF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(55, 182, 255, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(55, 182, 255, 0.2)';
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" style={{ color: '#37B6FF' }} viewBox="0 0 24 24">
                          {social.icon === "facebook" && (
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                          )}
                          {social.icon === "twitter" && (
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          )}
                          {social.icon === "linkedin" && (
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          )}
                          {social.icon === "instagram" && (
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.004 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.205-1.529l1.714-1.297c.394.486.994.811 1.673.811.72 0 1.351-.378 1.719-.944l1.663 1.378c-.72 1.134-1.996 1.897-3.382 1.897v-.316zm7.519 0c-1.386 0-2.662-.763-3.382-1.897l1.663-1.378c.368.566.999.944 1.719.944.679 0 1.279-.325 1.673-.811l1.714 1.297c-.757.933-1.908 1.529-3.205 1.529l-.182.316z"/>
                          )}
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="lg:col-span-8 xl:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 xl:gap-20">
                
                {/* Servicios */}
                <div className="space-y-6">
                  <h3 
                    className="text-lg font-bold text-white relative"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    <span className="relative z-10">Servicios</span>
                    <div 
                      className="absolute bottom-0 left-0 w-8 h-0.5 rounded-full"
                      style={{ backgroundColor: '#37B6FF' }}
                    />
                  </h3>
                  <nav className="space-y-4">
                    {[
                      { href: "/services", label: "Servicios" },
                      { href: "/dashboard/plans", label: "Planes" },
                      { href: "/dashboard/mentoria", label: "Mentoría" },
                      { href: "/dashboard/cursos", label: "Cursos" }
                    ].map((item, index) => (
                      <Link 
                        key={index}
                        href={item.href} 
                        className="group flex items-center space-x-2 transition-all duration-300"
                      >
                        <div 
                          className="w-1 h-1 rounded-full transition-all duration-300"
                          style={{ backgroundColor: '#37B6FF' }}
                        />
                        <span 
                          className="text-sm transition-colors duration-300 group-hover:translate-x-1"
                          style={{ 
                            color: '#B8C5D1',
                            fontFamily: 'Avenir, sans-serif'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#37B6FF'}
                          onMouseLeave={(e) => e.target.style.color = '#B8C5D1'}
                        >
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Comunidad */}
                <div className="space-y-6">
                  <h3 
                    className="text-lg font-bold text-white relative"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    <span className="relative z-10">Comunidad</span>
                    <div 
                      className="absolute bottom-0 left-0 w-8 h-0.5 rounded-full"
                      style={{ backgroundColor: '#7085E2' }}
                    />
                  </h3>
                  <nav className="space-y-4">
                    {[
                      { href: "/community", label: "Comunidad" },
                      { href: "/eventos", label: "Eventos" },
                      { href: "/blog", label: "Blog" },
                      { href: "/recursos", label: "Recursos" }
                    ].map((item, index) => (
                      <Link 
                        key={index}
                        href={item.href} 
                        className="group flex items-center space-x-2 transition-all duration-300"
                      >
                        <div 
                          className="w-1 h-1 rounded-full transition-all duration-300"
                          style={{ backgroundColor: '#7085E2' }}
                        />
                        <span 
                          className="text-sm transition-colors duration-300 group-hover:translate-x-1"
                          style={{ 
                            color: '#B8C5D1',
                            fontFamily: 'Avenir, sans-serif'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#7085E2'}
                          onMouseLeave={(e) => e.target.style.color = '#B8C5D1'}
                        >
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Soporte */}
                <div className="space-y-6">
                  <h3 
                    className="text-lg font-bold text-white relative"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    <span className="relative z-10">Soporte</span>
                    <div 
                      className="absolute bottom-0 left-0 w-8 h-0.5 rounded-full"
                      style={{ backgroundColor: '#37B6FF' }}
                    />
                  </h3>
                  <nav className="space-y-4">
                    <Link 
                      href="/dashboard/ayuda" 
                      className="group flex items-center space-x-2 transition-all duration-300"
                    >
                      <div 
                        className="w-1 h-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#37B6FF' }}
                      />
                      <span 
                        className="text-sm transition-colors duration-300 group-hover:translate-x-1"
                        style={{ 
                          color: '#B8C5D1',
                          fontFamily: 'Avenir, sans-serif'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#37B6FF'}
                        onMouseLeave={(e) => e.target.style.color = '#B8C5D1'}
                      >
                        Centro de ayuda
                      </span>
                    </Link>
                    <a 
                      href="mailto:soporte@menthia.com" 
                      className="group flex items-center space-x-2 transition-all duration-300"
                    >
                      <div 
                        className="w-1 h-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#37B6FF' }}
                      />
                      <span 
                        className="text-sm transition-colors duration-300 group-hover:translate-x-1"
                        style={{ 
                          color: '#B8C5D1',
                          fontFamily: 'Avenir, sans-serif'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#37B6FF'}
                        onMouseLeave={(e) => e.target.style.color = '#B8C5D1'}
                      >
                        Contacto
                      </span>
                    </a>
                    <Link 
                      href="/politicas" 
                      className="group flex items-center space-x-2 transition-all duration-300"
                    >
                      <div 
                        className="w-1 h-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#37B6FF' }}
                      />
                      <span 
                        className="text-sm transition-colors duration-300 group-hover:translate-x-1"
                        style={{ 
                          color: '#B8C5D1',
                          fontFamily: 'Avenir, sans-serif'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#37B6FF'}
                        onMouseLeave={(e) => e.target.style.color = '#B8C5D1'}
                      >
                        Políticas
                      </span>
                    </Link>
                    <Link 
                      href="/terminos" 
                      className="group flex items-center space-x-2 transition-all duration-300"
                    >
                      <div 
                        className="w-1 h-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#37B6FF' }}
                      />
                      <span 
                        className="text-sm transition-colors duration-300 group-hover:translate-x-1"
                        style={{ 
                          color: '#B8C5D1',
                          fontFamily: 'Avenir, sans-serif'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#37B6FF'}
                        onMouseLeave={(e) => e.target.style.color = '#B8C5D1'}
                      >
                        Términos
                      </span>
                    </Link>
                    <Link 
                      href="/privacidad" 
                      className="group flex items-center space-x-2 transition-all duration-300"
                    >
                      <div 
                        className="w-1 h-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: '#37B6FF' }}
                      />
                      <span 
                        className="text-sm transition-colors duration-300 group-hover:translate-x-1"
                        style={{ 
                          color: '#B8C5D1',
                          fontFamily: 'Avenir, sans-serif'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#37B6FF'}
                        onMouseLeave={(e) => e.target.style.color = '#B8C5D1'}
                      >
                        Privacidad
                      </span>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom mejorado */}
        <div 
          className="border-t"
          style={{ 
            borderColor: 'rgba(55, 182, 255, 0.1)',
            background: 'linear-gradient(90deg, rgba(55, 182, 255, 0.05) 0%, rgba(112, 133, 226, 0.05) 100%)'
          }}
        >
          <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#37B6FF' }}
                />
                <p 
                  className="text-sm font-medium"
                  style={{ 
                    color: '#8B9AAB',
                    fontFamily: 'Avenir, sans-serif'
                  }}
                >
                  © {currentYear} MentHIA - Asesoría integral, humana e inteligente
                </p>
              </div>
              <div className="flex items-center space-x-8">
                <Link 
                  href="/privacidad" 
                  className="text-sm font-medium transition-colors duration-300"
                  style={{ 
                    color: '#8B9AAB',
                    fontFamily: 'Avenir, sans-serif'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#37B6FF'}
                  onMouseLeave={(e) => e.target.style.color = '#8B9AAB'}
                >
                  Privacidad
                </Link>
                <Link 
                  href="/terminos" 
                  className="text-sm font-medium transition-colors duration-300"
                  style={{ 
                    color: '#8B9AAB',
                    fontFamily: 'Avenir, sans-serif'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#37B6FF'}
                  onMouseLeave={(e) => e.target.style.color = '#8B9AAB'}
                >
                  Términos
                </Link>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: '#37B6FF' }}
                  />
                  <span 
                    className="text-xs font-medium"
                    style={{ 
                      color: '#37B6FF',
                      fontFamily: 'Avenir, sans-serif'
                    }}
                  >
                    En línea
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
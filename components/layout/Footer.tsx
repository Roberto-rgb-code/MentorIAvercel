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
                           radial-gradient(circle at 80% 20%, #70B5E2 0%, transparent 50%), 
                           radial-gradient(circle at 40% 80%, #37B6FF 0%, transparent 50%)`
        }}
      />
      
      <div className="relative z-10">
        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 pt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
            
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="space-y-6">
                {/* Logo */}
                <div className="flex items-center group">
                  <div 
                    className="p-4 rounded-2xl mr-4 shadow-lg transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #37B6FF 0%, #70B5E2 100%)',
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

                {/* Descripción */}
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

                {/* Redes sociales */}
                <div className="flex space-x-5 pt-2">
                  {[
                    { 
                      icon: (
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      ), 
                      href: "#" 
                    },
                    { 
                      icon: (
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      ), 
                      href: "#" 
                    },
                    { 
                      icon: (
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      ), 
                      href: "#" 
                    },
                    { 
                      icon: (
                        <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.747.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" clipRule="evenodd" />
                      ), 
                      href: "#" 
                    }
                  ].map((social, index) => (
                    <a 
                      key={index}
                      href={social.href} 
                      className="group relative"
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-opacity-20"
                        style={{ 
                          backgroundColor: 'rgba(55, 182, 255, 0.1)',
                          border: '1px solid rgba(55, 182, 255, 0.2)'
                        }}
                      >
                        <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          {social.icon}
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
                
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
                        className="group flex items-center space-x-2 transition-all duration-300 hover:translate-x-1"
                      >
                        <div 
                          className="w-1 h-1 rounded-full transition-all duration-300"
                          style={{ backgroundColor: '#37B6FF' }}
                        />
                        <span 
                          className="text-sm transition-colors duration-300 text-gray-300 group-hover:text-blue-400"
                          style={{ fontFamily: 'Avenir, sans-serif' }}
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
                      style={{ backgroundColor: '#70B5E2' }}
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
                        className="group flex items-center space-x-2 transition-all duration-300 hover:translate-x-1"
                      >
                        <div 
                          className="w-1 h-1 rounded-full transition-all duration-300"
                          style={{ backgroundColor: '#70B5E2' }}
                        />
                        <span 
                          className="text-sm transition-colors duration-300 text-gray-300 group-hover:text-blue-400"
                          style={{ fontFamily: 'Avenir, sans-serif' }}
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
                    {[
                      { href: "/dashboard/ayuda", label: "Centro de ayuda" },
                      { href: "mailto:soporte@menthia.com", label: "Contacto" },
                      { href: "/politicas", label: "Políticas" },
                      { href: "/terminos", label: "Términos" },
                      { href: "/privacidad", label: "Privacidad" }
                    ].map((item, index) => (
                      item.href.startsWith('mailto:') ? (
                        <a 
                          key={index}
                          href={item.href} 
                          className="group flex items-center space-x-2 transition-all duration-300 hover:translate-x-1"
                        >
                          <div 
                            className="w-1 h-1 rounded-full transition-all duration-300"
                            style={{ backgroundColor: '#37B6FF' }}
                          />
                          <span 
                            className="text-sm transition-colors duration-300 text-gray-300 group-hover:text-blue-400"
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          >
                            {item.label}
                          </span>
                        </a>
                      ) : (
                        <Link 
                          key={index}
                          href={item.href} 
                          className="group flex items-center space-x-2 transition-all duration-300 hover:translate-x-1"
                        >
                          <div 
                            className="w-1 h-1 rounded-full transition-all duration-300"
                            style={{ backgroundColor: '#37B6FF' }}
                          />
                          <span 
                            className="text-sm transition-colors duration-300 text-gray-300 group-hover:text-blue-400"
                            style={{ fontFamily: 'Avenir, sans-serif' }}
                          >
                            {item.label}
                          </span>
                        </Link>
                      )
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div 
          className="border-t"
          style={{ 
            borderColor: 'rgba(55, 182, 255, 0.1)',
            background: 'linear-gradient(90deg, rgba(55, 182, 255, 0.05) 0%, rgba(112, 133, 226, 0.05) 100%)'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-8">
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
                  className="text-sm font-medium transition-colors duration-300 text-gray-400 hover:text-blue-400"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Privacidad
                </Link>
                <Link 
                  href="/terminos" 
                  className="text-sm font-medium transition-colors duration-300 text-gray-400 hover:text-blue-400"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
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
// pages/dashboard/plans.tsx
import React from "react";
import Link from "next/link";
import PrivateLayout from "@/components/layout/PrivateLayout";

// Puedes gestionar estas features como datos para mantener el JSX limpio
const planFeatures = {
  basic: [
    { text: "Mentoría grupal", icon: "👥" },
    { text: "Acceso a recursos básicos", icon: "📚" },
    { text: "Soporte por correo electrónico", icon: "📧" },
  ],
  pro: [
    { text: "Mentoría 1:1 (2 sesiones/mes)", icon: "🤝" },
    { text: "Talleres exclusivos", icon: "💡" },
    { text: "Acceso a recursos avanzados", icon: "🌟" },
    { text: "Soporte prioritario", icon: "⚡" },
  ],
  empresa: [
    { text: "Mentoría 1:1 ilimitada", icon: "🚀" },
    { text: "Acceso completo a todos los recursos", icon: "💎" },
    { text: "Soporte premium 24/7", icon: "📞" },
    { text: "Sesiones estratégicas personalizadas", icon: "🎯" },
  ],
};

const Plans: React.FC = () => {
  return (
    <PrivateLayout>
      {/* Hero */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Elige el Plan Perfecto para Tu Éxito
          </h1>
          <p className="mt-6 text-lg md:text-xl opacity-90">
            Planes flexibles para impulsar tu emprendimiento, sin importar la etapa en la que estés.
          </p>
        </div>
      </section>

      {/* Cards de planes */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Básico */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Básico</h2>
                <p className="text-gray-600 mb-6">
                  Ideal para emprendedores que están dando sus primeros pasos.
                </p>
                <p className="text-5xl font-extrabold text-blue-700 mb-6">
                  $29<span className="text-xl font-medium text-gray-500">/mes</span>
                </p>
                <ul className="mt-6 space-y-4 text-gray-700">
                  {planFeatures.basic.map((f, i) => (
                    <li key={i} className="flex items-center text-lg">
                      <span className="text-blue-500 mr-3 text-2xl">{f.icon}</span>
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-10 block w-full bg-blue-600 text-white py-3.5 rounded-lg text-lg font-semibold hover:bg-blue-700 text-center transition-colors"
              >
                Empezar con Básico
              </Link>
            </div>

            {/* Pro (destacado) */}
            <div className="bg-white p-8 rounded-xl shadow-2xl border-4 border-blue-600 relative transform md:scale-105 md:z-10 flex flex-col justify-between">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-gray-900 text-xs md:text-sm font-bold py-1 px-4 rounded-full shadow-md">
                ¡Más Popular!
              </div>
              <div>
                <h2 className="text-3xl font-bold text-blue-700 mb-2">Pro</h2>
                <p className="text-gray-600 mb-6">
                  Perfecto para negocios que buscan escalar su crecimiento.
                </p>
                <p className="text-5xl font-extrabold text-blue-700 mb-6">
                  $59<span className="text-xl font-medium text-gray-500">/mes</span>
                </p>
                <ul className="mt-6 space-y-4 text-gray-700">
                  {planFeatures.pro.map((f, i) => (
                    <li key={i} className="flex items-center text-lg">
                      <span className="text-blue-500 mr-3 text-2xl">{f.icon}</span>
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-10 block w-full bg-blue-600 text-white py-3.5 rounded-lg text-lg font-semibold hover:bg-blue-700 text-center transition-colors"
              >
                Elegir Plan Pro
              </Link>
            </div>

            {/* Empresa */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Empresa</h2>
                <p className="text-gray-600 mb-6">
                  Para empresas establecidas que exigen soporte y mentoría ilimitada.
                </p>
                <p className="text-5xl font-extrabold text-blue-700 mb-6">
                  $99<span className="text-xl font-medium text-gray-500">/mes</span>
                </p>
                <ul className="mt-6 space-y-4 text-gray-700">
                  {planFeatures.empresa.map((f, i) => (
                    <li key={i} className="flex items-center text-lg">
                      <span className="text-blue-500 mr-3 text-2xl">{f.icon}</span>
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register"
                className="mt-10 block w-full bg-blue-600 text-white py-3.5 rounded-lg text-lg font-semibold hover:bg-blue-700 text-center transition-colors"
              >
                Solicitar Plan Empresa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA consulta */}
      <section className="py-16 bg-blue-500 text-white">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Aún tienes dudas sobre qué plan elegir?
          </h2>
          <p className="mt-4 text-lg md:text-xl opacity-90">
            Nuestro equipo te ayuda a encontrar la solución perfecta para tu negocio.
            Agenda una consulta gratuita y despeja todas tus inquietudes.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block bg-white text-blue-600 px-8 md:px-10 py-3.5 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition-all"
          >
            Agenda una Consulta Gratuita
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-8">
            <div className="border-b pb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                ¿Puedo cambiar de plan más adelante?
              </h3>
              <p className="text-gray-600">
                Sí, puedes mejorar o bajar de plan en cualquier momento desde tu panel. Los cambios se aplican de forma prorrateada.
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                ¿Hay compromiso a largo plazo?
              </h3>
              <p className="text-gray-600">
                Los planes son mensuales y puedes cancelar cuando quieras, sin penalizaciones.
              </p>
            </div>
            <div className="border-b pb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                ¿Qué tipo de soporte recibo?
              </h3>
              <p className="text-gray-600">
                Según tu plan, tendrás soporte por correo, prioritario o premium 24/7. Siempre respondemos rápido.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PrivateLayout>
  );
};

export default Plans;

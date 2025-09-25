// components/auth/Login.tsx
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { FaGoogle, FaFacebook, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

// Particles (sin THREE)
import Particles from "react-tsparticles";
import type { Engine, Container } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

// ===== Fondo con partículas =====
const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (_container?: Container) => {
    // no-op
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <Particles
        id="tsparticles-login"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fullScreen: { enable: false, zIndex: 0 },
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          detectRetina: true,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              push: { quantity: 2 },
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            number: { value: 120, density: { enable: true, area: 800 } },
            color: { value: ["#7085E2", "#37B6FF", "#293A49"] },
            links: {
              enable: true,
              color: "#7085E2",
              distance: 140,
              opacity: 0.3,
              width: 1,
            },
            move: { enable: true, speed: 0.6, outModes: { default: "bounce" } },
            opacity: { value: 0.4 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
        }}
        className="w-full h-full"
      />
    </div>
  );
};

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ===== Handlers =====
  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("¡Inicio de sesión exitoso!");
      router.push("/dashboard/inicio");
    } catch (err: any) {
      let msg = "Error al iniciar sesión. Verifica tus credenciales.";
      if (["auth/invalid-email", "auth/user-not-found", "auth/wrong-password"].includes(err?.code)) {
        msg = "Correo o contraseña incorrectos. Inténtalo de nuevo.";
      } else if (err?.code === "auth/network-request-failed") {
        msg = "Problema de conexión. Revisa tu internet.";
      } else if (err?.code === "auth/too-many-requests") {
        msg = "Demasiados intentos. Intenta más tarde o usa 'Olvidaste tu contraseña'.";
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: "google" | "facebook" | "apple") => {
    let provider;
    switch (providerName) {
      case "google":
        provider = new GoogleAuthProvider();
        break;
      case "facebook":
        provider = new FacebookAuthProvider();
        break;
      case "apple":
        provider = new OAuthProvider("apple.com");
        provider.addScope("email");
        provider.addScope("name");
        break;
    }

    setError("");
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success(`¡Inicio de sesión con ${providerName} exitoso!`);
      router.push("/dashboard/inicio");
    } catch (err: any) {
      let msg = `Error al iniciar sesión con ${providerName}.`;
      if (err?.code === "auth/network-request-failed") msg = "Problema de conexión. Revisa tu internet.";
      else if (err?.code === "auth/popup-closed-by-user") msg = "Cerraste la ventana de inicio de sesión.";
      else if (err?.code === "auth/cancelled-popup-request") msg = "Solicitud cancelada. Intenta de nuevo.";
      else if (err?.code === "auth/account-exists-with-different-credential")
        msg = "Ya existe una cuenta con ese correo y otro proveedor. Usa tu método original.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <ParticleBackground />

      {/* Degradé y blobs con colores de la marca */}
      <div className="absolute inset-0" style={{ 
        background: 'linear-gradient(135deg, #7085E2 0%, #37B6FF 50%, #293A49 100%)' 
      }} />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ background: 'radial-gradient(circle, rgba(112, 133, 226, 0.2) 0%, rgba(55, 182, 255, 0.2) 100%)' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000"
          style={{ background: 'radial-gradient(circle, rgba(55, 182, 255, 0.2) 0%, rgba(41, 58, 73, 0.2) 100%)' }}
        />
        <div 
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-2xl animate-pulse delay-500"
          style={{ background: 'radial-gradient(circle, rgba(112, 133, 226, 0.15) 0%, rgba(55, 182, 255, 0.15) 100%)' }}
        />
      </div>

      {/* Header con enlace a "/" */}
      <div className="relative z-10 pt-6 pl-8">
        <h1
          className="text-white text-2xl font-medium cursor-pointer hover:underline transition-all duration-200"
          onClick={() => router.push("/")}
          style={{ fontWeight: 500 }}
        >
          MenthIA
        </h1>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30">
            <div className="mb-8">
              <h2 className="text-2xl font-medium text-gray-900 mb-2" style={{ color: '#293A49' }}>
                Inicia sesión en tu cuenta
              </h2>
              <p className="text-gray-600 text-sm">
                Asesoría integral, humana e inteligente para tu negocio
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="email" style={{ color: '#293A49' }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-200"
                  style={{ 
                    borderColor: '#E5E7EB',
                    color: '#293A49',
                    fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7085E2'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  placeholder="ejemplo@dominio.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium" htmlFor="password" style={{ color: '#293A49' }}>
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push("/reset-password")}
                    className="text-sm transition-colors hover:underline"
                    style={{ color: '#7085E2' }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-200"
                    style={{ 
                      borderColor: '#E5E7EB',
                      color: '#293A49',
                      fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#7085E2'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                style={{ 
                  background: 'linear-gradient(135deg, #7085E2 0%, #37B6FF 100%)',
                  fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm font-medium">o</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200"
                style={{ 
                  color: '#293A49',
                  fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                <FaGoogle className="text-red-500 mr-3 text-lg" />
                Inicia sesión con Google
              </button>

              <button
                onClick={() => handleSocialLogin("facebook")}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200"
                style={{ 
                  color: '#293A49',
                  fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                <FaFacebook className="text-blue-600 mr-3 text-lg" />
                Inicia sesión con Facebook
              </button>

              <button
                onClick={() => handleSocialLogin("apple")}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200"
                style={{ 
                  color: '#293A49',
                  fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                <FaApple className="text-black mr-3 text-lg" />
                Inicia sesión con Apple
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600" style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="font-medium transition-colors hover:underline"
                  style={{ color: '#7085E2' }}
                >
                  Regístrate
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-6 px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center text-white/90 text-sm space-y-2 sm:space-y-0 sm:space-x-6"
             style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
          <span>© MenthIA</span>
          <button className="hover:text-white transition-colors">Privacidad y condiciones</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
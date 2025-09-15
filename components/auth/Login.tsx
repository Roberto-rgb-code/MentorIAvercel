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
            color: { value: ["#93C5FD", "#A5B4FC", "#C7D2FE"] },
            links: {
              enable: true,
              color: "#A5B4FC",
              distance: 140,
              opacity: 0.25,
              width: 1,
            },
            move: { enable: true, speed: 0.6, outModes: { default: "bounce" } },
            opacity: { value: 0.35 },
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
      router.push("/dashboard/inicio"); // ⬅️ siempre aquí
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
      router.push("/dashboard/inicio"); // ⬅️ también aquí
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <ParticleBackground />

      {/* Degradé y blobs translúcidos */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-cyan-400 via-sky-300 to-indigo-400" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Header con enlace a "/" */}
      <div className="relative z-10 pt-6 pl-8">
        <h1
          className="text-white text-2xl font-semibold cursor-pointer hover:underline"
          onClick={() => router.push("/")}
        >
          MenthIA
        </h1>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/20">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Inicia sesión en tu cuenta
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="ejemplo@dominio.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push("/reset-password")}
                    className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
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
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <FaGoogle className="text-red-500 mr-3 text-lg" />
                Inicia sesión con Google
              </button>

              <button
                onClick={() => handleSocialLogin("facebook")}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <FaFacebook className="text-blue-600 mr-3 text-lg" />
                Inicia sesión con Facebook
              </button>

              <button
                onClick={() => handleSocialLogin("apple")}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <FaApple className="text-black mr-3 text-lg" />
                Inicia sesión con Apple
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                ¿No tienes cuenta?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
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
        <div className="flex flex-col sm:flex-row items-center justify-center text-white/80 text-sm space-y-2 sm:space-y-0 sm:space-x-6">
          <span>© MenthIA</span>
          <button className="hover:text-white transition-colors">Privacidad y condiciones</button>
        </div>
      </div>
    </div>
  );
};

export default Login;

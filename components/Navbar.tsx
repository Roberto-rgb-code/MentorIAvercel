// components/Navbar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaTrashAlt,
} from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";

import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";

// -----------------------------------------------------------------------------
// Fallback inline: NotificationBell
// -----------------------------------------------------------------------------
type NotificationBellProps = {
  renderTrigger: (args: { count: number; onToggle: () => void }) => React.ReactNode;
};

function NotificationBell({ renderTrigger }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [items] = useState<Array<{ id: string; title: string; time: string }>>([]);

  const count = items.length;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      {renderTrigger({ count, onToggle: () => setOpen((s) => !s) })}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="text-sm font-semibold" style={{ color: '#293A49' }}>Notificaciones</div>
            <div className="text-xs text-gray-500">
              {count > 0 ? `${count} nueva(s)` : "Sin notificaciones"}
            </div>
          </div>
          <div className="max-h-80 overflow-auto divide-y">
            {items.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">Nada por ahora</div>
            ) : (
              items.map((n) => (
                <div key={n.id} className="p-3 hover:bg-blue-50 transition-colors">
                  <div className="text-sm" style={{ color: '#293A49' }}>{n.title}</div>
                  <div className="text-xs text-gray-500">{n.time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Navbar con diseño MentHIA + ocultamiento por scroll
// -----------------------------------------------------------------------------
const Navbar = () => {
  const { user, logout, loading } = useAuth?.() ?? { user: null, logout: async () => {}, loading: false };
  const router = useRouter();

  const {
    items = [],
    itemCount = 0,
    subtotalFormatted = "$0.00",
    removeItem = (_id: string) => {},
  } = useCart?.() ?? ({} as any);

  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // --- Cerrar overlays al hacer click fuera ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // --- Lógica de ocultamiento al hacer scroll ---
  const NAV_HEIGHT = 64; // px (h-16)
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const lastYRef = useRef(0);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    lastYRef.current = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = y - lastYRef.current;
          // Umbral para evitar jitter
          if (Math.abs(delta) > 6) {
            setScrollDir(delta > 0 ? "down" : "up");
            lastYRef.current = y;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // No ocultar si estás arriba (<=100) o si el menú móvil está abierto
  const shouldHide =
    typeof window !== "undefined" &&
    scrollDir === "down" &&
    window.scrollY > 100 &&
    !mobileMenuOpen;

  const handleLogout = async () => {
    setDropdownOpen(false);
    setIsLoggingOut(true);
    try {
      await logout();
      toast?.success?.("Sesión cerrada exitosamente.");
      router.push("/login");
    } catch (error) {
      console.error("Navbar: Error al cerrar sesión:", error);
      toast?.error?.("Error al cerrar sesión. Inténtalo de nuevo.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinkClasses = (href: string) =>
    `relative block px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
     ${
       router.pathname === href
         ? "text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg"
         : "text-white hover:text-cyan-300 hover:bg-white/10"
     }`;

  const getUserDisplayName = () => {
    const u = user as any;
    const display =
      (typeof u?.displayName === "string" && u.displayName) ||
      (typeof u?.name === "string" && u.name) ||
      (typeof u?.email === "string" && u.email?.split("@")[0]);
    return display ? String(display).split(" ")[0] : "Usuario";
  };

  if (loading) return null;

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 font-sans shadow-xl",
        "transform transition-transform duration-300 will-change-transform",
        shouldHide ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
      style={{
        background: "linear-gradient(135deg, #293A49 0%, #37B6FF 100%)",
        height: NAV_HEIGHT,
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 h-full">
        {/* TOPBAR */}
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Image
                  src="/favicon.png"
                  alt="MentHIA Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </div>
              <span className="text-white text-2xl font-extrabold tracking-tight">
                MentHIA
              </span>
            </Link>
          </div>

          {/* Desktop Nav + Actions */}
          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-3">
            {user ? (
              <>
                <Link href="/dashboard/inicio" className={navLinkClasses("/dashboard/inicio")}>
                  Inicio
                </Link>
                <Link href="/dashboard/diagnostico" className={navLinkClasses("/dashboard/diagnostico")}>
                  Diagnóstico
                </Link>
                <Link href="/dashboard/mentoria" className={navLinkClasses("/dashboard/mentoria")}>
                  Mentoría
                </Link>
                <Link href="/dashboard/cursos" className={navLinkClasses("/dashboard/cursos")}>
                  Cursos
                </Link>
                <Link href="/dashboard/marketplace" className={navLinkClasses("/dashboard/marketplace")}>
                  Marketplace
                </Link>
                <Link href="/dashboard/plans" className={navLinkClasses("/dashboard/plans")}>
                  Planes
                </Link>
                <Link href="/dashboard/ayuda" className={navLinkClasses("/dashboard/ayuda")}>
                  Ayuda
                </Link>
                <Link href="/dashboard/pagos" className={navLinkClasses("/dashboard/pagos")}>
                  Pagos
                </Link>

                {/* Notificaciones */}
                <NotificationBell
                  renderTrigger={({ count, onToggle }) => (
                    <button
                      onClick={onToggle}
                      className="relative text-white hover:text-cyan-300 p-2 rounded-lg transition-colors"
                      aria-label="Notificaciones"
                    >
                      <IoNotificationsOutline className="h-6 w-6" />
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-[10px] font-bold rounded-full bg-red-600 text-white px-1.5 py-0.5 shadow-md">
                          {count}
                        </span>
                      )}
                    </button>
                  )}
                />

                {/* Carrito (desktop) */}
                <div className="relative" ref={cartRef}>
                  <button
                    onClick={() => setCartOpen((s) => !s)}
                    className="relative p-2 rounded-lg text-white hover:bg-white/20 transition-all shadow-md"
                    aria-label="Abrir carrito"
                  >
                    <FaShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-[10px] font-bold rounded-full bg-cyan-400 text-gray-900 px-1.5 py-0.5 shadow-md">
                        {itemCount}
                      </span>
                    )}
                  </button>

                  {cartOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl ring-1 ring-black ring-opacity-5 z-50">
                      <div className="p-3 border-b border-gray-200">
                        <div className="text-sm font-semibold" style={{ color: '#293A49' }}>Tu carrito</div>
                        <div className="text-xs text-gray-500">
                          {itemCount > 0 ? `${itemCount} artículo(s)` : "Vacío"}
                        </div>
                      </div>

                      <div className="max-h-80 overflow-auto divide-y">
                        {items.slice(0, 3).map((it: any) => (
                          <div key={it.id} className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors">
                            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden grid place-items-center">
                              {it.image ? (
                                <Image
                                  src={it.image}
                                  alt={it.title}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <FaShoppingCart className="text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium line-clamp-1" style={{ color: '#293A49' }}>{it.title}</div>
                              <div className="text-xs text-gray-500">
                                {it.kind} · x{it.quantity}
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(it.id)}
                              className="text-red-600 hover:text-red-700 p-2 transition-colors"
                              aria-label="Eliminar del carrito"
                              title="Eliminar"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        ))}
                        {items.length === 0 && (
                          <div className="p-4 text-center text-sm text-gray-500">No hay productos</div>
                        )}
                        {items.length > 3 && (
                          <div className="p-2 text-center text-xs text-gray-500">
                            y {items.length - 3} artículo(s) más…
                          </div>
                        )}
                      </div>

                      <div className="p-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold" style={{ color: '#293A49' }}>{subtotalFormatted}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href="/cart"
                            onClick={() => setCartOpen(false)}
                            className="flex-1 text-center px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold hover:bg-gray-50 transition-colors"
                            style={{ color: '#293A49' }}
                          >
                            Ver carrito
                          </Link>
                          <Link
                            href="/checkout"
                            onClick={() => setCartOpen(false)}
                            className="flex-1 text-center px-3 py-2 rounded-lg text-white text-sm font-semibold hover:shadow-lg transition-all"
                            style={{ background: 'linear-gradient(135deg, #37B6FF 0%, #70B5E2 100%)' }}
                          >
                            Ir a pagar
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dropdown de usuario */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="text-white hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-md transition-all"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    disabled={isLoggingOut}
                  >
                    <FaUserCircle className="mr-2" /> Hola, {getUserDisplayName()}
                    <svg
                      className="ml-2 -mr-0.5 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-2xl py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <Link
                        href="/perfil"
                        className="flex items-center px-4 py-2 text-sm hover:bg-blue-50 rounded-md transition-colors"
                        style={{ color: '#293A49' }}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaCog className="mr-2" /> Mi Perfil
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        disabled={isLoggingOut}
                      >
                        <FaSignOutAlt className="mr-2" /> {isLoggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/" className={navLinkClasses("/")}>
                  Inicio
                </Link>
                <Link href="/services" className={navLinkClasses("/services")}>
                  Servicios
                </Link>
                <Link href="/community" className={navLinkClasses("/community")}>
                  Comunidad
                </Link>
                <button
                  onClick={() => router.push("/register")}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white hover:shadow-lg shadow-md transition-all"
                  style={{ background: 'linear-gradient(135deg, #37B6FF 0%, #70B5E2 100%)' }}
                >
                  Registro
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="bg-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 shadow-md border border-white/20 transition-all"
                  style={{ color: '#293A49' }}
                >
                  Iniciar Sesión
                </button>
              </>
            )}
          </div>

          {/* Mobile: carrito + hamburguesa */}
          <div className="-mr-2 flex md:hidden items-center gap-2">
            {user && (
              <button
                onClick={() => router.push("/cart")}
                className="relative p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                aria-label="Carrito"
              >
                <FaShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-[10px] font-bold rounded-full bg-cyan-400 text-gray-900 px-1.5 py-0.5 shadow-md">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {user && (
              <NotificationBell
                renderTrigger={({ count, onToggle }) => (
                  <button
                    onClick={onToggle}
                    className="relative p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                    aria-label="Notificaciones"
                  >
                    <IoNotificationsOutline className="h-5 w-5" />
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-[10px] font-bold rounded-full bg-red-600 text-white px-1.5 py-0.5 shadow-md">
                        {count}
                      </span>
                    )}
                  </button>
                )}
              />
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen ? "true" : "false"}
            >
              <span className="sr-only">Abrir menú principal</span>
              {!mobileMenuOpen ? <FaBars className="block h-6 w-6" /> : <FaTimes className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center space-y-8 z-40"
          style={{ background: 'linear-gradient(135deg, #293A49 0%, #37B6FF 100%)', opacity: 0.98 }}
        >
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-white focus:outline-none hover:text-cyan-300 transition-colors"
          >
            <FaTimes size={30} />
          </button>

          {user ? (
            <>
              <Link
                href="/dashboard/inicio"
                className="text-white text-3xl font-bold hover:text-cyan-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/dashboard/diagnostico"
                className="text-white text-3xl font-bold hover:text-cyan-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Diagnóstico
              </Link>
              <Link
                href="/dashboard/mentoria"
                className="text-white text-3xl font-bold hover:text-cyan-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mentoría
              </Link>
              <Link
                href="/dashboard/cursos"
                className="text-white text-3xl font-bold hover:text-cyan-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cursos
              </Link>
              <Link
                href="/dashboard/marketplace"
                className="text-white text-3xl font-bold hover:text-cyan-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/dashboard/plans"
                className="text-white text-3xl font-bold hover:text-cyan-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Planes y Paquetes
              </Link>

              <Link
                href="/cart"
                className="text-white text-3xl font-bold hover:text-cyan-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Carrito {itemCount > 0 ? `(${itemCount})` : ""}
              </Link>

              <div className="border-t border-white/30 w-2/3 my-4" />
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold text-xl hover:bg-red-700 shadow-lg transition-all"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="text-white text-3xl font-bold hover:text-cyan-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/services"
                className="text-white text-3xl font-bold hover:text-cyan-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link
                href="/community"
                className="text-white text-3xl font-bold hover:text-cyan-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Comunidad
              </Link>

              <div className="border-t border-white/30 w-2/3 my-4" />
              <button
                onClick={() => {
                  router.push("/register");
                  setMobileMenuOpen(false);
                }}
                className="px-6 py-3 rounded-full text-lg font-semibold text-white hover:shadow-lg shadow-md transition-all"
                style={{ background: 'linear-gradient(135deg, #37B6FF 0%, #70B5E2 100%)' }}
              >
                Registro
              </button>
              <button
                onClick={() => {
                  router.push("/login");
                  setMobileMenuOpen(false);
                }}
                className="bg-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 shadow-md transition-all"
                style={{ color: '#293A49' }}
              >
                Iniciar Sesión
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

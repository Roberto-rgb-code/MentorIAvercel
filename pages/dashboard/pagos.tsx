// pages/dashboard/pagos.tsx
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import PrivateLayout from "../../components/layout/PrivateLayout";

type CartItem = {
  sku: string;
  name: string;
  price: number; // en MXN
  qty: number;
  image?: string;
  type?: string;
};

type Address = {
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  line1: string;
  line2?: string;
};

const mx = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 });

const COUPONS: Record<string, number> = {
  MENTOR10: 0.1,
  LANZAMIENTO20: 0.2,
  VIP30: 0.3,
};

const DEFAULT_CART: CartItem[] = [
  {
    sku: "diagnostico_profundo",
    name: "Diagnóstico Profundo Empresarial",
    price: 1999_00,
    qty: 1,
    image: "/img/diagnostico.png",
    type: "diagnostico",
  },
  {
    sku: "dashboard_kpis",
    name: "Dashboard Ejecutivo KPIs",
    price: 399_00,
    qty: 1,
    image: "/img/marketplace/dashboard.jpg",
    type: "plantilla",
  },
];

const PagosPage: React.FC = () => {
  const router = useRouter();

  // CARRITO
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; pct: number } | null>(null);

  // DATOS FACTURACIÓN / ENVÍO (para recibo)
  const [addr, setAddr] = useState<Address>({
    name: "",
    email: "",
    phone: "",
    country: "México",
    state: "",
    city: "",
    zip: "",
    line1: "",
    line2: "",
  });

  // PAGO (Demo tarjeta)
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar carrito desde localStorage o query (?sku= & price= & name= & qty=)
  useEffect(() => {
    // 1) query -> agrega un item rápido (p. ej., desde marketplace)
    const { sku, name, price, qty, image, type } = router.query;
    let items: CartItem[] = [];
    try {
      const raw = localStorage.getItem("mentorapp_cart");
      if (raw) items = JSON.parse(raw);
    } catch {}

    if (sku && name && price) {
      const q = Number(qty || 1);
      const p = Number(price);
      const exists = items.find((i) => i.sku === sku);
      if (exists) exists.qty += q;
      else
        items.push({
          sku: String(sku),
          name: String(name),
          price: isNaN(p) ? 0 : p,
          qty: isNaN(q) ? 1 : q,
          image: typeof image === "string" ? image : undefined,
          type: typeof type === "string" ? type : undefined,
        });
    }

    if (items.length === 0) items = DEFAULT_CART.slice();
    setCart(items);
  }, [router.query]);

  // Persistir carrito
  useEffect(() => {
    try {
      localStorage.setItem("mentorapp_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const subtotal = useMemo(
    () => cart.reduce((acc, it) => acc + it.price * it.qty, 0),
    [cart]
  );

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return Math.round(subtotal * appliedCoupon.pct);
  }, [subtotal, appliedCoupon]);

  const taxable = Math.max(0, subtotal - discount);
  const iva = Math.round(taxable * 0.16);
  const total = taxable + iva;

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) {
      setAppliedCoupon(null);
      return;
    }
    const pct = COUPONS[code];
    if (!pct) {
      setError("Cupón inválido.");
      setAppliedCoupon(null);
      setTimeout(() => setError(null), 1800);
      return;
    }
    setAppliedCoupon({ code, pct });
  }

  function removeItem(sku: string) {
    setCart((c) => c.filter((x) => x.sku !== sku));
  }
  function setQty(sku: string, next: number) {
    if (next < 1) return;
    setCart((c) => c.map((x) => (x.sku === sku ? { ...x, qty: next } : x)));
  }

  function validate(): string | null {
    if (cart.length === 0) return "Tu carrito está vacío.";
    if (!addr.name.trim()) return "Escribe tu nombre completo.";
    if (!addr.email.trim() || !/\S+@\S+\.\S+/.test(addr.email)) return "Ingresa un correo válido.";
    if (!addr.phone.trim()) return "Ingresa tu teléfono.";
    if (!addr.line1.trim() || !addr.city.trim() || !addr.state.trim() || !addr.zip.trim())
      return "Completa tu dirección (calle, ciudad, estado, CP).";
    if (cardNumber.replace(/\s+/g, "").length < 15) return "Número de tarjeta inválido.";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Fecha de expiración inválida (MM/AA).";
    if (!/^\d{3,4}$/.test(cvc)) return "CVC inválido.";
    return null;
  }

  async function payNow() {
    const msg = validate();
    if (msg) {
      setError(msg);
      setTimeout(() => setError(null), 2000);
      return;
    }

    setError(null);
    setSaving(true);

    // DEMO: simulación de checkout
    setTimeout(() => {
      setSaving(false);
      try {
        localStorage.removeItem("mentorapp_cart");
      } catch {}
      router.push("/dashboard/inicio?paid=1");
    }, 1400);
  }

  return (
    <PrivateLayout>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Checkout</div>
              <h1 className="text-2xl font-extrabold text-gray-900">Finaliza tu compra</h1>
              <p className="text-sm text-gray-600">Revisa tu pedido y completa el pago de forma segura.</p>
            </div>
            <Link href="/dashboard/marketplace" className="px-3 py-2 rounded-xl border text-sm bg-white hover:bg-gray-50">
              ⟵ Seguir comprando
            </Link>
          </div>
        </div>

        {/* Main */}
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Col izquierda: datos */}
          <div className="lg:col-span-7 space-y-6">
            {/* Carrito */}
            <section className="bg-white border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">Tu carrito</h2>
                <span className="text-sm text-gray-500">{cart.length} productos</span>
              </div>

              {cart.length === 0 ? (
                <div className="p-8 text-center text-gray-600">
                  Tu carrito está vacío. <Link href="/dashboard/marketplace" className="underline">Explora el marketplace</Link>.
                </div>
              ) : (
                <ul className="divide-y">
                  {cart.map((it) => (
                    <li key={it.sku} className="py-3 flex items-center gap-3">
                      <img
                        src={it.image || "/img/marketplace/placeholder.jpg"}
                        alt={it.name}
                        className="w-16 h-16 rounded-xl object-cover border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 truncate">{it.name}</p>
                          <div className="font-bold text-indigo-700">{mx(it.price)}</div>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          SKU: {it.sku} {it.type ? `· ${it.type}` : ""}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center border rounded-xl overflow-hidden bg-white">
                            <button
                              className="px-2 py-1 text-sm hover:bg-gray-50"
                              onClick={() => setQty(it.sku, it.qty - 1)}
                            >
                              −
                            </button>
                            <input
                              value={it.qty}
                              onChange={(e) => {
                                const n = Number(e.target.value);
                                if (!Number.isNaN(n)) setQty(it.sku, n);
                              }}
                              className="w-12 text-center text-sm outline-none"
                            />
                            <button
                              className="px-2 py-1 text-sm hover:bg-gray-50"
                              onClick={() => setQty(it.sku, it.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(it.sku)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Cupón */}
              <div className="mt-4 flex items-center gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded-xl border text-sm"
                  placeholder="¿Tienes un cupón? (p. ej. MENTOR10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button
                  onClick={applyCoupon}
                  className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm"
                >
                  Aplicar
                </button>
                {appliedCoupon && (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border">
                    Cupón {appliedCoupon.code} aplicado ({Math.round(appliedCoupon.pct * 100)}%)
                  </span>
                )}
              </div>
            </section>

            {/* Datos de facturación/envío */}
            <section className="bg-white border rounded-2xl p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Datos de facturación</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-600">Nombre completo</label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border"
                    value={addr.name}
                    onChange={(e) => setAddr({ ...addr, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Correo electrónico</label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border"
                    value={addr.email}
                    onChange={(e) => setAddr({ ...addr, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Teléfono</label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border"
                    value={addr.phone}
                    onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">País</label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border"
                    value={addr.country}
                    onChange={(e) => setAddr({ ...addr, country: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Estado / Provincia</label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border"
                    value={addr.state}
                    onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Ciudad</label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border"
                    value={addr.city}
                    onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Código Postal</label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border"
                    value={addr.zip}
                    onChange={(e) => setAddr({ ...addr, zip: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-600">Calle y número</label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border"
                    value={addr.line1}
                    onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-600">Depto, interior (opcional)</label>
                  <input
                    className="w-full px-3 py-2 rounded-xl border"
                    value={addr.line2}
                    onChange={(e) => setAddr({ ...addr, line2: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Método de pago */}
            <section className="bg-white border rounded-2xl p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Método de pago</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-3">
                  <label className="text-xs text-gray-600">Número de tarjeta</label>
                  <input
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-3 py-2 rounded-xl border"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(
                        e.target.value
                          .replace(/[^\d]/g, "")
                          .slice(0, 16)
                          .replace(/(\d{4})(?=\d)/g, "$1 ")
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Expira (MM/AA)</label>
                  <input
                    inputMode="numeric"
                    placeholder="MM/AA"
                    className="w-full px-3 py-2 rounded-xl border"
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(
                        e.target.value
                          .replace(/[^\d]/g, "")
                          .slice(0, 4)
                          .replace(/(\d{2})(?=\d)/, "$1/")
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">CVC</label>
                  <input
                    inputMode="numeric"
                    placeholder="123"
                    className="w-full px-3 py-2 rounded-xl border"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                  />
                </div>
                <div className="flex items-end">
                  <div className="text-xs text-gray-500">Tarjeta demo · No se hace cargo real</div>
                </div>
              </div>
            </section>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-semibold disabled:opacity-60 flex items-center gap-2"
                onClick={payNow}
                disabled={saving || cart.length === 0}
              >
                {saving ? (
                  <>
                    <span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Procesando…
                  </>
                ) : (
                  <>Pagar ahora</>
                )}
              </button>
              <button
                className="px-5 py-3 rounded-2xl border bg-white"
                onClick={() => router.push("/dashboard/inicio")}
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Col derecha: resumen */}
          <aside className="lg:col-span-5">
            <div className="bg-white border rounded-2xl p-4 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Resumen del pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{mx(subtotal / 100)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Descuento</span>
                  <span className={`font-semibold ${discount ? "text-emerald-700" : ""}`}>
                    − {mx(discount / 100)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Base imponible</span>
                  <span className="font-semibold">{mx(taxable / 100)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">IVA (16%)</span>
                  <span className="font-semibold">{mx(iva / 100)}</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="text-gray-800 font-bold">Total</span>
                  <span className="text-xl font-extrabold text-indigo-700">{mx(total / 100)}</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Al completar el pago recibirás accesos y/o descargas en tu correo. Los recursos digitales no
                son reembolsables una vez entregados.
              </div>

              <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-sm text-indigo-900">
                <b>Garantía de satisfacción:</b> si algo falla con tu descarga o acceso, te ayudamos a resolverlo en 24h.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default PagosPage;

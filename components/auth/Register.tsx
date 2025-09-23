// components/auth/Register.tsx
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

const ROLES_FINAL = [
  { value: "emprendedor", label: "PyME / Emprendedor", description: "Acceso freemium/premium, diagnóstico, cursos y comunidad." },
  { value: "consultor", label: "Consultor Independiente", description: "Carga perfil experto, gestión de agenda, consultoría 1:1." },
  { value: "empresa", label: "Empresa (Licenciataria)", description: "Acceso corporativo, métricas de empleados, equipos." },
  { value: "universidad", label: "Universidad", description: "Gestión de usuarios institucional, seguimiento académico." },
  { value: "gobierno", label: "Gobierno", description: "Reportes de impacto, acceso institucional, licenciamiento." },
];

const INITIAL_USER_DATA = {
  fullName: "",
  email: "",
  phone: "",
  birthYear: "",
  language: "",
  gender: "",
  country: "",
  city: "",
  password: "",
  privacyConsent: false,
};

const Register = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [userData, setUserData] = useState({ ...INITIAL_USER_DATA });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // --- negocio/institución
  const [motivation, setMotivation] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessRelationship, setBusinessRelationship] = useState("");
  const [businessStage, setBusinessStage] = useState("");
  const [mainChallenge, setMainChallenge] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [otherGoal, setOtherGoal] = useState("");
  const [previousAdvisory, setPreviousAdvisory] = useState("");
  const [supportAreas, setSupportAreas] = useState<string[]>([]);
  const [otherSupportArea, setOtherSupportArea] = useState("");

  // --- consultor
  const [ultimoGrado, setUltimoGrado] = useState("");
  const [otroGrado, setOtroGrado] = useState("");
  const [areaEstudios, setAreaEstudios] = useState("");
  const [anosExperiencia, setAnosExperiencia] = useState("");
  const [experienciaMipymes, setExperienciaMipymes] = useState("");
  const [colaboracionInstitucional, setColaboracionInstitucional] = useState("");
  const [areasExperiencia, setAreasExperiencia] = useState<string[]>([]);
  const [otherAreaExperiencia, setOtherAreaExperiencia] = useState("");
  const [industrias, setIndustrias] = useState<string[]>([]);
  const [otherIndustry, setOtherIndustry] = useState("");
  const [casoExito, setCasoExito] = useState("");
  const [intervencionPreferida, setIntervencionPreferida] = useState("");
  const [otraIntervencion, setOtraIntervencion] = useState("");
  const [acompanamiento, setAcompanamiento] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [herramientasDigitales, setHerramientasDigitales] = useState<string[]>([]);
  const [otherDigitalTool, setOtherDigitalTool] = useState("");
  const [recursosPropios, setRecursosPropios] = useState("");
  const [reportesEstructurados, setReportesEstructurados] = useState("");
  const [horasSemanales, setHorasSemanales] = useState("");
  const [trabajoProyecto, setTrabajoProyecto] = useState("");
  const [tarifaTipo, setTarifaTipo] = useState("");
  const [tarifaHora, setTarifaHora] = useState("");
  const [tarifaPaquete, setTarifaPaquete] = useState("");
  const [motivacionConsultor, setMotivacionConsultor] = useState("");
  const [otraMotivacion, setOtraMotivacion] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [portafolio, setPortafolio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [referencias, setReferencias] = useState("");
  const [confirmacionEntrevista, setConfirmacionEntrevista] = useState(false);

  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
    setStep(2);
    setError("");
  };

  const handleCheckboxChange = (
    setState: React.Dispatch<React.SetStateAction<string[]>>,
    currentArray: string[],
    value: string,
    _otherValueState?: string,
    setOtherValueState?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (currentArray.includes(value)) {
      setState(currentArray.filter((i) => i !== value));
      if ((value === "Otro" || value === "Otra") && setOtherValueState) {
        setOtherValueState("");
      }
    } else {
      setState([...currentArray, value]);
    }
  };

  const getMaxSteps = useMemo(() => {
    if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) return 6;
    if (role === "consultor") return 8;
    return 1;
  }, [role]);

  const handleNext = () => {
    setError("");

    if (step === 2) {
      const { fullName, email, phone, language, country, city, birthYear } = userData;
      if (!fullName || !email || !phone || !language || !country || !city || !birthYear) {
        setError("Completa todos los campos obligatorios del Paso 1: Sobre ti.");
        return;
      }
    }

    if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
      if (step === 3 && (!motivation || !businessName || !businessRelationship || !businessStage)) {
        setError("Completa los campos del Paso 2: Sobre tu Negocio/Institución.");
        return;
      }
      if (step === 4) {
        if (
          !mainChallenge ||
          goals.length === 0 ||
          (goals.includes("Otro") && !otherGoal.trim()) ||
          !previousAdvisory
        ) {
          setError("Completa el Paso 3: Retos y Metas (si elegiste ‘Otro’, especifícalo).");
          return;
        }
      }
      if (step === 5) {
        if (supportAreas.length === 0 || (supportAreas.includes("Otro") && !otherSupportArea.trim())) {
          setError("Selecciona al menos un área en el Paso 4: Áreas de Apoyo (si ‘Otro’, especifícalo).");
          return;
        }
      }
      if (step === 6) {
        if (!userData.password || userData.password.length < 8) {
          setError("La contraseña debe tener al menos 8 caracteres.");
          return;
        }
        if (!userData.privacyConsent) {
          setError("Debes aceptar el aviso de privacidad y los términos de uso.");
          return;
        }
      }
    } else if (role === "consultor") {
      if (step === 3) {
        if (
          !ultimoGrado ||
          (ultimoGrado === "Otro" && !otroGrado.trim()) ||
          !areaEstudios ||
          !anosExperiencia ||
          !experienciaMipymes ||
          !colaboracionInstitucional
        ) {
          setError("Completa el Paso 2: Formación y Experiencia (si ‘Otro’, especifícalo).");
          return;
        }
      }
      if (step === 4) {
        if (
          areasExperiencia.length === 0 ||
          (areasExperiencia.includes("Otro") && !otherAreaExperiencia.trim())
        ) {
          setError("Selecciona al menos un área de experiencia (si ‘Otro’, especifícalo).");
          return;
        }
        if (industrias.length === 0 || (industrias.includes("Otro") && !otherIndustry.trim())) {
          setError("Selecciona al menos una industria (si ‘Otro’, especifícalo).");
          return;
        }
        if (
          !casoExito ||
          !intervencionPreferida ||
          (intervencionPreferida === "Otro" && !otraIntervencion.trim())
        ) {
          setError("Completa caso de éxito e intervención preferida (si ‘Otro’, especifícalo).");
          return;
        }
      }
      if (step === 5) {
        if (
          !acompanamiento ||
          !modalidad ||
          herramientasDigitales.length === 0 ||
          (herramientasDigitales.includes("Otra") && !otherDigitalTool.trim()) ||
          !recursosPropios ||
          !reportesEstructurados
        ) {
          setError("Completa el Paso 4: Estilo y Metodología (si ‘Otra’ herramienta, especifícalo).");
          return;
        }
      }
      if (step === 6) {
        if (
          !horasSemanales ||
          !trabajoProyecto ||
          !tarifaTipo ||
          (tarifaTipo === "Por hora" && !tarifaHora.trim()) ||
          (tarifaTipo === "Por paquete" && !tarifaPaquete.trim()) ||
          !motivacionConsultor ||
          (motivacionConsultor === "Otro" && !otraMotivacion.trim())
        ) {
          setError("Completa el Paso 5: Disponibilidad y Condiciones.");
          return;
        }
      }
      if (step === 7) {
        if (!curriculum || !referencias) {
          setError("Completa CV y referencias en el Paso 6: Validaciones.");
          return;
        }
      }
      if (step === 8) {
        if (!userData.password || userData.password.length < 8) {
          setError("La contraseña debe tener al menos 8 caracteres.");
          return;
        }
        if (!userData.privacyConsent || !confirmacionEntrevista) {
          setError("Debes aceptar privacidad/términos y confirmar la entrevista.");
          return;
        }
      }
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const saveUserData = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    const baseData: any = {
      uid: user.uid,
      email: user.email || userData.email,
      role,
      fullName: userData.fullName,
      phone: userData.phone,
      birthYear: userData.birthYear,
      language: userData.language,
      gender: userData.gender,
      country: userData.country,
      city: userData.city,
      privacyConsent: userData.privacyConsent,
      createdAt: new Date().toISOString(),
    };

    if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
      Object.assign(baseData, {
        motivation,
        businessName,
        businessRelationship,
        businessStage,
        mainChallenge,
        goals:
          goals.includes("Otro") && otherGoal
            ? [...goals.filter((g) => g !== "Otro"), otherGoal]
            : goals,
        previousAdvisory,
        supportAreas:
          supportAreas.includes("Otro") && otherSupportArea
            ? [...supportAreas.filter((a) => a !== "Otro"), otherSupportArea]
            : supportAreas,
      });
    } else if (role === "consultor") {
      Object.assign(baseData, {
        ultimoGrado: ultimoGrado === "Otro" ? otroGrado : ultimoGrado,
        areaEstudios,
        anosExperiencia,
        experienciaMipymes,
        colaboracionInstitucional,
        areasExperiencia:
          areasExperiencia.includes("Otro") && otherAreaExperiencia
            ? [...areasExperiencia.filter((a) => a !== "Otro"), otherAreaExperiencia]
            : areasExperiencia,
        industrias:
          industrias.includes("Otro") && otherIndustry
            ? [...industrias.filter((i) => i !== "Otro"), otherIndustry]
            : industrias,
        casoExito,
        intervencionPreferida:
          intervencionPreferida === "Otro" ? otraIntervencion : intervencionPreferida,
        acompanamiento,
        modalidad,
        herramientasDigitales:
          herramientasDigitales.includes("Otra") && otherDigitalTool
            ? [...herramientasDigitales.filter((h) => h !== "Otra"), otherDigitalTool]
            : herramientasDigitales,
        recursosPropios,
        reportesEstructurados,
        horasSemanales,
        trabajoProyecto,
        tarifa:
          tarifaTipo === "Por hora"
            ? tarifaHora
            : tarifaTipo === "Por paquete"
            ? tarifaPaquete
            : "Ajustable",
        motivacion: motivacionConsultor === "Otro" ? otraMotivacion : motivacionConsultor,
        curriculum,
        portafolio,
        linkedin,
        referencias,
        confirmacionEntrevista,
      });
    }

    await setDoc(userRef, baseData, { merge: true });
  };

  const onFinalSubmit = async () => {
    if (step < getMaxSteps) {
      setError("Completa todos los pasos antes de registrarte.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      if (cred?.user) {
        await saveUserData(cred.user);
        router.push("/dashboard/inicio");
      } else {
        setError("No se pudo obtener la información del usuario después del registro.");
      }
    } catch (err: any) {
      console.error("Register error:", err);
      if (err.code === "auth/network-request-failed") {
        setError("Problema de conexión. Verifica tu internet / firewall / VPN.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Ese correo ya está registrado. Inicia sesión o usa otro correo.");
      } else if (err.code === "auth/invalid-email") {
        setError("Formato de correo inválido.");
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña es débil (mínimo 8 caracteres).");
      } else {
        setError(err.message || "Error al registrarse. Verifica tus datos.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = async (providerName: "google" | "facebook" | "apple") => {
    setError("");
    setSubmitting(true);
    try {
      let provider;
      if (providerName === "google") provider = new GoogleAuthProvider();
      if (providerName === "facebook") provider = new FacebookAuthProvider();
      if (providerName === "apple") {
        provider = new OAuthProvider("apple.com");
        provider.addScope("email");
        provider.addScope("name");
      }
      const cred = await signInWithPopup(auth, provider as any);
      if (cred?.user) {
        await saveUserData(cred.user);
        router.push("/dashboard/inicio");
      } else {
        setError("No se pudo obtener la información del usuario tras el inicio social.");
      }
    } catch (err: any) {
      console.error("Social login error:", err);
      if (err.code === "auth/network-request-failed") {
        setError("Problema de conexión. Verifica tu internet / firewall / VPN.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Cerraste la ventana de inicio de sesión.");
      } else if (err.code === "auth/cancelled-popup-request") {
        setError("Solicitud cancelada. Inténtalo de nuevo.");
      } else if (err.code === "auth/account-exists-with-different-credential" || err.code === "auth/email-already-in-use") {
        setError("Tu email ya está vinculado con otro método. Inicia sesión con ese método o vincula cuentas.");
      } else {
        setError(err.message || "Error al autenticarte con el proveedor.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const total = getMaxSteps - 1;
    const current = role ? step - 1 : 0;
    if (!role || total <= 0) return null;
    return (
      <div className="flex justify-center mb-6">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-1 mx-1 rounded-full transition-all duration-300 ${
              current > i ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const PasoButtons = ({
    onNext,
    onBack,
    nextText = "Siguiente",
  }: { onNext: () => void; onBack: () => void; nextText?: string }) => (
    <div className="flex justify-between mt-6">
      <button onClick={onBack} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">
        Volver
      </button>
      <button onClick={onNext} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
        {nextText}
      </button>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
              ¿Qué te trae a MentorApp?
            </h2>
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 underline">
                ← Volver al inicio
              </Link>
            </div>
            <div className="space-y-4">
              {ROLES_FINAL.map((rol) => (
                <button
                  key={rol.value}
                  onClick={() => handleRoleSelection(rol.value)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out text-left"
                >
                  <div className="font-semibold text-lg">{rol.label}</div>
                  <div className="text-sm opacity-90 mt-1">{rol.description}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
            </div>
          </div>
        );

      // Paso 1 (Sobre ti)
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔹 Paso 1: Sobre ti</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={userData.fullName}
                  onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Número de teléfono (+ lada internacional)</label>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+52 55 1234 5678"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Año de nacimiento</label>
                <input
                  type="number"
                  value={userData.birthYear}
                  onChange={(e) => setUserData({ ...userData, birthYear: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1990"
                  min={1900}
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Idioma preferido</label>
                <select
                  value={userData.language}
                  onChange={(e) => setUserData({ ...userData, language: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Selecciona</option>
                  <option value="Español">Español</option>
                  <option value="Inglés">Inglés</option>
                  <option value="Francés">Francés</option>
                  <option value="Alemán">Alemán</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Género (opcional)</label>
                <div className="flex flex-wrap gap-4">
                  {["Mujer", "Hombre", "Prefiero no decirlo", "Otro"].map((g) => (
                    <label key={g} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value={g}
                        checked={userData.gender === g}
                        onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-800">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">País</label>
                <input
                  type="text"
                  value={userData.country}
                  onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu país de residencia"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Ciudad</label>
                <input
                  type="text"
                  value={userData.city}
                  onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu ciudad"
                />
              </div>
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      // ===== Flujos intermedios (AQUÍ ESTABA EL HUECO) =====

      // Negocio/Institución — Paso 2
      case 3:
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔹 Paso 2: Sobre tu Negocio/Institución</h2>
              <div className="space-y-4">
                <input className="w-full p-3 border rounded-lg" placeholder="Motivación principal"
                  value={motivation} onChange={(e) => setMotivation(e.target.value)} />
                <input className="w-full p-3 border rounded-lg" placeholder="Nombre del negocio / institución"
                  value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                <input className="w-full p-3 border rounded-lg" placeholder="Relación con el negocio (propietario, empleado, etc.)"
                  value={businessRelationship} onChange={(e) => setBusinessRelationship(e.target.value)} />
                <select className="w-full p-3 border rounded-lg bg-white"
                  value={businessStage} onChange={(e) => setBusinessStage(e.target.value)}>
                  <option value="">Etapa</option>
                  <option>Idea</option><option>Arranque</option><option>Tracción</option><option>Escala</option>
                </select>
              </div>
              <PasoButtons onBack={handleBack} onNext={handleNext} />
            </div>
          );
        }
        // Consultor — Paso 2 (Formación y experiencia)
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔹 Paso 2: Formación y Experiencia</h2>
            <div className="space-y-4">
              <select className="w-full p-3 border rounded-lg bg-white"
                value={ultimoGrado} onChange={(e) => setUltimoGrado(e.target.value)}>
                <option value="">Último grado</option>
                <option>Licenciatura</option><option>Maestría</option><option>Doctorado</option><option>Otro</option>
              </select>
              {ultimoGrado === "Otro" && (
                <input className="w-full p-3 border rounded-lg" placeholder="Especifica tu grado"
                  value={otroGrado} onChange={(e) => setOtroGrado(e.target.value)} />
              )}
              <input className="w-full p-3 border rounded-lg" placeholder="Área de estudios"
                value={areaEstudios} onChange={(e) => setAreaEstudios(e.target.value)} />
              <input className="w-full p-3 border rounded-lg" placeholder="Años de experiencia"
                value={anosExperiencia} onChange={(e) => setAnosExperiencia(e.target.value)} />
              <select className="w-full p-3 border rounded-lg bg-white"
                value={experienciaMipymes} onChange={(e) => setExperienciaMipymes(e.target.value)}>
                <option value="">Experiencia con MiPyMEs</option>
                <option>Alta</option><option>Media</option><option>Baja</option>
              </select>
              <select className="w-full p-3 border rounded-lg bg-white"
                value={colaboracionInstitucional} onChange={(e) => setColaboracionInstitucional(e.target.value)}>
                <option value="">Colaboración con instituciones</option>
                <option>Frecuente</option><option>Ocasional</option><option>Nula</option>
              </select>
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      // Negocio/Institución — Paso 3 | Consultor — Paso 3 (áreas/industrias/caso de éxito)
      case 4:
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔹 Paso 3: Retos y Metas</h2>
              <div className="space-y-4">
                <input className="w-full p-3 border rounded-lg" placeholder="Principal reto actual"
                  value={mainChallenge} onChange={(e) => setMainChallenge(e.target.value)} />
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Metas (selecciona y/o escribe)</label>
                  <div className="flex flex-wrap gap-3">
                    {["Ventas", "Operación", "Finanzas", "Talento", "Otro"].map((g) => (
                      <label key={g} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={goals.includes(g)}
                          onChange={() => handleCheckboxChange(setGoals, goals, g, otherGoal, setOtherGoal)}
                        />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                  {goals.includes("Otro") && (
                    <input className="mt-2 w-full p-3 border rounded-lg" placeholder="Otra meta"
                      value={otherGoal} onChange={(e) => setOtherGoal(e.target.value)} />
                  )}
                </div>
                <select className="w-full p-3 border rounded-lg bg-white"
                  value={previousAdvisory} onChange={(e) => setPreviousAdvisory(e.target.value)}>
                  <option value="">¿Has tenido asesoría previa?</option>
                  <option>Sí</option><option>No</option>
                </select>
              </div>
              <PasoButtons onBack={handleBack} onNext={handleNext} />
            </div>
          );
        }
        // Consultor
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔹 Paso 3: Áreas, Industrias y Caso de éxito</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Áreas de experiencia</label>
                <div className="flex flex-wrap gap-3">
                  {["Estrategia", "Finanzas", "Operaciones", "Marketing", "Talento", "Otro"].map((a) => (
                    <label key={a} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={areasExperiencia.includes(a)}
                        onChange={() => handleCheckboxChange(setAreasExperiencia, areasExperiencia, a, otherAreaExperiencia, setOtherAreaExperiencia)}
                      />
                      <span>{a}</span>
                    </label>
                  ))}
                </div>
                {areasExperiencia.includes("Otro") && (
                  <input className="mt-2 w-full p-3 border rounded-lg" placeholder="Otra área"
                    value={otherAreaExperiencia} onChange={(e) => setOtherAreaExperiencia(e.target.value)} />
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Industrias</label>
                <div className="flex flex-wrap gap-3">
                  {["Retail", "Manufactura", "Servicios", "Tecnología", "Salud", "Otro"].map((i) => (
                    <label key={i} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={industrias.includes(i)}
                        onChange={() => handleCheckboxChange(setIndustrias, industrias, i, otherIndustry, setOtherIndustry)}
                      />
                      <span>{i}</span>
                    </label>
                  ))}
                </div>
                {industrias.includes("Otro") && (
                  <input className="mt-2 w-full p-3 border rounded-lg" placeholder="Otra industria"
                    value={otherIndustry} onChange={(e) => setOtherIndustry(e.target.value)} />
                )}
              </div>

              <textarea className="w-full p-3 border rounded-lg" placeholder="Describe un caso de éxito brevemente"
                value={casoExito} onChange={(e) => setCasoExito(e.target.value)} />
              <div className="flex flex-col gap-2">
                <select className="w-full p-3 border rounded-lg bg-white"
                  value={intervencionPreferida} onChange={(e) => setIntervencionPreferida(e.target.value)}>
                  <option value="">Intervención preferida</option>
                  <option>Diagnóstico</option><option>Implementación</option><option>Acompañamiento</option><option>Otro</option>
                </select>
                {intervencionPreferida === "Otro" && (
                  <input className="w-full p-3 border rounded-lg" placeholder="Especifica intervención"
                    value={otraIntervencion} onChange={(e) => setOtraIntervencion(e.target.value)} />
                )}
              </div>
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      // Negocio/Institución — Paso 4 | Consultor — Paso 4 (estilo y metodología)
      case 5:
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔹 Paso 4: Áreas de Apoyo</h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {["Diagnóstico", "Mentoría", "Capacitación", "Implementación", "Otro"].map((s) => (
                    <label key={s} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={supportAreas.includes(s)}
                        onChange={() => handleCheckboxChange(setSupportAreas, supportAreas, s, otherSupportArea, setOtherSupportArea)}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
                {supportAreas.includes("Otro") && (
                  <input className="w-full p-3 border rounded-lg" placeholder="Otra área de apoyo"
                    value={otherSupportArea} onChange={(e) => setOtherSupportArea(e.target.value)} />
                )}
              </div>
              <PasoButtons onBack={handleBack} onNext={handleNext} />
            </div>
          );
        }
        // Consultor — Estilo y metodología
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔹 Paso 4: Estilo y Metodología</h2>
            <div className="space-y-4">
              <select className="w-full p-3 border rounded-lg bg-white"
                value={acompanamiento} onChange={(e) => setAcompanamiento(e.target.value)}>
                <option value="">Nivel de acompañamiento</option>
                <option>Ligero</option><option>Medio</option><option>Intensivo</option>
              </select>
              <select className="w-full p-3 border rounded-lg bg-white"
                value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
                <option value="">Modalidad</option>
                <option>Remoto</option><option>Presencial</option><option>Mixto</option>
              </select>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Herramientas digitales</label>
                <div className="flex flex-wrap gap-3">
                  {["Drive", "Notion", "Slack", "Zoom", "Otra"].map((h) => (
                    <label key={h} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={herramientasDigitales.includes(h)}
                        onChange={() => handleCheckboxChange(setHerramientasDigitales, herramientasDigitales, h, otherDigitalTool, setOtherDigitalTool)}
                      />
                      <span>{h}</span>
                    </label>
                  ))}
                </div>
                {herramientasDigitales.includes("Otra") && (
                  <input className="mt-2 w-full p-3 border rounded-lg" placeholder="Otra herramienta"
                    value={otherDigitalTool} onChange={(e) => setOtherDigitalTool(e.target.value)} />
                )}
              </div>

              <input className="w-full p-3 border rounded-lg" placeholder="Recursos propios (p. ej. plantillas)"
                value={recursosPropios} onChange={(e) => setRecursosPropios(e.target.value)} />
              <select className="w-full p-3 border rounded-lg bg-white"
                value={reportesEstructurados} onChange={(e) => setReportesEstructurados(e.target.value)}>
                <option value="">¿Entregas reportes/formatos?</option>
                <option>Sí</option><option>No</option>
              </select>
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      // Negocio/Institución — Paso 5: Registro final (ya lo tenías)
      case 6:
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔹 Paso 5: Registro Final</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Crea tu contraseña</label>
                  <input
                    type="password"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userData.privacyConsent}
                    onChange={(e) => setUserData({ ...userData, privacyConsent: e.target.checked })}
                    className="h-5 w-5 text-blue-600"
                  />
                  <label className="ml-2 text-gray-800">
                    Acepto el{" "}
                    <Link href="/aviso-privacidad" target="_blank" className="text-blue-600 underline">Aviso de Privacidad</Link>{" "}
                    y los{" "}
                    <Link href="/terminos-uso" target="_blank" className="text-blue-600 underline">Términos de Uso</Link>.
                  </label>
                </div>
              </div>

              {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">{error}</div>}

              <div className="flex justify-between mt-6">
                <button onClick={handleBack} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Volver</button>
                <button onClick={onFinalSubmit} disabled={submitting} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60">
                  {submitting ? "Registrando..." : "Registrarme"}
                </button>
              </div>

              <div className="mt-6 text-center text-gray-600">
                <p className="mb-4">O regístrate con:</p>
                <div className="flex justify-center space-x-4">
                  <button onClick={() => handleSocialLogin("google")} disabled={submitting} className="p-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md disabled:opacity-60" aria-label="Regístrate con Google">
                    <FaGoogle className="w-6 h-6" />
                  </button>
                  <button onClick={() => handleSocialLogin("facebook")} disabled={submitting} className="p-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md disabled:opacity-60" aria-label="Regístrate con Facebook">
                    <FaFacebook className="w-6 h-6" />
                  </button>
                  <button onClick={() => handleSocialLogin("apple")} disabled={submitting} className="p-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md disabled:opacity-60" aria-label="Regístrate con Apple">
                    <FaApple className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          );
        }
        // Consultor — Paso 5: Disponibilidad y condiciones
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔹 Paso 5: Disponibilidad y Condiciones</h2>
            <div className="space-y-4">
              <input className="w-full p-3 border rounded-lg" placeholder="Horas semanales disponibles"
                value={horasSemanales} onChange={(e) => setHorasSemanales(e.target.value)} />
              <select className="w-full p-3 border rounded-lg bg-white"
                value={trabajoProyecto} onChange={(e) => setTrabajoProyecto(e.target.value)}>
                <option value="">¿Aceptas trabajo por proyecto?</option>
                <option>Sí</option><option>No</option>
              </select>

              <div className="flex flex-col gap-2">
                <select className="w-full p-3 border rounded-lg bg-white"
                  value={tarifaTipo} onChange={(e) => setTarifaTipo(e.target.value)}>
                  <option value="">Tipo de tarifa</option>
                  <option>Por hora</option><option>Por paquete</option><option>A convenir</option>
                </select>
                {tarifaTipo === "Por hora" && (
                  <input className="w-full p-3 border rounded-lg" placeholder="Tarifa por hora (MXN/USD)"
                    value={tarifaHora} onChange={(e) => setTarifaHora(e.target.value)} />
                )}
                {tarifaTipo === "Por paquete" && (
                  <input className="w-full p-3 border rounded-lg" placeholder="Tarifa por paquete"
                    value={tarifaPaquete} onChange={(e) => setTarifaPaquete(e.target.value)} />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <select className="w-full p-3 border rounded-lg bg-white"
                  value={motivacionConsultor} onChange={(e) => setMotivacionConsultor(e.target.value)}>
                  <option value="">Motivación principal</option>
                  <option>Impacto</option><option>Ingresos</option><option>Marca personal</option><option>Otro</option>
                </select>
                {motivacionConsultor === "Otro" && (
                  <input className="w-full p-3 border rounded-lg" placeholder="Especifica tu motivación"
                    value={otraMotivacion} onChange={(e) => setOtraMotivacion(e.target.value)} />
                )}
              </div>
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      // Consultor — Paso 6: Validaciones (CV/links/referencias)
      case 7:
        if (role === "consultor") {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔹 Paso 6: Validaciones</h2>
              <div className="space-y-4">
                <input className="w-full p-3 border rounded-lg" placeholder="URL a tu CV (Drive/Link)"
                  value={curriculum} onChange={(e) => setCurriculum(e.target.value)} />
                <input className="w-full p-3 border rounded-lg" placeholder="URL a tu portafolio (opcional)"
                  value={portafolio} onChange={(e) => setPortafolio(e.target.value)} />
                <input className="w-full p-3 border rounded-lg" placeholder="URL a tu LinkedIn (opcional)"
                  value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                <textarea className="w-full p-3 border rounded-lg" placeholder="Referencias (nombre + contacto)"
                  value={referencias} onChange={(e) => setReferencias(e.target.value)} />
              </div>

              {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">{error}</div>}

              <PasoButtons onBack={handleBack} onNext={handleNext} nextText="Continuar" />
            </div>
          );
        }
        return null;

      // Consultor — Paso 7: Registro final (tu caso 8)
      case 8:
        if (role === "consultor") {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🔹 Paso 7: Registro Final</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Crea tu contraseña</label>
                  <input
                    type="password"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userData.privacyConsent}
                    onChange={(e) => setUserData({ ...userData, privacyConsent: e.target.checked })}
                    className="h-5 w-5 text-blue-600"
                  />
                  <label className="ml-2 text-gray-800">
                    Acepto el{" "}
                    <Link href="/aviso-privacidad" target="_blank" className="text-blue-600 underline">Aviso de Privacidad</Link>{" "}
                    y los{" "}
                    <Link href="/terminos-uso" target="_blank" className="text-blue-600 underline">Términos de Uso</Link>.
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={confirmacionEntrevista}
                    onChange={(e) => setConfirmacionEntrevista(e.target.checked)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <label className="ml-2 text-gray-800">
                    Confirmo mi disposición a participar en una entrevista de validación.
                  </label>
                </div>
              </div>

              {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">{error}</div>}

              <div className="flex justify-between mt-6">
                <button onClick={handleBack} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">Volver</button>
                <button onClick={onFinalSubmit} disabled={submitting} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60">
                  {submitting ? "Registrando..." : "Registrarme"}
                </button>
              </div>

              <div className="mt-6 text-center text-gray-600">
                <p className="mb-4">O regístrate con:</p>
                <div className="flex justify-center space-x-4">
                  <button onClick={() => handleSocialLogin("google")} disabled={submitting} className="p-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md disabled:opacity-60" aria-label="Regístrate con Google">
                    <FaGoogle className="w-6 h-6" />
                  </button>
                  <button onClick={() => handleSocialLogin("facebook")} disabled={submitting} className="p-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md disabled:opacity-60" aria-label="Regístrate con Facebook">
                    <FaFacebook className="w-6 h-6" />
                  </button>
                  <button onClick={() => handleSocialLogin("apple")} disabled={submitting} className="p-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md disabled:opacity-60" aria-label="Regístrate con Apple">
                    <FaApple className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Crear cuenta · MentorApp</title>
        <meta name="description" content="Regístrate para acceder a diagnósticos, mentoría y cursos." />
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
          {renderStepIndicator()}
          {renderStep()}
        </div>
      </div>
    </>
  );
};

export default Register;

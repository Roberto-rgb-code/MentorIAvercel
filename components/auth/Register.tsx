// components/auth/Register.tsx
import React, { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
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
import { FaGoogle, FaFacebook, FaApple, FaArrowLeft } from "react-icons/fa";

type Role = "emprendedor" | "consultor" | "empresa" | "universidad" | "gobierno" | "";

const ROLES_FINAL: { value: Role; label: string; description: string }[] = [
  { value: "emprendedor", label: "PyME / Emprendedor", description: "Acceso freemium/premium, diagnóstico, cursos y comunidad." },
  { value: "consultor", label: "Consultor Independiente", description: "Carga perfil experto, gestión de agenda, consultoría 1:1." },
  { value: "empresa", label: "Empresa (Licenciataria)", description: "Acceso corporativo, métricas de empleados, equipos." },
  { value: "universidad", label: "Universidad", description: "Gestión de usuarios institucional, seguimiento académico." },
  { value: "gobierno", label: "Gobierno", description: "Reportes de impacto, acceso institucional, licenciamiento." },
];

type UserData = {
  fullName: string;
  email: string;
  phone: string;
  birthYear: string;
  language: string;
  gender: string;
  country: string;
  city: string;
  password: string;
  privacyConsent: boolean;
};

const INITIAL_USER_DATA: UserData = {
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

/* ---------- UI Inputs (memo) ---------- */
type InputProps = {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  min?: number;
  max?: number;
  autoComplete?: string;
};

const InputField = memo(function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  className = "",
  min,
  max,
  autoComplete,
}: InputProps) {
  const handle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value), [onChange]);

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "#293A49" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={handle}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-colors duration-150 focus:outline-none focus:border-[#70B5E2] ${className}`}
        style={{ borderColor: "#E5E7EB", color: "#293A49" }}
        autoComplete={autoComplete}
        min={min}
        max={max}
      />
    </div>
  );
});

type SelectProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
};

const SelectField = memo(function SelectField({ label, value, onChange, children, className = "" }: SelectProps) {
  const handle = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value), [onChange]);

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "#293A49" }}>{label}</label>
      <select
        value={value}
        onChange={handle}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-colors duration-150 focus:outline-none focus:border-[#70B5E2] bg-white ${className}`}
        style={{ borderColor: "#E5E7EB", color: "#293A49" }}
      >
        {children}
      </select>
    </div>
  );
});

type TextAreaProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  className?: string;
};

const TextAreaField = memo(function TextAreaField({ label, placeholder, value, onChange, rows = 3, className = "" }: TextAreaProps) {
  const handle = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value), [onChange]);

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "#293A49" }}>{label}</label>
      <textarea
        value={value}
        onChange={handle}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-colors duration-150 focus:outline-none focus:border-[#70B5E2] ${className}`}
        style={{ borderColor: "#E5E7EB", color: "#293A49" }}
      />
    </div>
  );
});

/* ---------- Component ---------- */
const Register: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [role, setRole] = useState<Role>("");
  const [userData, setUserData] = useState<UserData>({ ...INITIAL_USER_DATA });
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // negocio/institución
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

  // consultor
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

  const handleRoleSelection = useCallback((selectedRole: Role) => {
    setRole(selectedRole);
    setStep(2);
    setError("");
  }, []);

  const toggleFromArray = useCallback(
    (
      setState: React.Dispatch<React.SetStateAction<string[]>>,
      currentArray: string[],
      value: string,
      setOther?: React.Dispatch<React.SetStateAction<string>>
    ) => {
      if (currentArray.includes(value)) {
        setState(currentArray.filter((i) => i !== value));
        if ((value === "Otro" || value === "Otra") && setOther) setOther("");
      } else {
        setState([...currentArray, value]);
      }
    },
    []
  );

  const getMaxSteps = useMemo(() => {
    if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) return 6;
    if (role === "consultor") return 8;
    return 1;
  }, [role]);

  const handleNext = useCallback(() => {
    setError("");

    if (step === 2) {
      const { fullName, email, phone, language, country, city, birthYear } = userData;
      if (!fullName || !email || !phone || !language || !country || !city || !birthYear) {
        setError("Completa todos los campos obligatorios del Paso 1: Sobre ti.");
        return;
      }
    }

    if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
      if (step === 3) {
        if (!motivation.trim() || !businessName.trim() || !businessRelationship.trim() || !businessStage) {
          setError("Completa los campos del Paso 2: Sobre tu Negocio/Institución.");
          return;
        }
      }
      if (step === 4) {
        if (!mainChallenge.trim() || goals.length === 0 || (goals.includes("Otro") && !otherGoal.trim()) || !previousAdvisory) {
          setError("Completa el Paso 3: Retos y Metas (si elegiste 'Otro', especifícalo).");
          return;
        }
      }
      if (step === 5) {
        if (supportAreas.length === 0 || (supportAreas.includes("Otro") && !otherSupportArea.trim())) {
          setError("Selecciona al menos un área en el Paso 4: Áreas de Apoyo (si 'Otro', especifícalo).");
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
          setError("Completa el Paso 2: Formación y Experiencia (si 'Otro', especifícalo).");
          return;
        }
      }
      if (step === 4) {
        if (areasExperiencia.length === 0 || (areasExperiencia.includes("Otro") && !otherAreaExperiencia.trim())) {
          setError("Selecciona al menos un área de experiencia (si 'Otro', especifícalo).");
          return;
        }
        if (industrias.length === 0 || (industrias.includes("Otro") && !otherIndustry.trim())) {
          setError("Selecciona al menos una industria (si 'Otro', especifícalo).");
          return;
        }
        if (!casoExito || !intervencionPreferida || (intervencionPreferida === "Otro" && !otraIntervencion.trim())) {
          setError("Completa caso de éxito e intervención preferida (si 'Otro', especifícalo).");
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
          setError("Completa el Paso 4: Estilo y Metodología (si 'Otra' herramienta, especifícalo).");
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
  }, [
    step,
    role,
    userData,
    motivation,
    businessName,
    businessRelationship,
    businessStage,
    mainChallenge,
    goals,
    otherGoal,
    previousAdvisory,
    supportAreas,
    otherSupportArea,
    ultimoGrado,
    otroGrado,
    areaEstudios,
    anosExperiencia,
    experienciaMipymes,
    colaboracionInstitucional,
    areasExperiencia,
    otherAreaExperiencia,
    industrias,
    otherIndustry,
    casoExito,
    intervencionPreferida,
    otraIntervencion,
    acompanamiento,
    modalidad,
    herramientasDigitales,
    otherDigitalTool,
    recursosPropios,
    reportesEstructurados,
    horasSemanales,
    trabajoProyecto,
    tarifaTipo,
    tarifaHora,
    tarifaPaquete,
    motivacionConsultor,
    otraMotivacion,
    curriculum,
    referencias,
    confirmacionEntrevista,
  ]);

  const handleBack = useCallback(() => setStep((s) => Math.max(1, s - 1)), []);

  const saveUserData = useCallback(
    async (user: User) => {
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
        exists: snap.exists(),
      };

      if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
        Object.assign(baseData, {
          motivation,
          businessName,
          businessRelationship,
          businessStage,
          mainChallenge,
          goals: goals.includes("Otro") && otherGoal ? [...goals.filter((g) => g !== "Otro"), otherGoal] : goals,
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
          intervencionPreferida: intervencionPreferida === "Otro" ? otraIntervencion : intervencionPreferida,
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
          tarifa: tarifaTipo === "Por hora" ? tarifaHora : tarifaTipo === "Por paquete" ? tarifaPaquete : "Ajustable",
          motivacion: motivacionConsultor === "Otro" ? otraMotivacion : motivacionConsultor,
          curriculum,
          portafolio,
          linkedin,
          referencias,
          confirmacionEntrevista,
        });
      }

      await setDoc(userRef, baseData, { merge: true });
    },
    [
      userData,
      role,
      motivation,
      businessName,
      businessRelationship,
      businessStage,
      mainChallenge,
      goals,
      otherGoal,
      previousAdvisory,
      supportAreas,
      otherSupportArea,
      ultimoGrado,
      otroGrado,
      areaEstudios,
      anosExperiencia,
      experienciaMipymes,
      colaboracionInstitucional,
      areasExperiencia,
      otherAreaExperiencia,
      industrias,
      otherIndustry,
      casoExito,
      intervencionPreferida,
      otraIntervencion,
      acompanamiento,
      modalidad,
      herramientasDigitales,
      otherDigitalTool,
      recursosPropios,
      reportesEstructurados,
      horasSemanales,
      trabajoProyecto,
      tarifaTipo,
      tarifaHora,
      tarifaPaquete,
      motivacionConsultor,
      otraMotivacion,
      curriculum,
      portafolio,
      linkedin,
      referencias,
      confirmacionEntrevista,
    ]
  );

  const onFinalSubmit = useCallback(async () => {
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
  }, [step, getMaxSteps, userData, saveUserData, router]);

  const handleSocialLogin = useCallback(
    async (providerName: "google" | "facebook" | "apple") => {
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
    },
    [router, saveUserData]
  );

  const renderStepIndicator = useCallback(() => {
    const total = getMaxSteps - 1;
    const current = role ? step - 1 : 0;
    if (!role || total <= 0) return null;
    return (
      <div className="flex justify-center mb-8">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-8 h-2 mx-1 rounded-full transition-all duration-300 ${current > i ? "shadow-lg scale-105" : "bg-gray-200"}`}
            style={{ background: current > i ? "linear-gradient(135deg, #70B5E2 0%, #37B6FF 100%)" : undefined }}
          />
        ))}
      </div>
    );
  }, [getMaxSteps, role, step]);

  const PasoButtons = ({ onNext, onBack, nextText = "Siguiente" }: { onNext: () => void; onBack: () => void; nextText?: string }) => (
    <div className="flex justify-between mt-8">
      <button
        onClick={onBack}
        className="px-8 py-3 rounded-xl font-medium transition-transform duration-150 hover:scale-105 shadow-md"
        style={{ backgroundColor: "#f8f9fa", color: "#293A49" }}
      >
        Volver
      </button>
      <button
        onClick={onNext}
        className="px-8 py-3 text-white rounded-xl font-medium transition-transform duration-150 hover:scale-105 shadow-lg"
        style={{ background: "linear-gradient(135deg, #70B5E2 0%, #37B6FF 100%)" }}
      >
        {nextText}
      </button>
    </div>
  );

  /* ---------- UI por paso ---------- */
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-8">
                <Image src="/logo_register.png" alt="MentHIA Logo" width={180} height={180} className="w-45 h-45" priority />
              </div>
              <h1 className="text-4xl font-bold mb-4" style={{ color: "#293A49" }}>Únete a MentHIA</h1>
              <p className="text-lg text-gray-600 leading-relaxed">Asesoría integral, humana e inteligente para tu negocio</p>
            </div>

            <div className="mb-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-transform hover:scale-105 shadow-sm group border-2"
                style={{ color: "#70B5E2", borderColor: "#70B5E2", backgroundColor: "white" }}
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Volver al inicio
              </Link>
            </div>

            <div className="space-y-4">
              {ROLES_FINAL.map((rol) => (
                <button
                  key={rol.value}
                  onClick={() => handleRoleSelection(rol.value)}
                  className="w-full p-6 rounded-xl shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all text-left border-2 border-transparent"
                  style={{ background: "linear-gradient(135deg, #70B5E2 0%, #37B6FF 100%)", color: "white" }}
                >
                  <div className="font-bold text-xl mb-2">{rol.label}</div>
                  <div className="text-sm opacity-95 leading-relaxed">{rol.description}</div>
                </button>
              ))}
            </div>

            <div className="mt-10 text-center text-sm border-top pt-6" style={{ color: "#6B7280", borderTop: "1px solid #E5E7EB" }}>
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-semibold transition-colors hover:underline" style={{ color: "#70B5E2" }}>
                Inicia sesión aquí
              </Link>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium text-center mb-8" style={{ color: "#293A49" }}>Paso 1: Sobre ti</h2>
            <div className="space-y-6">
              <InputField label="Nombre completo" placeholder="Tu nombre completo" value={userData.fullName} onChange={(v) => setUserData((s) => ({ ...s, fullName: v }))} autoComplete="name" />
              <InputField label="Correo electrónico" type="email" placeholder="ejemplo@correo.com" value={userData.email} onChange={(v) => setUserData((s) => ({ ...s, email: v }))} autoComplete="email" />
              <InputField label="Número de teléfono (+ lada internacional)" type="tel" placeholder="+52 55 1234 5678" value={userData.phone} onChange={(v) => setUserData((s) => ({ ...s, phone: v }))} autoComplete="tel" />
              <InputField label="Año de nacimiento" type="number" placeholder="1990" value={userData.birthYear} onChange={(v) => setUserData((s) => ({ ...s, birthYear: v }))} min={1900} max={new Date().getFullYear()} autoComplete="bday-year" />
              <SelectField label="Idioma preferido" value={userData.language} onChange={(v) => setUserData((s) => ({ ...s, language: v }))}>
                <option value="">Selecciona</option>
                <option value="Español">Español</option>
                <option value="Inglés">Inglés</option>
                <option value="Francés">Francés</option>
                <option value="Alemán">Alemán</option>
              </SelectField>
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#293A49" }}>Género (opcional)</label>
                <div className="flex flex-wrap gap-4">
                  {["Mujer", "Hombre", "Prefiero no decirlo", "Otro"].map((g) => (
                    <label key={g} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value={g}
                        checked={userData.gender === g}
                        onChange={(e) => setUserData((s) => ({ ...s, gender: e.target.value }))}
                        className="h-4 w-4 mr-2"
                        style={{ accentColor: "#70B5E2" }}
                      />
                      <span style={{ color: "#293A49" }}>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <InputField label="País" placeholder="Tu país de residencia" value={userData.country} onChange={(v) => setUserData((s) => ({ ...s, country: v }))} autoComplete="country-name" />
              <InputField label="Ciudad" placeholder="Tu ciudad" value={userData.city} onChange={(v) => setUserData((s) => ({ ...s, city: v }))} autoComplete="address-level2" />
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      case 3:
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role))
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: "#293A49" }}>Paso 2: Sobre tu Negocio/Institución</h2>
              <div className="space-y-6">
                <InputField label="Motivación principal" placeholder="¿Qué te motiva a buscar asesoría?" value={motivation} onChange={setMotivation} />
                <InputField label="Nombre del negocio / institución" placeholder="Nombre de tu organización" value={businessName} onChange={setBusinessName} autoComplete="organization" />
                <InputField label="Relación con el negocio" placeholder="Propietario, empleado, socio, etc." value={businessRelationship} onChange={setBusinessRelationship} />
                <SelectField label="Etapa del negocio" value={businessStage} onChange={setBusinessStage}>
                  <option value="">Selecciona la etapa</option>
                  <option>Idea</option>
                  <option>Arranque</option>
                  <option>Tracción</option>
                  <option>Escala</option>
                </SelectField>
              </div>
              <PasoButtons onBack={handleBack} onNext={handleNext} />
            </div>
          );

        // consultor
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium text-center mb-8" style={{ color: "#293A49" }}>Paso 2: Formación y Experiencia</h2>
            <div className="space-y-6">
              <SelectField label="Último grado académico" value={ultimoGrado} onChange={setUltimoGrado}>
                <option value="">Selecciona tu último grado</option>
                <option>Licenciatura</option>
                <option>Maestría</option>
                <option>Doctorado</option>
                <option>Otro</option>
              </SelectField>
              {ultimoGrado === "Otro" && (
                <InputField label="Especifica tu grado" placeholder="Describe tu formación académica" value={otroGrado} onChange={setOtroGrado} />
              )}
              <InputField label="Área de estudios" placeholder="Administración, Ingeniería, Psicología, etc." value={areaEstudios} onChange={setAreaEstudios} />
              <InputField label="Años de experiencia" placeholder="Número de años de experiencia profesional" value={anosExperiencia} onChange={setAnosExperiencia} />
              <SelectField label="Experiencia con MiPyMEs" value={experienciaMipymes} onChange={setExperienciaMipymes}>
                <option value="">Selecciona tu nivel de experiencia</option>
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </SelectField>
              <SelectField label="Colaboración con instituciones" value={colaboracionInstitucional} onChange={setColaboracionInstitucional}>
                <option value="">Selecciona tu nivel de colaboración</option>
                <option>Frecuente</option>
                <option>Ocasional</option>
                <option>Nula</option>
              </SelectField>
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      case 4:
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role))
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: "#293A49" }}>Paso 3: Retos y Metas</h2>
              <div className="space-y-6">
                <InputField label="Principal reto actual" placeholder="¿Cuál es el mayor desafío que enfrenta tu negocio?" value={mainChallenge} onChange={setMainChallenge} />
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: "#293A49" }}>Metas principales (selecciona todas las que apliquen)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Ventas", "Operación", "Finanzas", "Talento", "Otro"].map((g) => {
                      const active = goals.includes(g);
                      return (
                        <label key={g} className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer" style={{ borderColor: active ? "#70B5E2" : "#E5E7EB", backgroundColor: active ? "#F0F4FF" : "white" }}>
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleFromArray(setGoals, goals, g, setOtherGoal)}
                            className="h-4 w-4"
                            style={{ accentColor: "#70B5E2" }}
                          />
                          <span style={{ color: "#293A49" }}>{g}</span>
                        </label>
                      );
                    })}
                  </div>
                  {goals.includes("Otro") && (
                    <InputField label="" placeholder="Especifica tu otra meta" value={otherGoal} onChange={setOtherGoal} className="mt-3" />
                  )}
                </div>
                <SelectField label="¿Has tenido asesoría previa?" value={previousAdvisory} onChange={setPreviousAdvisory}>
                  <option value="">Selecciona una opción</option>
                  <option>Sí</option>
                  <option>No</option>
                </SelectField>
              </div>
              <PasoButtons onBack={handleBack} onNext={handleNext} />
            </div>
          );

        // consultor
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium text-center mb-8" style={{ color: "#293A49" }}>Paso 3: Áreas, Industrias y Experiencia</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#293A49" }}>Áreas de experiencia</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Estrategia", "Finanzas", "Operaciones", "Marketing", "Talento", "Otro"].map((a) => {
                    const active = areasExperiencia.includes(a);
                    return (
                      <label key={a} className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer" style={{ borderColor: active ? "#70B5E2" : "#E5E7EB", backgroundColor: active ? "#F0F4FF" : "white" }}>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleFromArray(setAreasExperiencia, areasExperiencia, a, setOtherAreaExperiencia)}
                          className="h-4 w-4"
                          style={{ accentColor: "#70B5E2" }}
                        />
                        <span style={{ color: "#293A49" }}>{a}</span>
                      </label>
                    );
                  })}
                </div>
                {areasExperiencia.includes("Otro") && (
                  <InputField label="" placeholder="Especifica otra área" value={otherAreaExperiencia} onChange={setOtherAreaExperiencia} className="mt-3" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#293A49" }}>Industrias de experiencia</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Retail", "Manufactura", "Servicios", "Tecnología", "Salud", "Otro"].map((i) => {
                    const active = industrias.includes(i);
                    return (
                      <label key={i} className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer" style={{ borderColor: active ? "#70B5E2" : "#E5E7EB", backgroundColor: active ? "#F0F4FF" : "white" }}>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleFromArray(setIndustrias, industrias, i, setOtherIndustry)}
                          className="h-4 w-4"
                          style={{ accentColor: "#70B5E2" }}
                        />
                        <span style={{ color: "#293A49" }}>{i}</span>
                      </label>
                    );
                  })}
                </div>
                {industrias.includes("Otro") && (
                  <InputField label="" placeholder="Especifica otra industria" value={otherIndustry} onChange={setOtherIndustry} className="mt-3" />
                )}
              </div>

              <TextAreaField label="Caso de éxito" placeholder="Describe brevemente un caso de éxito relevante" value={casoExito} onChange={setCasoExito} rows={4} />
              <SelectField label="Intervención preferida" value={intervencionPreferida} onChange={setIntervencionPreferida}>
                <option value="">Selecciona tu intervención preferida</option>
                <option>Diagnóstico</option>
                <option>Implementación</option>
                <option>Acompañamiento</option>
                <option>Otro</option>
              </SelectField>
              {intervencionPreferida === "Otro" && <InputField label="" placeholder="Especifica tu intervención preferida" value={otraIntervencion} onChange={setOtraIntervencion} />}
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      case 5:
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role))
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: "#293A49" }}>Paso 4: Áreas de Apoyo</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: "#293A49" }}>Selecciona las áreas donde necesitas apoyo</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Diagnóstico", "Mentoría", "Capacitación", "Implementación", "Otro"].map((s) => {
                      const active = supportAreas.includes(s);
                      return (
                        <label key={s} className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer" style={{ borderColor: active ? "#70B5E2" : "#E5E7EB", backgroundColor: active ? "#F0F4FF" : "white" }}>
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleFromArray(setSupportAreas, supportAreas, s, setOtherSupportArea)}
                            className="h-4 w-4"
                            style={{ accentColor: "#70B5E2" }}
                          />
                          <span style={{ color: "#293A49" }}>{s}</span>
                        </label>
                      );
                    })}
                  </div>
                  {supportAreas.includes("Otro") && (
                    <InputField label="" placeholder="Especifica otra área de apoyo" value={otherSupportArea} onChange={setOtherSupportArea} className="mt-3" />
                  )}
                </div>
              </div>
              <PasoButtons onBack={handleBack} onNext={handleNext} />
            </div>
          );

        // consultor
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium text-center mb-8" style={{ color: "#293A49" }}>Paso 4: Estilo y Metodología</h2>
            <div className="space-y-6">
              <SelectField label="Nivel de acompañamiento" value={acompanamiento} onChange={setAcompanamiento}>
                <option value="">Selecciona el nivel de acompañamiento</option>
                <option>Ligero</option>
                <option>Medio</option>
                <option>Intensivo</option>
              </SelectField>
              <SelectField label="Modalidad de trabajo" value={modalidad} onChange={setModalidad}>
                <option value="">Selecciona tu modalidad preferida</option>
                <option>Remoto</option>
                <option>Presencial</option>
                <option>Mixto</option>
              </SelectField>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: "#293A49" }}>Herramientas digitales que utilizas</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Drive", "Notion", "Slack", "Zoom", "Otra"].map((h) => {
                    const active = herramientasDigitales.includes(h);
                    return (
                      <label key={h} className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer" style={{ borderColor: active ? "#70B5E2" : "#E5E7EB", backgroundColor: active ? "#F0F4FF" : "white" }}>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleFromArray(setHerramientasDigitales, herramientasDigitales, h, setOtherDigitalTool)}
                          className="h-4 w-4"
                          style={{ accentColor: "#70B5E2" }}
                        />
                        <span style={{ color: "#293A49" }}>{h}</span>
                      </label>
                    );
                  })}
                </div>
                {herramientasDigitales.includes("Otra") && (
                  <InputField label="" placeholder="Especifica otra herramienta" value={otherDigitalTool} onChange={setOtherDigitalTool} className="mt-3" />
                )}
              </div>

              <InputField label="Recursos propios" placeholder="Describe tus plantillas, metodologías o recursos propios" value={recursosPropios} onChange={setRecursosPropios} />
              <SelectField label="¿Entregas reportes estructurados?" value={reportesEstructurados} onChange={setReportesEstructurados}>
                <option value="">Selecciona una opción</option>
                <option>Sí</option>
                <option>No</option>
              </SelectField>
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      case 6:
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role))
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: "#293A49" }}>Paso 5: Registro Final</h2>
              <div className="space-y-6">
                <InputField label="Crea tu contraseña" type="password" placeholder="Mínimo 8 caracteres" value={userData.password} onChange={(v) => setUserData((s) => ({ ...s, password: v }))} autoComplete="new-password" />
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={userData.privacyConsent}
                    onChange={(e) => setUserData((s) => ({ ...s, privacyConsent: e.target.checked }))}
                    className="h-5 w-5 mt-1"
                    style={{ accentColor: "#70B5E2" }}
                  />
                  <label style={{ color: "#293A49" }}>
                    Acepto el{" "}
                    <Link href="/aviso-privacidad" target="_blank" className="font-medium hover:underline" style={{ color: "#70B5E2" }}>
                      Aviso de Privacidad
                    </Link>{" "}
                    y los{" "}
                    <Link href="/terminos-uso" target="_blank" className="font-medium hover:underline" style={{ color: "#70B5E2" }}>
                      Términos de Uso
                    </Link>.
                  </label>
                </div>
              </div>

              {error && <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm">{error}</div>}

              <div className="flex justify-between mt-8">
                <button onClick={handleBack} className="px-8 py-3 rounded-xl font-medium transition-transform hover:scale-105 shadow-md" style={{ backgroundColor: "#f8f9fa", color: "#293A49" }}>
                  Volver
                </button>
                <button
                  onClick={onFinalSubmit}
                  disabled={submitting}
                  className="px-8 py-3 text-white rounded-xl font-medium transition-transform hover:scale-105 shadow-lg disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #70B5E2 0%, #37B6FF 100%)" }}
                >
                  {submitting ? "Registrando..." : "Registrarme"}
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="mb-4" style={{ color: "#6B7280" }}>O regístrate con:</p>
                <div className="flex justify-center space-x-4">
                  <button onClick={() => handleSocialLogin("google")} disabled={submitting} className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-transform hover:scale-105 disabled:opacity-60" aria-label="Regístrate con Google">
                    <FaGoogle className="w-6 h-6 text-red-500" />
                  </button>
                  <button onClick={() => handleSocialLogin("facebook")} disabled={submitting} className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-transform hover:scale-105 disabled:opacity-60" aria-label="Regístrate con Facebook">
                    <FaFacebook className="w-6 h-6 text-blue-600" />
                  </button>
                  <button onClick={() => handleSocialLogin("apple")} disabled={submitting} className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-transform hover:scale-105 disabled:opacity-60" aria-label="Regístrate con Apple">
                    <FaApple className="w-6 h-6 text-black" />
                  </button>
                </div>
              </div>
            </div>
          );

        // consultor
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium text-center mb-8" style={{ color: "#293A49" }}>Paso 5: Disponibilidad y Condiciones</h2>
            <div className="space-y-6">
              <InputField label="Horas semanales disponibles" placeholder="Ejemplo: 20 horas" value={horasSemanales} onChange={setHorasSemanales} />
              <SelectField label="¿Aceptas trabajo por proyecto?" value={trabajoProyecto} onChange={setTrabajoProyecto}>
                <option value="">Selecciona una opción</option>
                <option>Sí</option>
                <option>No</option>
              </SelectField>
              <SelectField label="Tipo de tarifa" value={tarifaTipo} onChange={setTarifaTipo}>
                <option value="">Selecciona el tipo de tarifa</option>
                <option>Por hora</option>
                <option>Por paquete</option>
                <option>A convenir</option>
              </SelectField>
              {tarifaTipo === "Por hora" && <InputField label="Tarifa por hora" placeholder="Ej: $500 MXN/h o $25 USD/h" value={tarifaHora} onChange={setTarifaHora} />}
              {tarifaTipo === "Por paquete" && <InputField label="Tarifa por paquete" placeholder="Ej: $10,000 MXN por proyecto" value={tarifaPaquete} onChange={setTarifaPaquete} />}
              <SelectField label="Motivación principal" value={motivacionConsultor} onChange={setMotivacionConsultor}>
                <option value="">¿Qué te motiva principalmente?</option>
                <option>Impacto</option>
                <option>Ingresos</option>
                <option>Marca personal</option>
                <option>Otro</option>
              </SelectField>
              {motivacionConsultor === "Otro" && <InputField label="" placeholder="Especifica tu motivación" value={otraMotivacion} onChange={setOtraMotivacion} />}
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      case 7:
        if (role === "consultor")
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: "#293A49" }}>Paso 6: Validaciones</h2>
              <div className="space-y-6">
                <InputField label="URL a tu CV" placeholder="Link de Drive/Dropbox o sitio web" value={curriculum} onChange={setCurriculum} autoComplete="url" />
                <InputField label="URL a tu portafolio (opcional)" placeholder="Portafolio o sitio profesional" value={portafolio} onChange={setPortafolio} autoComplete="url" />
                <InputField label="URL a tu LinkedIn (opcional)" placeholder="https://linkedin.com/in/tu-perfil" value={linkedin} onChange={setLinkedin} autoComplete="url" />
                <TextAreaField label="Referencias profesionales" placeholder="Nombre y contacto de al menos 2 referencias" value={referencias} onChange={setReferencias} rows={4} />
              </div>
              <PasoButtons onBack={handleBack} onNext={handleNext} nextText="Continuar" />
            </div>
          );
        return null;

      case 8:
        if (role === "consultor")
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: "#293A49" }}>Paso 7: Registro Final</h2>
              <div className="space-y-6">
                <InputField label="Crea tu contraseña" type="password" placeholder="Mínimo 8 caracteres" value={userData.password} onChange={(v) => setUserData((s) => ({ ...s, password: v }))} autoComplete="new-password" />
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={userData.privacyConsent}
                      onChange={(e) => setUserData((s) => ({ ...s, privacyConsent: e.target.checked }))}
                      className="h-5 w-5 mt-1"
                      style={{ accentColor: "#70B5E2" }}
                    />
                    <label style={{ color: "#293A49" }}>
                      Acepto el{" "}
                      <Link href="/aviso-privacidad" target="_blank" className="font-medium hover:underline" style={{ color: "#70B5E2" }}>
                        Aviso de Privacidad
                      </Link>{" "}
                      y los{" "}
                      <Link href="/terminos-uso" target="_blank" className="font-medium hover:underline" style={{ color: "#70B5E2" }}>
                        Términos de Uso
                      </Link>.
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={confirmacionEntrevista}
                      onChange={(e) => setConfirmacionEntrevista(e.target.checked)}
                      className="h-5 w-5 mt-1"
                      style={{ accentColor: "#70B5E2" }}
                    />
                    <label style={{ color: "#293A49" }}>
                      Confirmo mi disposición a participar en una entrevista de validación.
                    </label>
                  </div>
                </div>
              </div>

              {error && <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm">{error}</div>}

              <div className="flex justify-between mt-8">
                <button onClick={handleBack} className="px-8 py-3 rounded-xl font-medium transition-transform hover:scale-105 shadow-md" style={{ backgroundColor: "#f8f9fa", color: "#293A49" }}>
                  Volver
                </button>
                <button
                  onClick={onFinalSubmit}
                  disabled={submitting}
                  className="px-8 py-3 text-white rounded-xl font-medium transition-transform hover:scale-105 shadow-lg disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #70B5E2 0%, #37B6FF 100%)" }}
                >
                  {submitting ? "Registrando..." : "Registrarme"}
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="mb-4" style={{ color: "#6B7280" }}>O regístrate con:</p>
                <div className="flex justify-center space-x-4">
                  <button onClick={() => handleSocialLogin("google")} disabled={submitting} className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-transform hover:scale-105 disabled:opacity-60" aria-label="Regístrate con Google">
                    <FaGoogle className="w-6 h-6 text-red-500" />
                  </button>
                  <button onClick={() => handleSocialLogin("facebook")} disabled={submitting} className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-transform hover:scale-105 disabled:opacity-60" aria-label="Regístrate con Facebook">
                    <FaFacebook className="w-6 h-6 text-blue-600" />
                  </button>
                  <button onClick={() => handleSocialLogin("apple")} disabled={submitting} className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-transform hover:scale-105 disabled:opacity-60" aria-label="Regístrate con Apple">
                    <FaApple className="w-6 h-6 text-black" />
                  </button>
                </div>
              </div>
            </div>
          );
        return null;

      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Crear cuenta · MentHIA</title>
        <meta name="description" content="Regístrate para acceder a diagnósticos, mentoría y cursos - Asesoría integral, humana e inteligente para tu negocio" />
      </Head>

      <div
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative"
        style={{ background: "linear-gradient(135deg, #70B5E2 0%, #37B6FF 50%, #293A49 100%)" }}
      >
        {/* blobs decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20"
            style={{ background: "radial-gradient(circle, rgba(112,181,226,0.30) 0%, rgba(55,182,255,0.20) 100%)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse opacity-20"
            style={{ background: "radial-gradient(circle, rgba(55,182,255,0.30) 0%, rgba(41,58,73,0.20) 100%)" }}
          />
          <div
            className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-2xl animate-pulse opacity-15"
            style={{ background: "radial-gradient(circle, rgba(112,181,226,0.20) 0%, rgba(55,182,255,0.20) 100%)" }}
          />
        </div>

        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 border border-white/30">
          {renderStepIndicator()}
          {renderStep()}
        </div>
      </div>
    </>
  );
};

export default Register;

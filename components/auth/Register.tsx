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
        if (
          areasExperiencia.length === 0 ||
          (areasExperiencia.includes("Otro") && !otherAreaExperiencia.trim())
        ) {
          setError("Selecciona al menos un área de experiencia (si 'Otro', especifícalo).");
          return;
        }
        if (industrias.length === 0 || (industrias.includes("Otro") && !otherIndustry.trim())) {
          setError("Selecciona al menos una industria (si 'Otro', especifícalo).");
          return;
        }
        if (
          !casoExito ||
          !intervencionPreferida ||
          (intervencionPreferida === "Otro" && !otraIntervencion.trim())
        ) {
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
      <div className="flex justify-center mb-8">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-8 h-2 mx-1 rounded-full transition-all duration-300 ${
              current > i 
                ? "shadow-lg transform scale-105" 
                : "bg-gray-200"
            }`}
            style={{
              background: current > i 
                ? 'linear-gradient(135deg, #7085E2 0%, #37B6FF 100%)' 
                : undefined
            }}
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
    <div className="flex justify-between mt-8">
      <button 
        onClick={onBack} 
        className="px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
        style={{ 
          backgroundColor: '#f8f9fa',
          color: '#293A49',
          fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        Volver
      </button>
      <button 
        onClick={onNext} 
        className="px-8 py-3 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
        style={{ 
          background: 'linear-gradient(135deg, #7085E2 0%, #37B6FF 100%)',
          fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        {nextText}
      </button>
    </div>
  );

  const InputField = ({ label, placeholder, type = "text", value, onChange, className = "", ...props }: any) => (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none ${className}`}
        style={{
          borderColor: '#E5E7EB',
          color: '#293A49',
          fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
        onFocus={(e) => e.target.style.borderColor = '#7085E2'}
        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
        {...props}
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, children, className = "", ...props }: any) => (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none bg-white ${className}`}
        style={{
          borderColor: '#E5E7EB',
          color: '#293A49',
          fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
        onFocus={(e) => e.target.style.borderColor = '#7085E2'}
        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
        {...props}
      >
        {children}
      </select>
    </div>
  );

  const TextAreaField = ({ label, placeholder, value, onChange, className = "", ...props }: any) => (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none ${className}`}
        style={{
          borderColor: '#E5E7EB',
          color: '#293A49',
          fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
        onFocus={(e) => e.target.style.borderColor = '#7085E2'}
        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
        {...props}
      />
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-medium mb-4" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                ¿Qué te trae a MenthIA?
              </h1>
              <p className="text-gray-600" style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                Asesoría integral, humana e inteligente para tu negocio
              </p>
            </div>
            
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center text-sm transition-colors hover:underline"
                style={{ color: '#7085E2', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                ← Volver al inicio
              </Link>
            </div>
            
            <div className="space-y-4">
              {ROLES_FINAL.map((rol) => (
                <button
                  key={rol.value}
                  onClick={() => handleRoleSelection(rol.value)}
                  className="w-full p-6 rounded-xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 text-left"
                  style={{ 
                    background: 'linear-gradient(135deg, #7085E2 0%, #37B6FF 100%)',
                    color: 'white',
                    fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                >
                  <div className="font-semibold text-lg mb-2">{rol.label}</div>
                  <div className="text-sm opacity-95">{rol.description}</div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 text-center text-sm" style={{ color: '#6B7280', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-medium transition-colors hover:underline"
                style={{ color: '#7085E2' }}>
                Inicia sesión
              </Link>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium text-center mb-8" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Paso 1: Sobre ti
            </h2>
            <div className="space-y-6">
              <InputField
                label="Nombre completo"
                placeholder="Tu nombre completo"
                value={userData.fullName}
                onChange={(e: any) => setUserData({ ...userData, fullName: e.target.value })}
              />
              <InputField
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@correo.com"
                value={userData.email}
                onChange={(e: any) => setUserData({ ...userData, email: e.target.value })}
              />
              <InputField
                label="Número de teléfono (+ lada internacional)"
                type="tel"
                placeholder="+52 55 1234 5678"
                value={userData.phone}
                onChange={(e: any) => setUserData({ ...userData, phone: e.target.value })}
              />
              <InputField
                label="Año de nacimiento"
                type="number"
                placeholder="1990"
                value={userData.birthYear}
                onChange={(e: any) => setUserData({ ...userData, birthYear: e.target.value })}
                min={1900}
                max={new Date().getFullYear()}
              />
              <SelectField
                label="Idioma preferido"
                value={userData.language}
                onChange={(e: any) => setUserData({ ...userData, language: e.target.value })}
              >
                <option value="">Selecciona</option>
                <option value="Español">Español</option>
                <option value="Inglés">Inglés</option>
                <option value="Francés">Francés</option>
                <option value="Alemán">Alemán</option>
              </SelectField>
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  Género (opcional)
                </label>
                <div className="flex flex-wrap gap-4">
                  {["Mujer", "Hombre", "Prefiero no decirlo", "Otro"].map((g) => (
                    <label key={g} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value={g}
                        checked={userData.gender === g}
                        onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                        className="h-4 w-4 mr-2"
                        style={{ accentColor: '#7085E2' }}
                      />
                      <span style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <InputField
                label="País"
                placeholder="Tu país de residencia"
                value={userData.country}
                onChange={(e: any) => setUserData({ ...userData, country: e.target.value })}
              />
              <InputField
                label="Ciudad"
                placeholder="Tu ciudad"
                value={userData.city}
                onChange={(e: any) => setUserData({ ...userData, city: e.target.value })}
              />
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      case 3:
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                Paso 2: Sobre tu Negocio/Institución
              </h2>
              <div className="space-y-6">
                <InputField
                  label="Motivación principal"
                  placeholder="¿Qué te motiva a buscar asesoría?"
                  value={motivation}
                  onChange={(e: any) => setMotivation(e.target.value)}
                />
                <InputField
                  label="Nombre del negocio / institución"
                  placeholder="Nombre de tu organización"
                  value={businessName}
                  onChange={(e: any) => setBusinessName(e.target.value)}
                />
                <InputField
                  label="Relación con el negocio"
                  placeholder="Propietario, empleado, socio, etc."
                  value={businessRelationship}
                  onChange={(e: any) => setBusinessRelationship(e.target.value)}
                />
                <SelectField
                  label="Etapa del negocio"
                  value={businessStage}
                  onChange={(e: any) => setBusinessStage(e.target.value)}
                >
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
        }
        // Consultor — Paso 2 (Formación y experiencia)
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium text-center mb-8" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Paso 2: Formación y Experiencia
            </h2>
            <div className="space-y-6">
              <SelectField
                label="Último grado académico"
                value={ultimoGrado}
                onChange={(e: any) => setUltimoGrado(e.target.value)}
              >
                <option value="">Selecciona tu último grado</option>
                <option>Licenciatura</option>
                <option>Maestría</option>
                <option>Doctorado</option>
                <option>Otro</option>
              </SelectField>
              {ultimoGrado === "Otro" && (
                <InputField
                  label="Especifica tu grado"
                  placeholder="Describe tu formación académica"
                  value={otroGrado}
                  onChange={(e: any) => setOtroGrado(e.target.value)}
                />
              )}
              <InputField
                label="Área de estudios"
                placeholder="Administración, Ingeniería, Psicología, etc."
                value={areaEstudios}
                onChange={(e: any) => setAreaEstudios(e.target.value)}
              />
              <InputField
                label="Años de experiencia"
                placeholder="Número de años de experiencia profesional"
                value={anosExperiencia}
                onChange={(e: any) => setAnosExperiencia(e.target.value)}
              />
              <SelectField
                label="Experiencia con MiPyMEs"
                value={experienciaMipymes}
                onChange={(e: any) => setExperienciaMipymes(e.target.value)}
              >
                <option value="">Selecciona tu nivel de experiencia</option>
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </SelectField>
              <SelectField
                label="Colaboración con instituciones"
                value={colaboracionInstitucional}
                onChange={(e: any) => setColaboracionInstitucional(e.target.value)}
              >
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
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                Paso 3: Retos y Metas
              </h2>
              <div className="space-y-6">
                <InputField
                  label="Principal reto actual"
                  placeholder="¿Cuál es el mayor desafío que enfrenta tu negocio?"
                  value={mainChallenge}
                  onChange={(e: any) => setMainChallenge(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    Metas principales (selecciona todas las que apliquen)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Ventas", "Operación", "Finanzas", "Talento", "Otro"].map((g) => (
                      <label key={g} className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer"
                        style={{ borderColor: goals.includes(g) ? '#7085E2' : '#E5E7EB', backgroundColor: goals.includes(g) ? '#F0F4FF' : 'white' }}>
                        <input
                          type="checkbox"
                          checked={goals.includes(g)}
                          onChange={() => handleCheckboxChange(setGoals, goals, g, otherGoal, setOtherGoal)}
                          className="h-4 w-4"
                          style={{ accentColor: '#7085E2' }}
                        />
                        <span style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>{g}</span>
                      </label>
                    ))}
                  </div>
                  {goals.includes("Otro") && (
                    <InputField
                      label=""
                      placeholder="Especifica tu otra meta"
                      value={otherGoal}
                      onChange={(e: any) => setOtherGoal(e.target.value)}
                      className="mt-3"
                    />
                  )}
                </div>
                <SelectField
                  label="¿Has tenido asesoría previa?"
                  value={previousAdvisory}
                  onChange={(e: any) => setPreviousAdvisory(e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  <option>Sí</option>
                  <option>No</option>
                </SelectField>
              </div>
              <PasoButtons onBack={handleBack} onNext={handleNext} />
            </div>
          );
        }
        // Consultor
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium text-center mb-8" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Paso 3: Áreas, Industrias y Experiencia
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  Áreas de experiencia
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Estrategia", "Finanzas", "Operaciones", "Marketing", "Talento", "Otro"].map((a) => (
                    <label key={a} className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer"
                      style={{ borderColor: areasExperiencia.includes(a) ? '#7085E2' : '#E5E7EB', backgroundColor: areasExperiencia.includes(a) ? '#F0F4FF' : 'white' }}>
                      <input
                        type="checkbox"
                        checked={areasExperiencia.includes(a)}
                        onChange={() => handleCheckboxChange(setAreasExperiencia, areasExperiencia, a, otherAreaExperiencia, setOtherAreaExperiencia)}
                        className="h-4 w-4"
                        style={{ accentColor: '#7085E2' }}
                      />
                      <span style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>{a}</span>
                    </label>
                  ))}
                </div>
                {areasExperiencia.includes("Otro") && (
                  <InputField
                    label=""
                    placeholder="Especifica otra área"
                    value={otherAreaExperiencia}
                    onChange={(e: any) => setOtherAreaExperiencia(e.target.value)}
                    className="mt-3"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  Industrias de experiencia
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Retail", "Manufactura", "Servicios", "Tecnología", "Salud", "Otro"].map((i) => (
                    <label key={i} className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer"
                      style={{ borderColor: industrias.includes(i) ? '#7085E2' : '#E5E7EB', backgroundColor: industrias.includes(i) ? '#F0F4FF' : 'white' }}>
                      <input
                        type="checkbox"
                        checked={industrias.includes(i)}
                        onChange={() => handleCheckboxChange(setIndustrias, industrias, i, otherIndustry, setOtherIndustry)}
                        className="h-4 w-4"
                        style={{ accentColor: '#7085E2' }}
                      />
                      <span style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>{i}</span>
                    </label>
                  ))}
                </div>
                {industrias.includes("Otro") && (
                  <InputField
                    label=""
                    placeholder="Especifica otra industria"
                    value={otherIndustry}
                    onChange={(e: any) => setOtherIndustry(e.target.value)}
                    className="mt-3"
                  />
                )}
              </div>

              <TextAreaField
                label="Caso de éxito"
                placeholder="Describe brevemente un caso de éxito relevante de tu experiencia profesional"
                value={casoExito}
                onChange={(e: any) => setCasoExito(e.target.value)}
                rows={4}
              />
              
              <SelectField
                label="Intervención preferida"
                value={intervencionPreferida}
                onChange={(e: any) => setIntervencionPreferida(e.target.value)}
              >
                <option value="">Selecciona tu intervención preferida</option>
                <option>Diagnóstico</option>
                <option>Implementación</option>
                <option>Acompañamiento</option>
                <option>Otro</option>
              </SelectField>
              
              {intervencionPreferida === "Otro" && (
                <InputField
                  label=""
                  placeholder="Especifica tu intervención preferida"
                  value={otraIntervencion}
                  onChange={(e: any) => setOtraIntervencion(e.target.value)}
                />
              )}
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      case 5:
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                Paso 4: Áreas de Apoyo
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    Selecciona las áreas donde necesitas apoyo
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Diagnóstico", "Mentoría", "Capacitación", "Implementación", "Otro"].map((s) => (
                      <label key={s} className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer"
                        style={{ borderColor: supportAreas.includes(s) ? '#7085E2' : '#E5E7EB', backgroundColor: supportAreas.includes(s) ? '#F0F4FF' : 'white' }}>
                        <input
                          type="checkbox"
                          checked={supportAreas.includes(s)}
                          onChange={() => handleCheckboxChange(setSupportAreas, supportAreas, s, otherSupportArea, setOtherSupportArea)}
                          className="h-4 w-4"
                          style={{ accentColor: '#7085E2' }}
                        />
                        <span style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>{s}</span>
                      </label>
                    ))}
                  </div>
                  {supportAreas.includes("Otro") && (
                    <InputField
                      label=""
                      placeholder="Especifica otra área de apoyo"
                      value={otherSupportArea}
                      onChange={(e: any) => setOtherSupportArea(e.target.value)}
                      className="mt-3"
                    />
                  )}
                </div>
              </div>
              <PasoButtons onBack={handleBack} onNext={handleNext} />
            </div>
          );
        }
        // Consultor — Estilo y metodología
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium text-center mb-8" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Paso 4: Estilo y Metodología
            </h2>
            <div className="space-y-6">
              <SelectField
                label="Nivel de acompañamiento"
                value={acompanamiento}
                onChange={(e: any) => setAcompanamiento(e.target.value)}
              >
                <option value="">Selecciona el nivel de acompañamiento</option>
                <option>Ligero</option>
                <option>Medio</option>
                <option>Intensivo</option>
              </SelectField>
              
              <SelectField
                label="Modalidad de trabajo"
                value={modalidad}
                onChange={(e: any) => setModalidad(e.target.value)}
              >
                <option value="">Selecciona tu modalidad preferida</option>
                <option>Remoto</option>
                <option>Presencial</option>
                <option>Mixto</option>
              </SelectField>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  Herramientas digitales que utilizas
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Drive", "Notion", "Slack", "Zoom", "Otra"].map((h) => (
                    <label key={h} className="flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer"
                      style={{ borderColor: herramientasDigitales.includes(h) ? '#7085E2' : '#E5E7EB', backgroundColor: herramientasDigitales.includes(h) ? '#F0F4FF' : 'white' }}>
                      <input
                        type="checkbox"
                        checked={herramientasDigitales.includes(h)}
                        onChange={() => handleCheckboxChange(setHerramientasDigitales, herramientasDigitales, h, otherDigitalTool, setOtherDigitalTool)}
                        className="h-4 w-4"
                        style={{ accentColor: '#7085E2' }}
                      />
                      <span style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>{h}</span>
                    </label>
                  ))}
                </div>
                {herramientasDigitales.includes("Otra") && (
                  <InputField
                    label=""
                    placeholder="Especifica otra herramienta"
                    value={otherDigitalTool}
                    onChange={(e: any) => setOtherDigitalTool(e.target.value)}
                    className="mt-3"
                  />
                )}
              </div>

              <InputField
                label="Recursos propios"
                placeholder="Describe tus plantillas, metodologías o recursos propios"
                value={recursosPropios}
                onChange={(e: any) => setRecursosPropios(e.target.value)}
              />
              
              <SelectField
                label="¿Entregas reportes estructurados?"
                value={reportesEstructurados}
                onChange={(e: any) => setReportesEstructurados(e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                <option>Sí</option>
                <option>No</option>
              </SelectField>
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      case 6:
        if (["emprendedor", "empresa", "universidad", "gobierno"].includes(role)) {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                Paso 5: Registro Final
              </h2>
              <div className="space-y-6">
                <InputField
                  label="Crea tu contraseña"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={userData.password}
                  onChange={(e: any) => setUserData({ ...userData, password: e.target.value })}
                />
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={userData.privacyConsent}
                    onChange={(e) => setUserData({ ...userData, privacyConsent: e.target.checked })}
                    className="h-5 w-5 mt-1"
                    style={{ accentColor: '#7085E2' }}
                  />
                  <label style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                    Acepto el{" "}
                    <Link href="/aviso-privacidad" target="_blank" className="font-medium hover:underline"
                      style={{ color: '#7085E2' }}>
                      Aviso de Privacidad
                    </Link>{" "}
                    y los{" "}
                    <Link href="/terminos-uso" target="_blank" className="font-medium hover:underline"
                      style={{ color: '#7085E2' }}>
                      Términos de Uso
                    </Link>.
                  </label>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center"
                  style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  {error}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button 
                  onClick={handleBack} 
                  className="px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                  style={{ 
                    backgroundColor: '#f8f9fa',
                    color: '#293A49',
                    fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                >
                  Volver
                </button>
                <button 
                  onClick={onFinalSubmit} 
                  disabled={submitting} 
                  className="px-8 py-3 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-60"
                  style={{ 
                    background: 'linear-gradient(135deg, #7085E2 0%, #37B6FF 100%)',
                    fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                >
                  {submitting ? "Registrando..." : "Registrarme"}
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="mb-4" style={{ color: '#6B7280', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  O regístrate con:
                </p>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => handleSocialLogin("google")} 
                    disabled={submitting} 
                    className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-60"
                    aria-label="Regístrate con Google"
                  >
                    <FaGoogle className="w-6 h-6 text-red-500" />
                  </button>
                  <button 
                    onClick={() => handleSocialLogin("facebook")} 
                    disabled={submitting} 
                    className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-60"
                    aria-label="Regístrate con Facebook"
                  >
                    <FaFacebook className="w-6 h-6 text-blue-600" />
                  </button>
                  <button 
                    onClick={() => handleSocialLogin("apple")} 
                    disabled={submitting} 
                    className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-60"
                    aria-label="Regístrate con Apple"
                  >
                    <FaApple className="w-6 h-6 text-black" />
                  </button>
                </div>
              </div>
            </div>
          );
        }
        // Consultor — Paso 5: Disponibilidad y condiciones
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium text-center mb-8" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Paso 5: Disponibilidad y Condiciones
            </h2>
            <div className="space-y-6">
              <InputField
                label="Horas semanales disponibles"
                placeholder="Ejemplo: 20 horas"
                value={horasSemanales}
                onChange={(e: any) => setHorasSemanales(e.target.value)}
              />
              
              <SelectField
                label="¿Aceptas trabajo por proyecto?"
                value={trabajoProyecto}
                onChange={(e: any) => setTrabajoProyecto(e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                <option>Sí</option>
                <option>No</option>
              </SelectField>

              <SelectField
                label="Tipo de tarifa"
                value={tarifaTipo}
                onChange={(e: any) => setTarifaTipo(e.target.value)}
              >
                <option value="">Selecciona el tipo de tarifa</option>
                <option>Por hora</option>
                <option>Por paquete</option>
                <option>A convenir</option>
              </SelectField>
              
              {tarifaTipo === "Por hora" && (
                <InputField
                  label="Tarifa por hora"
                  placeholder="Ejemplo: $500 MXN/hora o $25 USD/hora"
                  value={tarifaHora}
                  onChange={(e: any) => setTarifaHora(e.target.value)}
                />
              )}
              
              {tarifaTipo === "Por paquete" && (
                <InputField
                  label="Tarifa por paquete"
                  placeholder="Ejemplo: $10,000 MXN por proyecto completo"
                  value={tarifaPaquete}
                  onChange={(e: any) => setTarifaPaquete(e.target.value)}
                />
              )}

              <SelectField
                label="Motivación principal"
                value={motivacionConsultor}
                onChange={(e: any) => setMotivacionConsultor(e.target.value)}
              >
                <option value="">¿Qué te motiva principalmente?</option>
                <option>Impacto</option>
                <option>Ingresos</option>
                <option>Marca personal</option>
                <option>Otro</option>
              </SelectField>
              
              {motivacionConsultor === "Otro" && (
                <InputField
                  label=""
                  placeholder="Especifica tu motivación"
                  value={otraMotivacion}
                  onChange={(e: any) => setOtraMotivacion(e.target.value)}
                />
              )}
            </div>
            <PasoButtons onBack={handleBack} onNext={handleNext} />
          </div>
        );

      case 7:
        if (role === "consultor") {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                Paso 6: Validaciones
              </h2>
              <div className="space-y-6">
                <InputField
                  label="URL a tu CV"
                  placeholder="Link de Google Drive, Dropbox o sitio web"
                  value={curriculum}
                  onChange={(e: any) => setCurriculum(e.target.value)}
                />
                <InputField
                  label="URL a tu portafolio (opcional)"
                  placeholder="Link a tu portafolio o sitio web profesional"
                  value={portafolio}
                  onChange={(e: any) => setPortafolio(e.target.value)}
                />
                <InputField
                  label="URL a tu LinkedIn (opcional)"
                  placeholder="https://linkedin.com/in/tu-perfil"
                  value={linkedin}
                  onChange={(e: any) => setLinkedin(e.target.value)}
                />
                <TextAreaField
                  label="Referencias profesionales"
                  placeholder="Proporciona nombre y contacto de al menos 2 referencias profesionales"
                  value={referencias}
                  onChange={(e: any) => setReferencias(e.target.value)}
                  rows={4}
                />
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center"
                  style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  {error}
                </div>
              )}

              <PasoButtons onBack={handleBack} onNext={handleNext} nextText="Continuar" />
            </div>
          );
        }
        return null;

      case 8:
        if (role === "consultor") {
          return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-medium text-center mb-8" style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                Paso 7: Registro Final
              </h2>
              <div className="space-y-6">
                <InputField
                  label="Crea tu contraseña"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={userData.password}
                  onChange={(e: any) => setUserData({ ...userData, password: e.target.value })}
                />
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={userData.privacyConsent}
                      onChange={(e) => setUserData({ ...userData, privacyConsent: e.target.checked })}
                      className="h-5 w-5 mt-1"
                      style={{ accentColor: '#7085E2' }}
                    />
                    <label style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      Acepto el{" "}
                      <Link href="/aviso-privacidad" target="_blank" className="font-medium hover:underline"
                        style={{ color: '#7085E2' }}>
                        Aviso de Privacidad
                      </Link>{" "}
                      y los{" "}
                      <Link href="/terminos-uso" target="_blank" className="font-medium hover:underline"
                        style={{ color: '#7085E2' }}>
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
                      style={{ accentColor: '#7085E2' }}
                    />
                    <label style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      Confirmo mi disposición a participar en una entrevista de validación.
                    </label>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center"
                  style={{ fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  {error}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button 
                  onClick={handleBack} 
                  className="px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                  style={{ 
                    backgroundColor: '#f8f9fa',
                    color: '#293A49',
                    fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                >
                  Volver
                </button>
                <button 
                  onClick={onFinalSubmit} 
                  disabled={submitting} 
                  className="px-8 py-3 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-60"
                  style={{ 
                    background: 'linear-gradient(135deg, #7085E2 0%, #37B6FF 100%)',
                    fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                >
                  {submitting ? "Registrando..." : "Registrarme"}
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="mb-4" style={{ color: '#6B7280', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  O regístrate con:
                </p>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => handleSocialLogin("google")} 
                    disabled={submitting} 
                    className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-60"
                    aria-label="Regístrate con Google"
                  >
                    <FaGoogle className="w-6 h-6 text-red-500" />
                  </button>
                  <button 
                    onClick={() => handleSocialLogin("facebook")} 
                    disabled={submitting} 
                    className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-60"
                    aria-label="Regístrate con Facebook"
                  >
                    <FaFacebook className="w-6 h-6 text-blue-600" />
                  </button>
                  <button 
                    onClick={() => handleSocialLogin("apple")} 
                    disabled={submitting} 
                    className="p-4 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-60"
                    aria-label="Regístrate con Apple"
                  >
                    <FaApple className="w-6 h-6 text-black" />
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
        <title>Crear cuenta · MenthIA</title>
        <meta name="description" content="Regístrate para acceder a diagnósticos, mentoría y cursos - Asesoría integral, humana e inteligente para tu negocio" />
      </Head>
      <div 
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative"
        style={{ 
          background: 'linear-gradient(135deg, #7085E2 0%, #37B6FF 50%, #293A49 100%)',
          fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(112, 133, 226, 0.3) 0%, rgba(55, 182, 255, 0.2) 100%)' }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(55, 182, 255, 0.3) 0%, rgba(41, 58, 73, 0.2) 100%)' }}
          />
          <div 
            className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-2xl animate-pulse delay-500 opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(112, 133, 226, 0.2) 0%, rgba(55, 182, 255, 0.2) 100%)' }}
          />
        </div>

        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 border border-white/30">
          {step === 1 && (
            <div className="text-center mb-8">
              <h1 
                className="text-3xl font-medium cursor-pointer hover:underline transition-colors"
                onClick={() => router.push("/")}
                style={{ color: '#293A49', fontFamily: 'Avenir, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                MenthIA
              </h1>
            </div>
          )}
          
          {renderStepIndicator()}
          {renderStep()}
        </div>
      </div>
    </>
  );
};

export default Register;
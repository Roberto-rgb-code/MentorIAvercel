// pages/dashboard/diagnostico/emergencia.tsx
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../contexts/AuthContext";
import PrivateLayout from "../../../components/layout/PrivateLayout";
import "animate.css";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

/** ========= Tipos ========= */
interface DiagnosticoEmergenciaData {
  userId: string;
  nombreSolicitante: string;
  puestoSolicitante: string;
  nombreEmpresa: string;
  rfcEmpresa: string;
  giroIndustria: string;
  numeroEmpleados: string;
  antiguedadEmpresa: string;
  ubicacion: string;
  telefonoContacto: string;
  correoElectronico: string;
  sitioWebRedes: string;
  areaMayorProblema: string;
  problematicaEspecifica: string;
  principalPrioridad: string;
  problemaMasUrgente: string;
  impactoDelProblema: string;
  continuidadNegocio: "1" | "2" | "3" | "4" | "5" | "";
  flujoEfectivo: "Si" | "No" | "Parcialmente" | "";
  ventasDisminuido: "Si" | "No" | "No lo sé" | "";
  personalAfectado: "Si" | "No" | "No aplica" | "";
  operacionesCalidadTiempo: "Si" | "No" | "Parcialmente" | "";
  suministroMateriales: "Si" | "No" | "Parcialmente" | "";
  capacidadAdaptarse: "1" | "2" | "3" | "4" | "5" | "";
  apoyoExterno: "Si" | "No" | "Estoy buscando" | "";
  createdAt: string;
}

type Riesgo = "bajo" | "moderado" | "alto" | "critico";

interface LLMAnalysisResult {
  diagnostico_rapido: string;
  acciones_inmediatas: string[];
  riesgo_general: Riesgo;
  recomendaciones_clave: string[];
}

type ChatItem =
  | { type: "bot"; message: React.ReactNode; isLoader?: boolean }
  | { type: "user"; message: React.ReactNode; isLoader?: boolean };

/** ========= Loader minimal ========= */
const UiverseLoader = () => (
  <>
    <style jsx>{`
      .dots:after {
        content: " ";
        display: inline-block;
        width: 1.2em;
        text-align: left;
        animation: ellipsis steps(4, end) 900ms infinite;
      }
      @keyframes ellipsis {
        to {
          width: 4.8em;
        }
      }
    `}</style>
    <div className="dots">Cargando</div>
  </>
);

/** ========= Chat bubble ========= */
interface ChatBubbleProps {
  message: string | React.ReactNode;
  isUser?: boolean;
  isLoader?: boolean;
}
const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser = false,
  isLoader = false,
}) => {
  const alignClass = isUser ? "justify-end" : "justify-start";
  const bubbleClass = isUser
    ? "bg-red-600 text-white rounded-br-none"
    : "bg-gray-200 text-gray-800 rounded-bl-none";
  return (
    <div className={`flex mb-4 animate__animated animate__fadeIn ${alignClass}`}>
      <div className={`max-w-xs lg:max-w-md p-4 rounded-xl shadow-md ${bubbleClass}`}>
        {isLoader ? <UiverseLoader /> : message}
      </div>
    </div>
  );
};

/** ========= Preguntas ========= */
const chatQuestions: Array<{
  key: string;
  message: string;
  component: React.ComponentType<any> | null; // <- fix: sin JSX.Element
  dataKey?: keyof DiagnosticoEmergenciaData;
}> = [
  {
    key: "intro1",
    message:
      "Este diagnóstico de emergencia identifica rápido lo más crítico para decidir y priorizar. La información es confidencial.",
    component: null,
  },
  {
    key: "intro2",
    message: "¿Listo? Empecemos con tus datos para contextualizar:",
    component: null,
  },

  {
    key: "nombreSolicitante",
    message: "1/11. Tu nombre ✍️",
    component: (p: any) => <input {...p} type="text" placeholder="Tu nombre" />,
    dataKey: "nombreSolicitante",
  },
  {
    key: "puestoSolicitante",
    message: "2/11. Tu puesto 💼",
    component: (p: any) => <input {...p} type="text" placeholder="Puesto" />,
    dataKey: "puestoSolicitante",
  },
  {
    key: "nombreEmpresa",
    message: "3/11. Nombre de la empresa 🏢",
    component: (p: any) => <input {...p} type="text" placeholder="Empresa" />,
    dataKey: "nombreEmpresa",
  },
  {
    key: "rfcEmpresa",
    message: "4/11. RFC (si aplica)",
    component: (p: any) => <input {...p} type="text" placeholder="RFC (opcional)" />,
    dataKey: "rfcEmpresa",
  },
  {
    key: "giroIndustria",
    message: "5/11. Giro o industria 🏭",
    component: (p: any) => <input {...p} type="text" placeholder="Industria" />,
    dataKey: "giroIndustria",
  },
  {
    key: "numeroEmpleados",
    message: "6/11. Nº de empleados 👥",
    component: (p: any) => <input {...p} type="text" placeholder="Ej. 25" />,
    dataKey: "numeroEmpleados",
  },
  {
    key: "antiguedadEmpresa",
    message: "7/11. Antigüedad (años) ⏳",
    component: (p: any) => <input {...p} type="text" placeholder="Ej. 8" />,
    dataKey: "antiguedadEmpresa",
  },
  {
    key: "ubicacion",
    message: "8/11. Ciudad y estado 📍",
    component: (p: any) => <input {...p} type="text" placeholder="Ciudad, Estado" />,
    dataKey: "ubicacion",
  },
  {
    key: "telefonoContacto",
    message: "9/11. Teléfono 📞",
    component: (p: any) => <input {...p} type="tel" placeholder="Teléfono" />,
    dataKey: "telefonoContacto",
  },
  {
    key: "correoElectronico",
    message: "10/11. Correo 📧",
    component: (p: any) => <input {...p} type="email" placeholder="Correo" />,
    dataKey: "correoElectronico",
  },
  {
    key: "sitioWebRedes",
    message: "11/11. Sitio web o redes 🌐",
    component: (p: any) => <input {...p} type="text" placeholder="URL o usuario (opcional)" />,
    dataKey: "sitioWebRedes",
  },

  {
    key: "areaMayorProblema",
    message: "Área con mayor problema (Ventas, Finanzas, Operaciones...) 🚨",
    component: (p: any) => <input {...p} type="text" placeholder="Área principal" />,
    dataKey: "areaMayorProblema",
  },
  {
    key: "problematicaEspecifica",
    message: "Describe la problemática específica 🤯",
    component: (p: any) => <textarea {...p} rows={3} placeholder="Problema específico" />,
    dataKey: "problematicaEspecifica",
  },
  {
    key: "principalPrioridad",
    message: "Principal prioridad a corto plazo 🎯",
    component: (p: any) => <textarea {...p} rows={2} placeholder="Prioridad principal" />,
    dataKey: "principalPrioridad",
  },

  {
    key: "problemaMasUrgente",
    message: "En una frase, el problema más URGENTE hoy 💥",
    component: (p: any) => <textarea {...p} rows={2} placeholder="Problema urgente" />,
    dataKey: "problemaMasUrgente",
  },
  {
    key: "impactoDelProblema",
    message: "¿Afecta finanzas, operación, clientes o personal? 📉",
    component: (p: any) => <textarea {...p} rows={2} placeholder="Impacto" />,
    dataKey: "impactoDelProblema",
  },

  {
    key: "continuidadNegocio",
    message: "Riesgo de detener operaciones 1–5 (1 sin impacto, 5 inminente) 🛑",
    component: (p: any) => (
      <select {...p} className="w-full">
        <option value="">Seleccione...</option>
        <option value="1">1</option><option value="2">2</option>
        <option value="3">3</option><option value="4">4</option><option value="5">5</option>
      </select>
    ),
    dataKey: "continuidadNegocio",
  },
  {
    key: "flujoEfectivo",
    message: "¿Cubre gastos básicos 1 mes? 💰",
    component: (p: any) => (
      <select {...p} className="w-full">
        <option value="">Seleccione...</option>
        <option value="Si">Sí</option><option value="No">No</option>
        <option value="Parcialmente">Parcialmente</option>
      </select>
    ),
    dataKey: "flujoEfectivo",
  },
  {
    key: "ventasDisminuido",
    message: "¿Ventas han caído en 3 meses? 📉",
    component: (p: any) => (
      <select {...p} className="w-full">
        <option value="">Seleccione...</option>
        <option value="Si">Sí</option><option value="No">No</option><option value="No lo sé">No lo sé</option>
      </select>
    ),
    dataKey: "ventasDisminuido",
  },
  {
    key: "personalAfectado",
    message: "¿Conflictos/ausencias/rotación? 😟",
    component: (p: any) => (
      <select {...p} className="w-full">
        <option value="">Seleccione...</option>
        <option value="Si">Sí</option><option value="No">No</option><option value="No aplica">No aplica</option>
      </select>
    ),
    dataKey: "personalAfectado",
  },
  {
    key: "operacionesCalidadTiempo",
    message: "¿Cumples calidad y tiempos? ⚙️",
    component: (p: any) => (
      <select {...p} className="w-full">
        <option value="">Seleccione...</option>
        <option value="Si">Sí</option><option value="No">No</option><option value="Parcialmente">Parcialmente</option>
      </select>
    ),
    dataKey: "operacionesCalidadTiempo",
  },
  {
    key: "suministroMateriales",
    message: "¿Asegurado insumos críticos próximas semanas? 📦",
    component: (p: any) => (
      <select {...p} className="w-full">
        <option value="">Seleccione...</option>
        <option value="Si">Sí</option><option value="No">No</option><option value="Parcialmente">Parcialmente</option>
      </select>
    ),
    dataKey: "suministroMateriales",
  },
  {
    key: "capacidadAdaptarse",
    message: "Preparación 1–5 para decidir rápido 🧠",
    component: (p: any) => (
      <select {...p} className="w-full">
        <option value="">Seleccione...</option>
        <option value="1">1</option><option value="2">2</option>
        <option value="3">3</option><option value="4">4</option><option value="5">5</option>
      </select>
    ),
    dataKey: "capacidadAdaptarse",
  },
  {
    key: "apoyoExterno",
    message: "¿Tienes apoyo externo? 🤝",
    component: (p: any) => (
      <select {...p} className="w-full">
        <option value="">Seleccione...</option>
        <option value="Si">Sí</option><option value="No">No</option><option value="Estoy buscando">Estoy buscando</option>
      </select>
    ),
    dataKey: "apoyoExterno",
  },
];

/** ========= Componente principal ========= */
const DiagnosticoEmergencia: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [datos, setDatos] = useState<DiagnosticoEmergenciaData>({
    userId: "",
    nombreSolicitante: "",
    puestoSolicitante: "",
    nombreEmpresa: "",
    rfcEmpresa: "",
    giroIndustria: "",
    numeroEmpleados: "",
    antiguedadEmpresa: "",
    ubicacion: "",
    telefonoContacto: "",
    correoElectronico: "",
    sitioWebRedes: "",
    areaMayorProblema: "",
    problematicaEspecifica: "",
    principalPrioridad: "",
    problemaMasUrgente: "",
    impactoDelProblema: "",
    continuidadNegocio: "",
    flujoEfectivo: "",
    ventasDisminuido: "",
    personalAfectado: "",
    operacionesCalidadTiempo: "",
    suministroMateriales: "",
    capacidadAdaptarse: "",
    apoyoExterno: "",
    createdAt: new Date().toISOString(),
  });
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analisis, setAnalisis] = useState<LLMAnalysisResult | null>(null);

  useEffect(() => {
    if (user?.id && !datos.userId) {
      setDatos((prev) => ({ ...prev, userId: user.id! }));
    }
  }, [user?.id, datos.userId]);

  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        { type: "bot", message: chatQuestions[0].message },
        { type: "bot", message: chatQuestions[1].message },
        { type: "bot", message: chatQuestions[2].message },
      ]);
    }
  }, [chatHistory.length]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleNextStep = async () => {
    const nextIndex = step + 2;
    const currentQ = chatQuestions[nextIndex];

    if (currentQ?.dataKey && !currentAnswer) return;

    const updatedDatos = currentQ?.dataKey
      ? { ...datos, [currentQ.dataKey]: currentAnswer }
      : datos;
    setDatos(updatedDatos);

    if (currentAnswer) {
      setChatHistory((prev) => [...prev, { type: "user", message: currentAnswer }]);
      setCurrentAnswer("");
    }

    if (nextIndex + 1 >= chatQuestions.length) {
      await handleSubmit(updatedDatos);
      return;
    }

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", message: chatQuestions[nextIndex + 1].message },
      ]);
      setStep((s) => s + 1);
    }, 400);
  };

  const handleSubmit = async (finalDatos: DiagnosticoEmergenciaData) => {
    setIsLoading(true);
    setChatHistory((prev) => [
      ...prev,
      { type: "bot", message: "Analizando tus respuestas...", isLoader: true },
    ]);

    const payload: DiagnosticoEmergenciaData = {
      ...finalDatos,
      userId: finalDatos.userId || user?.id || "anon",
    };

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 30000); // 30s

    try {
      const response = await fetch(
        "https://mentorapp-api-llm.onrender.com/api/diagnostico/emergencia/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        let msg = "Error al procesar el diagnóstico.";
        try {
          const err = await response.json();
          if (err?.error || err?.detail) msg = err.error || err.detail;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const result = (await response.json()) as LLMAnalysisResult;
      setAnalisis(result);

      setChatHistory((prev) => [
        ...prev.filter((i) => !i.isLoader),
        {
          type: "bot",
          message: (
            <>
              <h3 className="font-bold text-lg text-red-700">Diagnóstico rápido</h3>
              <p className="mt-2 whitespace-pre-wrap">{result.diagnostico_rapido}</p>

              <h3 className="font-bold text-lg text-red-700 mt-4">Acciones inmediatas</h3>
              <ul className="list-disc list-inside mt-2">
                {result.acciones_inmediatas.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>

              <h3 className="font-bold text-lg mt-4">
                Riesgo general:{" "}
                <span className={getRiesgoColor(result.riesgo_general)}>
                  {result.riesgo_general.toUpperCase()}
                </span>
              </h3>

              <h3 className="font-bold text-lg text-red-700 mt-4">
                Recomendaciones (2–4 semanas)
              </h3>
              <ul className="list-disc list-inside mt-2">
                {result.recomendaciones_clave.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>

              <p className="mt-3 text-gray-700">
                Un consultor te contactará para explicar resultados y siguientes pasos.
              </p>
            </>
          ),
        },
      ]);
    } catch (error: any) {
      setChatHistory((prev) => [
        ...prev.filter((i) => !i.isLoader),
        { type: "bot", message: `Ocurrió un error: ${error?.message || "desconocido"}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiesgoColor = (riesgo: Riesgo) => {
    switch (riesgo) {
      case "bajo":
        return "text-green-600";
      case "moderado":
        return "text-yellow-600";
      case "alto":
        return "text-orange-600";
      case "critico":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const renderCurrentQuestion = () => {
    const currentQuestion = chatQuestions[step + 2];
    if (!currentQuestion || analisis) return null;

    const InputComponent = currentQuestion.component;
    return (
      <div className="flex items-center space-x-4 mt-4 animate__animated animate__fadeInUp">
        {InputComponent && currentQuestion.dataKey && (
          <InputComponent
            name={currentQuestion.dataKey}
            value={currentAnswer}
            onChange={(
              e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
            ) => setCurrentAnswer(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          />
        )}
        <button
          onClick={handleNextStep}
          disabled={isLoading || (!!currentQuestion.dataKey && !currentAnswer)}
          className={`p-3 rounded-full ${
            isLoading || (!!currentQuestion.dataKey && !currentAnswer)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          } text-white transition-colors duration-200`}
        >
          <ArrowRightIcon className="h-6 w-6" />
        </button>
      </div>
    );
  };

  return (
    <PrivateLayout>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full bg-white p-8 rounded-xl shadow-lg animate__animated animate__fadeInDown border border-red-200">
          <h1 className="text-4xl font-extrabold text-center text-red-800 mb-4">
            Diagnóstico de Emergencia Empresarial
          </h1>
          <div
            ref={chatWindowRef}
            className="h-[60vh] overflow-y-auto p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            {chatHistory.map((chat, index) => (
              <ChatBubble
                key={index}
                message={chat.message}
                isUser={chat.type === "user"}
                isLoader={chat.isLoader}
              />
            ))}
          </div>

          {!analisis && !isLoading && (
            <div className="animate__animated animate__fadeInUp">{renderCurrentQuestion()}</div>
          )}

          {analisis && (
            <div className="mt-8 text-center animate__animated animate__fadeIn">
              <p className="text-xl text-gray-700">
                ¡Diagnóstico completo! Un consultor se pondrá en contacto contigo.
              </p>
              <button
                onClick={() => router.push("/dashboard/inicio")}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Ir al inicio
              </button>
            </div>
          )}
        </div>
      </div>
    </PrivateLayout>
  );
};

export default DiagnosticoEmergencia;

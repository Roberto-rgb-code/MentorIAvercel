// pages/dashboard/diagnostico/general.tsx
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../contexts/AuthContext";
import PrivateLayout from "../../../components/layout/PrivateLayout";
import "animate.css";

import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

// ---------- Tipos ----------
interface DiagnosticoGeneralData {
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

  dg_misionVisionValores: "1" | "2" | "3" | "4" | "5" | "";
  dg_objetivosClaros: "1" | "2" | "3" | "4" | "5" | "";
  dg_analisisFoda: "1" | "2" | "3" | "4" | "5" | "";
  dg_situacionGeneralEmpresa: string;
  dg_principalProblemaActual: string;

  fa_margenGanancia: "1" | "2" | "3" | "4" | "5" | "";
  fa_estadosFinancierosActualizados: "1" | "2" | "3" | "4" | "5" | "";
  fa_liquidezSuficiente: "1" | "2" | "3" | "4" | "5" | "";
  fa_razonBajaLiquidez: string;
  fa_gastosIdentificadosControlados: "1" | "2" | "3" | "4" | "5" | "";

  op_capacidadCubreDemanda: "1" | "2" | "3" | "4" | "5" | "";
  op_procesosDocumentadosFacilesSeguir: "1" | "2" | "3" | "4" | "5" | "";
  op_calidadProductosServicios: "1" | "2" | "3" | "4" | "5" | "";
  op_factorBajaCalidad: string;
  op_inventariosControladosRotacionAdecuada: "1" | "2" | "3" | "4" | "5" | "";

  mv_clienteIdealValora: "1" | "2" | "3" | "4" | "5" | "";
  mv_planMarketingDocumentado: "1" | "2" | "3" | "4" | "5" | "";
  mv_canalesVentaAdecuados: "1" | "2" | "3" | "4" | "5" | "";
  mv_canalExplorar: string;
  mv_marcaReconocidaValorada: "1" | "2" | "3" | "4" | "5" | "";

  rh_organigramaClaroFuncionesDefinidas: "1" | "2" | "3" | "4" | "5" | "";
  rh_personalCapacitado: "1" | "2" | "3" | "4" | "5" | "";
  rh_climaLaboralProductividad: "1" | "2" | "3" | "4" | "5" | "";
  rh_factorAfectaClimaLaboral: string;
  rh_sistemaRemuneracionCompetitivoJusto: "1" | "2" | "3" | "4" | "5" | "";

  lc_proveedoresCumplenTiempoForma: "1" | "2" | "3" | "4" | "5" | "";
  lc_procesosAseguranEntregasTiempo: "1" | "2" | "3" | "4" | "5" | "";
  lc_costosLogisticosControladosCompetitivos: "1" | "2" | "3" | "4" | "5" | "";
  lc_principalObstaculoCadenaSuministro: string;
  lc_areaMayorAtencionOperacion: string;

  createdAt: string;
}

interface LLMAnalysisResult {
  resumen_ejecutivo: string;
  areas_oportunidad: string[];
  recomendaciones_clave: string[];
  puntuacion_madurez_promedio: number;
  nivel_madurez_general: "muy_bajo" | "bajo" | "medio" | "alto" | "muy_alto";
}

interface ChatMessage {
  sender: "bot" | "user";
  text: string | React.ReactNode;
  questionId?: keyof DiagnosticoGeneralData | string;
  type?: "open" | "likert" | "info";
  area?: string;
}

// ---------- Preguntas ----------
const questions = [
  { id: "intro1", type: "info", text: "¡Hola! Soy tu asistente para el diagnóstico empresarial general. Este diagnóstico te ayudará a comprender mejor la situación actual de tu empresa.", area: "Introducción" },
  { id: "intro2", type: "info", text: "Usaremos preguntas abiertas y una escala Likert (1 a 5). Responde con honestidad para obtener mejores recomendaciones.", area: "Introducción" },
  { id: "intro3", type: "info", text: "¿Listo para comenzar?", area: "Introducción" },

  // Generales
  { id: "nombreSolicitante", type: "open", text: "Tu nombre completo:", area: "Datos Generales" },
  { id: "puestoSolicitante", type: "open", text: "Tu puesto:", area: "Datos Generales" },
  { id: "nombreEmpresa", type: "open", text: "Nombre de la empresa:", area: "Datos Generales" },
  { id: "rfcEmpresa", type: "open", text: "RFC (opcional):", area: "Datos Generales" },
  { id: "giroIndustria", type: "open", text: "Giro o industria:", area: "Datos Generales" },
  { id: "numeroEmpleados", type: "open", text: "Número de empleados:", area: "Datos Generales" },
  { id: "antiguedadEmpresa", type: "open", text: "Años de antigüedad:", area: "Datos Generales" },
  { id: "ubicacion", type: "open", text: "Ciudad y estado:", area: "Datos Generales" },
  { id: "telefonoContacto", type: "open", text: "Teléfono de contacto:", area: "Datos Generales" },
  { id: "correoElectronico", type: "open", text: "Correo electrónico:", area: "Datos Generales" },
  { id: "sitioWebRedes", type: "open", text: "Sitio web / redes (opcional):", area: "Datos Generales" },

  // Problemática
  { id: "areaMayorProblema", type: "open", text: "Área con mayor problema actual:", area: "Problemática" },
  { id: "problematicaEspecifica", type: "open", text: "Problemática específica que más afecta:", area: "Problemática" },
  { id: "principalPrioridad", type: "open", text: "Principal prioridad a corto plazo:", area: "Problemática" },

  // Dirección General
  { id: "dg_misionVisionValores", type: "likert", text: "¿Misión/visión/valores claros y conocidos?", area: "Dirección General" },
  { id: "dg_objetivosClaros", type: "likert", text: "¿Objetivos claros y medibles?", area: "Dirección General" },
  { id: "dg_analisisFoda", type: "likert", text: "¿Realizan análisis FODA periódico?", area: "Dirección General" },
  { id: "dg_situacionGeneralEmpresa", type: "open", text: "Situación general actual de la empresa:", area: "Dirección General" },
  { id: "dg_principalProblemaActual", type: "open", text: "Principal problema actual:", area: "Dirección General" },

  // Finanzas
  { id: "fa_margenGanancia", type: "likert", text: "¿Conoces margen de ganancia?", area: "Finanzas" },
  { id: "fa_estadosFinancierosActualizados", type: "likert", text: "¿Estados financieros actualizados?", area: "Finanzas" },
  { id: "fa_liquidezSuficiente", type: "likert", text: "¿Liquidez suficiente a corto plazo?", area: "Finanzas" },
  { id: "fa_razonBajaLiquidez", type: "open", text: "Si es baja la liquidez, ¿por qué?", area: "Finanzas" },
  { id: "fa_gastosIdentificadosControlados", type: "likert", text: "¿Gastos identificados y controlados?", area: "Finanzas" },

  // Operaciones
  { id: "op_capacidadCubreDemanda", type: "likert", text: "¿Capacidad actual cubre demanda?", area: "Operaciones" },
  { id: "op_procesosDocumentadosFacilesSeguir", type: "likert", text: "¿Procesos documentados y claros?", area: "Operaciones" },
  { id: "op_calidadProductosServicios", type: "likert", text: "¿Calidad de productos/servicios?", area: "Operaciones" },
  { id: "op_factorBajaCalidad", type: "open", text: "Si es baja, ¿principal factor?", area: "Operaciones" },
  { id: "op_inventariosControladosRotacionAdecuada", type: "likert", text: "¿Inventarios controlados y rotación adecuada?", area: "Operaciones" },

  // Marketing/Ventas
  { id: "mv_clienteIdealValora", type: "likert", text: "¿Cliente ideal claro y qué valora?", area: "Marketing/Ventas" },
  { id: "mv_planMarketingDocumentado", type: "likert", text: "¿Plan de marketing documentado?", area: "Marketing/Ventas" },
  { id: "mv_canalesVentaAdecuados", type: "likert", text: "¿Canales de venta adecuados?", area: "Marketing/Ventas" },
  { id: "mv_canalExplorar", type: "open", text: "Si no, ¿qué canal explorar?", area: "Marketing/Ventas" },
  { id: "mv_marcaReconocidaValorada", type: "likert", text: "¿Marca reconocida y valorada?", area: "Marketing/Ventas" },

  // RH
  { id: "rh_organigramaClaroFuncionesDefinidas", type: "likert", text: "¿Organigrama y funciones claras?", area: "RH" },
  { id: "rh_personalCapacitado", type: "likert", text: "¿Personal capacitado?", area: "RH" },
  { id: "rh_climaLaboralProductividad", type: "likert", text: "¿Clima laboral productivo?", area: "RH" },
  { id: "rh_factorAfectaClimaLaboral", type: "open", text: "Si no, ¿principal factor que afecta?", area: "RH" },
  { id: "rh_sistemaRemuneracionCompetitivoJusto", type: "likert", text: "¿Remuneración competitiva y justa?", area: "RH" },

  // Logística
  { id: "lc_proveedoresCumplenTiempoForma", type: "likert", text: "¿Proveedores cumplen tiempo/forma?", area: "Logística" },
  { id: "lc_procesosAseguranEntregasTiempo", type: "likert", text: "¿Procesos aseguran entregas a tiempo?", area: "Logística" },
  { id: "lc_costosLogisticosControladosCompetitivos", type: "likert", text: "¿Costos logísticos controlados?", area: "Logística" },
  { id: "lc_principalObstaculoCadenaSuministro", type: "open", text: "¿Principal obstáculo en cadena de suministro?", area: "Logística" },
  { id: "lc_areaMayorAtencionOperacion", type: "open", text: "¿Qué área necesita mayor atención para mejorar toda la operación?", area: "Logística" },
];

// ---------- Loader NUEVO ----------
const PulseSpinner = () => (
  <>
    <style jsx>{`
      .spinner {
        width: 64px;
        height: 64px;
        border-radius: 9999px;
        border: 6px solid rgba(255,255,255,0.25);
        border-top-color: #ffffff;
        animation: spin 1s linear infinite;
        box-shadow: 0 0 0 0 rgba(255,255,255,0.35);
        position: relative;
      }
      .spinner::after{
        content:"";
        position:absolute;
        inset:-10px;
        border-radius:9999px;
        box-shadow: 0 0 0 0 rgba(255,255,255,0.35);
        animation: pulse 1.4s ease-out infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse {
        0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.35);}
        70%  { box-shadow: 0 0 0 20px rgba(255,255,255,0);}
        100% { box-shadow: 0 0 0 0 rgba(255,255,255,0);}
      }
    `}</style>
    <div className="spinner" />
  </>
);

// ---------- Componente principal ----------
const DiagnosticoGeneralChatbot = () => {
  const { user } = useAuth();
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const initialData: DiagnosticoGeneralData = {
    userId: user?.id || "",
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
    dg_misionVisionValores: "",
    dg_objetivosClaros: "",
    dg_analisisFoda: "",
    dg_situacionGeneralEmpresa: "",
    dg_principalProblemaActual: "",
    fa_margenGanancia: "",
    fa_estadosFinancierosActualizados: "",
    fa_liquidezSuficiente: "",
    fa_razonBajaLiquidez: "",
    fa_gastosIdentificadosControlados: "",
    op_capacidadCubreDemanda: "",
    op_procesosDocumentadosFacilesSeguir: "",
    op_calidadProductosServicios: "",
    op_factorBajaCalidad: "",
    op_inventariosControladosRotacionAdecuada: "",
    mv_clienteIdealValora: "",
    mv_planMarketingDocumentado: "",
    mv_canalesVentaAdecuados: "",
    mv_canalExplorar: "",
    mv_marcaReconocidaValorada: "",
    rh_organigramaClaroFuncionesDefinidas: "",
    rh_personalCapacitado: "",
    rh_climaLaboralProductividad: "",
    rh_factorAfectaClimaLaboral: "",
    rh_sistemaRemuneracionCompetitivoJusto: "",
    lc_proveedoresCumplenTiempoForma: "",
    lc_procesosAseguranEntregasTiempo: "",
    lc_costosLogisticosControladosCompetitivos: "",
    lc_principalObstaculoCadenaSuministro: "",
    lc_areaMayorAtencionOperacion: "",
    createdAt: new Date().toISOString(),
  };

  const [answers, setAnswers] = useState<DiagnosticoGeneralData>(initialData);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LLMAnalysisResult | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Avance de preguntas
  useEffect(() => {
    if (user?.id && answers.userId === "") {
      setAnswers((prev) => ({ ...prev, userId: user.id! }));
    }

    if (currentQuestionIndex < questions.length && !showSummary) {
      setIsTyping(true);
      setTimeout(() => {
        const q = questions[currentQuestionIndex];
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: q.text,
            questionId: q.id as keyof DiagnosticoGeneralData,
            type: q.type as "open" | "likert" | "info",
            area: q.area,
          },
        ]);
        if (q.type !== "info") {
          setInputValue(answers[q.id as keyof DiagnosticoGeneralData]?.toString() || "");
        } else {
          setInputValue("");
        }
        setIsTyping(false);
      }, 600);
    } else if (currentQuestionIndex === questions.length && !showSummary) {
      setShowSummary(true);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "¡Listo! Revisa tu resumen y envíalo para análisis." },
      ]);
    }
  }, [currentQuestionIndex, showSummary, user]); // eslint-disable-line

  const handleUserResponse = async (value: string) => {
    if (isLoading || isTyping) return;
    const q = questions[currentQuestionIndex];
    if (!q || q.type === "info") return;

    if (q.type === "open" && !value.trim()) {
      setError("Por favor, ingresa una respuesta.");
      return;
    }
    setError(null);

    setMessages((prev) => [...prev, { sender: "user", text: value, questionId: q.id as keyof DiagnosticoGeneralData }]);
    setAnswers((prev) => ({ ...prev, [q.id]: value } as DiagnosticoGeneralData));
    setInputValue("");
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleLikertSelect = (value: string) => handleUserResponse(value);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserResponse(inputValue);
    }
  };

  const handleContinue = () => {
    if (isLoading || isTyping) return;
    setError(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevQ = questions[currentQuestionIndex - 1];
      let newMessages = messages.slice(0, messages.length - 1);
      if (prevQ && prevQ.type !== "info") {
        newMessages = newMessages.slice(0, newMessages.length - 1);
      }
      setMessages(newMessages);
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowSummary(false);
      setError(null);
    }
  };

  // Envío a backend
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://mentorapp-api-llm.onrender.com";

  const handleSubmit = async () => {
    if (!user) {
      setError("Debes iniciar sesión para realizar el diagnóstico.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch(`${API_BASE}/api/diagnostico/general/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, userId: user.id, createdAt: new Date().toISOString() }),
      });

      const text = await response.text();
      let json: any = null;
      try { json = text ? JSON.parse(text) : null; } catch { json = null; }

      if (!response.ok) {
        const msg =
          (json && (json.error || json.detail)) ||
          `Error al procesar el diagnóstico general. (${response.status})`;
        throw new Error(msg);
      }

      setAnalysisResult(json as LLMAnalysisResult);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "¡Análisis completado! Aquí están los resultados:" },
      ]);
    } catch (err: any) {
      console.error("Error submitting general diagnosis:", err);
      setError(err.message || "Ocurrió un error al procesar tu diagnóstico general.");
    } finally {
      setIsLoading(false);
    }
  };

  const getNivelMadurezColor = (nivel: LLMAnalysisResult["nivel_madurez_general"]) => {
    switch (nivel) {
      case "muy_bajo": return "text-red-600";
      case "bajo": return "text-orange-600";
      case "medio": return "text-yellow-600";
      case "alto": return "text-blue-600";
      case "muy_alto": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <PrivateLayout>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex flex-col items-center justify-center z-50 animate__animated animate__fadeIn">
            <PulseSpinner />
            <p className="mt-5 text-white text-lg font-semibold text-center">
              Analizando tu diagnóstico con IA…
            </p>
          </div>
        )}

        <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg flex flex-col h-[80vh] animate__animated animate__fadeInDown border border-indigo-200">
          <div className="p-6 bg-indigo-600 text-white rounded-t-xl flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center">
              <ChatBubbleLeftRightIcon className="h-7 w-7 mr-2" />
              Diagnóstico General Chat
            </h1>
            <button
              onClick={() => router.push("/dashboard/inicio")}
              className="text-white hover:text-indigo-100 transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>

          <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-indigo-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-sm animate__animated animate__fadeIn ${
                    msg.sender === "bot"
                      ? "bg-indigo-200 text-indigo-900 rounded-bl-none"
                      : "bg-indigo-500 text-white rounded-br-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[70%] p-3 rounded-lg shadow-sm bg-indigo-200 text-indigo-900 rounded-bl-none">
                  <div className="typing-indicator flex space-x-1">
                    <span className="dot animate-bounce" style={{ animationDelay: "0s" }}>.</span>
                    <span className="dot animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                    <span className="dot animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                  </div>
                </div>
              </div>
            )}
            <style jsx>{`
              .typing-indicator .dot {
                animation-duration: 1s;
                animation-iteration-count: infinite;
                font-size: 1.5em;
                line-height: 0.5;
              }
            `}</style>
          </div>

          <div className="p-4 border-t border-indigo-200 bg-white">
            {error && <p className="text-red-500 text-sm mb-2 animate__animated animate__shakeX">{error}</p>}

            {showSummary && !analysisResult ? (
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-indigo-700 mb-4">Resumen de tus respuestas:</h3>
                <div className="max-h-48 overflow-y-auto w-full bg-indigo-50 p-4 rounded-lg border border-indigo-200 mb-4 text-sm text-gray-800">
                  {Object.entries(answers).map(([key, value]) => {
                    if (key === "userId" || key === "createdAt" || value === "") return null;
                    const q = questions.find((qq) => qq.id === key);
                    const questionText = (q ? q.text : key).replace(/^\d+\.\s*/, "");
                    return (
                      <p key={key} className="mb-1">
                        <strong className="text-indigo-700">{questionText}:</strong> {value?.toString()}
                      </p>
                    );
                  })}
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar para Análisis"}
                </button>
                <button
                  onClick={goToPreviousQuestion}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 flex items-center justify-center"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-1" />
                  Volver a la última pregunta
                </button>
              </div>
            ) : analysisResult ? (
              <div className="mt-4 p-4 bg-indigo-100 rounded-lg border border-indigo-300 animate__animated animate__fadeInUp">
                <h3 className="text-xl font-semibold text-indigo-700 mb-3">Resultados del Análisis:</h3>
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-indigo-600">Resumen Ejecutivo:</h4>
                  <p className="text-gray-800">{analysisResult.resumen_ejecutivo}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-indigo-600">Áreas de Oportunidad:</h4>
                  <ul className="list-disc list-inside text-gray-800">
                    {analysisResult.areas_oportunidad.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-indigo-600">Recomendaciones Clave:</h4>
                  <ul className="list-disc list-inside text-gray-800">
                    {analysisResult.recomendaciones_clave.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-indigo-600">Puntuación de Madurez Promedio:</h4>
                  <p className="text-2xl font-bold text-indigo-600">
                    {analysisResult.puntuacion_madurez_promedio.toFixed(2)}
                  </p>
                </div>
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-indigo-600">Nivel de Madurez General:</h4>
                  <p className={`text-2xl font-bold ${getNivelMadurezColor(analysisResult.nivel_madurez_general)}`}>
                    {analysisResult.nivel_madurez_general.toUpperCase().replace(/_/g, " ")}
                  </p>
                </div>
                <button
                  onClick={() => router.push("/dashboard/inicio")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mt-4"
                >
                  Volver al Inicio
                </button>
              </div>
            ) : (
              <>
                {currentQuestion?.type === "open" && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu respuesta aquí..."
                      className="flex-1 p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                      disabled={isTyping}
                    />
                    <button
                      onClick={() => handleUserResponse(inputValue)}
                      className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
                      disabled={isTyping || !inputValue.trim()}
                    >
                      <PaperAirplaneIcon className="h-6 w-6 transform rotate-90" />
                    </button>
                  </div>
                )}

                {currentQuestion?.type === "likert" && (
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleLikertSelect(num.toString())}
                        className={`px-4 py-2 rounded-lg border text-lg font-bold transition-all duration-200
                          ${
                            answers[currentQuestion.id as keyof DiagnosticoGeneralData] === num.toString()
                              ? "bg-indigo-600 text-white shadow-md scale-105 border-indigo-700"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-100 hover:border-indigo-400"
                          }`}
                        disabled={isTyping}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion?.type === "info" && (
                  <div className="flex justify-end w-full">
                    <button
                      onClick={handleContinue}
                      className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                      disabled={isTyping}
                    >
                      Continuar
                      <ArrowRightIcon className="h-5 w-5 ml-1" />
                    </button>
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={goToPreviousQuestion}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                    disabled={currentQuestionIndex === 0 || isTyping}
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-1" />
                    Anterior
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default DiagnosticoGeneralChatbot;

// contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";

// ----- Tipos -----

// Datos guardados en Firestore para cada usuario
interface FirestoreUser {
  name?: string | null;
  photoUrl?: string | null;
  role?: string | null;
}

// Datos de usuario que maneja la app
interface AppUser {
  id: string;
  email: string | null;
  name: string | null;
  photoUrl: string | null;
  role: string | null;
}

// Contexto de autenticación
interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// ----- Contexto -----
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Para detectar transición de "no logueado" -> "logueado" y evitar redirecciones múltiples
  const prevUidRef = useRef<string | null>(null);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            // Buscar datos extra en Firestore
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            let userData: FirestoreUser | undefined;
            if (userDocSnap.exists()) {
              userData = userDocSnap.data() as FirestoreUser;
            }

            // Construir objeto de usuario de la app
            const appUser: AppUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName ?? userData?.name ?? null,
              photoUrl: firebaseUser.photoURL ?? userData?.photoUrl ?? null,
              role: userData?.role ?? null,
            };

            setUser(appUser);
          } catch (error) {
            console.error("Error al obtener datos del usuario de Firestore:", error);
            setUser(null);
          }
        } else {
          // No hay usuario logueado
          setUser(null);
          // Resetear banderas cuando se desloguea
          prevUidRef.current = null;
          hasRedirectedRef.current = false;
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Redirección suave al dashboard cuando se autentica (desde /, /login o /register)
  useEffect(() => {
    if (isLoading) return;

    const wasLoggedOut = !prevUidRef.current;
    const isLoggedIn = !!user?.id;

    // Detecta transición "no logueado" -> "logueado"
    if (wasLoggedOut && isLoggedIn && !hasRedirectedRef.current) {
      const path = router.pathname;
      const cameFromAuthScreen =
        path === "/" || path === "/login" || path === "/register";

      if (cameFromAuthScreen) {
        hasRedirectedRef.current = true;
        router.push("/dashboard/inicio");
      }
    }

    // Actualiza referencia
    prevUidRef.current = user?.id ?? null;
  }, [isLoading, user?.id, router.pathname]);

  // Cierre de sesión
  const logout = async () => {
    try {
      await signOut(auth);
      // Opcional: después de desloguear, puedes mandar a login
      // router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

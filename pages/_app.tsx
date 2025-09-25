// pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatbotWidget from '@/components/ChatbotWidget';
import PrivateLayout from '@/components/layout/PrivateLayout';
import PublicLayout from '@/components/layout/PublicLayout';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Páginas que NO deben tener layout (sin navbar/footer)
  const noLayoutRoutes = ['/login', '/register', '/reset-password'];
  
  // Páginas privadas (requieren el layout privado)
  const privateRoutes = ['/dashboard', '/perfil'];
  
  // Verificar si la ruta actual no debe tener layout
  const shouldHaveNoLayout = noLayoutRoutes.includes(router.pathname);
  
  // Verificar si la ruta actual es privada
  const isPrivateRoute = privateRoutes.some(route => router.pathname.startsWith(route));
  
  // Elegir el layout apropiado
  let Layout = PublicLayout;
  if (shouldHaveNoLayout) {
    Layout = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  } else if (isPrivateRoute) {
    Layout = PrivateLayout;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>MentHIA</title>
        <meta name="description" content="Mentores expertos + IA para escalar tu negocio. Talento humano con tecnología para decisiones más rápidas y rentables." />
        
        {/* Favicons */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MentHIA - Asesoría Integral con IA" />
        <meta property="og:description" content="Mentores expertos + IA para escalar tu negocio" />
        <meta property="og:image" content="/favicon.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MentHIA - Asesoría Integral con IA" />
        <meta name="twitter:description" content="Mentores expertos + IA para escalar tu negocio" />
        
        {/* Fonts - Avenir */}
        <style>{`
          @font-face {
            font-family: 'Avenir';
            src: local('Avenir'), local('Avenir-Book');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Avenir';
            src: local('Avenir-Medium');
            font-weight: 500;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Avenir';
            src: local('Avenir-Heavy'), local('Avenir-Black');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
          
          body {
            font-family: 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
        `}</style>
      </Head>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="!bg-white !text-gray-900 !shadow-lg !border !border-gray-200"
            progressClassName="!bg-gradient-to-r !from-blue-500 !to-cyan-400"
          />
          <ChatbotWidget />
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
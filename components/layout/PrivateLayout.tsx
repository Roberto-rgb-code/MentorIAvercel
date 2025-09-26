import React from 'react';
import Navbar from '../Navbar';
import Footer from './Footer';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Dejamos espacio arriba para el navbar fijo */}
      <main className="flex-grow pt-[64px] md:pt-[72px]">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivateLayout;

// components/layout/PublicLayout.tsx
import React from 'react';
import Navbar from '../Navbar';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-6">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;
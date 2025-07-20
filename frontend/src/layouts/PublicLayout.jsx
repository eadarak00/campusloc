
// VERSION 1: Avec Bootstrap
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PublicLayout= () => {
  return (
    <div className="d-flex flex-column min-vh-100 publicLayout-main" style={{ backgroundColor: '#FAF9F6', color: '#374151' }}>
      <Navbar />
      
      {/* Contenu central */}
      <main className="flex-grow-1">
        <div className="h-100">
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;
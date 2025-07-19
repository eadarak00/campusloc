import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import NavbarProspect from "../components/NavbarProspect";
import { getProspectFromStorage } from "../utils/authUtils";

const ProspectLayout= () => {
    const user  = getProspectFromStorage();
  return (
    <div className="d-flex flex-column min-vh-100 publicLayout-main" style={{ backgroundColor: '#FAF9F6', color: '#374151' }}>
      <NavbarProspect user={user} />
      
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

export default ProspectLayout;
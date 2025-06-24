// src/pages/Home.jsx
import React from "react";
import EnConstruction from "../components/EnConstruction";

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center" style={{ backgroundColor: '#FAF9F6' }}>
      <EnConstruction nomPage="Accueil" />
    </main>
  );
};

export default Home;

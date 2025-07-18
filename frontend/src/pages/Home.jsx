// src/pages/Home.jsx
import React from "react";
import EnConstruction from "../components/EnConstruction";
import ParallaxCampusHousing from "../components/Parallax";
import "../styles/home.css"
import ProcessStepsComponent from "../components/ProcessComponent";

const Home = () => {
  return (
    <main className="home__container">
      <ParallaxCampusHousing />
      <ProcessStepsComponent />
      {/* <EnConstruction nomPage="Accueil" /> */}
    </main>
  );
};

export default Home;

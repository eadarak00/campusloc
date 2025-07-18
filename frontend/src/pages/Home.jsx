// src/pages/Home.jsx
import React from "react";
import EnConstruction from "../components/EnConstruction";
import ParallaxCampusHousing from "../components/Parallax";
import ProcessStepsComponent from "../components/ProcessComponent";
import AnnoncesPopulaires from "../components/AnnoncePopulaire";

import "../styles/home.css"
import AnnoncesRecentes from "../components/AnnoncesRecentes";
import { Divider } from "antd";
import Missions from "../components/Missions";


const Home = () => {
  return (
    <main className="home__container">
      <ParallaxCampusHousing />
      <ProcessStepsComponent />
      <Divider/>
      <AnnoncesPopulaires />
      <Divider />
      <AnnoncesRecentes />
      <Divider />
      <Missions />
      {/* <EnConstruction nomPage="Accueil" /> */}
    </main>
  );
};

export default Home;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ROUTES from "./routes";
import Home from "../pages/Home";
import Connexion from "../pages/auth/Connexion";
import PublicLayout from "../layouts/PublicLayout";
import Inscription from "../pages/auth/Inscription";
import DashboardBailleur from "../pages/bailleur/DashboardBailleur";
import BailleurLayout from "../layouts/BailleurLayout";
import ProtectedRoute from "./ProtectedRoute";
import AnnoncesBailleur from "../pages/bailleur/Annonces";
import CreationAnnonce from "../pages/bailleur/CreationAnnonce";
import AnnonceEnAttentes from "../pages/bailleur/AnnoncesEnAttente";
import DetailAnnonce from "../pages/bailleur/AnnonceDetails";
import ModifierAnnonce from "../pages/bailleur/ModifierAnnonce";
import AnnonceActive from "../pages/bailleur/AnnoncesActives";

const AppRouter = () => (
  <Router>
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.CONNEXION} element={<Connexion />} />
        <Route path={ROUTES.INSCRIPTION} element={<Inscription />} />
      </Route>

      {/* Routes protégées pour bailleurs */}
      <Route
        path="/bailleur"
        element={
          <ProtectedRoute allowedRoles={["BAILLEUR"]}>
            <BailleurLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path={ROUTES.DASHBOARD_BAILLEUR}
          element={<DashboardBailleur />}
        />
        <Route path={ROUTES.ANNONCES_BAILLEUR} element={<AnnoncesBailleur />} />
        <Route path={ROUTES.CREATION_ANNONCE} element={<CreationAnnonce />} />
        <Route
          path={ROUTES.ANNONCES_ACTIFS_BAILLEUR}
          element={<AnnonceActive />}
        />
        <Route
          path={ROUTES.ANNONCES_EN_ATTENTES}
          element={<AnnonceEnAttentes />}
        />
        <Route
          path={ROUTES.DETAIL_ANNONCE_BAILLEUR}
          element={<DetailAnnonce />}
        />
        <Route
          path={ROUTES.MODIFIER_ANNONCE_BAILLEUR}
          element={<ModifierAnnonce />}
        />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;

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
import AdminLayout from "../layouts/AdminLayout";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import AnnoncesAdmin from "../pages/admin/annonces-admin";
import AnnonceAValider from "../pages/admin/AnnonceAValider";
import AnnonceDetailsAdmin from "../pages/admin/AnnonceDetailsAdmin";
import ListeAnnoncesAdmin from "../pages/admin/ListeAnnoncesAdmin";
import AnnoncesPage from "../pages/Annonces";
import ProspectLayout from "../layouts/ProspectLayout";

const AppRouter = () => (
  <Router>
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.CONNEXION} element={<Connexion />} />
        <Route path={ROUTES.INSCRIPTION} element={<Inscription />} />
        <Route path={ROUTES.ANNONCES} element={<AnnoncesPage />} />
      </Route>

       {/* Routes protégées pour prospecr */}
      <Route
        path="/prospect"
        element={
          <ProtectedRoute allowedRoles={["PROSPECT"]}>
            <ProspectLayout />
          </ProtectedRoute>
        }
      >
        <Route
         path={ROUTES.DASHBOARD_PROSPECT}
         element = {<Home />}
        />
        <Route
         path={ROUTES.ANNONCES_PROSPECT}
         element = {<AnnoncesPage />}
        />
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

      {/* Routes protégées pour bailleurs */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path={ROUTES.DASHBOARD_ADMIN}
          element={<DashboardAdmin/>}
        />
         <Route
          path={ROUTES.ANNONCES_ADMIN}
          element={<AnnoncesAdmin/>}
        />

        <Route
          path={ROUTES.ANNONCES_EN_ATTENTES_ADMIN}
          element={<AnnonceAValider/>}
        />

        <Route
          path={ROUTES.DETAIL_ANNONCE_ADMIN}
          element={<AnnonceDetailsAdmin />}
        />
        <Route
          path={ROUTES.TOUTES_ANNONCES_ADMIN}
          element={<ListeAnnoncesAdmin/>}
        />

      </Route>
    </Routes>
  </Router>
);

export default AppRouter;

// src/router/routes.js
const ROUTES = {
  HOME: "/",
  CONNEXION: "/connexion",
  INSCRIPTION: "/inscription",
  INSCRIPTION_BAILLEUR: "/inscription-bailleur",
  VALIDATION: "/validation",

  // Dashboards par rôle
  DASHBOARD_ADMIN: "/admin/dashboard",
  DASHBOARD_BAILLEUR: "/bailleur/dashboard",
  DASHBOARD_ETUDIANT: "/etudiant/accueil",

  //endpoints BAILLEUR
  ANNONCES_BAILLEUR: "/bailleur/mes-annonces",
  ANNONCES_ACTIFS_BAILLEUR: "/bailleurs/mes-annonces/actifs",
  ANNONCES_EN_ATTENTES: "/bailleur/annonces-attentes",
  CREATION_ANNONCE: "/bailleur/creation-annonce",
  DETAIL_ANNONCE_BAILLEUR: "/bailleur/annonce/:id",
  MODIFIER_ANNONCE_BAILLEUR: "/bailleur/annonce/modifier/:id",

  TENANTS: "/tenants",

  NOT_FOUND: "*",
};

export default ROUTES;

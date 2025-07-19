// src/router/routes.js
const ROUTES = {
  HOME: "/",
  CONNEXION: "/connexion",
  INSCRIPTION: "/inscription",
  INSCRIPTION_BAILLEUR: "/inscription-bailleur",
  VALIDATION: "/validation",
  ANNONCES: "/annonces",

  // Dashboards par rôle
  DASHBOARD_ADMIN: "/admin/dashboard",
  DASHBOARD_BAILLEUR: "/bailleur/dashboard",
  DASHBOARD_PROSPECT: "/prospect/accueil",

  //endpoints BAILLEUR
  ANNONCES_BAILLEUR: "/bailleur/mes-annonces",
  ANNONCES_ACTIFS_BAILLEUR: "/bailleur/mes-annonces/actifs",
  ANNONCES_EN_ATTENTES: "/bailleur/annonces-attentes",
  CREATION_ANNONCE: "/bailleur/creation-annonce",
  DETAIL_ANNONCE_BAILLEUR: "/bailleur/annonce/:id",
  MODIFIER_ANNONCE_BAILLEUR: "/bailleur/annonce/modifier/:id",
  TENANTS: "/tenants",

  // endpoints Administrateur
  ANNONCES_ADMIN: "/admin/annonces",
  ANNONCES_EN_ATTENTES_ADMIN: "/admin/annonces/en-attente",
  TOUTES_ANNONCES_ADMIN: "/admin/annonces/toutes",
  DETAIL_ANNONCE_ADMIN: "/admin/annonces/:id",


  //endpoint pour les prospects
  ANNONCES_PROSPECT: "/prospect/annonces",
  FAVORI_PROSPECT: "/prospect/favoris",


  NOT_FOUND: "*",
};

export default ROUTES;

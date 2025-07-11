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
  ANNONCES_ACTIFS_BAILLEUR: "/bailleur/mes-annonces/actifs",
  ANNONCES_EN_ATTENTES: "/bailleur/annonces-attentes",
  CREATION_ANNONCE: "/bailleur/creation-annonce",
  DETAIL_ANNONCE_BAILLEUR: "/bailleur/annonce/:id",
  MODIFIER_ANNONCE_BAILLEUR: "/bailleur/annonce/modifier/:id",
  TENANTS: "/tenants",

  // endpoints Administrateur
  ANNONCES_ADMIN: "/admin/annonces",
  ANNONCES_ACTIVES_ADMIN: "/admin/annonces/actives",
  ANNONCES_EN_ATTENTES_ADMIN: "/admin/annonces/en-attente",
  ANNONCES_A_VALIDER_ADMIN: "/admin/annonces/a-valider",
  ANNONCES_A_REFUSER_ADMIN: "/admin/annonces/a-refuser",
  TOUTES_ANNONCES_ADMIN: "/admin/annonces/toutes",
  DETAIL_ANNONCE_ADMIN: "/admin/annonces/:id",


  NOT_FOUND: "*",
};

export default ROUTES;

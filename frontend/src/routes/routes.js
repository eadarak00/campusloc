// src/router/routes.js
const ROUTES = {
  HOME: '/',
  CONNEXION: '/connexion',
  INSCRIPTION: '/inscription',
  INSCRIPTION_BAILLEUR: '/inscription-bailleur',
  VALIDATION: '/validation',
  
  // Dashboards par rôle
  DASHBOARD_ADMIN: '/admin/dashboard',
  DASHBOARD_BAILLEUR: '/bailleur/dashboard',
  DASHBOARD_ETUDIANT: '/etudiant/accueil',

  //endpoints BAILLEUR
  ANNONCES_BAILLEUR: '/bailleur/annonces',
  ANNONCES_EN_ATTENTES: '/bailleur/annonces-attentes',
  TENANTS: '/tenants',


  NOT_FOUND: '*',
};

export default ROUTES;

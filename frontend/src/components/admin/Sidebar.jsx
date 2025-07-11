import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

import {
  Home,
  Building,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  TrendingUp,
  Calendar,
  Bell,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageCircle,
} from "lucide-react";
import "../../styles/bailleur/sidetopbar.css";
import ROUTES from "../../routes/routes";
import { Avatar } from "antd";
import { getAdminFromStorage } from "../../utils/authUtils";
import { logout } from "../../utils/authService";

const Sidebar = ({ children }) => {
  const [sidebarState, setSidebarState] = useState("collapsed");
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const user = getAdminFromStorage();
  
    const fullName = user?.prenom + user?.nom;
  
    const getInitials = (name) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: Home,
      path: ROUTES.DASHBOARD_ADMIN,
    },
    {
      id: "annonces",
      label: "Annonces",
      icon: Building,
      path: ROUTES.ANNONCES_BAILLEUR,
    },

  ];

  const handleItemClick = (id) => {
    setActiveItem(id);
    // Fermer la sidebar sur mobile après sélection
    if (isMobile) {
      setSidebarState("collapsed");
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      // Sur mobile: toggle entre fermé et ouvert
      setSidebarState((prev) =>
        prev === "collapsed" ? "expanded" : "collapsed"
      );
    } else {
      // Sur desktop: cycle entre les 3 états
      const states = ["collapsed", "semi-expanded", "expanded"];
      const currentIndex = states.indexOf(sidebarState);
      const nextIndex = (currentIndex + 1) % states.length;
      setSidebarState(states[nextIndex]);
    }
  };

  const getSidebarClass = () => {
    const baseClass = "sidebar";
    const stateClass = `sidebar--${sidebarState}`;
    const mobileClass = isMobile ? "sidebar--mobile" : "";
    return `${baseClass} ${stateClass} ${mobileClass}`.trim();
  };

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("fr-FR", options);
  };

  const getToggleIcon = () => {
    if (isMobile) {
      return sidebarState === "collapsed" ? (
        <Menu size={20} />
      ) : (
        <X size={20} />
      );
    } else {
      return sidebarState === "expanded" ? (
        <ChevronLeft size={20} />
      ) : (
        <ChevronRight size={20} />
      );
    }
  };

  const handleLogout = () =>{
    logout();
    navigate(ROUTES.CONNEXION);
}

  return (
    <div className="app-container">
      {/* Overlay pour mobile */}
      {isMobile && sidebarState !== "collapsed" && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarState("collapsed")}
        />
      )}

      {/* Sidebar */}
      <div className={getSidebarClass()}>
        {/* Header */}
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">C</div>
            <div className="sidebar__logo-text">
              <h2 className="sidebar__logo-title">Campusloc</h2>
              <p className="sidebar__logo-subtitle">Espace admin</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="sidebar__toggle"
            aria-label="Toggle sidebar"
          >
            {getToggleIcon()}
          </button>
        </div>

        {/* Navigation */}
        {/* <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <li key={item.id} className="sidebar__nav-item">
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`sidebar__nav-button ${isActive ? 'sidebar__nav-button--active' : ''}`}
                    aria-label={item.label}
                  >
                    <Icon size={20} className="sidebar__nav-icon" />
                    <span className="sidebar__nav-text">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav> */}

        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.id} className="sidebar__nav-item">
                  <Link
                    to={item.path}
                    onClick={() => handleItemClick(item.id)}
                    className={`sidebar__nav-button ${
                      isActive ? "sidebar__nav-button--active" : ""
                    }`}
                    aria-label={item.label}
                  >
                    <Icon size={20} className="sidebar__nav-icon" />
                    <span className="sidebar__nav-text">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer optionnel */}
        <div className="sidebar__footer">
          <button className="sidebar__nav-button">
            <Settings size={20} className="sidebar__nav-icon" />
            <span className="sidebar__nav-text">Paramètres</span>
          </button>

          <button className="sidebar__nav-button" onClick={handleLogout}>
            <LogOut size={20} className="sidebar__nav-icon" />
            <span className="sidebar__nav-text">Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar__left">
            {/* Bouton menu mobile */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="topbar__menu-button"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            )}

            <div className="topbar__date">{getCurrentDate()}</div>

            <div className="topbar__search">
              <Search size={20} className="topbar__search-icon" />
              <input
                type="text"
                placeholder="Rechercher une propriété, un locataire..."
                className="topbar__search-input"
              />
            </div>
          </div>

          <div className="topbar__right">
            <button className="topbar__icon-button" aria-label="Notifications">
              <Bell size={20} />
              <div className="topbar__notification-badge">5</div>
            </button>

            <button className="topbar__icon-button" aria-label="Paramètres">
              <MessageCircle size={20} />
            </button>

            {/* <div className="topbar__avatar" aria-label="Profil utilisateur">
              JD
            </div> */}
              <Avatar className= "topbar__avatar" src={user.photoUrl}>
              {getInitials(fullName)}
            </Avatar>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {children || (
            <div className="demo-content">
              <div className="demo-card">
                <h1 className="demo-title">Bienvenue sur l'espace administrateur</h1>
                <p className="demo-text">
                  Votre tableau de bord pour la gestion immobilière. Utilisez la
                  sidebar pour naviguer entre les différentes sections.
                </p>
                <div className="demo-stats">
                  <div className="demo-stat">
                    <h3>12</h3>
                    <p>Propriétés</p>
                  </div>
                  <div className="demo-stat">
                    <h3>28</h3>
                    <p>Locataires</p>
                  </div>
                  <div className="demo-stat">
                    <h3>€15,420</h3>
                    <p>Revenus mensuels</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

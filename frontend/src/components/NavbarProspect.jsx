import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Space,
  Drawer,
  Badge,
  Avatar,
  Dropdown,
  Tooltip,
} from "antd";
import {
  HomeOutlined,
  NotificationOutlined,
  HeartOutlined,
  ContactsOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import "../styles/navbar.css";
import ROUTES from "../routes/routes";
import { getNombreFavoris } from "../utils/CountUtils";
import { logout } from "../utils/authService";

const { Header } = Layout;

export default function NavbarProspect({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [nombreFavoris, setNombreFavoris] = useState(0);


  useEffect(() => {
    getNombreFavoris().then(setNombreFavoris);
  }, []);

  // Fonction pour générer les initiales proprement
  const getInitials = (prenom, nom) => {
    const prenomInitial = prenom?.charAt(0)?.toUpperCase() || "";
    const nomInitial = nom?.charAt(0)?.toUpperCase() || "";
    return prenomInitial + nomInitial || "U";
  };

  // Fonction pour formater le nom d'affichage
  const getDisplayName = (prenom, nom) => {
    if (!prenom && !nom) return "Utilisateur";
    if (!nom) return prenom;
    return `${prenom} ${nom.charAt(0)}.`;
  };

  // Menu items pour la navigation principale avec icônes
  const menuItems = [
    {
      key: "/prospect/accueil",
      icon: <HomeOutlined style={{ fontSize: "16px" }} />,
      label: (
        <Link
          to={ROUTES.DASHBOARD_PROSPECT}
          onClick={() => setDrawerVisible(false)}
        >
          Accueil
        </Link>
      ),
    },
    {
      key: "/prospect/annonces",
      icon: <FileTextOutlined style={{ fontSize: "16px" }} />,
      label: (
        <Link
          to={ROUTES.ANNONCES_PROSPECT}
          onClick={() => setDrawerVisible(false)}
        >
          Annonces
        </Link>
      ),
    },
    {
      key: "/favoris",
      icon: <HeartOutlined style={{ fontSize: "16px" }} />,
      label: (
        <Link
          to={ROUTES.FAVORI_PROSPECT}
          onClick={() => setDrawerVisible(false)}
        >
          Favoris
        </Link>
      ),
    },
    {
      key: "/a-propos",
      icon: <InfoCircleOutlined style={{ fontSize: "16px" }} />,
      label: (
        <Link to="/a-propos" onClick={() => setDrawerVisible(false)}>
          À Propos
        </Link>
      ),
    },
    {
      key: ROUTES.CONTACTS_PROSPECT,
      icon: <ContactsOutlined style={{ fontSize: "16px" }} />,
      label: (
        <Link to={ROUTES.CONTACTS_PROSPECT} onClick={() => setDrawerVisible(false)}>
          Contact
        </Link>
      ),
    },
  ];

  // Menu items pour l'avatar dropdown
  const avatarMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined style={{ fontSize: "14px" }} />,
      label: <Link to="/profil">Mon Profil</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined style={{ fontSize: "14px" }} />,
      label: <Link to="/paramètres">Paramètres</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ fontSize: "14px" }} />,
      label: "Déconnexion",
      onClick: handleLogout,
      danger: true,
    },
  ];

  function handleLogout() {
    console.log("Déconnexion...");
    logout();
    navigate("/");
  }

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  return (
    <Header
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        position: "relative",
      }}
    >
      {/* Logo amélioré */}
      <div
        style={{ display: "flex", alignItems: "center" }}
        className="font-poppins font-semibold campusloc-title"
      >
        <Link
          to="/"
          style={{
            fontSize: "24px",
            color: "#C58A51",
            textDecoration: "none",
            fontWeight: "700",
            letterSpacing: "-0.5px",
          }}
          className="font-poppins font-semibold"
        >
          CampusLoc
        </Link>
      </div>

      {/* Menu Desktop - Caché sur mobile */}
      <Menu
        mode="horizontal"
        className="font-poppins font-medium navbar-link desktop-menu"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{
          backgroundColor: "transparent",
          border: "none",
          fontSize: "15px",
          fontWeight: "500",
          flex: 1,
          justifyContent: "center",
          display: "none",
        }}
      />

      {/* Actions utilisateur connecté - Desktop */}
      <Space
        size="large"
        className="desktop-buttons"
        style={{ display: "none" }}
      >
        {/* Notifications avec tooltip */}
        <Tooltip title="Notifications">
          <Badge count={3} size="small" offset={[-2, 2]}>
            <Button
              type="text"
              icon={<NotificationOutlined style={{ fontSize: "20px" }} />}
              size="large"
              style={{
                color: "#C58A51",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              className="navbar-icon-btn"
              onClick={() => navigate("/notifications")}
            />
          </Badge>
        </Tooltip>

        {/* Favoris avec tooltip */}
        <Tooltip title="Mes favoris">
          <Badge count={nombreFavoris} size="small" offset={[-2, 2]}>
            <Button
              type="text"
              icon={<HeartOutlined style={{ fontSize: "20px" }} />}
              size="large"
              style={{
                color: "#C58A51",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              className="navbar-icon-btn"
              onClick={() => navigate(ROUTES.FAVORI_PROSPECT)}
            />
          </Badge>
        </Tooltip>

        {/* Contacts avec tooltip */}
        <Tooltip title="Mes contacts">
          <Button
            type="text"
            icon={<ContactsOutlined style={{ fontSize: "20px" }} />}
            size="large"
            style={{
              color: "#C58A51",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
            className="navbar-icon-btn"
            onClick={() => navigate(ROUTES.CONTACTS_PROSPECT)}
          />
        </Tooltip>

        {/* Avatar avec menu déroulant amélioré */}
        <Dropdown
          menu={{
            items: avatarMenuItems,
          }}
          trigger={["click"]}
          placement="bottomRight"
          arrow
        >
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 12px",
              borderRadius: "24px",
              transition: "all 0.3s ease",
              border: "2px solid transparent",
            }}
            className="user-profile-section"
          >
            <Avatar
              size={42}
              src={user?.avatar}
              style={{
                backgroundColor: "#C58A51",
                border: "2px solid #fff",
                boxShadow: "0 2px 8px rgba(197, 138, 81, 0.3)",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              {getInitials(user?.prenom, user?.nom)}
            </Avatar>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span
                className="font-poppins font-semibold"
                style={{
                  color: "#333",
                  fontSize: "14px",
                  lineHeight: "1.2",
                  marginBottom: "2px",
                }}
              >
                {getDisplayName(user?.prenom, user?.nom)}
              </span>
              <span
                className="font-poppins"
                style={{
                  color: "#666",
                  fontSize: "12px",
                  lineHeight: "1.2",
                }}
              >
                Prospect
              </span>
            </div>
          </div>
        </Dropdown>
      </Space>

      {/* Bouton Menu Mobile amélioré */}
      <Button
        type="text"
        icon={<MenuOutlined style={{ fontSize: "20px" }} />}
        onClick={showDrawer}
        className="mobile-menu-button"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#C58A51",
          borderRadius: "8px",
          width: "44px",
          height: "44px",
          transition: "all 0.3s ease",
        }}
      />

      {/* Drawer pour menu mobile amélioré */}
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              className="font-poppins font-bold"
              style={{
                color: "#C58A51",
                fontSize: "22px",
                letterSpacing: "-0.5px",
              }}
            >
              CampusLoc
            </span>
            <Avatar
              size={36}
              src={user?.avatar}
              style={{
                backgroundColor: "#C58A51",
                border: "2px solid #fff",
                boxShadow: "0 2px 4px rgba(197, 138, 81, 0.3)",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {getInitials(user?.prenom, user?.nom)}
            </Avatar>
          </div>
        }
        placement="right"
        closable={true}
        onClose={onClose}
        open={drawerVisible}
        width={300}
        styles={{
          body: { padding: 0 },
          header: {
            borderBottom: "1px solid #f0f0f0",
            padding: "16px 24px",
          },
        }}
      >
        {/* Informations utilisateur dans le drawer améliorées */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #f0f0f0",
            textAlign: "center",
            background: "linear-gradient(135deg, #faf9f7 0%, #f5f3f0 100%)",
          }}
        >
          <Avatar
            size={80}
            src={user?.avatar}
            style={{
              backgroundColor: "#C58A51",
              marginBottom: "16px",
              border: "3px solid #fff",
              boxShadow: "0 4px 12px rgba(197, 138, 81, 0.3)",
              fontSize: "28px",
              fontWeight: "600",
            }}
          >
            {getInitials(user?.prenom, user?.nom)}
          </Avatar>
          <div
            className="font-poppins font-semibold"
            style={{
              fontSize: "18px",
              color: "#333",
              marginBottom: "4px",
            }}
          >
            {getDisplayName(user?.prenom, user?.nom)}
          </div>
          <div
            className="font-poppins"
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "8px",
            }}
          >
            {user?.email || "email@example.com"}
          </div>
          <div
            className="font-poppins font-medium"
            style={{
              fontSize: "12px",
              color: "#C58A51",
              backgroundColor: "rgba(197, 138, 81, 0.1)",
              padding: "4px 12px",
              borderRadius: "12px",
              display: "inline-block",
            }}
          >
            Prospect
          </div>
        </div>

        {/* Actions rapides dans le drawer mobile améliorées */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #f0f0f0",
            backgroundColor: "#fafafa",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "12px",
              fontWeight: "500",
            }}
          >
            Actions rapides
          </div>
          <Space
            size="large"
            style={{ width: "100%", justifyContent: "space-around" }}
          >
            <div style={{ textAlign: "center" }}>
              <Badge count={3} size="small" offset={[-4, 4]}>
                <Button
                  type="text"
                  icon={<NotificationOutlined style={{ fontSize: "22px" }} />}
                  size="large"
                  style={{
                    color: "#C58A51",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgba(197, 138, 81, 0.1)",
                    border: "1px solid rgba(197, 138, 81, 0.2)",
                  }}
                  onClick={() => {
                    navigate("/notifications");
                    setDrawerVisible(false);
                  }}
                />
              </Badge>
              <div
                className="font-poppins"
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "6px",
                  fontWeight: "500",
                }}
              >
                Notifications
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <Badge count={nombreFavoris} size="small" offset={[-4, 4]}>
                <Button
                  type="text"
                  icon={<HeartOutlined style={{ fontSize: "22px" }} />}
                  size="large"
                  style={{
                    color: "#C58A51",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgba(197, 138, 81, 0.1)",
                    border: "1px solid rgba(197, 138, 81, 0.2)",
                  }}
                  onClick={() => {
                    navigate(ROUTES.FAVORI_PROSPECT);
                    setDrawerVisible(false);
                  }}
                />
              </Badge>
              <div
                className="font-poppins"
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "6px",
                  fontWeight: "500",
                }}
              >
                Favoris
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <Button
                type="text"
                icon={<ContactsOutlined style={{ fontSize: "22px" }} />}
                size="large"
                style={{
                  color: "#C58A51",
                  borderRadius: "50%",
                  width: "48px",
                  height: "48px",
                  backgroundColor: "rgba(197, 138, 81, 0.1)",
                  border: "1px solid rgba(197, 138, 81, 0.2)",
                }}
                onClick={() => {
                  navigate(ROUTES.CONTACTS_PROSPECT);
                  setDrawerVisible(false);
                }}
              />
              <div
                className="font-poppins"
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "6px",
                  fontWeight: "500",
                }}
              >
                Contacts
              </div>
            </div>
          </Space>
        </div>

        {/* Menu de navigation amélioré */}
        <div style={{ padding: "16px 0" }}>
          <div
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "12px",
              paddingLeft: "24px",
              fontWeight: "500",
            }}
          >
            Navigation
          </div>
          <Menu
            mode="vertical"
            className="font-poppins font-medium"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "15px",
              fontWeight: "500",
            }}
          />
        </div>

        {/* Actions utilisateur dans le drawer mobile améliorées */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid #f0f0f0",
            backgroundColor: "#fafafa",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "16px",
              fontWeight: "500",
            }}
          >
            Mon compte
          </div>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Link to="/profil" style={{ display: "block" }}>
              <Button
                type="text"
                icon={<UserOutlined style={{ fontSize: "16px" }} />}
                size="large"
                block
                className="font-poppins font-medium"
                style={{
                  textAlign: "left",
                  color: "#333",
                  height: "44px",
                  borderRadius: "8px",
                  justifyContent: "flex-start",
                }}
                onClick={() => setDrawerVisible(false)}
              >
                Mon Profil
              </Button>
            </Link>

            <Link to="/paramètres" style={{ display: "block" }}>
              <Button
                type="text"
                icon={<SettingOutlined style={{ fontSize: "16px" }} />}
                size="large"
                block
                className="font-poppins font-medium"
                style={{
                  textAlign: "left",
                  color: "#333",
                  height: "44px",
                  borderRadius: "8px",
                  justifyContent: "flex-start",
                }}
                onClick={() => setDrawerVisible(false)}
              >
                Paramètres
              </Button>
            </Link>

            <Button
              type="primary"
              icon={<LogoutOutlined style={{ fontSize: "16px" }} />}
              size="large"
              block
              danger
              className="font-poppins font-medium"
              onClick={() => {
                handleLogout();
                setDrawerVisible(false);
              }}
              style={{
                marginTop: "20px",
                height: "44px",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              Déconnexion
            </Button>
          </Space>
        </div>
      </Drawer>

      <style jsx>{`
        .navbar-icon-btn:hover {
          background-color: rgba(197, 138, 81, 0.1) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(197, 138, 81, 0.2);
        }

        .user-profile-section:hover {
          background-color: rgba(197, 138, 81, 0.05);
          border-color: rgba(197, 138, 81, 0.2);
        }

        .mobile-menu-button:hover {
          background-color: rgba(197, 138, 81, 0.1) !important;
          transform: scale(1.05);
        }

        .desktop-menu {
          display: flex !important;
        }

        .desktop-buttons {
          display: flex !important;
        }

        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }

          .desktop-buttons {
            display: none !important;
          }
        }
      `}</style>
    </Header>
  );
}

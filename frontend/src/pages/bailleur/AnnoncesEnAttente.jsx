import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Typography,
  Pagination,
  Spin,
  Alert,
  Button,
  message,
  Empty,
  Card,
  Badge,
  Tooltip,
} from "antd";
import {
  ClockCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import AnnonceCard from "../../components/bailleur/AnnonceCard";
import { getAnnoncesEnAttentesParProprietaires } from "../../api/annonceAPI";
import "../../styles/bailleur/annonce-attente-bailleur.css";

const { Title, Text } = Typography;

const AnnonceEnAttentes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allAnnonces, setAllAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const pageSize = 9;

  // Récupération sécurisée des données utilisateur
  const getUserData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      return userData.userId;
    } catch (error) {
      console.error("Erreur lors de la lecture des données utilisateur:", error);
      return null;
    }
  };

  const proprietaireId = getUserData();

  // Preload images with fallback
  const preloadImages = useCallback((annonces) => {
    return Promise.all(
      annonces.map((annonce) => {
        if (annonce.imageUrl) {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = annonce.imageUrl;
            img.onload = () => resolve({ ...annonce, imageLoaded: true });
            img.onerror = () => resolve({ ...annonce, imageUrl: null, imageLoaded: false });
            setTimeout(() => resolve({ ...annonce, imageUrl: null, imageLoaded: false }), 5000);
          });
        }
        return Promise.resolve({ ...annonce, imageLoaded: false });
      })
    );
  }, []);

  const fetchAnnoncesEnAttente = useCallback(async () => {
    if (!proprietaireId) {
      setError("Identifiant utilisateur manquant");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAnnoncesEnAttentesParProprietaires(proprietaireId);
      const data = response.data;

      const annoncesData = data.content || data.data || data;

      // Preload images and update annonces
      const annoncesWithImages = await preloadImages(Array.isArray(annoncesData) ? annoncesData : []);
      setAllAnnonces(annoncesWithImages);
      
      // Réinitialiser à la première page lors du rechargement des données
      setCurrentPage(1);
    } catch (err) {
      console.error("Erreur lors du chargement des annonces:", err);
      setError(err.message || "Erreur lors du chargement des annonces");
      message.error("Erreur lors du chargement des annonces");
    } finally {
      setLoading(false);
    }
  }, [proprietaireId, preloadImages]);

  // Calcul des annonces à afficher pour la page courante
  const getCurrentPageAnnonces = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allAnnonces.slice(startIndex, endIndex);
  };

  // Gestionnaire pour toggle des détails
  const handleToggleDetails = (annonceId, expanded, annonce) => {
    console.log(`Détails ${expanded ? "étendus" : "réduits"} pour l'annonce ${annonceId}`);
  };

  // Chargement initial
  useEffect(() => {
    fetchAnnoncesEnAttente();
  }, [fetchAnnoncesEnAttente]);

  // Gestionnaire changement de page avec animation
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Faire défiler vers le haut avec animation smooth
    const headerElement = document.querySelector('.annonces-en-attente__header');
    if (headerElement) {
      headerElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAction = async (action, annonceId, annonce) => {
    setActionLoading(prev => ({ ...prev, [annonceId]: true }));
    
    try {
      switch (action) {
        case "voir":
          message.info(`Voir les détails de l'annonce ID: ${annonceId}`);
          break;
        case "modifier":
          // navigate(`/modifier-annonce/${annonceId}`);
          message.info(`Redirection vers la modification de l'annonce ${annonceId}`);
          break;
        case "supprimer":
          // showModal de confirmation
          message.info(`Demande de suppression de l'annonce ${annonceId}`);
          break;
        default:
          console.warn("Action inconnue :", action);
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [annonceId]: false }));
    }
  };

  // Création des actions pour chaque annonce
  const getActionsForAnnonce = (annonce) => {
    const isLoading = actionLoading[annonce.id];

    return [
      <Tooltip key="voir" title="Voir les détails">
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleAction("voir", annonce.id, annonce);
          }}
          className="annonce-action-btn"
          loading={isLoading}
        >
          Voir
        </Button>
      </Tooltip>,
      <Tooltip key="modifier" title="Modifier l'annonce">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleAction("modifier", annonce.id, annonce);
          }}
          className="annonce-action-btn"
          loading={isLoading}
        >
          Modifier
        </Button>
      </Tooltip>,
      <Tooltip key="supprimer" title="Supprimer l'annonce">
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleAction("supprimer", annonce.id, annonce);
          }}
          className="annonce-action-btn"
          loading={isLoading}
        >
          Supprimer
        </Button>
      </Tooltip>,
    ];
  };

  // Affichage conditionnel en cas d'erreur critique
  if (!proprietaireId) {
    return (
      <div className="annonces-en-attente">
        <Alert
          message="Erreur d'authentification"
          description="Impossible de récupérer les informations utilisateur. Veuillez vous reconnecter."
          type="error"
          showIcon
          className="annonces-en-attente__error"
        />
      </div>
    );
  }

  const currentPageAnnonces = getCurrentPageAnnonces();
  const totalCount = allAnnonces.length;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="annonces-en-attente">
      <div className="annonces-en-attente__header">
        <div className="annonces-en-attente__title-section">
          <Title level={2} className="annonces-en-attente__title">
            <ClockCircleOutlined className="annonces-en-attente__title-icon" />
            Annonces en attente
          </Title>
          <Badge 
            count={totalCount} 
            className="annonces-en-attente__badge"
            showZero
          />
        </div>
        <div className="annonces-en-attente__subtitle-section">
          <Text className="annonces-en-attente__subtitle">
            Vous avez {totalCount} annonce{totalCount > 1 ? "s" : ""} en attente de validation
          </Text>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchAnnoncesEnAttente}
            loading={loading}
            className="annonces-en-attente__refresh-btn"
          >
            Actualiser
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          message="Erreur"
          description={error}
          type="error"
          showIcon
          className="annonces-en-attente__error"
          action={
            <Button
              size="small"
              onClick={() => fetchAnnoncesEnAttente()}
              className="annonces-en-attente__retry-btn"
            >
              Réessayer
            </Button>
          }
        />
      )}

      <Spin
        spinning={loading}
        size="large"
        className="annonces-en-attente__spinner"
      >
        {allAnnonces.length === 0 && !loading ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="annonces-en-attente__empty-text">
                Aucune annonce en attente
              </span>
            }
            className="annonces-en-attente__empty"
          >
            <Text
              type="secondary"
              className="annonces-en-attente__empty-subtitle"
            >
              Toutes vos annonces ont été traitées.
            </Text>
          </Empty>
        ) : (
          <div className="annonces-en-attente__content">
            {/* Informations de pagination en haut */}
            {totalCount > 0 && (
              <div className="annonces-en-attente__pagination-info">
                <Text className="annonces-en-attente__pagination-text">
                  Affichage de {startIndex} à {endIndex} sur {totalCount} annonce{totalCount > 1 ? "s" : ""}
                </Text>
              </div>
            )}

            <Row gutter={[24, 24]} className="annonces-en-attente__grid">
              {currentPageAnnonces.map((annonce) => (
                <Col
                  key={annonce.id}
                  xs={24}
                  sm={12}
                  lg={8}
                  className="annonces-en-attente__grid-item"
                >
                  <AnnonceCard
                    annonce={annonce}
                    size="default"
                    showBadge={true}
                    showPrice={true}
                    showInfoButton={true}
                    showActions={true}
                    expandable={true}
                    priceFormat="detailed"
                    onToggleDetails={handleToggleDetails}
                    onAction={handleAction}
                    actions={getActionsForAnnonce(annonce)}
                    cardStyle={{
                      height: "100%",
                      transition: "all 0.3s ease",
                    }}
                    // Fallback image if none loaded
                    imageUrl={annonce.imageUrl || "https://via.placeholder.com/300x200?text=Image+non+disponible"}
                  />
                </Col>
              ))}
            </Row>

            {totalCount > pageSize && (
              <div className="annonces-en-attente__pagination">
                <Pagination
                  current={currentPage}
                  total={totalCount}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper={true}
                  showTotal={(total, range) => (
                    <span className="annonces-en-attente__pagination-total">
                      {range[0]}-{range[1]} sur {total} annonce{total > 1 ? "s" : ""}
                    </span>
                  )}
                  className="annonces-en-attente__pagination-component"
                />
              </div>
            )}
          </div>
        )}
      </Spin>
    </div>
  );
};

export default AnnonceEnAttentes;
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Pagination,
  Spin,
  Alert,
  Space,
  Button,
  message,
  Modal,
  Empty,
} from "antd";
import {
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import AnnonceCard from "../../components/bailleur/AnnonceCard";
import { getAnnoncesEnAttentesParProprietaires } from "../../api/annonceAPI";
import "../../styles/bailleur/annonce-attente-bailleur.css";

const { Title, Text } = Typography;

const AnnonceEnAttentes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 9;

  // Récupération sécurisée des données utilisateur
  const getUserData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      return userData.userId;
    } catch (error) {
      console.error(
        "Erreur lors de la lecture des données utilisateur:",
        error
      );
      return null;
    }
  };

  const proprietaireId = getUserData();

  const fetchAnnoncesEnAttente = async (page = 1) => {
    if (!proprietaireId) {
      setError("Identifiant utilisateur manquant");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAnnoncesEnAttentesParProprietaires(
        proprietaireId
      );
      const data = response.data;

      const annoncesData = data.content || data.data || data;
      const total =
        data.totalElements ||
        data.total ||
        (Array.isArray(annoncesData) ? annoncesData.length : 0);

      setAnnonces(Array.isArray(annoncesData) ? annoncesData : []);
      setTotalCount(total);
    } catch (err) {
      console.error("Erreur lors du chargement des annonces:", err);
      setError(err.message || "Erreur lors du chargement des annonces");
      message.error("Erreur lors du chargement des annonces");
    } finally {
      setLoading(false);
    }
  };

  // Gestionnaire pour toggle des détails
  const handleToggleDetails = (annonceId, expanded, annonce) => {
    console.log(
      `Détails ${expanded ? "étendus" : "réduits"} pour l'annonce ${annonceId}`
    );
  };

  // Chargement initial et changement de page
  useEffect(() => {
    fetchAnnoncesEnAttente(currentPage);
  }, [currentPage]);

  // Gestionnaire changement de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAction = (action, annonceId, annonce) => {
  switch (action) {
    case "voir":
      // Par exemple rediriger vers une page de détail :
      // navigate(`/annonces/${annonceId}`);
      message.info(`Voir les détails de l'annonce ID: ${annonceId}`);
      break;
    case "modifier":
      // navigate(`/modifier-annonce/${annonceId}`);
      break;
    case "supprimer":
      // showModal de confirmation
      break;
    default:
      console.warn("Action inconnue :", action);
  }
};


  // Création des actions pour chaque annonce
  const getActionsForAnnonce = (annonce) => {
    const isLoading = actionLoading[annonce.id];

    return [
      <Button
        key="voir"
        type="text"
        icon={<EyeOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          handleAction("voir", annonce.id, annonce);
        }}
        className="annonce-action-btn"
      >
        Voir
      </Button>,
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

  return (
    <div className="annonces-en-attente">
      <div className="annonces-en-attente__header">
        <Title level={2} className="annonces-en-attente__title">
          <ClockCircleOutlined className="annonces-en-attente__title-icon" />
          Annonces en attente
        </Title>
        <Text className="annonces-en-attente__subtitle">
          Vous avez {totalCount} annonce{totalCount > 1 ? "s" : ""} en attente
          de validation
        </Text>
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
              onClick={() => fetchAnnoncesEnAttente(currentPage)}
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
        {annonces.length === 0 && !loading ? (
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
            <Row gutter={[24, 24]} className="annonces-en-attente__grid">
              {annonces.map((annonce) => (
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
                      {range[0]}-{range[1]} sur {total} annonces
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

import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Alert,
  Button,
  message,
  Empty,
  Table,
  Badge,
  Tag,
  Space,
} from "antd";
import {
  ClockCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { getAnnoncesEnAttentesParProprietaires } from "../../api/annonceAPI";
import "../../styles/bailleur/annonce-attente-bailleur.css";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const logementLabels = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  STUDIO: "Studio",
  CHAMBRE_INDIVIDUELLE: "Chambre Individuelle",
  CHAMBRE_PARTAGEE: "Chambre Partagée",
};

const logementColors = {
  APPARTEMENT: "geekblue",
  MAISON: "green",
  STUDIO: "purple",
  CHAMBRE_INDIVIDUELLE: "volcano",
  CHAMBRE_PARTAGEE: "orange",
};

const AnnonceEnAttentes = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();

  const getUserId = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      return userData?.userId || null;
    } catch {
      return null;
    }
  };

  const proprietaireId = getUserId();

  const fetchAnnonces = useCallback(async () => {
    if (!proprietaireId) {
      setError("Identifiant utilisateur manquant");
      setAnnonces([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAnnoncesEnAttentesParProprietaires(
        proprietaireId
      );
      const data = response?.data;
      const listeAnnonces = data?.content || data?.data || data || [];
      setAnnonces(Array.isArray(listeAnnonces) ? listeAnnonces : []);
    } catch (err) {
      const msg = err?.message || "Erreur lors du chargement des annonces";
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  }, [proprietaireId]);

  useEffect(() => {
    fetchAnnonces();
  }, [fetchAnnonces]);

  const handleVoirDetails = async (annonce) => {
    const id = annonce?.id;
    if (!id) return;

    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      // Navigation vers la route détail avec l'id
      navigate(`/bailleur/annonce/${id}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getStatutColor = (statut) => {
    if (!statut) return "default";
    const st = statut.toLowerCase().replace(/\s+/g, "_");
    switch (st) {
      case "en_attente":
        return "orange";
      case "validé":
      case "valide":
        return "green";
      case "refusé":
      case "refuse":
        return "red";
      default:
        return "default";
    }
  };

  const formatStatut = (statut) => {
    if (!statut) return "Non défini";
    return statut.replace(/_/g, " ").toUpperCase();
  };

  const logementFilters = Object.entries(logementLabels).map(
    ([key, label]) => ({
      text: label,
      value: key,
    })
  );

  const statutFilters = [
    { text: "En attente", value: "en_attente" },
    { text: "Validé", value: "valide" },
    { text: "Refusé", value: "refuse" },
  ];

  const columns = [
    {
      title: "Titre",
      dataIndex: "titre",
      key: "titre",
      width: "25%",
      sorter: (a, b) => (a.titre || "").localeCompare(b.titre || ""),
      render: (titre) => <Text strong>{titre || "Sans titre"}</Text>,
    },
    {
      title: "Type de logement",
      dataIndex: "typeDeLogement",
      key: "typeDeLogement",
      width: "20%",
      filters: logementFilters,
      onFilter: (value, record) => (record.typeDeLogement || "") === value,
      render: (type) => {
        const label = logementLabels[type] || "Non spécifié";
        const color = logementColors[type] || "blue";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Adresse",
      dataIndex: "adresse",
      key: "adresse",
      width: "20%",
      sorter: (a, b) => (a.adresse || "").localeCompare(b.adresse || ""),
      render: (adresse) => adresse || "Non spécifiée",
    },
    {
      title: "Ville",
      dataIndex: "ville",
      key: "ville",
      width: "15%",
      sorter: (a, b) => (a.ville || "").localeCompare(b.ville || ""),
      render: (ville) => ville || "Non spécifiée",
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      width: "12%",
      filters: statutFilters,
      onFilter: (value, record) =>
        (record.statut || "").toLowerCase() === value.toLowerCase(),
      render: (statut) => (
        <Tag color={getStatutColor(statut)}>{formatStatut(statut)}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "8%",
      render: (_, annonce) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          loading={!!actionLoading[annonce.id]}
          onClick={() => handleVoirDetails(annonce)}
        >
          Voir
        </Button>
      ),
    },
  ];

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
      <header className="annonces-en-attente__header">
        <div className="annonces-en-attente__title-section">
          <Title level={2} className="annonces-en-attente__title">
            <ClockCircleOutlined className="annonces-en-attente__title-icon" />{" "}
            Annonces en attente
          </Title>
          <Badge
            count={annonces.length}
            showZero
            className="annonces-en-attente__badge"
          />
        </div>
        <div className="annonces-en-attente__subtitle-section">
          <Text className="annonces-en-attente__subtitle">
            Vous avez {annonces.length} annonce{annonces.length > 1 ? "s" : ""}{" "}
            en attente de validation
          </Text>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchAnnonces}
            loading={loading}
            className="annonces-en-attente__refresh-btn"
          >
            Actualiser
          </Button>
        </div>
      </header>

      {error && (
        <Alert
          message="Erreur"
          description={error}
          type="error"
          showIcon
          className="annonces-en-attente__error"
          action={
            <Button size="small" onClick={fetchAnnonces}>
              Réessayer
            </Button>
          }
        />
      )}

      <section className="annonces-en-attente__table-container">
        <Table
          columns={columns}
          dataSource={annonces}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} sur ${total} annonce${
                total > 1 ? "s" : ""
              }`,
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size="small">
                    <Text>Aucune annonce en attente</Text>
                    <Text type="secondary">
                      Toutes vos annonces ont été traitées.
                    </Text>
                  </Space>
                }
              />
            ),
          }}
          scroll={{ x: 800 }}
          size="middle"
          className="annonces-en-attente__table"
        />
      </section>
    </div>
  );
};

export default AnnonceEnAttentes;

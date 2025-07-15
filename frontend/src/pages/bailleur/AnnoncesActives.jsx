import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Tag,
  Card,
  Descriptions,
  Space,
  Typography,
  message,
  Badge,
} from "antd";
import {
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "../../styles/bailleur/annonceActive.css";
import { getBailleurFromStorage } from "../../utils/authUtils";
import { getAnnoncesActivesParProprietaires } from "../../api/annonceAPI";

const { Title, Text } = Typography;

const AnnonceActive = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);

  const fetchAnnonces = async () => {
    setLoading(true);
    try {
      const proprietaireId = getBailleurFromStorage()?.userId;

      if (!proprietaireId) {
        message.warning("Identifiant utilisateur introuvable.");
        return;
      }

      const response = await getAnnoncesActivesParProprietaires(proprietaireId);
      setAnnonces(response.data);
    } catch (error) {
      message.error("Erreur lors du chargement des annonces");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const showDetails = (annonce) => {
    setSelectedAnnonce(annonce);
    setDetailsVisible(true);
  };

  const handleCloseDetails = () => {
    setDetailsVisible(false);
    setSelectedAnnonce(null);
  };

  // Fonction pour formater le type de logement
  const formatTypeDeLogement = (type) => {
    const typeMap = {
      CHAMBRE_INDIVIDUELLE: "Chambre individuelle",
      CHAMBRE_PARTAGEE: "Chambre partagée",
      APPARTEMENT: "Appartement",
      MAISON: "Maison",
      STUDIO: "Studio",
    };
    return typeMap[type] || type;
  };

  // Fonction pour obtenir la couleur du tag selon le type
  const getTypeColor = (type) => {
    const colorMap = {
      CHAMBRE_INDIVIDUELLE: "blue",
      CHAMBRE_PARTAGEE: "cyan",
      APPARTEMENT: "green",
      MAISON: "purple",
      STUDIO: "orange",
    };
    return colorMap[type] || "default";
  };

  // Fonction pour formater le statut
  const formatStatut = (statut) => {
    const statutMap = {
      EN_ATTENTE: "En Attente",
      REFUSER: "refuse",
      ACCEPTER: "accpter",
    };
    return statutMap[statut] || statut;
  };

  const columns = [
    {
      title: "Titre",
      dataIndex: "titre",
      key: "titre",
      className: "annonce-active__column-titre",
      render: (text) => (
        <Text strong className="annonce-active__titre-text">
          {text}
        </Text>
      ),
    },
    {
      title: "Type de logement",
      dataIndex: "typeDeLogement",
      key: "typeDeLogement",
      className: "annonce-active__column-type",
      render: (type) => (
        <Tag color={getTypeColor(type)} className="annonce-active__type-tag">
          {formatTypeDeLogement(type)}
        </Tag>
      ),
    },
    {
      title: "Prix",
      dataIndex: "prix",
      key: "prix",
      className: "annonce-active__column-prix",
      render: (prix) => (
        <Text strong className="annonce-active__prix-text">
          {prix?.toLocaleString()} €/mois
        </Text>
      ),
    },
    {
      title: "Localisation",
      dataIndex: "ville",
      key: "ville",
      className: "annonce-active__column-localisation",
      render: (ville, record) => (
        <span>
          <EnvironmentOutlined /> {ville}
        </span>
      ),
    },
    {
      title: "Surface",
      dataIndex: "surface",
      key: "surface",
      className: "annonce-active__column-surface",
      render: (surface) => <span>{surface} m²</span>,
    },
    {
      title: "Date publication",
      dataIndex: "datePublication",
      key: "datePublication",
      className: "annonce-active__column-date",
      render: (date) => (
        <span className="annonce-active__date-text">
          {new Date(date).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      className: "annonce-active__column-statut",
      render: (statut) => (
        <Tag color="success" className="annonce-active__statut-tag">
          {formatStatut(statut)}
        </Tag>
      ),
    },
    {
      title: "Disponible",
      dataIndex: "disponible",
      key: "disponible",
      className: "annonce-active__column-disponible",
      render: (disponible) => (
        <Badge
          status={disponible ? "success" : "error"}
          text={disponible ? "Disponible" : "Indisponible"}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      className: "annonce-active__column-actions",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/bailleur/annonce/${record.id}`)}
          className="annonce-active__btn-details"
        >
          Détails
        </Button>
      ),
    },
  ];

  return (
    <div className="annonce-active">
      <div className="annonce-active__header">
        <Title level={2} className="annonce-active__title">
          Annonces Actives
        </Title>
        <Text className="annonce-active__subtitle">
          Gestion des annonces en cours de publication
        </Text>
      </div>

      <Card className="annonce-active__table-card">
        <Table
          columns={columns}
          dataSource={annonces}
          loading={loading}
          rowKey="id"
          className="annonce-active__table"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} sur ${total} annonces`,
            className: "annonce-active__pagination",
          }}
        />
      </Card>
    </div>
  );
};

export default AnnonceActive;

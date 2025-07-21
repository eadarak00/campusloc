import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Divider,
  Button,
  Space,
  Image,
  Carousel,
  Empty,
  Badge,
  Tooltip,
  Avatar,
  Rate,
  Progress,
  Skeleton,
  Breadcrumb,
  Modal,
  message,
  Tabs,
  List,
  Statistic,
  Timeline,
  FloatButton,
  Popconfirm,
  notification,
  Form,
  Input,
} from "antd";
import {
  HomeOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ExpandOutlined,
  BankOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CalendarOutlined,
  RestOutlined,
  EyeOutlined,
  StarOutlined,
  SafetyOutlined,
  WifiOutlined,
  CarOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CustomerServiceOutlined,
  LeftOutlined,
  RightOutlined,
  FullscreenOutlined,
  MessageOutlined,
  WhatsAppOutlined,
  CopyOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  GlobalOutlined,
  ShopOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import "../../styles/bailleur/detail-annonce.css";
import { useParams, useNavigate } from "react-router-dom";
import { getAnnonceById } from "../../api/annonceAPI";
import { getImageUrl } from "../../api/ImageHelper";
import { Mail, Phone, User, X } from "lucide-react";
import ROUTES from "../../routes/routes";
import { debloquerCoordonnees } from "../../api/ContactAPI";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const AnnonceDetailsProspect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [visitsCount, setVisitsCount] = useState(0);

  const [notificationApi, contextHolder] = notification.useNotification();

  // Appel du API pour recuperer l'annonce
  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        setLoading(true);
        const response = await getAnnonceById(id);
        const data = response.data;
        setAnnonce(data);
        console.log("Données récupérées :", data);

        // setVisitsCount(data?.stats?.vues || 0);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'annonce :", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnnonce();
    }
  }, [id]);

  const handleContact = async () => {
    try {
      const res = await debloquerCoordonnees(annonce.id);
      const data = res.data;

      if (data.statut === "EXISTANT") {
        notificationApi.warning({
          message: "Vous avez déjà contacté ce bailleur",
          description: (
            <>
              <p>
                <b>Nom :</b> {data.nom} {data.prenom}
              </p>
            </>
          ),
          placement: "topRight",
          duration: 2,
        });
      } else {
        notificationApi.success({
          message: "Contact enregistré",
          description: (
            <>
              <p>
                <b>Nom :</b> {data.nom} {data.prenom}
              </p>
              <p>
                <b>Email :</b> {data.email}
              </p>
              <p>
                <b>Téléphone :</b> {data.telephone}
              </p>
            </>
          ),
          placement: "topRight",
          duration: 2,
        });
      }
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        notificationApi.warning({
          message: "Connexion requise",
          description:
            "Veuillez vous connecter pour contacter le propriétaire.",
          placement: "topRight",
          duration: 3,
          onClose: () => navigate("/connexion"),
        });
      } else if (error.response?.status === 409) {
        notification.info({
          message: "Déjà contacté",
          description: "Vous avez déjà fait une demande pour cette annonce.",
          placement: "topRight",
          duration: 4,
        });
      } else {
        notificationApi.error({
          message: "Erreur",
          description: "Une erreur est survenue lors de la demande de contact.",
          placement: "topRight",
          duration: 3,
        });
        console.error(error);
      }
    }
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    message.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: annonce.titre,
        text: annonce.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success("Lien copié dans le presse-papiers");
    }
  };

  const getImages = () => {
    if (annonce?.medias?.length > 0) {
      return annonce.medias.map((media) => ({
        ...media,
        fullUrl: getImageUrl(media.url),
      }));
    }

    return [
      {
        nomFichier: "placeholder.jpg",
        fullUrl:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      },
    ];
  };

  const images = getImages();

  const getTypeLabel = (type) => {
    const typeLabels = {
      CHAMBRE_INDIVIDUELLE: "Chambre individuelle",
      CHAMBRE_PARTAGEE: "Chambre partagée",
      APPARTEMENT: "Appartement",
      MAISON: "Maison",
      STUDIO: "Studio",
    };
    return typeLabels[type] || type;
  };

  const formatPrice = (price) => {
    if (!price) return "0";
    return price.toLocaleString();
  };

  const getTypeColor = (type) => {
    const colors = {
      CHAMBRE_INDIVIDUELLE: "blue",
      CHAMBRE_PARTAGEE: "green",
      APPARTEMENT: "orange",
      MAISON: "red",
      STUDIO: "purple",
    };
    return colors[type] || "default";
  };

  const getCaracteristiques = () => {
    if (!annonce) return [];

    const caracteristiques = [];

    if (annonce.surface) {
      caracteristiques.push({
        icon: <ExpandOutlined />,
        label: "Surface",
        value: `${annonce.surface} m²`,
      });
    }

    if (annonce.pieces) {
      caracteristiques.push({
        icon: <HomeOutlined />,
        label: "Pièces",
        value: annonce.pieces,
      });
    }

    if (annonce.nombreDeChambres) {
      caracteristiques.push({
        icon: <RestOutlined />,
        label: "Chambres",
        value: annonce.nombreDeChambres,
      });
    }

    if (annonce.capacite) {
      caracteristiques.push({
        icon: <UserOutlined />,
        label: "Capacité",
        value: `${annonce.capacite} personne(s)`,
      });
    }

    if (annonce.salleDeBains) {
      caracteristiques.push({
        icon: <BankOutlined />,
        label: "Salles de bain",
        value: annonce.salleDeBains,
      });
    }

    return caracteristiques;
  };

  // Fonction pour flouter le texte
  const getBlurredText = (text, showLength = 3) => {
    if (!text) return "•••••••";
    return text.substring(0, showLength) + "•••••••";
  };

  if (loading) {
    return (
      <div className="detail-annonce">
        <Skeleton active />
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={16}>
            <Skeleton.Image style={{ width: "100%", height: 400 }} />
            <Skeleton active style={{ marginTop: 24 }} />
          </Col>
          <Col xs={24} lg={8}>
            <Skeleton active />
          </Col>
        </Row>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="detail-annonce">
        <Empty description="Annonce non trouvée" />
      </div>
    );
  }

  return (
    <div className="detail-annonce">
      {contextHolder}
      {/* Breadcrumb */}
      <Breadcrumb className="detail-annonce__breadcrumb">
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Annonces</Breadcrumb.Item>
        <Breadcrumb.Item>{annonce.titre}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Header avec actions */}
      <div className="detail-annonce__header">
        <div className="detail-annonce__header-left">
          <div className="detail-annonce__title-section">
            <div className="detail-annonce__title-top">
              <Space>
                <Tag
                  color={getTypeColor(annonce.typeDeLogement)}
                  className="detail-annonce__type-tag"
                >
                  {getTypeLabel(annonce.typeDeLogement)}
                </Tag>
                {annonce.verified && (
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Vérifié
                  </Tag>
                )}
                {annonce.negociable && <Tag color="blue">Négociable</Tag>}
              </Space>
            </div>
            <Title level={1} className="detail-annonce__title">
              {annonce.titre}
            </Title>
            <div className="detail-annonce__location">
              <EnvironmentOutlined className="detail-annonce__location-icon" />
              <Text className="detail-annonce__location-text">
                {annonce.adresse}, {annonce.ville}
              </Text>
            </div>
          </div>
        </div>

        <div className="detail-annonce__header-right">
          <Space>
            <Tooltip title="Ajouter aux favoris">
              <Button
                type={isFavorite ? "primary" : "default"}
                icon={<HeartOutlined />}
                onClick={handleFavoriteToggle}
              />
            </Tooltip>
            <Tooltip title="Partager">
              <Button icon={<ShareAltOutlined />} onClick={handleShare} />
            </Tooltip>
          </Space>
        </div>
      </div>

      <div className="detail-annonce__content">
        <Row gutter={[24, 24]}>
          {/* Colonne principale */}
          <Col xs={24} lg={16}>
            {/* Galerie photos */}
            <Card className="detail-annonce__gallery">
              <div className="detail-annonce__gallery-header">
                <Title level={4}>Photos ({images.length})</Title>
                <Button
                  icon={<FullscreenOutlined />}
                  onClick={() => setShowImageModal(true)}
                >
                  Voir en grand
                </Button>
              </div>

              {images.length > 0 ? (
                <div className="detail-annonce__carousel-container">
                  <Carousel
                    autoplay
                    dots={false}
                    prevArrow={<LeftOutlined />}
                    nextArrow={<RightOutlined />}
                    beforeChange={(from, to) => setActiveImageIndex(to)}
                  >
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="detail-annonce__carousel-item"
                      >
                        <Image
                          src={image.fullUrl}
                          alt={image.nomFichier || `Photo ${index + 1}`}
                          className="detail-annonce__carousel-media"
                          preview={false}
                        />
                      </div>
                    ))}
                  </Carousel>

                  <div className="detail-annonce__thumbnail-strip">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`detail-annonce__thumbnail ${
                          index === activeImageIndex ? "active" : ""
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={image.fullUrl}
                          alt={image.nomFichier || `Thumbnail ${index + 1}`}
                          preview={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Empty description="Aucune photo disponible" />
              )}
            </Card>

            {/* Contenu principal avec onglets */}
            <Card className="detail-annonce__main-content">
              <Tabs defaultActiveKey="details" className="detail-annonce__tabs">
                <TabPane tab="Détails" key="details">
                  {/* Prix */}
                  <div className="detail-annonce__price-section">
                    <div className="detail-annonce__main-price">
                      <Title level={2} className="detail-annonce__price-value">
                        {formatPrice(annonce.prix)} FCFA
                      </Title>
                      <Text
                        type="secondary"
                        className="detail-annonce__price-period"
                      >
                        / mois
                      </Text>
                    </div>

                    <div className="detail-annonce__additional-costs">
                      {annonce.charges && (
                        <div className="detail-annonce__cost-item">
                          <Text type="secondary">Charges: </Text>
                          <Text strong>
                            {formatPrice(annonce.charges)} FCFA/mois
                          </Text>
                        </div>
                      )}
                      {annonce.caution && (
                        <div className="detail-annonce__cost-item">
                          <Text type="secondary">Caution: </Text>
                          <Text strong>
                            {formatPrice(annonce.caution)} FCFA
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>

                  <Divider />

                  {/* Caractéristiques */}
                  <div className="detail-annonce__characteristics">
                    <Title level={4}>Caractéristiques</Title>
                    <Row gutter={[16, 16]}>
                      {getCaracteristiques().map((carac, index) => (
                        <Col xs={12} sm={8} md={6} key={index}>
                          <div className="detail-annonce__characteristic-item">
                            <div className="detail-annonce__characteristic-icon">
                              {carac.icon}
                            </div>
                            <div className="detail-annonce__characteristic-content">
                              <Text
                                type="secondary"
                                className="detail-annonce__characteristic-label"
                              >
                                {carac.label}
                              </Text>
                              <Text
                                strong
                                className="detail-annonce__characteristic-value"
                              >
                                {carac.value}
                              </Text>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <Divider />

                  {/* Description */}
                  <div className="detail-annonce__description">
                    <Title level={4}>Description</Title>
                    <Paragraph className="detail-annonce__description-text">
                      {annonce.description}
                    </Paragraph>
                  </div>
                </TabPane>
                <TabPane tab="Localisation" key="localisation">
                  <div className="detail-annonce__localisation">
                    <Title level={4}>Localisation et proximité</Title>

                    {/* Carte placeholder */}
                    <div className="detail-annonce__map-container">
                      <div className="detail-annonce__map-placeholder">
                        <EnvironmentOutlined className="detail-annonce__map-icon" />
                        <Text type="secondary">Carte interactive</Text>
                        <Text
                          type="secondary"
                          className="detail-annonce__map-address"
                        >
                          {annonce.adresse}, {annonce.ville}
                        </Text>
                      </div>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Informations du propriétaire (floutées) */}
            <Card className="detail-annonce__owner-card">
              <Title level={4} className="detail-annonce__owner-header">
                Informations du propriétaire
              </Title>
              <div className="detail-annonce__owner-info detail-annonce__owner-info--blurred">
                <div className="detail-annonce__owner-name">
                  <User className="info-icon" size={18} />
                  <Text strong style={{ filter: "blur(3px)" }}>
                    {getBlurredText(annonce.nomProprietaire)}
                  </Text>
                </div>
                <div className="detail-annonce__info-row">
                  <Mail className="info-icon" size={18} />
                  <Text strong style={{ filter: "blur(3px)" }}>
                    {getBlurredText(annonce.emailProprietaire)}
                  </Text>
                </div>
                <div className="detail-annonce__info-row">
                  <Phone className="info-icon" size={18} />
                  <Text strong style={{ filter: "blur(3px)" }}>
                    {getBlurredText(annonce.telephoneProprietaire)}
                  </Text>
                </div>
              </div>

              <Divider />

              <div className="detail-annonce__contact-section">
                <Button
                  type="primary"
                  size="large"
                  icon={<MessageOutlined />}
                  onClick={handleContact}
                  block
                >
                  Contacter le propriétaire
                </Button>
                <Text
                  type="secondary"
                  style={{
                    textAlign: "center",
                    display: "block",
                    marginTop: 8,
                  }}
                >
                  Connectez-vous pour voir les informations complètes
                </Text>
              </div>
            </Card>

            {/* Récapitulatif des coûts */}
            <Card className="detail-annonce__cost-summary">
              <Title level={4}>Récapitulatif des coûts</Title>
              <div className="detail-annonce__cost-breakdown">
                <div className="detail-annonce__cost-row">
                  <Text>Loyer mensuel</Text>
                  <Text strong>{formatPrice(annonce.prix)} FCFA</Text>
                </div>
                {annonce.charges && (
                  <div className="detail-annonce__cost-row">
                    <Text>Charges</Text>
                    <Text strong>{formatPrice(annonce.charges)} FCFA</Text>
                  </div>
                )}
                {annonce.caution && (
                  <div className="detail-annonce__cost-row">
                    <Text>Caution</Text>
                    <Text strong>{formatPrice(annonce.caution)} FCFA</Text>
                  </div>
                )}
                <Divider />
                <div className="detail-annonce__cost-row detail-annonce__cost-row--total">
                  <Text strong>Total mensuel</Text>
                  <Text strong className="detail-annonce__total-price">
                    {formatPrice((annonce.prix || 0) + (annonce.charges || 0))}{" "}
                    FCFA
                  </Text>
                </div>
              </div>
            </Card>

            {/* Infos publication */}
            <Card className="detail-annonce__publication-info">
              <Title level={4}>Informations</Title>
              <Timeline>
                <Timeline.Item dot={<CalendarOutlined />} color="green">
                  <Text>
                    Publié le{" "}
                    {new Date(annonce.datePublication).toLocaleDateString()}
                  </Text>
                </Timeline.Item>
                <Timeline.Item dot={<EyeOutlined />} color="blue">
                  <Text>{visitsCount} vues</Text>
                </Timeline.Item>
                {annonce.dateModification && (
                  <Timeline.Item dot={<ClockCircleOutlined />} color="orange">
                    <Text>
                      Mis à jour le{" "}
                      {new Date(annonce.dateModification).toLocaleDateString()}
                    </Text>
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal galerie plein écran */}
      <Modal
        visible={showImageModal}
        onCancel={() => setShowImageModal(false)}
        footer={null}
        width="90%"
        className="detail-annonce__media-modal"
      >
        <Carousel
          initialSlide={activeImageIndex}
          arrows
          prevArrow={<LeftOutlined />}
          nextArrow={<RightOutlined />}
        >
          {images.map((image, index) => (
            <div key={index}>
              <Image
                src={image.fullUrl}
                alt={`Photo ${index + 1}`}
                style={{ width: "100%", height: "70vh", objectFit: "contain" }}
                preview={false}
              />
            </div>
          ))}
        </Carousel>
      </Modal>
    </div>
  );
};

export default AnnonceDetailsProspect;

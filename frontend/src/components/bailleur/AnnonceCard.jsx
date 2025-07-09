import React, { useState } from "react";
import {
  Card,
  Badge,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Tag,
  Carousel,
  Modal,
} from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  EuroOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
  CameraOutlined,
  ExpandOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getImageUrl } from "../../api/ImageHelper";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

const AnnonceCard = ({
  annonce,
  size = "default",
  showBadge = true,
  showPrice = true,
  showActions = true,
  onAction,
  actions = [],
  cardStyle = {},
  onToggleDetails,
  expandable = true,
  defaultExpanded = false,
  onViewDetails, // Nouvelle prop pour gérer la redirection vers les détails
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [liked, setLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleToggleDetails = () => {
    const newShowDetails = !showDetails;
    setShowDetails(newShowDetails);
    if (onToggleDetails) {
      onToggleDetails(annonce.id, newShowDetails, annonce);
    }
  };

  const handleAction = (actionKey, event) => {
    event.stopPropagation();
    if (onAction) {
      onAction(actionKey, annonce.id, annonce);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(annonce.id, annonce);
    }
  };

  const handleImageModalOpen = (e) => {
    e.stopPropagation();
    setModalImageIndex(currentImageIndex);
    setIsImageModalVisible(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalVisible(false);
  };

  // Fonction pour ouvrir l'image dans un nouvel onglet
  const openImageInNewTab = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      EN_ATTENTE: {
        color: "warning",
        icon: <ClockCircleOutlined />,
        text: "En attente",
        bgColor: "#fadb14",
      },
      VALIDEE: {
        color: "success",
        icon: <CheckCircleOutlined />,
        text: "Validée",
        bgColor: "#52c41a",
      },
      REJETEE: {
        color: "error",
        icon: <ClockCircleOutlined />,
        text: "Rejetée",
        bgColor: "#ff4d4f",
      },
    };
    return configs[status] || configs["EN_ATTENTE"];
  };

  const getTypeLogementText = (type) => {
    const types = {
      CHAMBRE_INDIVIDUELLE: "Chambre individuelle",
      CHAMBRE_PARTAGEE: "Chambre partagée",
      APPARTEMENT: "Appartement",
      MAISON: "Maison",
      STUDIO: "Studio",
    };
    return types[type] || type;
  };

  const formatPrice = (price, charges = 0) => {
    return charges > 0
      ? `${price}€/mois + ${charges}€ charges`
      : `${price}€/mois`;
  };

  const getImages = () => {
    if (annonce.medias && annonce.medias.length > 0) {
      return annonce.medias.map((media) => {
        const fullUrl = getImageUrl(media.url);
        return {
          ...media,
          fullUrl,
        };
      });
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
  const statusConfig = getStatusConfig(annonce.statut);

  const CustomArrow = ({ direction, onClick }) => (
    <Button
      type="primary"
      shape="circle"
      size="small"
      icon={direction === "left" ? <LeftOutlined /> : <RightOutlined />}
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        [direction]: "8px",
        transform: "translateY(-50%)",
        zIndex: 2,
        background: "rgba(0,0,0,0.5)",
        border: "none",
        color: "white",
        backdropFilter: "blur(8px)",
        width: "28px",
        height: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );

  const ModalCustomArrow = ({ direction, onClick }) => (
    <Button
      type="primary"
      shape="circle"
      size="large"
      icon={direction === "left" ? <LeftOutlined /> : <RightOutlined />}
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        [direction]: "20px",
        transform: "translateY(-50%)",
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        border: "none",
        color: "white",
        backdropFilter: "blur(8px)",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );

  return (
    <>
      <Card
        hoverable
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #f0f0f0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
          ...cardStyle,
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Détails en haut du card (visible seulement si showDetails est true) */}
        {showDetails && (
          <div
            style={{
              padding: "16px",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderBottom: "1px solid #e2e8f0",
              animation: "slideDown 0.3s ease",
            }}
          >
            {/* Titre */}
            <Title
              level={4}
              style={{
                margin: "0 0 12px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#262626",
                lineHeight: "1.3",
              }}
              ellipsis={{ rows: 2 }}
            >
              {annonce.titre}
            </Title>

            {/* Prix */}
            {showPrice && annonce.prix && (
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: "600",
                    fontSize: "14px",
                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                  }}
                >
                  {formatPrice(annonce.prix, annonce.charges)}
                </div>
              </div>
            )}

            {/* Statistiques rapides */}
            <Row gutter={[8, 8]} style={{ marginBottom: "12px" }}>
              {annonce.nombreDeChambres && (
                <Col span={8}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "8px",
                      background: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1890ff",
                      }}
                    >
                      {annonce.nombreDeChambres}
                    </Text>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#8c8c8c",
                        marginTop: "2px",
                      }}
                    >
                      Chambres
                    </div>
                  </div>
                </Col>
              )}
              {annonce.pieces && (
                <Col span={8}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "8px",
                      background: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1890ff",
                      }}
                    >
                      {annonce.pieces}
                    </Text>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#8c8c8c",
                        marginTop: "2px",
                      }}
                    >
                      Pièces
                    </div>
                  </div>
                </Col>
              )}
              {annonce.salleDeBains && (
                <Col span={8}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "8px",
                      background: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1890ff",
                      }}
                    >
                      {annonce.salleDeBains}
                    </Text>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#8c8c8c",
                        marginTop: "2px",
                      }}
                    >
                      SDB
                    </div>
                  </div>
                </Col>
              )}
            </Row>

            {/* Date de publication */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              <CalendarOutlined style={{ color: "#8c8c8c", fontSize: "12px" }} />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Publié le {annonce.datePublication
                  ? formatDate(annonce.datePublication)
                  : "Date inconnue"}
              </Text>
            </div>
          </div>
        )}

        {/* Image */}
        <div
          style={{ 
            position: "relative", 
            height: "240px", 
            overflow: "hidden",
          }}
        >
          <Carousel
            dots={false}
            infinite={images.length > 1}
            arrows={images.length > 1}
            prevArrow={<CustomArrow direction="left" />}
            nextArrow={<CustomArrow direction="right" />}
            beforeChange={(from, to) => setCurrentImageIndex(to)}
            style={{ height: "100%" }}
          >
            {images.map((image, index) => (
              <div key={index} style={{ height: "240px" }}>
                <img
                  src={image.fullUrl}
                  alt={image.nomFichier || `image-${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>
            ))}
          </Carousel>

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Status badge */}
          {showBadge && annonce.statut && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                zIndex: 2,
              }}
            >
              <Badge
                count={statusConfig.text}
                style={{
                  backgroundColor: statusConfig.bgColor,
                  color: "white",
                  fontWeight: "500",
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  border: "none",
                }}
              />
            </div>
          )}

          {/* Action buttons */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 2,
              display: "flex",
              gap: "8px",
            }}
          >
            {/* Bouton d'information */}
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<InfoCircleOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleDetails();
              }}
              style={{
                background: showDetails ? "rgba(24, 144, 255, 0.9)" : "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                border: "none",
                color: showDetails ? "white" : "#666",
              }}
            />

            {/* Bouton pour ouvrir l'image dans un nouvel onglet */}
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<ExpandOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                openImageInNewTab(images[currentImageIndex].fullUrl);
              }}
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                border: "none",
                color: "#666",
              }}
              title="Ouvrir l'image dans un nouvel onglet"
            />
            
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={
                liked ? (
                  <HeartFilled style={{ color: "#ff4d4f" }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                border: "none",
                color: liked ? "#ff4d4f" : "#666",
              }}
            />
            
            {/* Bouton pour voir les détails - remplace le bouton de partage */}
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/bailleur/annonce/${annonce.id}`) }
              style={{
                background: "rgba(222, 187, 133, 0.7)",
                backdropFilter: "blur(8px)",
                border: "none",
                color: "white",
              }}
              title="Voir les détails de l'annonce"
            />
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                right: "12px",
                zIndex: 2,
                background: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {currentImageIndex + 1}/{images.length}
            </div>
          )}

          {/* Availability indicator */}
          {!annonce.disponible && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(255,255,255,0.95)",
                color: "#ff4d4f",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                zIndex: 2,
                border: "2px solid #ff4d4f",
              }}
            >
              Non disponible
            </div>
          )}
        </div>

        {/* <style jsx>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .ant-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
          }

          .ant-carousel .slick-slide {
            height: 350px;
          }

          .ant-carousel .slick-track {
            height: 350px;
          }
        `}</style> */}
      </Card>
    </>
  );
};

export default AnnonceCard;
import React, { useState } from "react";
import {
  Card,
  Badge,
  Button,
  Typography,
  Space,
  Tooltip,
  Row,
  Col,
  Tag,
  Carousel,
  Avatar,
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
  UserOutlined,
  BankOutlined,
  TeamOutlined,
  LeftOutlined,
  RightOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  WifiOutlined,
  CarOutlined,
  ShoppingOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { getImageUrl } from "../../api/ImageHelper";

const { Text, Title, Paragraph } = Typography;

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
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [liked, setLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleToggleDetails = () => {
    if (!expandable) return;
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onToggleDetails) {
      onToggleDetails(annonce.id, newExpanded, annonce);
    }
  };

  const handleAction = (actionKey, event) => {
    event.stopPropagation();
    if (onAction) {
      onAction(actionKey, annonce.id, annonce);
    }
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

  // const getImages = () => {
  //   if (annonce.medias && annonce.medias.length > 0) {
  //     return annonce.medias.map(media => getImageUrl(media.url));
  //   }
  //   return [DEFAULT_IMAGE];
  // };

  // const getImages = () => {
  //   if (annonce.medias && annonce.medias.length > 0) {
  //     return annonce.medias.map((media) => ({

  //       ...media,
  //       fullUrl: getImageUrl(media.url),
  //       console.log("Nom:", media.nomFichier, "URL complète:", getImageUrl(media.url))
  //     }));
  //   }

  //   return [
  //     {
  //       nomFichier: "placeholder.jpg",
  //       fullUrl:
  //         "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  //     },
  //   ];
  // };

  const getImages = () => {
  if (annonce.medias && annonce.medias.length > 0) {
    return annonce.medias.map((media) => {
      const fullUrl = getImageUrl(media.url);
      console.log("Nom:", media.nomFichier, "URL complète:", fullUrl);
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

  return (
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
      cover={
        <div
          style={{ position: "relative", height: "240px", overflow: "hidden" }}
        >
          {/* <Carousel
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
                  src={image.url}
                  alt={image.nomFichier}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>
            ))}
          </Carousel> */}
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
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<ShareAltOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleAction("share", e);
              }}
              style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                border: "none",
                color: "#666",
              }}
            />
          </div>

          {/* Price badge */}
          {showPrice && annonce.prix && (
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "12px",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontWeight: "600",
                  fontSize: "14px",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                }}
              >
                {formatPrice(annonce.prix, annonce.charges)}
              </div>
            </div>
          )}

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
      }
      actions={showActions && actions.length > 0 ? actions : undefined}
    >
      <div style={{ padding: "4px 0" }}>
        {/* Header */}
        <div style={{ marginBottom: "12px" }}>
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#262626",
              lineHeight: "1.3",
            }}
            ellipsis={{ rows: 2 }}
          >
            {annonce.titre}
          </Title>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "8px",
              gap: "8px",
            }}
          >
            <EnvironmentOutlined
              style={{ color: "#8c8c8c", fontSize: "14px" }}
            />
            <Text type="secondary" style={{ fontSize: "14px" }}>
              {annonce.adresse
                ? `${annonce.adresse}, ${annonce.ville}`
                : annonce.ville}
            </Text>
          </div>
        </div>

        {/* Property details */}
        <Row gutter={[8, 8]} style={{ marginBottom: "12px" }}>
          <Col span={12}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <HomeOutlined style={{ color: "#1890ff", fontSize: "14px" }} />
              <Text style={{ fontSize: "13px", color: "#595959" }}>
                {getTypeLogementText(annonce.typeDeLogement)}
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Text style={{ fontSize: "13px", color: "#595959" }}>
                {annonce.surface && `${annonce.surface}m²`}
                {annonce.pieces && ` • ${annonce.pieces} pièces`}
              </Text>
            </div>
          </Col>
        </Row>

        {/* Quick stats */}
        <Row gutter={[8, 8]} style={{ marginBottom: "12px" }}>
          {annonce.nombreDeChambres && (
            <Col span={8}>
              <div
                style={{
                  textAlign: "center",
                  padding: "8px",
                  background: "#f5f5f5",
                  borderRadius: "8px",
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
          {annonce.salleDeBains && (
            <Col span={8}>
              <div
                style={{
                  textAlign: "center",
                  padding: "8px",
                  background: "#f5f5f5",
                  borderRadius: "8px",
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
          {annonce.capacite && (
            <Col span={8}>
              <div
                style={{
                  textAlign: "center",
                  padding: "8px",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                }}
              >
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1890ff",
                  }}
                >
                  {annonce.capacite}
                </Text>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#8c8c8c",
                    marginTop: "2px",
                  }}
                >
                  Personnes
                </div>
              </div>
            </Col>
          )}
        </Row>

        {/* Tags */}
        <div style={{ marginBottom: "12px" }}>
          <Space wrap size="small">
            {annonce.meuble && (
              <Tag
                color="blue"
                style={{ borderRadius: "12px", fontSize: "11px" }}
              >
                Meublé
              </Tag>
            )}
            {annonce.negociable && (
              <Tag
                color="green"
                style={{ borderRadius: "12px", fontSize: "11px" }}
              >
                Négociable
              </Tag>
            )}
            {annonce.disponible && (
              <Tag
                color="success"
                style={{ borderRadius: "12px", fontSize: "11px" }}
              >
                Disponible
              </Tag>
            )}
          </Space>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "12px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CalendarOutlined style={{ color: "#8c8c8c", fontSize: "12px" }} />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {annonce.datePublication
                ? formatDate(annonce.datePublication)
                : "Date inconnue"}
            </Text>
          </div>

          {expandable && (
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={handleToggleDetails}
              style={{
                color: "#1890ff",
                fontWeight: "500",
                fontSize: "12px",
                padding: "4px 8px",
                height: "auto",
              }}
            >
              Voir plus
            </Button>
          )}
        </div>

        {/* Expanded details */}
        {expanded && (
          <div
            style={{
              marginTop: "16px",
              padding: "16px",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              animation: "slideDown 0.3s ease",
            }}
          >
            <Title level={5} style={{ margin: "0 0 12px 0", color: "#1e293b" }}>
              Détails complémentaires
            </Title>

            <Row gutter={[16, 12]}>
              <Col span={24}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <EuroOutlined style={{ color: "#1890ff" }} />
                  <Text strong>
                    Prix: {formatPrice(annonce.prix, annonce.charges)}
                  </Text>
                </div>
              </Col>

              {annonce.caution && (
                <Col span={24}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <BankOutlined style={{ color: "#1890ff" }} />
                    <Text>Caution: {annonce.caution}€</Text>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        )}
      </div>

      <style jsx>{`
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
          height: 240px;
        }

        .ant-carousel .slick-track {
          height: 240px;
        }
      `}</style>
    </Card>
  );
};

export default AnnonceCard;

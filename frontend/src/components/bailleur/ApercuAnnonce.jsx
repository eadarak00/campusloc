import React from "react";
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
} from "antd";
import {
  HomeOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ExpandOutlined,
//   BedOutlined,
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
} from "@ant-design/icons";

import "../../styles/bailleur/apercu-annonce.css"

const { Title, Text, Paragraph } = Typography;

const ApercuAnnonce = ({ formData, fileList, onClose, onEdit }) => {
  // Fonction pour obtenir le label du type de bien
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

  // Fonction pour formater les prix
  const formatPrice = (price) => {
    if (!price) return "0";
    return price.toLocaleString();
  };

  // Fonction pour déterminer la couleur du tag selon le type
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

  // Fonction pour générer les caractéristiques du bien
  const getCaracteristiques = () => {
    const caracteristiques = [];
    
    if (formData.surface) {
      caracteristiques.push({
        icon: <ExpandOutlined />,
        label: "Surface",
        value: `${formData.surface} m²`,
      });
    }
    
    if (formData.pieces) {
      caracteristiques.push({
        icon: <HomeOutlined />,
        label: "Pièces",
        value: formData.pieces,
      });
    }
    
    if (formData.chambres) {
      caracteristiques.push({
        icon: <RestOutlined />,
        label: "Chambres",
        value: formData.chambres,
      });
    }
    
    if (formData.capacite) {
      caracteristiques.push({
        icon: <UserOutlined />,
        label: "Capacité",
        value: `${formData.capacite} personne(s)`,
      });
    }
    
    if (formData.sallesBain) {
      caracteristiques.push({
        icon: <BankOutlined />,
        label: "Salles de bain",
        value: formData.sallesBain,
      });
    }
    
    return caracteristiques;
  };

  return (
    <div className="apercu-annonce">
      {/* Header avec actions */}
      <div className="apercu-annonce__header">
        <div className="apercu-annonce__header-left">
          <Button onClick={onClose} type="text">
            ← Retour à l'édition
          </Button>
        </div>
        <div className="apercu-annonce__header-right">
          <Space>
            <Button icon={<HeartOutlined />} type="text">
              Favoris
            </Button>
            <Button icon={<ShareAltOutlined />} type="text">
              Partager
            </Button>
            <Button type="primary" onClick={onEdit}>
              Modifier
            </Button>
          </Space>
        </div>
      </div>

      <div className="apercu-annonce__content">
        <Row gutter={[24, 24]}>
          {/* Colonne principale */}
          <Col xs={24} lg={16}>
            {/* Galerie photos */}
            <Card className="apercu-annonce__gallery">
              {fileList && fileList.length > 0 ? (
                <Carousel autoplay dots={{ className: "apercu-annonce__carousel-dots" }}>
                  {fileList.map((file, index) => (
                    <div key={index} className="apercu-annonce__carousel-item">
                      <Image
                        src={file.url || URL.createObjectURL(file.originFileObj)}
                        alt={`Photo ${index + 1}`}
                        className="apercu-annonce__carousel-image"
                        preview={false}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div className="apercu-annonce__no-photos">
                  <Empty
                    description="Aucune photo ajoutée"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              )}
            </Card>

            {/* Informations principales */}
            <Card className="apercu-annonce__main-info">
              <div className="apercu-annonce__title-section">
                <div className="apercu-annonce__title-top">
                  <Tag color={getTypeColor(formData.type)} className="apercu-annonce__type-tag">
                    {getTypeLabel(formData.type)}
                  </Tag>
                  <Text type="secondary" className="apercu-annonce__date">
                    <CalendarOutlined /> Publié aujourd'hui
                  </Text>
                </div>
                <Title level={2} className="apercu-annonce__title">
                  {formData.titre || "Titre de l'annonce"}
                </Title>
                <div className="apercu-annonce__location">
                  <EnvironmentOutlined className="apercu-annonce__location-icon" />
                  <Text className="apercu-annonce__location-text">
                    {formData.adresse && formData.ville 
                      ? `${formData.adresse}, ${formData.ville}`
                      : formData.ville || formData.adresse || "Localisation non renseignée"
                    }
                  </Text>
                </div>
              </div>

              <Divider />

              {/* Prix */}
              <div className="apercu-annonce__price-section">
                <div className="apercu-annonce__main-price">
                  <Title level={3} className="apercu-annonce__price-value">
                    {formatPrice(formData.prix)} FCFA
                  </Title>
                  <Text type="secondary" className="apercu-annonce__price-period">
                    / mois
                  </Text>
                  {formData.negociable && (
                    <Tag color="green" className="apercu-annonce__negotiable-tag">
                      Négociable
                    </Tag>
                  )}
                </div>
                
                <div className="apercu-annonce__additional-costs">
                  {formData.charges && (
                    <div className="apercu-annonce__cost-item">
                      <Text type="secondary">Charges: </Text>
                      <Text strong>{formatPrice(formData.charges)} FCFA/mois</Text>
                    </div>
                  )}
                  {formData.caution && (
                    <div className="apercu-annonce__cost-item">
                      <Text type="secondary">Caution: </Text>
                      <Text strong>{formatPrice(formData.caution)} FCFA</Text>
                    </div>
                  )}
                </div>
              </div>

              <Divider />

              {/* Caractéristiques */}
              <div className="apercu-annonce__characteristics">
                <Title level={4} className="apercu-annonce__section-title">
                  Caractéristiques
                </Title>
                <Row gutter={[16, 16]}>
                  {getCaracteristiques().map((carac, index) => (
                    <Col xs={12} sm={8} md={6} key={index}>
                      <div className="apercu-annonce__characteristic-item">
                        <div className="apercu-annonce__characteristic-icon">
                          {carac.icon}
                        </div>
                        <div className="apercu-annonce__characteristic-content">
                          <Text type="secondary" className="apercu-annonce__characteristic-label">
                            {carac.label}
                          </Text>
                          <Text strong className="apercu-annonce__characteristic-value">
                            {carac.value}
                          </Text>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Options */}
              <div className="apercu-annonce__options">
                <Title level={4} className="apercu-annonce__section-title">
                  Options
                </Title>
                <Space wrap>
                  <div className="apercu-annonce__option-item">
                    {formData.meuble ? (
                      <CheckCircleOutlined className="apercu-annonce__option-icon apercu-annonce__option-icon--yes" />
                    ) : (
                      <CloseCircleOutlined className="apercu-annonce__option-icon apercu-annonce__option-icon--no" />
                    )}
                    <Text>Meublé</Text>
                  </div>
                </Space>
              </div>

              <Divider />

              {/* Description */}
              <div className="apercu-annonce__description">
                <Title level={4} className="apercu-annonce__section-title">
                  Description
                </Title>
                <Paragraph className="apercu-annonce__description-text">
                  {formData.description || "Aucune description fournie."}
                </Paragraph>
              </div>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Carte contact */}
            <Card className="apercu-annonce__contact-card">
              <Title level={4} className="apercu-annonce__contact-title">
                Contacter le propriétaire
              </Title>
              <div className="apercu-annonce__contact-info">
                <div className="apercu-annonce__contact-item">
                  <PhoneOutlined className="apercu-annonce__contact-icon" />
                  <Text style={{ filter: 'blur(4px)' }}>+221 XX XXX XX XX</Text>
                </div>
                <div className="apercu-annonce__contact-item">
                  <MailOutlined className="apercu-annonce__contact-icon" />
                  <Text style={{ filter: 'blur(4px)' }}>contact@exemple.com</Text>
                </div>
              </div>
              <Button 
                type="primary" 
                size="large" 
                block 
                className="apercu-annonce__contact-button"
              >
                Contacter
              </Button>
            </Card>

            {/* Carte localisation */}
            <Card className="apercu-annonce__location-card">
              <Title level={4} className="apercu-annonce__location-title">
                Localisation
              </Title>
              <div className="apercu-annonce__map-placeholder">
                <EnvironmentOutlined className="apercu-annonce__map-icon" />
                <Text type="secondary">Carte interactive</Text>
                <Text type="secondary" className="apercu-annonce__map-address">
                  {formData.adresse && formData.ville 
                    ? `${formData.adresse}, ${formData.ville}`
                    : "Adresse non renseignée"
                  }
                </Text>
              </div>
            </Card>

            {/* Récapitulatif des coûts */}
            <Card className="apercu-annonce__cost-summary">
              <Title level={4} className="apercu-annonce__cost-title">
                Récapitulatif des coûts
              </Title>
              <div className="apercu-annonce__cost-breakdown">
                <div className="apercu-annonce__cost-row">
                  <Text>Loyer mensuel</Text>
                  <Text strong>{formatPrice(formData.prix)} FCFA</Text>
                </div>
                {formData.charges && (
                  <div className="apercu-annonce__cost-row">
                    <Text>Charges</Text>
                    <Text strong>{formatPrice(formData.charges)} FCFA</Text>
                  </div>
                )}
                {formData.caution && (
                  <div className="apercu-annonce__cost-row">
                    <Text>Caution</Text>
                    <Text strong>{formatPrice(formData.caution)} FCFA</Text>
                  </div>
                )}
                <Divider />
                <div className="apercu-annonce__cost-row apercu-annonce__cost-row--total">
                  <Text strong>Total mensuel</Text>
                  <Text strong className="apercu-annonce__total-price">
                    {formatPrice((formData.prix || 0) + (formData.charges || 0))} FCFA
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ApercuAnnonce;
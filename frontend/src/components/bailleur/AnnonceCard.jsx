import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Typography,
  Tag,
  Badge,
  Button,
  Tooltip,
  Avatar,
  Modal,
  Image,
  notification,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  HomeOutlined,
  UserOutlined,
  EnvironmentOutlined,
  LeftOutlined,
  RightOutlined,
  DollarCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CloseOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { getImageUrl } from "../../api/ImageHelper";
import { useNavigate } from "react-router-dom";
import { ajouterFavori, supprimerFavori } from "../../api/favorisAPI";
import { getProspectFromStorage, isProspect } from "../../utils/authUtils";

const { Title, Text } = Typography;

const AnnonceCard = ({ annonce, isFavorite = false, onFavoriteChange }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isFavorite);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef(null);

  const [notificationApi, contextHolder] = notification.useNotification();

  const handleAnnonce = async () => {
    const user = getProspectFromStorage();
    if (user.role === "PROSPECT") {
      navigate(`/prospect/annonces/${annonce.id}`);
    } else {
      navigate(`/annonces/${annonce.id}`);
    }
  };

  // Mettre à jour l'état liked quand isFavorite change
  useEffect(() => {
    setLiked(isFavorite);
  }, [isFavorite]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (loadingFavorite) return;

    setLoadingFavorite(true);

    const action = liked ? supprimerFavori : ajouterFavori;
    const successMessage = liked
      ? "Annonce retirée de vos favoris"
      : "Annonce ajoutée à vos favoris";
    const errorMessage = liked
      ? "Erreur lors de la suppression du favori"
      : "Erreur lors de l'ajout du favori";

    try {
      await action(annonce.id);
      setLiked(!liked);

      notificationApi.success({
        message: "Favoris mis à jour",
        description: successMessage,
        placement: "topRight",
      });

      if (onFavoriteChange) {
        onFavoriteChange(annonce.id, !liked);
      }
    } catch (error) {
      console.error("Erreur favoris:", error);

      if (error?.response?.status === 403 || error?.response?.status === 401) {
        notificationApi.warning({
          message: "Connexion requise",
          description: "Vous devez être connecté pour gérer vos favoris.",
          placement: "topRight",
          showProgress: true,
          duration: 4,
        });

        // Redirection après 2 secondes
        setTimeout(() => {
          navigate("/connexion");
        }, 2000);
      } else {
        notificationApi.error({
          message: "Erreur",
          description: errorMessage,
          placement: "topRight",
          showProgress: true,
          duration: 1.5,
        });

        // Redirection après 2 secondes
        setTimeout(() => {
          navigate("/connexion");
        }, 2000);
      }
    } finally {
      setLoadingFavorite(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      EN_ATTENTE: {
        color: "#faad14",
        icon: <ClockCircleOutlined />,
        text: "En attente",
        bgColor: "rgba(250, 173, 20, 0.1)",
        pulse: true,
      },
      VALIDER: {
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
        text: "Validée",
        bgColor: "rgba(82, 196, 26, 0.1)",
        pulse: false,
      },
      REJETER: {
        color: "#ff4d4f",
        icon: <ClockCircleOutlined />,
        text: "Rejetée",
        bgColor: "rgba(255, 77, 79, 0.1)",
        pulse: false,
      },
    };
    return configs[status] || configs["EN_ATTENTE"];
  };

  const getTypeLogementText = (type) => {
    const types = {
      CHAMBRE_INDIVIDUELLE: "Chambre",
      CHAMBRE_PARTAGEE: "Partagée",
      APPARTEMENT: "Appartement",
      MAISON: "Maison",
      STUDIO: "Studio",
    };
    return types[type] || type;
  };

  const formatPrice = (price, charges = 0) => {
    return charges > 0 ? `${price}f + ${charges}f` : `${price}f`;
  };

  const status = getStatusConfig(annonce.statut);
  const images =
    annonce.medias && annonce.medias.length > 0
      ? annonce.medias.map((m) => getImageUrl(m.url))
      : [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        ];

  // Auto-play des images
  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    } else {
      clearInterval(autoPlayRef.current);
    }

    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, images.length]);

  // Démarrer l'auto-play au hover
  useEffect(() => {
    if (isHovered && images.length > 1) {
      const timer = setTimeout(() => {
        setIsAutoPlaying(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsAutoPlaying(false);
    }
  }, [isHovered, images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openPreview = (index) => {
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  const nextPreviewImage = () => {
    setPreviewIndex((prev) => (prev + 1) % images.length);
  };

  const prevPreviewImage = () => {
    setPreviewIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {contextHolder}

      <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 w-80 h-96">
        {/* Section Image */}
        <div
          className="relative h-48 overflow-hidden cursor-pointer"
          onClick={() => openPreview(currentImageIndex)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <LazyLoadImage
            src={images[currentImageIndex]}
            alt={`image-${currentImageIndex}`}
            effect="blur"
            width="100%"
            height="192px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Navigation des images */}
          {images.length > 1 && (
            <>
              <Button
                type="text"
                shape="circle"
                icon={<LeftOutlined className="text-xs" />}
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur border-0 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 w-7 h-7 flex items-center justify-center hover:bg-white"
              />
              <Button
                type="text"
                shape="circle"
                icon={<RightOutlined className="text-xs" />}
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur border-0 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 w-7 h-7 flex items-center justify-center hover:bg-white"
              />
            </>
          )}

          {/* Bouton Auto-play */}
          {images.length > 1 && (
            <Button
              type="text"
              shape="circle"
              icon={
                isAutoPlaying ? (
                  <PauseCircleOutlined className="text-sm" />
                ) : (
                  <PlayCircleOutlined className="text-sm" />
                )
              }
              onClick={(e) => {
                e.stopPropagation();
                setIsAutoPlaying(!isAutoPlaying);
              }}
              className="absolute bottom-3 right-3 bg-black/60 backdrop-blur border-0 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 w-8 h-8 flex items-center justify-center hover:bg-black/80"
            />
          )}

          {/* Indicateurs d'images */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 bg-black/50 backdrop-blur rounded-full">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                    index === currentImageIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}
          {/* Actions */}
          <div className="absolute top-3 right-3 flex gap-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            <Tooltip title="Prévisualiser">
              <Button
                type="text"
                shape="circle"
                icon={<FullscreenOutlined className="text-xs text-white" />}
                onClick={(e) => {
                  e.stopPropagation();
                  openPreview(currentImageIndex);
                }}
                className="bg-black/50 backdrop-blur border-0 w-7 h-7 flex items-center justify-center hover:bg-black/70"
              />
            </Tooltip>
            <Tooltip
              title={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Button
                type="text"
                shape="circle"
                icon={
                  liked ? (
                    <HeartFilled className="text-xs text-red-500" />
                  ) : (
                    <HeartOutlined className="text-xs text-white" />
                  )
                }
                onClick={handleFavoriteToggle}
                loading={loadingFavorite}
                disabled={loadingFavorite}
                className={`backdrop-blur border-0 w-7 h-7 flex items-center justify-center transition-all duration-300 ${
                  liked
                    ? "bg-white/90 hover:bg-white"
                    : "bg-black/50 hover:bg-black/70"
                } ${liked ? "scale-110" : "scale-100"}`}
              />
            </Tooltip>
            <Tooltip title="Voir les détails">
              <Button
                type="text"
                shape="circle"
                icon={<EyeOutlined className="text-xs text-white" />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnnonce();
                }}
                className="bg-black/50 backdrop-blur border-0 w-7 h-7 flex items-center justify-center hover:bg-black/70"
              />
            </Tooltip>
          </div>
        </div>

        {/* Section Informations */}
        <div className="p-4 h-48 flex flex-col justify-between">
          {/* Titre et Prix */}
          <div>
            <Title
              level={5}
              ellipsis
              className="text-sm font-semibold text-gray-900 mb-1 leading-tight"
            >
              {annonce.titre}
            </Title>
            <div className="flex items-center gap-1.5 mb-3">
              <DollarCircleOutlined className="text-blue-500 text-base" />
              <Text className="text-lg font-bold text-blue-600">
                {formatPrice(annonce.prix, annonce.charges)}
              </Text>
              <Text className="text-xs text-gray-500">/mois</Text>
            </div>
          </div>

          {/* Localisation */}
          {annonce.adresse && (
            <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-600 bg-gray-50 px-2 py-1.5 rounded-lg">
              <EnvironmentOutlined className="text-gray-400" />
              <span className="truncate">
                {annonce.adresse}, {annonce.ville}
              </span>
            </div>
          )}

          {/* Tags caractéristiques */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Tag className="text-xs px-2 py-0.5 rounded-full border-0 bg-blue-50 text-blue-700 font-medium">
              {getTypeLogementText(annonce.typeDeLogement)}
            </Tag>
            <Tag className="text-xs px-2 py-0.5 rounded-full border-0 bg-green-50 text-green-700 font-medium flex items-center gap-1">
              <HomeOutlined className="text-xs" />
              {annonce.nombreDeChambres || 0}ch
            </Tag>
            <Tag className="text-xs px-2 py-0.5 rounded-full border-0 bg-cyan-50 text-cyan-700 font-medium">
              {annonce.salleDeBains || 0} SDB
            </Tag>
            {annonce.surface && (
              <Tag className="text-xs px-2 py-0.5 rounded-full border-0 bg-purple-50 text-purple-700 font-medium">
                {annonce.surface}m²
              </Tag>
            )}
          </div>
        </div>
      </div>

      {/* Modal de prévisualisation */}
      <Modal
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        footer={null}
        centered
        width="90vw"
        style={{ maxWidth: 1200 }}
        styles={{
          body: { padding: 0 },
          mask: { backdropFilter: "blur(8px)" },
        }}
        closeIcon={
          <CloseOutlined
            style={{
              fontSize: 18,
              color: "white",
              background: "rgba(0,0,0,0.5)",
              padding: 8,
              borderRadius: "50%",
            }}
          />
        }
      >
        <div style={{ position: "relative", background: "#000" }}>
          <Image
            src={images[previewIndex]}
            alt={`Preview ${previewIndex}`}
            style={{
              width: "100%",
              height: "70vh",
              objectFit: "contain",
            }}
            preview={false}
          />

          {images.length > 1 && (
            <>
              <Button
                type="text"
                shape="circle"
                size="large"
                icon={<LeftOutlined style={{ fontSize: 20, color: "white" }} />}
                onClick={prevPreviewImage}
                style={{
                  position: "absolute",
                  left: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "none",
                  width: 50,
                  height: 50,
                }}
              />
              <Button
                type="text"
                shape="circle"
                size="large"
                icon={
                  <RightOutlined style={{ fontSize: 20, color: "white" }} />
                }
                onClick={nextPreviewImage}
                style={{
                  position: "absolute",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "none",
                  width: 50,
                  height: 50,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "white",
                  background: "rgba(0, 0, 0, 0.7)",
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 14,
                }}
              >
                {previewIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </Modal>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </>
  );
};

export default AnnonceCard;

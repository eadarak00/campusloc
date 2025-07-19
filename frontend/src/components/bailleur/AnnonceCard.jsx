// import React, { useState, useRef, useEffect } from "react";
// import {
//   Card,
//   Typography,
//   Tag,
//   Badge,
//   Row,
//   Col,
//   Button,
//   Space,
//   Tooltip,
//   Avatar,
//   Divider,
//   Modal,
//   Image,
// } from "antd";
// import {
//   ClockCircleOutlined,
//   CheckCircleOutlined,
//   EyeOutlined,
//   HeartOutlined,
//   HeartFilled,
//   HomeOutlined,
//   UserOutlined,
//   EnvironmentOutlined,
//   LeftOutlined,
//   RightOutlined,
//   DollarCircleOutlined,
//   PlayCircleOutlined,
//   PauseCircleOutlined,
//   CloseOutlined,
//   FullscreenOutlined,
// } from "@ant-design/icons";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import "react-lazy-load-image-component/src/effects/blur.css";
// import { getImageUrl } from "../../api/ImageHelper";
// import { useNavigate } from "react-router-dom";

// const { Title, Text } = Typography;

// const AnnonceCard = ({ annonce }) => {
//   const navigate = useNavigate();
//   const [liked, setLiked] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(false);
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [previewIndex, setPreviewIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const autoPlayRef = useRef(null);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("fr-FR", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const getStatusConfig = (status) => {
//     const configs = {
//       EN_ATTENTE: {
//         color: "#faad14",
//         icon: <ClockCircleOutlined />,
//         text: "En attente",
//         bgColor: "rgba(250, 173, 20, 0.1)",
//         pulse: true,
//       },
//       VALIDER: {
//         color: "#52c41a",
//         icon: <CheckCircleOutlined />,
//         text: "Validée",
//         bgColor: "rgba(82, 196, 26, 0.1)",
//         pulse: false,
//       },
//       REJETER: {
//         color: "#ff4d4f",
//         icon: <ClockCircleOutlined />,
//         text: "Rejetée",
//         bgColor: "rgba(255, 77, 79, 0.1)",
//         pulse: false,
//       },
//     };
//     return configs[status] || configs["EN_ATTENTE"];
//   };

//   const getTypeLogementText = (type) => {
//     const types = {
//       CHAMBRE_INDIVIDUELLE: "Chambre individuelle",
//       CHAMBRE_PARTAGEE: "Chambre partagée",
//       APPARTEMENT: "Appartement",
//       MAISON: "Maison",
//       STUDIO: "Studio",
//     };
//     return types[type] || type;
//   };

//   const formatPrice = (price, charges = 0) => {
//     return charges > 0
//       ? `${price}f/mois + ${charges}f charges`
//       : `${price}f/mois`;
//   };

//   const status = getStatusConfig(annonce.statut);
//   const images =
//     annonce.medias && annonce.medias.length > 0
//       ? annonce.medias.map((m) => getImageUrl(m.url))
//       : [
//           "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
//         ];

//   // Auto-play des images
//   useEffect(() => {
//     if (isAutoPlaying && images.length > 1) {
//       autoPlayRef.current = setInterval(() => {
//         setCurrentImageIndex((prev) => (prev + 1) % images.length);
//       }, 3000);
//     } else {
//       clearInterval(autoPlayRef.current);
//     }

//     return () => clearInterval(autoPlayRef.current);
//   }, [isAutoPlaying, images.length]);

//   // Démarrer l'auto-play au hover
//   useEffect(() => {
//     if (isHovered && images.length > 1) {
//       const timer = setTimeout(() => {
//         setIsAutoPlaying(true);
//       }, 800);
//       return () => clearTimeout(timer);
//     } else {
//       setIsAutoPlaying(false);
//     }
//   }, [isHovered, images.length]);

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   const openPreview = (index) => {
//     setPreviewIndex(index);
//     setIsPreviewOpen(true);
//   };

//   const nextPreviewImage = () => {
//     setPreviewIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevPreviewImage = () => {
//     setPreviewIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   return (
//     <>
//       <Card
//         hoverable
//         style={{
//           borderRadius: 20,
//           width: 450,
//           height: 580,
//           overflow: "hidden",
//           boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//           border: "none",
//           transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//           background: "#fff",
//           transform: isHovered ? "translateY(-8px)" : "translateY(0)",
//         }}
//         bodyStyle={{
//           padding: 0,
//           height: "100%",
//         }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Section Image avec navigation */}
//         <div
//           style={{
//             position: "relative",
//             height: 240,
//             overflow: "hidden",
//             cursor: "pointer",
//           }}
//           onClick={() => openPreview(currentImageIndex)}
//         >
//           <LazyLoadImage
//             src={images[currentImageIndex]}
//             alt={`image-${currentImageIndex}`}
//             effect="blur"
//             width="100%"
//             height="240px"
//             style={{
//               objectFit: "cover",
//               transition: "all 0.4s ease",
//               transform: isHovered ? "scale(1.05)" : "scale(1)",
//             }}
//           />

//           {/* Overlay dégradé */}
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               right: 0,
//               left: 0,
//               height: "100%",
//               background:
//                 "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%)",
//               opacity: isHovered ? 0.8 : 0.6,
//               transition: "opacity 0.3s ease",
//             }}
//           />

//           {/* Navigation des images */}
//           {images.length > 1 && (
//             <>
//               <Button
//                 type="text"
//                 shape="circle"
//                 icon={<LeftOutlined />}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   prevImage();
//                 }}
//                 style={{
//                   position: "absolute",
//                   left: 12,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   background: "rgba(255, 255, 255, 0.95)",
//                   backdropFilter: "blur(12px)",
//                   border: "none",
//                   color: "#333",
//                   fontSize: 14,
//                   opacity: isHovered ? 1 : 0,
//                   transition: "all 0.3s ease",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                 }}
//               />
//               <Button
//                 type="text"
//                 shape="circle"
//                 icon={<RightOutlined />}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   nextImage();
//                 }}
//                 style={{
//                   position: "absolute",
//                   right: 12,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   background: "rgba(255, 255, 255, 0.95)",
//                   backdropFilter: "blur(12px)",
//                   border: "none",
//                   color: "#333",
//                   fontSize: 14,
//                   opacity: isHovered ? 1 : 0,
//                   transition: "all 0.3s ease",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                 }}
//               />
//             </>
//           )}

//           {/* Bouton Auto-play */}
//           {images.length > 1 && (
//             <Button
//               type="text"
//               shape="circle"
//               icon={
//                 isAutoPlaying ? (
//                   <PauseCircleOutlined style={{ fontSize: 18 }} />
//                 ) : (
//                   <PlayCircleOutlined style={{ fontSize: 18 }} />
//                 )
//               }
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setIsAutoPlaying(!isAutoPlaying);
//               }}
//               style={{
//                 position: "absolute",
//                 bottom: 16,
//                 right: 16,
//                 background: "rgba(0, 0, 0, 0.7)",
//                 backdropFilter: "blur(8px)",
//                 border: "none",
//                 color: "white",
//                 opacity: isHovered ? 1 : 0,
//                 transition: "all 0.3s ease",
//                 width: 40,
//                 height: 40,
//               }}
//             />
//           )}

//           {/* Indicateurs d'images */}
//           {images.length > 1 && (
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: 12,
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 display: "flex",
//                 gap: 8,
//                 padding: "8px 12px",
//                 background: "rgba(0, 0, 0, 0.5)",
//                 borderRadius: 20,
//                 backdropFilter: "blur(8px)",
//               }}
//             >
//               {images.map((_, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     width: index === currentImageIndex ? 24 : 8,
//                     height: 8,
//                     borderRadius: 4,
//                     background:
//                       index === currentImageIndex
//                         ? "#fff"
//                         : "rgba(255,255,255,0.5)",
//                     cursor: "pointer",
//                     transition: "all 0.3s ease",
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setCurrentImageIndex(index);
//                   }}
//                 />
//               ))}
//             </div>
//           )}

//           {/* Status Badge amélioré */}
//           <Badge
//             count={
//               <Space size={4}>
//                 {status.icon}
//                 {status.text}
//               </Space>
//             }
//             style={{
//               position: "absolute",
//               top: 16,
//               left: 16,
//               backgroundColor: status.color,
//               color: "white",
//               fontWeight: 600,
//               borderRadius: 20,
//               padding: "6px 16px",
//               fontSize: 12,
//               boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//               border: `2px solid ${status.bgColor}`,
//               animation: status.pulse ? "pulse 2s infinite" : "none",
//             }}
//           />

//           {/* Actions (Like + View + Preview) */}
//           <div
//             style={{
//               position: "absolute",
//               top: 16,
//               right: 16,
//               display: "flex",
//               gap: 8,
//               opacity: isHovered ? 1 : 0.8,
//               transition: "opacity 0.3s ease",
//             }}
//           >
//             <Tooltip title="Prévisualiser">
//               <Button
//                 type="text"
//                 shape="circle"
//                 icon={
//                   <FullscreenOutlined
//                     style={{ color: "white", fontSize: 16 }}
//                   />
//                 }
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   openPreview(currentImageIndex);
//                 }}
//                 style={{
//                   background: "rgba(0, 0, 0, 0.6)",
//                   backdropFilter: "blur(8px)",
//                   border: "1px solid rgba(255, 255, 255, 0.3)",
//                   width: 36,
//                   height: 36,
//                 }}
//               />
//             </Tooltip>
//             <Tooltip
//               title={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
//             >
//               <Button
//                 type="text"
//                 shape="circle"
//                 icon={
//                   liked ? (
//                     <HeartFilled style={{ color: "#ff4d4f", fontSize: 16 }} />
//                   ) : (
//                     <HeartOutlined style={{ color: "white", fontSize: 16 }} />
//                   )
//                 }
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setLiked(!liked);
//                 }}
//                 style={{
//                   background: liked
//                     ? "rgba(255, 255, 255, 0.9)"
//                     : "rgba(0, 0, 0, 0.6)",
//                   backdropFilter: "blur(8px)",
//                   border: "1px solid rgba(255, 255, 255, 0.3)",
//                   width: 36,
//                   height: 36,
//                   transform: liked ? "scale(1.1)" : "scale(1)",
//                   transition: "all 0.3s ease",
//                 }}
//               />
//             </Tooltip>
//             <Tooltip title="Voir les détails">
//               <Button
//                 type="text"
//                 shape="circle"
//                 icon={<EyeOutlined style={{ color: "white", fontSize: 16 }} />}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate(`/bailleur/annonce/${annonce.id}`);
//                 }}
//                 style={{
//                   background: "rgba(0, 0, 0, 0.6)",
//                   backdropFilter: "blur(8px)",
//                   border: "1px solid rgba(255, 255, 255, 0.3)",
//                   width: 36,
//                   height: 36,
//                 }}
//               />
//             </Tooltip>
//           </div>
//         </div>

//         {/* Section Informations */}
//         <div style={{ padding: 20 }}>
//           {/* Titre et Prix */}
//           <div style={{ marginBottom: 16 }}>
//             <Title
//               level={5}
//               ellipsis
//               style={{
//                 marginBottom: 8,
//                 fontSize: 18,
//                 fontWeight: 600,
//                 color: "#1a1a1a",
//                 transition: "color 0.3s ease",
//               }}
//             >
//               {annonce.titre}
//             </Title>
//             <Text
//               strong
//               style={{
//                 fontSize: 20,
//                 color: "#1890ff",
//                 fontWeight: 700,
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 8,
//                 marginBottom: 8,
//               }}
//             >
//               <DollarCircleOutlined style={{ fontSize: 22 }} />
//               {formatPrice(annonce.prix, annonce.charges)}
//             </Text>
//           </div>

//           <Divider style={{ margin: "16px 0" }} />

//           {/* Localisation */}
//           {annonce.adresse && (
//             <div style={{ marginBottom: 16 }}>
//               <Text
//                 type="secondary"
//                 style={{
//                   fontSize: 14,
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 8,
//                   padding: "8px 12px",
//                   background: "#f8f9fa",
//                   borderRadius: 12,
//                   border: "1px solid #e9ecef",
//                 }}
//               >
//                 <EnvironmentOutlined
//                   style={{ color: "#1890ff", fontSize: 16 }}
//                 />
//                 {annonce.adresse}, {annonce.ville}
//               </Text>
//             </div>
//           )}

//           {/* Tags caractéristiques */}
//           <Row gutter={[8, 8]} style={{ marginBottom: 20 }}>
//             <Col>
//               <Tag
//                 color="blue"
//                 style={{
//                   borderRadius: 16,
//                   padding: "6px 14px",
//                   fontSize: 12,
//                   fontWeight: 500,
//                   border: "none",
//                   boxShadow: "0 2px 8px rgba(24, 144, 255, 0.2)",
//                 }}
//               >
//                 {getTypeLogementText(annonce.typeDeLogement)}
//               </Tag>
//             </Col>
//             <Col>
//               <Tag
//                 color="green"
//                 style={{
//                   borderRadius: 16,
//                   padding: "6px 14px",
//                   fontSize: 12,
//                   fontWeight: 500,
//                   border: "none",
//                   boxShadow: "0 2px 8px rgba(82, 196, 26, 0.2)",
//                 }}
//               >
//                 <HomeOutlined style={{ marginRight: 4 }} />
//                 {annonce.nombreDeChambres || 0} chambre(s)
//               </Tag>
//             </Col>
//             <Col>
//               <Tag
//                 color="cyan"
//                 style={{
//                   borderRadius: 16,
//                   padding: "6px 14px",
//                   fontSize: 12,
//                   fontWeight: 500,
//                   border: "none",
//                   boxShadow: "0 2px 8px rgba(19, 194, 194, 0.2)",
//                 }}
//               >
//                 {annonce.salleDeBains || 0} SDB
//               </Tag>
//             </Col>
//             {annonce.surface && (
//               <Col>
//                 <Tag
//                   color="purple"
//                   style={{
//                     borderRadius: 16,
//                     padding: "6px 14px",
//                     fontSize: 12,
//                     fontWeight: 500,
//                     border: "none",
//                     boxShadow: "0 2px 8px rgba(114, 46, 209, 0.2)",
//                   }}
//                 >
//                   {annonce.surface}m²
//                 </Tag>
//               </Col>
//             )}
//           </Row>

//           {/* Footer avec date et propriétaire */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               paddingTop: 16,
//               borderTop: "1px solid #f0f0f0",
//             }}
//           >
//             <Text
//               type="secondary"
//               style={{
//                 fontSize: 12,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//               }}
//             >
//               <ClockCircleOutlined style={{ color: "#1890ff" }} />
//               Publié le {formatDate(annonce.datePublication)}
//             </Text>

//             {annonce.proprietaire && (
//               <Space size={8}>
//                 <Avatar
//                   size={28}
//                   icon={<UserOutlined />}
//                   src={annonce.proprietaire.avatar}
//                   style={{
//                     backgroundColor: "#1890ff",
//                     border: "2px solid #e6f7ff",
//                   }}
//                 />
//                 <Text
//                   type="secondary"
//                   style={{ fontSize: 12, fontWeight: 500 }}
//                 >
//                   {annonce.proprietaire.nom || "Propriétaire"}
//                 </Text>
//               </Space>
//             )}
//           </div>
//         </div>
//       </Card>

//       {/* Modal de prévisualisation */}
//       <Modal
//         open={isPreviewOpen}
//         onCancel={() => setIsPreviewOpen(false)}
//         footer={null}
//         centered
//         width="90vw"
//         style={{ maxWidth: 1200 }}
//         styles={{
//           body: { padding: 0 },
//           mask: { backdropFilter: "blur(8px)" },
//         }}
//         closeIcon={
//           <CloseOutlined
//             style={{
//               fontSize: 18,
//               color: "white",
//               background: "rgba(0,0,0,0.5)",
//               padding: 8,
//               borderRadius: "50%",
//             }}
//           />
//         }
//       >
//         <div style={{ position: "relative", background: "#000" }}>
//           <Image
//             src={images[previewIndex]}
//             alt={`Preview ${previewIndex}`}
//             style={{
//               width: "100%",
//               height: "70vh",
//               objectFit: "contain",
//             }}
//             preview={false}
//           />

//           {images.length > 1 && (
//             <>
//               <Button
//                 type="text"
//                 shape="circle"
//                 size="large"
//                 icon={<LeftOutlined style={{ fontSize: 20, color: "white" }} />}
//                 onClick={prevPreviewImage}
//                 style={{
//                   position: "absolute",
//                   left: 20,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   background: "rgba(0, 0, 0, 0.5)",
//                   border: "none",
//                   width: 50,
//                   height: 50,
//                 }}
//               />
//               <Button
//                 type="text"
//                 shape="circle"
//                 size="large"
//                 icon={
//                   <RightOutlined style={{ fontSize: 20, color: "white" }} />
//                 }
//                 onClick={nextPreviewImage}
//                 style={{
//                   position: "absolute",
//                   right: 20,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   background: "rgba(0, 0, 0, 0.5)",
//                   border: "none",
//                   width: 50,
//                   height: 50,
//                 }}
//               />

//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: 20,
//                   left: "50%",
//                   transform: "translateX(-50%)",
//                   color: "white",
//                   background: "rgba(0, 0, 0, 0.7)",
//                   padding: "8px 16px",
//                   borderRadius: 20,
//                   fontSize: 14,
//                 }}
//               >
//                 {previewIndex + 1} / {images.length}
//               </div>
//             </>
//           )}
//         </div>
//       </Modal>

//       <style jsx>{`
//         @keyframes pulse {
//           0%,
//           100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.7;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default AnnonceCard;


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

const { Title, Text } = Typography;

const AnnonceCard = ({ annonce }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
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

          {/* Overlay gradient
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}

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
            <Tooltip title={liked ? "Retirer des favoris" : "Ajouter aux favoris"}>
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
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                className={`backdrop-blur border-0 w-7 h-7 flex items-center justify-center transition-all duration-300 ${
                  liked ? "bg-white/90 hover:bg-white" : "bg-black/50 hover:bg-black/70"
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
                  navigate(`/bailleur/annonce/${annonce.id}`);
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
          0%, 100% {
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
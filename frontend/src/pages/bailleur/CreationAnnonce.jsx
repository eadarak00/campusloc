import React, { useState } from "react";
import {
  Card,
  Input,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  Typography,
  message,
  Switch,
  Upload,
  Steps,
  Progress,
  Divider,
  Space,
  Tag,
  Modal,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SaveOutlined,
  EyeOutlined,
  HomeOutlined,
  DollarOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  FullscreenOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import "../../styles/bailleur/create-annonce.css";
import ApercuAnnonce from "../../components/bailleur/ApercuAnnonce";
import ROUTES from "../../routes/routes";
import { useNavigate } from "react-router-dom";
import { createAnnonce } from "../../api/annonceAPI";
import { uploadMedias } from "../../api/media";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreationAnnonce = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState("modal");
  const [createdAnnonceId, setCreatedAnnonceId] = useState(null);
  const [formData, setFormData] = useState({
    titre: "",
    typeDeLogement: "APPARTEMENT",
    description: "",
    surface: "",
    pieces: "",
    capacite: "",
    nombreDeChambres: "",
    sallesDeBain: "",
    adresse: "",
    ville: "",
    prix: "",
    caution: "",
    charges: "",
    meuble: false,
    negociable: false,
    disponible: true,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const steps = [
    {
      title: "Informations",
      icon: <InfoCircleOutlined />,
      description: "Détails généraux",
    },
    {
      title: "Caractéristiques",
      icon: <HomeOutlined />,
      description: "Propriétés du bien",
    },
    {
      title: "Prix",
      icon: <DollarOutlined />,
      description: "Tarification",
    },
    {
      title: "Photos",
      icon: <CameraOutlined />,
      description: "Galerie d'images",
    },
    {
      title: "Finalisation",
      icon: <CheckCircleOutlined />,
      description: "Vérification",
    },
  ];

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.titre || !formData.typeDeLogement || !formData.description) {
          message.error("Veuillez remplir tous les champs obligatoires");
          return false;
        }
        break;
      case 1:
        if (!formData.surface || !formData.adresse || !formData.ville) {
          message.error("Veuillez remplir tous les champs obligatoires");
          return false;
        }
        break;
      case 2:
        if (!formData.prix || !formData.caution) {
          message.error("Veuillez remplir tous les champs obligatoires");
          return false;
        }
        break;
      case 3:
        break;
      default:
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Fonction pour préparer les données pour l'API
  const prepareDataForAPI = () => {
    const apiData = {
      titre: formData.titre,
      typeDeLogement: formData.typeDeLogement,
      description: formData.description,
      surface: parseInt(formData.surface),
      adresse: formData.adresse,
      ville: formData.ville,
      prix: parseInt(formData.prix),
      caution: parseInt(formData.caution),
      meuble: formData.meuble,
      negociable: formData.negociable,
      disponible: formData.disponible
    };

    // Ajouter les champs optionnels seulement s'ils sont remplis
    if (formData.pieces) apiData.pieces = parseInt(formData.pieces);
    if (formData.nombreDeChambres) apiData.nombreDeChambres = parseInt(formData.nombreDeChambres);
    if (formData.sallesDeBain) apiData.sallesDeBain = parseInt(formData.sallesDeBain);
    if (formData.capacite) apiData.capacite = parseInt(formData.capacite);
    if (formData.charges) apiData.charges = parseInt(formData.charges);

    return apiData;
  };

  // Fonction pour uploader les médias
  // const uploadMediasAnnonce = async (annonceId) => {
  //   if (fileList.length === 0) {
  //     return true; // Pas d'images à uploader
  //   }

  //   try {
  //     const formData = new FormData();

  //     // Ajouter chaque fichier au FormData
  //     fileList.forEach((file, index) => {
  //       if (file.originFileObj) {
  //         formData.append("medias", file.originFileObj);
  //       }
  //     });

  //     message.loading("Upload des images en cours...", 0);

  //     const response = await uploadMedias(annonceId, formData);

  //     message.destroy(); // Fermer le message de loading

  //     if (response.success) {
  //       message.success(`${fileList.length} image(s) uploadée(s) avec succès`);
  //       return true;
  //     } else {
  //       message.error("Erreur lors de l'upload des images");
  //       return false;
  //     }
  //   } catch (error) {
  //     message.destroy();
  //     console.error("Erreur upload médias:", error);
  //     message.error("Erreur lors de l'upload des images");
  //     return false;
  //   }
  // };

  const uploadMediasAnnonce = async (annonceId) => {
    if (fileList.length === 0) {
      return true; // Pas d'images à uploader
    }

    try {
      const formData = new FormData();

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj); // <-- clé correcte
        }
      });

      message.loading("Upload des images en cours...", 0);

      const response = await uploadMedias(annonceId, formData);

      message.destroy();

      if (response.data?.success || response.status === 200) {
        message.success(`${fileList.length} image(s) uploadée(s) avec succès`);
        return true;
      } else {
        message.error("Erreur lors de l'upload des images");
        return false;
      }
    } catch (error) {
      message.destroy();
      console.error("Erreur upload médias:", error);
      message.error("Erreur lors de l'upload des images");
      return false;
    }
  };

  // const handleSubmit = async () => {
  //   if (!validateCurrentStep()) return;

  //   setLoading(true);
  //   try {
  //     console.log("Données du formulaire:", formData);
  //     console.log("Fichiers uploadés:", fileList);

  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     message.success("Annonce créée avec succès !");

  //     setFormData({
  //       titre: "",
  //       type: "APPARTEMENT",
  //       description: "",
  //       surface: "",
  //       pieces: "",
  //       nombreDeChambres: "",
  //       sallesDeBain: "",
  //       adresse: "",
  //       ville: "",
  //       prix: "",
  //       charges: "",
  //       caution: "",
  //       meuble: false,
  //       negociable: false,
  //     });
  //     setFileList([]);
  //     setCurrentStep(0);
  //     setShowPreview(false);
  //   } catch (error) {
  //     message.error("Erreur lors de la création de l'annonce");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);

    try {
      // Étape 1: Créer l'annonce
      message.loading("Création de l'annonce en cours...", 0);

      const apiData = prepareDataForAPI();
      console.log("Données envoyées à l'API:", apiData);

      const response = await createAnnonce(apiData);
      const data = response.data;

      console.log("Données de reponse de l'API:", data);
      message.destroy(); // Fermer le message de loading

      if (data) {
        const annonceId = data.id;
        setCreatedAnnonceId(annonceId);

        message.success("Annonce créée avec succès !");

        // Étape 2: Uploader les médias si il y en a
        if (fileList.length > 0) {
          const uploadSuccess = await uploadMediasAnnonce(annonceId);

          if (!uploadSuccess) {
            // L'annonce est créée mais l'upload des images a échoué
            message.warning(
              "Annonce créée mais certaines images n'ont pas pu être uploadées"
            );
          }
        }

        // Étape 3: Réinitialiser le formulaire et rediriger
        setTimeout(() => {
          resetForm();
          // Optionnel: rediriger vers la liste des annonces ou la page de détail
          navigate(ROUTES.ANNONCES_BAILLEUR);
          message.success("Annonce publiée avec succès !");
        }, 1500);
      } else {
        message.error(
          response.message || "Erreur lors de la création de l'annonce"
        );
      }
    } catch (error) {
      message.destroy();
      console.error("Erreur lors de la création:", error);

      // Gestion des erreurs spécifiques
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        switch (status) {
          case 400:
            message.error(
              "Données invalides. Veuillez vérifier les informations saisies."
            );
            break;
          case 401:
            message.error("Vous devez être connecté pour créer une annonce.");
            break;
          case 403:
            message.error(
              "Vous n'avez pas les permissions pour créer une annonce."
            );
            break;
          case 500:
            message.error("Erreur serveur. Veuillez réessayer plus tard.");
            break;
          default:
            message.error(
              errorData.message || "Erreur lors de la création de l'annonce"
            );
        }
      } else {
        message.error(
          "Erreur de connexion. Veuillez vérifier votre connexion internet."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      titre: "",
      typeDeLogement: "APPARTEMENT",
      description: "",
      surface: "",
      pieces: "",
      capacite: "",
      nombreDeChambres: "",
      sallesDeBain: "",
      adresse: "",
      ville: "",
      prix: "",
      charges: "",
      caution: "",
      meuble: false,
      negociable: false,
      disponible: true
    });
    setFileList([]);
    setCurrentStep(0);
    setShowPreview(false);
    setCreatedAnnonceId(null);
  };

  const handleBack = () => {
    console.log("Retour à la page précédente");
    message.info("Retour à la liste des annonces...");
    navigate(ANNONCES_BAILLEUR);
  };

  // const uploadProps = {
  //   fileList,
  //   onChange: ({ fileList: newFileList }) => setFileList(newFileList),
  //   beforeUpload: () => false,
  //   multiple: true,
  //   accept: "image/*",
  //   maxCount: 10,
  // };

  const uploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    beforeUpload: (file) => {
      // Validation du type de fichier
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Vous ne pouvez uploader que des images !");
        return false;
      }

      // Validation de la taille (max 5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("La taille de l'image doit être inférieure à 5MB !");
        return false;
      }

      return false; // Empêcher l'upload automatique
    },
    multiple: true,
    accept: "image/*",
    maxCount: 10,
  };

  const typesBiens = [
    { value: "CHAMBRE_INDIVIDUELLE", label: "Chambre individuelle" },
    { value: "CHAMBRE_PARTAGEE", label: "Chambre partagée" },
    { value: "APPARTEMENT", label: "Appartement" },
    { value: "MAISON", label: "Maison" },
    { value: "STUDIO", label: "Studio" },
  ];

  const getProgressPercent = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  // Fonctions pour déterminer quels champs afficher selon le type
  const shouldShowCapacite = () => {
    return (
      formData.typeDeLogement === "CHAMBRE_INDIVIDUELLE" ||
      formData.typeDeLogement === "CHAMBRE_PARTAGEE"
    );
  };

  const shouldShowPieces = () => {
    return (
      formData.typeDeLogement === "APPARTEMENT" ||
      formData.typeDeLogement === "MAISON" ||
      formData.typeDeLogement === "STUDIO"
    );
  };

  const shouldShowChambres = () => {
      
    return formData.typeDeLogement === "APPARTEMENT" || formData.typeDeLogement === "MAISON" ||  formData.typeDeLogement === "STUDIO";
  };

  // Fonctions pour l'aperçu
  const handlePreview = (mode = "modal") => {
    if (!validateCurrentStep()) return;
    setPreviewMode(mode);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleEditFromPreview = () => {
    setShowPreview(false);
    // Optionnel: revenir à l'étape précédente pour modification
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card
            className="creation-annonce__step-card creation-annonce__step-card--info"
            title={
              <div className="creation-annonce__card-header">
                <EditOutlined className="creation-annonce__card-icon" />
                <span className="creation-annonce__card-title">
                  Informations générales
                </span>
              </div>
            }
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <div className="creation-annonce__form-group">
                  <label className="creation-annonce__form-label">
                    Titre de l'annonce{" "}
                    <span className="creation-annonce__required">*</span>
                  </label>
                  <Input
                    placeholder="Ex: Bel appartement 2 pièces centre-ville"
                    value={formData.titre}
                    onChange={(e) => handleInputChange("titre", e.target.value)}
                    className="creation-annonce__form-input"
                    size="large"
                  />
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="creation-annonce__form-group">
                  <label className="creation-annonce__form-label">
                    Type de bien{" "}
                    <span className="creation-annonce__required">*</span>
                  </label>
                  <Select
                    placeholder="Sélectionner le type"
                    value={formData.typeDeLogement}
                    onChange={(value) => handleInputChange("type", value)}
                    className="creation-annonce__form-select"
                    size="large"
                  >
                    {typesBiens.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col xs={24}>
                <div className="creation-annonce__form-group">
                  <label className="creation-annonce__form-label">
                    Description{" "}
                    <span className="creation-annonce__required">*</span>
                  </label>
                  <TextArea
                    rows={6}
                    placeholder="Décrivez votre bien en détail..."
                    showCount
                    maxLength={1000}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="creation-annonce__form-textarea"
                  />
                </div>
              </Col>
            </Row>
          </Card>
        );

      case 1:
        return (
          <Card
            className="creation-annonce__step-card creation-annonce__step-card--characteristics"
            title={
              <div className="creation-annonce__card-header">
                <HomeOutlined className="creation-annonce__card-icon" />
                <span className="creation-annonce__card-title">
                  Caractéristiques et localisation
                </span>
              </div>
            }
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div className="creation-annonce__form-group">
                  <label className="creation-annonce__form-label">
                    Surface (m²){" "}
                    <span className="creation-annonce__required">*</span>
                  </label>
                  <InputNumber
                    min={1}
                    className="creation-annonce__form-input creation-annonce__form-input--number"
                    size="large"
                    value={formData.surface}
                    onChange={(value) => handleInputChange("surface", value)}
                  />
                </div>
              </Col>

              {shouldShowPieces() && (
                <Col xs={24} md={8}>
                  <div className="creation-annonce__form-group">
                    <label className="creation-annonce__form-label">
                      Nombre de pièces
                    </label>
                    <InputNumber
                      min={1}
                      className="creation-annonce__form-input creation-annonce__form-input--number"
                      size="large"
                      value={formData.pieces}
                      onChange={(value) => handleInputChange("pieces", value)}
                    />
                  </div>
                </Col>
              )}

              {shouldShowChambres() && (
                <Col xs={24} md={8}>
                  <div className="creation-annonce__form-group">
                    <label className="creation-annonce__form-label">
                      Nombre de chambres
                    </label>
                    <InputNumber
                      min={0}
                      className="creation-annonce__form-input creation-annonce__form-input--number"
                      size="large"
                      value={formData.nombreDeChambres}
                      onChange={(value) => handleInputChange("nombreDeChambres", value)}
                    />
                  </div>
                </Col>
              )}

              <Col xs={24} md={8}>
                <div className="creation-annonce__form-group">
                  <label className="creation-annonce__form-label">
                    Salles de bain
                  </label>
                  <InputNumber
                    min={0}
                    className="creation-annonce__form-input creation-annonce__form-input--number"
                    size="large"
                    value={formData.sallesDeBain}
                    onChange={(value) => handleInputChange("sallesDeBain", value)}
                  />
                </div>
              </Col>

              {shouldShowCapacite() && (
                <Col xs={24} md={8}>
                  <div className="creation-annonce__form-group">
                    <label className="creation-annonce__form-label">
                      Capacité de la chambre
                    </label>
                    <InputNumber
                      min={1}
                      className="creation-annonce__form-input creation-annonce__form-input--number"
                      size="large"
                      value={formData.capacite}
                      onChange={(value) => handleInputChange("capacite", value)}
                    />
                  </div>
                </Col>
              )}

              <Col xs={24} md={12}>
                <div className="creation-annonce__form-group">
                  <label className="creation-annonce__form-label">
                    Adresse{" "}
                    <span className="creation-annonce__required">*</span>
                  </label>
                  <Input
                    placeholder="Rue, avenue..."
                    value={formData.adresse}
                    onChange={(e) =>
                      handleInputChange("adresse", e.target.value)
                    }
                    className="creation-annonce__form-input creation-annonce__form-input--address"
                    size="large"
                    prefix={
                      <EnvironmentOutlined className="creation-annonce__input-icon" />
                    }
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="creation-annonce__form-group">
                  <label className="creation-annonce__form-label">
                    Ville <span className="creation-annonce__required">*</span>
                  </label>
                  <Input
                    placeholder="Ville"
                    value={formData.ville}
                    onChange={(e) => handleInputChange("ville", e.target.value)}
                    className="creation-annonce__form-input creation-annonce__form-input--city"
                    size="large"
                    prefix={
                      <EnvironmentOutlined className="creation-annonce__input-icon" />
                    }
                  />
                </div>
              </Col>
            </Row>
          </Card>
        );

      case 2:
        return (
          <Card
            className="creation-annonce__step-card creation-annonce__step-card--pricing"
            title={
              <div className="creation-annonce__card-header">
                <DollarOutlined className="creation-annonce__card-icon" />
                <span className="creation-annonce__card-title">
                  Prix et options
                </span>
              </div>
            }
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div className="creation-annonce__form-group">
                  <label className="creation-annonce__form-label">
                    Prix mensuel (FCFA){" "}
                    <span className="creation-annonce__required">*</span>
                  </label>
                  <InputNumber
                    min={0}
                    className="creation-annonce__form-input creation-annonce__form-input--price"
                    size="large"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    value={formData.prix}
                    onChange={(value) => handleInputChange("prix", value)}
                  />
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="creation-annonce__form-group">
                  <label className="creation-annonce__form-label">
                    Charges mensuelles (FCFA)
                  </label>
                  <InputNumber
                    min={0}
                    className="creation-annonce__form-input creation-annonce__form-input--charges"
                    size="large"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    value={formData.charges}
                    onChange={(value) => handleInputChange("charges", value)}
                  />
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="creation-annonce__form-group">
                  <label className="creation-annonce__form-label">
                    Caution (FCFA){" "}
                    <span className="creation-annonce__required">*</span>
                  </label>
                  <InputNumber
                    min={0}
                    className="creation-annonce__form-input creation-annonce__form-input--caution"
                    size="large"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    value={formData.caution}
                    onChange={(value) => handleInputChange("caution", value)}
                  />
                </div>
              </Col>
              <Col xs={24}>
                <Divider className="creation-annonce__section-divider">
                  Options du bien
                </Divider>
              </Col>
              <Col xs={24} md={12}>
                <div className="creation-annonce__switch-group">
                  <Switch
                    checked={formData.negociable}
                    onChange={(checked) =>
                      handleInputChange("negociable", checked)
                    }
                    className="creation-annonce__switch creation-annonce__switch--negotiable"
                  />
                  <span className="creation-annonce__switch-label">
                    Prix négociable
                  </span>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="creation-annonce__switch-group">
                  <Switch
                    checked={formData.meuble}
                    onChange={(checked) => handleInputChange("meuble", checked)}
                    className="creation-annonce__switch creation-annonce__switch--furnished"
                  />
                  <span className="creation-annonce__switch-label">Meublé</span>
                </div>
              </Col>
            </Row>
          </Card>
        );

      case 3:
        return (
          <Card
            className="creation-annonce__step-card creation-annonce__step-card--upload"
            title={
              <div className="creation-annonce__card-header">
                <CameraOutlined className="creation-annonce__card-icon" />
                <span className="creation-annonce__card-title">
                  Photos du bien
                </span>
              </div>
            }
          >
            <div className="creation-annonce__upload-section">
              <div className="creation-annonce__upload-header">
                <div className="creation-annonce__upload-icon">
                  <CameraOutlined />
                </div>
                <Title level={4} className="creation-annonce__upload-title">
                  Ajoutez des photos de votre bien
                </Title>
                <Text className="creation-annonce__upload-description">
                  Ajoutez jusqu'à 10 photos pour attirer plus de locataires
                </Text>
              </div>
              <div className="creation-annonce__upload-container">
                <Upload
                  {...uploadProps}
                  listType="picture-card"
                  className="creation-annonce__upload-widget"
                >
                  <div className="creation-annonce__upload-button">
                    <UploadOutlined />
                    <div className="creation-annonce__upload-text">Ajouter</div>
                  </div>
                </Upload>
              </div>
              {fileList.length > 0 && (
                <div className="creation-annonce__upload-status">
                  <Text strong className="creation-annonce__upload-count">
                    {fileList.length} photo(s) ajoutée(s)
                  </Text>
                </div>
              )}
            </div>
          </Card>
        );

      case 4:
        return (
          <Card
            className="creation-annonce__step-card creation-annonce__step-card--confirmation"
            title={
              <div className="creation-annonce__card-header">
                <CheckCircleOutlined className="creation-annonce__card-icon" />
                <span className="creation-annonce__card-title">
                  Confirmation et publication
                </span>
              </div>
            }
          >
            <div className="creation-annonce__confirmation-content">
              <div className="creation-annonce__confirmation-header">
                <div className="creation-annonce__confirmation-icon">
                  <CheckCircleOutlined />
                </div>
                <Title
                  level={4}
                  className="creation-annonce__confirmation-title"
                >
                  Vérifiez vos informations
                </Title>
                <Text className="creation-annonce__confirmation-description">
                  Relisez attentivement toutes les informations
                </Text>
              </div>

              <div className="creation-annonce__summary-section">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <div className="creation-annonce__summary-item">
                      <Text strong className="creation-annonce__summary-label">
                        Titre:
                      </Text>
                      <Text className="creation-annonce__summary-value">
                        {formData.titre}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="creation-annonce__summary-item">
                      <Text strong className="creation-annonce__summary-label">
                        Type:
                      </Text>
                      <Text className="creation-annonce__summary-value">
                        {formData.type}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="creation-annonce__summary-item">
                      <Text strong className="creation-annonce__summary-label">
                        Surface:
                      </Text>
                      <Text className="creation-annonce__summary-value">
                        {formData.surface} m²
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="creation-annonce__summary-item">
                      <Text strong className="creation-annonce__summary-label">
                        Prix:
                      </Text>
                      <Text className="creation-annonce__summary-value creation-annonce__summary-value--price">
                        {formData.prix?.toLocaleString()} FCFA
                      </Text>
                    </div>
                  </Col>
                  {shouldShowPieces() && formData.pieces && (
                    <Col xs={24} md={12}>
                      <div className="creation-annonce__summary-item">
                        <Text
                          strong
                          className="creation-annonce__summary-label"
                        >
                          Pièces:
                        </Text>
                        <Text className="creation-annonce__summary-value">
                          {formData.pieces}
                        </Text>
                      </div>
                    </Col>
                  )}
                  {shouldShowChambres() && formData.nombreDeChambres && (
                    <Col xs={24} md={12}>
                      <div className="creation-annonce__summary-item">
                        <Text
                          strong
                          className="creation-annonce__summary-label"
                        >
                          Chambres:
                        </Text>
                        <Text className="creation-annonce__summary-value">
                          {formData.nombreDeChambres}
                        </Text>
                      </div>
                    </Col>
                  )}
                  {shouldShowCapacite() && formData.capacite && (
                    <Col xs={24} md={12}>
                      <div className="creation-annonce__summary-item">
                        <Text
                          strong
                          className="creation-annonce__summary-label"
                        >
                          Capacité:
                        </Text>
                        <Text className="creation-annonce__summary-value">
                          {formData.capacite} personne(s)
                        </Text>
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
              <Button
                type="primary"
                loading={loading}
                icon={<SaveOutlined />}
                size="large"
                onClick={handleSubmit}
                className="creation-annonce__publish-button"
                disabled={loading}
              >
                {loading ? "Publication en cours..." : "Publier l'annonce"}
              </Button>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  // Rendu de l'aperçu
  const renderPreview = () => {
    if (!showPreview) return null;

    if (previewMode === "fullscreen") {
      return (
        <div className="creation-annonce__fullscreen-preview">
          <ApercuAnnonce
            formData={formData}
            fileList={fileList}
            onClose={handleClosePreview}
            onEdit={handleEditFromPreview}
          />
        </div>
      );
    }

    return (
      <Modal
        title="Aperçu de l'annonce"
        open={showPreview}
        onCancel={handleClosePreview}
        footer={[
          <Button key="edit" onClick={handleEditFromPreview}>
            Modifier
          </Button>,
          <Button key="close" type="primary" onClick={handleClosePreview}>
            Fermer
          </Button>,
        ]}
        width="90%"
        style={{ maxWidth: "1200px" }}
        className="creation-annonce__preview-modal"
      >
        <div style={{ maxHeight: "70vh", overflow: "auto" }}>
          <ApercuAnnonce
            formData={formData}
            fileList={fileList}
            onClose={handleClosePreview}
            onEdit={handleEditFromPreview}
          />
        </div>
      </Modal>
    );
  };

  return (
    <div className="creation-annonce">
      <div className="creation-annonce__header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="creation-annonce__back-button"
        >
          Retour
        </Button>
        <Title level={2} className="creation-annonce__main-title">
          Créer une nouvelle annonce
        </Title>
        <Text className="creation-annonce__subtitle">
          Suivez les étapes pour publier votre annonce
        </Text>
      </div>

      <div className="creation-annonce__progress">
        <Progress
          percent={getProgressPercent()}
          showInfo={false}
          strokeColor={{
            "0%": "#d4b483",
            "100%": "#a0744a",
          }}
          className="creation-annonce__progress-bar"
        />
        <Steps
          current={currentStep}
          items={steps}
          className="creation-annonce__steps"
        />
        <div className="creation-annonce__step-info">
          <Text className="creation-annonce__step-description">
            Étape {currentStep + 1} sur {steps.length}:{" "}
            {steps[currentStep].description}
          </Text>
        </div>
      </div>

      <div className="creation-annonce__content">{renderStepContent()}</div>

      <Card className="creation-annonce__navigation">
        <Row justify="space-between" align="middle">
          <Col>
            {currentStep > 0 && (
              <Button
                onClick={prevStep}
                icon={<ArrowLeftOutlined />}
                className="creation-annonce__nav-button creation-annonce__nav-button--prev"
              >
                Précédent
              </Button>
            )}
          </Col>
          <Col>
            <Text className="creation-annonce__step-counter">
              {currentStep + 1} / {steps.length}
            </Text>
          </Col>
          <Col>
            {currentStep < steps.length - 1 ? (
              <Space>
                {/* <Button
                  icon={<EyeOutlined />}
                  onClick={() => handlePreview("modal")}
                  className="creation-annonce__nav-button creation-annonce__nav-button--preview"
                >
                  Aperçu
                </Button> */}
                <Button
                  type="primary"
                  onClick={nextStep}
                  icon={<ArrowRightOutlined />}
                  className="creation-annonce__nav-button creation-annonce__nav-button--next"
                >
                  Suivant
                </Button>
              </Space>
            ) : (
              <Space>
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  size="large"
                  onClick={() => handlePreview("modal")}
                  className="creation-annonce__preview-button"
                >
                  Aperçu rapide
                </Button>
                <Button
                  type="default"
                  icon={<FullscreenOutlined />}
                  size="large"
                  onClick={() => handlePreview("fullscreen")}
                  className="creation-annonce__preview-button"
                >
                  Aperçu plein écran
                </Button>
              </Space>
            )}
          </Col>
        </Row>
      </Card>

      {/* Rendu de l'aperçu */}
      {renderPreview()}
    </div>
  );
};

export default CreationAnnonce;

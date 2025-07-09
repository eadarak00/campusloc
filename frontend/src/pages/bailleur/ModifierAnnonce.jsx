import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Card,
  message,
  Typography,
  Skeleton,
  Alert,
  Row,
  Col,
  Space,
  Tag,
  Upload,
  Image,
  Popconfirm,
} from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  CameraOutlined,
  DeleteOutlined,
  EyeOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getAnnonceById, updateAnnonce } from "../../api/annonceAPI";
import { uploadMedias, deleteMedia } from "../../api/media";
import { getImageUrl } from "../../api/ImageHelper";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const ModifierAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [annonce, setAnnonce] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [deletingMedia, setDeletingMedia] = useState(null);

  const typeLogementOptions = [
    {
      value: "CHAMBRE_INDIVIDUELLE",
      label: "Chambre individuelle",
      icon: "🛏️",
    },
    { value: "CHAMBRE_PARTAGEE", label: "Chambre partagée", icon: "🛏️👥" },
    { value: "APPARTEMENT", label: "Appartement", icon: "🏠" },
    { value: "MAISON", label: "Maison", icon: "🏡" },
    { value: "STUDIO", label: "Studio", icon: "🏢" },
  ];

  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const response = await getAnnonceById(id);
        const data = response.data;
        setAnnonce(data);
        
        // Charger les médias existants
        if (data.medias && data.medias.length > 0) {
          const formattedMedias = data.medias.map((media, index) => ({
            uid: media.id || `-${index}`,
            name: media.nomFichier || `media-${index}`,
            status: "done",
            url: getImageUrl(media.url),
            type: media.type || "image",
            mediaId: media.id,
            thumbUrl: getImageUrl(media.url),
          }));
          setFileList(formattedMedias);
        }

        // Remplir le formulaire avec les données existantes
        form.setFieldsValue({
          ...data,
          prix: Number(data.prix),
          charges: Number(data.charges),
          caution: Number(data.caution),
          surface: Number(data.surface),
          pieces: Number(data.pieces),
          nombreDeChambres: Number(data.nombreDeChambres),
          salleDeBains: Number(data.salleDeBains),
          capacite: Number(data.capacite),
          negociable: Boolean(data.negociable),
          meuble: Boolean(data.meuble),
          disponible: Boolean(data.disponible),
        });
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        message.error("Erreur lors du chargement de l'annonce.");
        navigate("/bailleur/annonces");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonce();
  }, [id, form, navigate]);

  // Fonction pour uploader de nouveaux médias
  const uploadNewMedias = async (newFiles) => {
    if (newFiles.length === 0) {
      return true;
    }

    try {
      const formData = new FormData();
      newFiles.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj);
        }
      });

      message.loading("Upload des médias en cours...", 0);
      const response = await uploadMedias(id, formData);
      message.destroy();

      if (response.data && response.data.length > 0) {
        const uploadedMedias = response.data.map((media) => ({
          uid: media.id,
          name: media.nomFichier,
          status: "done",
          url: getImageUrl(media.url),
          type: media.type || "IMAGE",
          mediaId: media.id,
          thumbUrl: getImageUrl(media.url),
        }));

        // Mettre à jour fileList avec les nouveaux médias uploadés
        setFileList(prevList => {
          const existingFiles = prevList.filter(file => file.mediaId);
          return [...existingFiles, ...uploadedMedias];
        });

        message.success(`${response.data.length} média(s) ajouté(s) avec succès!`);
        return true;
      }
    } catch (error) {
      message.destroy();
      console.error("Erreur upload médias:", error);
      message.error("Erreur lors de l'upload des médias");
      return false;
    }
  };

  

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleRemoveMedia = async (file) => {
    if (file.mediaId) {
      try {
        setDeletingMedia(file.uid);
        await deleteMedia(file.mediaId);
        const newFileList = fileList.filter((item) => item.uid !== file.uid);
        setFileList(newFileList);
        message.success("Média supprimé avec succès!");
      } catch (error) {
        console.error("Erreur suppression média:", error);
        message.error("Erreur lors de la suppression du média");
      } finally {
        setDeletingMedia(null);
      }
    } else {
      // Fichier local non encore uploadé
      const newFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(newFileList);
    }
    return false;
  };

  const handleDeleteAllMedia = async () => {
    try {
      setDeletingMedia("all");

      // Supprimer tous les médias avec mediaId (médias du serveur)
      const deletePromises = fileList
        .filter((media) => media.mediaId)
        .map((media) => deleteMedia(media.mediaId));

      await Promise.all(deletePromises);
      setFileList([]);
      message.success("Tous les médias ont été supprimés!");
    } catch (error) {
      console.error("Erreur suppression médias:", error);
      message.error("Erreur lors de la suppression des médias");
    } finally {
      setDeletingMedia(null);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };


  // Props pour le composant Upload
  const uploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // Validation du type de fichier
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      
      if (!isImage && !isVideo) {
        message.error("Vous ne pouvez uploader que des images ou des vidéos !");
        return false;
      }

      // Validation de la taille (max 10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("Le fichier doit faire moins de 10MB !");
        return false;
      }

      return false; // Empêcher l'upload automatique
    },
    onPreview: handlePreview,
    onRemove: handleRemoveMedia,
    multiple: true,
    accept: "image/*,video/*",
    maxCount: 10,
    listType: "picture-card",
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
      removeIcon: (file) => (
        <DeleteOutlined
          style={{
            color: deletingMedia === file.uid ? "#ccc" : "#ff4d4f",
          }}
        />
      ),
    },
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Uploader les nouveaux médias d'abord
      const newFiles = fileList.filter(file => !file.mediaId);
      const uploadSuccess = await uploadNewMedias(newFiles);

      if (!uploadSuccess) {
        setSubmitting(false);
        return;
      }

      // Mettre à jour l'annonce
      const formData = {
        ...values,
        titre: values.titre?.trim(),
        description: values.description?.trim(),
        adresse: values.adresse?.trim(),
        ville: values.ville?.trim(),
        prix: Number(values.prix) || 0,
        charges: Number(values.charges) || 0,
        caution: Number(values.caution) || 0,
        surface: Number(values.surface) || 0,
        pieces: Number(values.pieces) || 0,
        nombreDeChambres: Number(values.nombreDeChambres) || 0,
        salleDeBains: Number(values.salleDeBains) || 0,
        capacite: Number(values.capacite) || 0,
      };

      await updateAnnonce(id, formData);
      message.success("Annonce mise à jour avec succès !");
      navigate(`/bailleur/annonce/${id}`);
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      if (error.response?.data?.message) {
        message.error(`Erreur : ${error.response.data.message}`);
      } else {
        message.error("Erreur lors de la mise à jour.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Ajouter</div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <Skeleton active />
      </div>
    );
  }

  if (!annonce) {
    return (
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <Alert
          message="Annonce introuvable"
          description="Impossible de charger l'annonce."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/bailleur/annonces")}
            type="text"
            size="large"
          >
            Retour
          </Button>
        </Space>
        <Title level={2} style={{ margin: "16px 0", color: "#1f2937" }}>
          <HomeOutlined style={{ marginRight: "12px", color: "#3b82f6" }} />
          Modifier l'annonce
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Modifiez les informations de votre annonce immobilière
        </Text>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[24, 24]}>
          {/* Informations générales */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <InfoCircleOutlined style={{ color: "#3b82f6" }} />
                  <span>Informations générales</span>
                </Space>
              }
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <Form.Item
                label={<Text strong>Titre de l'annonce</Text>}
                name="titre"
                rules={[
                  { required: true, message: "Titre requis" },
                  { min: 10, message: "Le titre doit contenir au moins 10 caractères" },
                  { max: 100, message: "Le titre ne doit pas dépasser 100 caractères" }
                ]}
              >
                <Input
                  placeholder="Ex: Bel appartement 2 pièces centre-ville"
                  size="large"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>

              <Form.Item
                label={<Text strong>Description</Text>}
                name="description"
                rules={[
                  { required: true, message: "Description requise" },
                  { min: 50, message: "La description doit contenir au moins 50 caractères" }
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Décrivez votre bien immobilier en détail..."
                  style={{ borderRadius: "8px" }}
                  maxLength={1000}
                  showCount
                />
              </Form.Item>

              <Form.Item
                label={<Text strong>Type de logement</Text>}
                name="typeDeLogement"
                rules={[{ required: true, message: "Type requis" }]}
              >
                <Select
                  placeholder="Sélectionnez un type"
                  size="large"
                  style={{ borderRadius: "8px" }}
                >
                  {typeLogementOptions.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      <Space>
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* Statut et options */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <Tag color="blue">Statut</Tag>
                </Space>
              }
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Form.Item
                  label={<Text strong>Disponible</Text>}
                  name="disponible"
                  valuePropName="checked"
                  style={{ marginBottom: "8px" }}
                >
                  <Switch
                    checkedChildren="Oui"
                    unCheckedChildren="Non"
                    size="default"
                  />
                </Form.Item>

                <Form.Item
                  label={<Text strong>Meublé</Text>}
                  name="meuble"
                  valuePropName="checked"
                  style={{ marginBottom: "8px" }}
                >
                  <Switch checkedChildren="Oui" unCheckedChildren="Non" />
                </Form.Item>

                <Form.Item
                  label={<Text strong>Prix négociable</Text>}
                  name="negociable"
                  valuePropName="checked"
                  style={{ marginBottom: "8px" }}
                >
                  <Switch checkedChildren="Oui" unCheckedChildren="Non" />
                </Form.Item>
              </Space>
            </Card>
          </Col>

          {/* Localisation */}
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <EnvironmentOutlined style={{ color: "#10b981" }} />
                  <span>Localisation</span>
                </Space>
              }
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text strong>Ville</Text>}
                    name="ville"
                    rules={[{ required: true, message: "Ville requise" }]}
                  >
                    <Input
                      placeholder="Ex: Dakar"
                      size="large"
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text strong>Adresse</Text>}
                    name="adresse"
                    rules={[{ required: true, message: "Adresse requise" }]}
                  >
                    <Input
                      placeholder="Ex: Rue de la Paix, Plateau"
                      size="large"
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Prix et charges */}
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <DollarOutlined style={{ color: "#f59e0b" }} />
                  <span>Prix et charges</span>
                </Space>
              }
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text strong>Prix mensuel (FCFA)</Text>}
                    name="prix"
                    rules={[
                      { required: true, message: "Prix requis" },
                      { type: "number", min: 1000, message: "Le prix doit être supérieur à 1000 FCFA" }
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: "8px" }}
                      min={0}
                      size="large"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                      }
                      parser={(value) => value.replace(/\s?/g, "")}
                      placeholder="150000"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text strong>Charges (FCFA)</Text>}
                    name="charges"
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: "8px" }}
                      min={0}
                      size="large"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                      }
                      parser={(value) => value.replace(/\s?/g, "")}
                      placeholder="25000"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<Text strong>Caution (FCFA)</Text>}
                    name="caution"
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: "8px" }}
                      min={0}
                      size="large"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                      }
                      parser={(value) => value.replace(/\s?/g, "")}
                      placeholder="300000"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Médias */}
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <CameraOutlined style={{ color: "#ef4444" }} />
                  <span>Photos et vidéos</span>
                </Space>
              }
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Text type="secondary">
                  Ajoutez des photos et des vidéos pour rendre votre annonce plus attractive. 
                  Formats acceptés: JPG, PNG, GIF, MP4, MOV (max 10MB par fichier)
                </Text>

                <Upload {...uploadProps}>
                  {fileList.length >= 10 ? null : uploadButton}
                </Upload>

                {fileList.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <Space wrap>
                      <Tag color="blue">
                        <CameraOutlined /> {fileList.length} média(s) sélectionné(s)
                      </Tag>
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => fileList.length > 0 && handlePreview(fileList[0])}
                      >
                        Prévisualiser
                      </Button>
                      <Popconfirm
                        title="Supprimer tous les médias"
                        description="Êtes-vous sûr de vouloir supprimer tous les médias ? Cette action est irréversible."
                        onConfirm={handleDeleteAllMedia}
                        okText="Oui"
                        cancelText="Non"
                        disabled={deletingMedia === "all"}
                      >
                        <Button
                          type="link"
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                          loading={deletingMedia === "all"}
                          disabled={fileList.length === 0}
                        >
                          Tout supprimer
                        </Button>
                      </Popconfirm>
                    </Space>
                  </div>
                )}
              </Space>
            </Card>
          </Col>

          {/* Caractéristiques */}
          <Col xs={24}>
            <Card
              title={
                <Space>
                  <HomeOutlined style={{ color: "#8b5cf6" }} />
                  <span>Caractéristiques du bien</span>
                </Space>
              }
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <Row gutter={16}>
                <Col xs={12} md={6}>
                  <Form.Item
                    label={<Text strong>Surface (m²)</Text>}
                    name="surface"
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: "8px" }}
                      min={1}
                      size="large"
                      placeholder="45"
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item
                    label={<Text strong>Nombre de pièces</Text>}
                    name="pieces"
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: "8px" }}
                      min={1}
                      size="large"
                      placeholder="3"
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item
                    label={<Text strong>Chambres</Text>}
                    name="nombreDeChambres"
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: "8px" }}
                      min={0}
                      size="large"
                      placeholder="2"
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item
                    label={<Text strong>Salles de bain</Text>}
                    name="salleDeBains"
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: "8px" }}
                      min={0}
                      size="large"
                      placeholder="1"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<Text strong>Capacité d'accueil</Text>}
                    name="capacite"
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: "8px" }}
                      min={1}
                      size="large"
                      placeholder="4"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Boutons d'action */}
          <Col xs={24}>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <Space
                size="middle"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Button
                  size="large"
                  onClick={() => navigate("/bailleur/annonces")}
                  style={{
                    borderRadius: "8px",
                    minWidth: "120px",
                  }}
                >
                  Annuler
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SaveOutlined />}
                  size="large"
                  style={{
                    borderRadius: "8px",
                    minWidth: "200px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    border: "none",
                  }}
                >
                  Enregistrer les modifications
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Modal de prévisualisation */}
      <Image
        style={{ display: "none" }}
        src={previewImage}
        preview={{
          visible: previewVisible,
          onVisibleChange: (visible) => setPreviewVisible(visible),
          title: previewTitle,
        }}
      />
    </div>
  );
};

export default ModifierAnnonce;
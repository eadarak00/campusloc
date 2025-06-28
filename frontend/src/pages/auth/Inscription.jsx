import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  message,
  Spin,
  notification,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/inscription.css";
import {
  checkEmailExists,
  register,
  validerCode,
  resendCode,
  inscriptionBailleur,
} from "../../api/auth";

const { Option } = Select;

const verifierEmail = async (email) => {
  try {
    const response = await checkEmailExists(email);
    return {
      exists: response.data?.exists || false,
      valid: true,
    };
  } catch (err) {
    console.error("Erreur API :", err);
    return {
      exists: false,
      valid: false,
      error: err,
    };
  }
};

const renvoyerCode = async (email) => {
  try {
    const response = await resendCode(email);

    return {
      success: true,
      message: response.data?.message || "Code renvoyé",
      email: response.data?.email,
      timestamp: response.data?.timestamp,
    };
  } catch (err) {
    console.error("Erreur API :", err);

    return {
      success: false,
      error: err?.response?.data?.message || "Erreur inconnue",
    };
  }
};

// Services API
const AuthService = {
  async checkEmail(email) {
    try {
      const response = await this.checkEmailExists(email);
      return {
        exists: response.data?.exists || false,
        valid: true,
      };
    } catch (error) {
      console.error("Erreur vérification email:", error);
      return {
        exists: false,
        valid: false,
        error: error.response?.data || error.message,
      };
    }
  },

  async verifyCode(email, code) {
    try {
      const response = await validerCode({ email, code });
      return response.data;
    } catch (error) {
      console.error("Erreur vérification code:", error);
      throw error;
    }
  },
};

// Utilitaires de validation
const ValidationUtils = {
  validatePassword(password) {
    const errors = [];
    if (password.length < 8) errors.push("Au moins 8 caractères");
    if (!/[A-Z]/.test(password)) errors.push("Au moins une majuscule");
    if (!/[a-z]/.test(password)) errors.push("Au moins une minuscule");
    if (!/[0-9]/.test(password)) errors.push("Au moins un chiffre");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("Au moins un caractère spécial");
    return errors;
  },

  validatePhone(phone) {
    const phoneRegex = /^(?:\+221|00221|0)(7[05678])[0-9]{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, ""); // supprime tout sauf chiffres

    if (cleaned.startsWith("221")) {
      return "+221" + cleaned.slice(3); // 221778123456 → +221778123456
    } else if (cleaned.startsWith("00221")) {
      return "+221" + cleaned.slice(5); // 00221778123456 → +221778123456
    } else if (cleaned.startsWith("7")) {
      return "+221" + cleaned; // 778123456 → +221778123456
    } else if (cleaned.startsWith("0")) {
      return "+221" + cleaned.slice(1); // 0778123456 → +221778123456
    }

    return phone; // sinon on retourne tel quel
  },
};

const Inscription = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("prospect");
  const [currentStep, setCurrentStep] = useState("inscription"); // inscription, validation, success
  const [form] = Form.useForm();
  const [validationForm] = Form.useForm();

  // États de chargement et erreurs
  const [loading, setLoading] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [phoneChecking, setPhoneChecking] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // États métier
  const [userId, setUserId] = useState(null);
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(3);

  // Configuration des notifications
  const [api, contextHolder] = notification.useNotification();

  // Fonctions utilitaires pour les notifications
  const showSuccessNotification = (title, description, duration = 4.5) => {
    api.success({
      message: title,
      description: description,
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      duration: duration,
      placement: "topRight",
    });
  };

  const showErrorNotification = (title, description, duration = 4.5) => {
    api.error({
      message: title,
      description: description,
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      duration: duration,
      placement: "topRight",
    });
  };

  const showWarningNotification = (title, description, duration = 4.5) => {
    api.warning({
      message: title,
      description: description,
      icon: <WarningOutlined style={{ color: "#faad14" }} />,
      duration: duration,
      placement: "topRight",
    });
  };

  const showInfoNotification = (title, description, duration = 4.5) => {
    api.info({
      message: title,
      description: description,
      icon: <InfoCircleOutlined style={{ color: "#1890ff" }} />,
      duration: duration,
      placement: "topRight",
    });
  };

  // Timer pour le renvoi de code
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((timer) => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleToggle = (type) => {
    setUserType(type);
    form.resetFields();
  };

  // Validation en temps réel de l'email
  const handleEmailBlur = async (e) => {
    const email = e.target.value;
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;

    setEmailChecking(true);
    try {
      const result = await verifierEmail(email);
      if (result.exists) {
        form.setFields([
          {
            name: "email",
            errors: ["Cette adresse email est déjà utilisée"],
          },
        ]);
        showWarningNotification(
          "Email déjà utilisé",
          "Cette adresse email est déjà associée à un compte existant."
        );
      } else {
        showInfoNotification(
          "Email disponible",
          "Cette adresse email peut être utilisée pour votre inscription."
        );
      }
    } catch (error) {
      console.error("Erreur vérification email:", error);
      showErrorNotification(
        "Erreur de vérification",
        "Impossible de vérifier la disponibilité de l'email."
      );
    } finally {
      setEmailChecking(false);
    }
  };

  // Validation en temps réel du téléphone
  const handlePhoneBlur = async (e) => {
    const phone = e.target.value;
    if (!phone) return;

    const formattedPhone = ValidationUtils.formatPhone(phone);
    if (!ValidationUtils.validatePhone(formattedPhone)) {
      form.setFields([
        {
          name: "telephone",
          errors: ["Format de téléphone invalide"],
        },
      ]);
      showWarningNotification(
        "Format de téléphone invalide",
        "Veuillez utiliser un numéro de téléphone sénégalais valide (ex: +221771234567)."
      );
      return;
    }

    // Met à jour le champ avec le format correct
    form.setFieldsValue({ telephone: formattedPhone });
    showInfoNotification(
      "Numéro formaté",
      `Votre numéro a été formaté en ${formattedPhone}.`
    );
  };

  // Validation personnalisée du mot de passe
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Mot de passe requis"));
    }

    const errors = ValidationUtils.validatePassword(value);
    if (errors.length > 0) {
      return Promise.reject(
        new Error(`Mot de passe faible: ${errors.join(", ")}`)
      );
    }

    return Promise.resolve();
  };

  // Fonction pour la validation du code
  const handleCodeValidation = async (values) => {
    const { code } = values;

    if (attempts >= maxAttempts) {
      showErrorNotification(
        "Tentatives épuisées",
        "Vous avez atteint le nombre maximum de tentatives. Veuillez demander un nouveau code."
      );
      return;
    }

    setCodeLoading(true);

    try {
      const response = await AuthService.verifyCode(userEmail, code);

      showSuccessNotification(
        "Compte activé avec succès !",
        "Votre compte a été activé. Vous allez être redirigé vers la page de connexion.",
        3
      );

      setCurrentStep("success");

      // Redirection après quelques secondes
      setTimeout(() => {
        navigate("/connexion");
      }, 2000);
    } catch (error) {
      console.error("Erreur validation code:", error);

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= maxAttempts) {
        showErrorNotification(
          "Tentatives épuisées",
          "Nombre maximum de tentatives atteint. Veuillez demander un nouveau code de vérification."
        );
        validationForm.resetFields();
      } else {
        const errorMessage =
          error.response?.data?.message || "Code invalide ou expiré";
        showWarningNotification(
          "Code incorrect",
          `${errorMessage}. ${
            maxAttempts - newAttempts
          } tentative(s) restante(s).`
        );
        validationForm.setFields([
          {
            name: "code",
            errors: [errorMessage],
          },
        ]);
      }
    } finally {
      setCodeLoading(false);
    }
  };

  const onFinish = async (values) => {
    console.log("Début de onFinish");

    setLoading(true);

    try {
      const userData = {
        prenom: values.prenom.trim(),
        nom: values.nom.trim(),
        email: values.email.toLowerCase().trim(),
        telephone: ValidationUtils.formatPhone(values.telephone),
        motDePasse: values.motDePasse,
        // typeUtilisateur: userType, // Décommentez si nécessaire
      };
      console.log("Données préparées:", userData);

      // Appel à l'API d'inscription
      // const response = await register(userData);
      // console.log("Réponse API:", response);
      // Appel à l'API d'inscription avec le bon endpoint
      let response;
      if (userType === "bailleur") {
        response = await inscriptionBailleur(userData);
      } else {
        response = await register(userData);
      }
      console.log("Réponse API:", response);

      // Vérification du statut 201 CREATED
      if (response.status === 201) {
        const user = response.data;
        console.log("Données utilisateur:", user);

        // Stockage des informations pour l'étape de validation
        setUserId(user.id);
        setUserEmail(user.email || userData.email);
        setUserPhone(userData.telephone);
        console.log("States updated - avant setCurrentStep");

        // Notification de succès
        showSuccessNotification(
          "Inscription réussie !",
          "Votre compte a été créé avec succès. Un code de validation a été envoyé à votre adresse email."
        );

        setCurrentStep("validation");
        console.log("setCurrentStep appelé");

        setResendTimer(60); // 60 secondes avant de pouvoir renvoyer
      }
    } catch (error) {
      console.error("Erreur inscription:", error);

      // Gestion d'erreur améliorée selon le statut HTTP
      if (error.response?.status === 409) {
        showErrorNotification(
          "Compte existant",
          "Un compte existe déjà avec cet email ou ce numéro de téléphone."
        );
      } else if (error.response?.data?.message) {
        showErrorNotification(
          "Erreur d'inscription",
          error.response.data.message
        );
      } else {
        showErrorNotification(
          "Erreur technique",
          "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Renvoi du code de vérification
  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setResendLoading(true);

    try {
      await renvoyerCode(userEmail);
      showSuccessNotification(
        "Code renvoyé",
        "Un nouveau code de vérification a été envoyé à votre adresse email."
      );
      setResendTimer(60);
      setAttempts(0); // Reset des tentatives
      validationForm.resetFields();
    } catch (error) {
      console.error("Erreur renvoi code:", error);
      showErrorNotification(
        "Erreur de renvoi",
        "Impossible de renvoyer le code de vérification. Veuillez réessayer."
      );
    } finally {
      setResendLoading(false);
    }
  };

  // Retour à l'inscription
  const handleBackToInscription = () => {
    setCurrentStep("inscription");
    setUserId(null);
    setUserPhone("");
    setUserEmail("");
    setAttempts(0);
    setResendTimer(0);
    validationForm.resetFields();

    showInfoNotification(
      "Retour à l'inscription",
      "Vous pouvez maintenant modifier vos informations d'inscription."
    );
  };

  // // Écran de succès
  // if (currentStep === "success") {
  //   return (
  //     <>
  //       {contextHolder}
  //       <main className="inscription-container">
  //         <div className="inscription-wrapper">
  //           <div className="inscription-content">
  //             <div className="inscription-success">
  //               <div className="success-icon">✅</div>
  //               <h2>Compte activé avec succès !</h2>
  //               <p>
  //                 Votre compte a été activé. Vous allez être redirigé
  //                 vers la page de connexion.
  //               </p>
  //               <Spin size="large" />
  //             </div>
  //           </div>
  //         </div>
  //       </main>
  //     </>
  //   );
  // }

  // Écran de validation du code
  if (currentStep === "validation") {
    return (
      <>
        {contextHolder}
        <main className="inscription-container">
          <div className="inscription-wrapper">
            <div className="inscription-content">
              <div className="inscription-text-section">
                <div className="inscription-brand">
                  <h1 className="inscription-brand-title">Campusloc</h1>
                  <p className="inscription-brand-subtitle">
                    Votre plateforme immobilière de confiance
                  </p>
                </div>
                <div className="inscription-text-content">
                  <h2 className="inscription-main-title">
                    Validation de votre compte
                  </h2>
                  <p className="inscription-description">
                    Nous avons envoyé un code de validation à 6 chiffres à{" "}
                    <strong>{userEmail}</strong>. Saisissez-le ci-dessous pour
                    finaliser votre inscription.
                  </p>
                  <div className="inscription-features">
                    <div className="inscription-feature">
                      <div className="inscription-feature-icon">🔐</div>
                      <span>Sécurité renforcée</span>
                    </div>
                    <div className="inscription-feature">
                      <div className="inscription-feature-icon">⚡</div>
                      <span>Activation rapide</span>
                    </div>
                  </div>

                  {attempts > 0 && (
                    <div className="validation-warning">
                      <p>
                        ⚠️ {attempts}/{maxAttempts} tentatives utilisées
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="inscription-form-section">
                <div className="inscription-form-container">
                  <div className="inscription-form-header">
                    <h3 className="inscription-form-title">
                      Code de validation
                    </h3>
                    <p className="inscription-form-subtitle">
                      Entrez le code reçu par Email
                    </p>
                  </div>

                  <Form
                    form={validationForm}
                    name="validation"
                    onFinish={handleCodeValidation}
                    layout="vertical"
                    className="inscription-form"
                  >
                    <Form.Item
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez saisir le code de validation",
                        },
                        {
                          len: 6,
                          message: "Le code doit contenir 6 caractères",
                        },
                        {
                          pattern: /^[0-9]+$/,
                          message: "Le code ne doit contenir que des chiffres",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="000000"
                        className="inscription-code-input"
                        maxLength={6}
                        disabled={attempts >= maxAttempts}
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="inscription-submit-btn"
                        loading={codeLoading}
                        disabled={attempts >= maxAttempts}
                        block
                      >
                        {codeLoading ? "Validation..." : "Valider mon compte"}
                      </Button>
                    </Form.Item>

                    <div className="inscription-form-footer">
                      <Button
                        type="link"
                        className="inscription-link"
                        onClick={handleBackToInscription}
                      >
                        ← Retour à l'inscription
                      </Button>
                      <Button
                        type="link"
                        className="inscription-link"
                        onClick={handleResendCode}
                        loading={resendLoading}
                        disabled={resendTimer > 0 || resendLoading}
                      >
                        {resendTimer > 0
                          ? `Renvoyer dans ${resendTimer}s`
                          : resendLoading
                          ? "Envoi..."
                          : "Renvoyer le code"}
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Formulaire d'inscription principal
  return (
    <>
      {contextHolder}
      <main className="inscription-container">
        <div className="inscription-wrapper">
          <div className="inscription-content">
            <div className="inscription-text-section">
              <div className="inscription-brand">
                <h1 className="inscription-brand-title">Campusloc</h1>
                <p className="inscription-brand-subtitle">
                  Votre plateforme immobilière de confiance
                </p>
              </div>
              <div className="inscription-text-content">
                <h2 className="inscription-main-title">
                  {userType === "prospect"
                    ? "Trouvez votre logement idéal"
                    : "Gérez vos biens immobiliers"}
                </h2>
                <p className="inscription-description">
                  {userType === "prospect"
                    ? "Accédez à des milliers d'annonces vérifiées et trouvez rapidement le logement qui vous correspond."
                    : "Optimisez la gestion de vos biens immobiliers avec nos outils professionnels."}
                </p>
                <div className="inscription-features">
                  {userType === "prospect" ? (
                    <>
                      <div className="inscription-feature">
                        <div className="inscription-feature-icon">🏠</div>
                        <span>Annonces vérifiées</span>
                      </div>
                      <div className="inscription-feature">
                        <div className="inscription-feature-icon">🔍</div>
                        <span>Recherche avancée</span>
                      </div>
                      <div className="inscription-feature">
                        <div className="inscription-feature-icon">💬</div>
                        <span>Contact direct</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="inscription-feature">
                        <div className="inscription-feature-icon">📊</div>
                        <span>Tableau de bord</span>
                      </div>
                      <div className="inscription-feature">
                        <div className="inscription-feature-icon">💰</div>
                        <span>Suivi des revenus</span>
                      </div>
                      <div className="inscription-feature">
                        <div className="inscription-feature-icon">🛠️</div>
                        <span>Outils de gestion</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="inscription-form-section">
              <div className="inscription-form-container">
                <div className="inscription-toggle">
                  <button
                    className={`inscription-toggle-btn ${
                      userType === "prospect" ? "active" : ""
                    }`}
                    onClick={() => handleToggle("prospect")}
                  >
                    Locataire
                  </button>
                  <button
                    className={`inscription-toggle-btn ${
                      userType === "bailleur" ? "active" : ""
                    }`}
                    onClick={() => handleToggle("bailleur")}
                  >
                    Propriétaire
                  </button>
                </div>

                <div className="inscription-form-header">
                  <h3 className="inscription-form-title">Créer un compte</h3>
                  <p className="inscription-form-subtitle">
                    {userType === "prospect"
                      ? "Rejoignez nos locataires"
                      : "Rejoignez nos propriétaires"}
                  </p>
                </div>

                <Form
                  form={form}
                  name="inscription"
                  onFinish={onFinish}
                  layout="vertical"
                  className="inscription-form"
                >
                  <div className="inscription-form-row">
                    <Form.Item
                      name="prenom"
                      rules={[
                        { required: true, message: "Prénom requis" },
                        { min: 2, message: "Prénom trop court" },
                        { max: 50, message: "Prénom trop long" },
                      ]}
                      className="inscription-form-item-half"
                    >
                      <Input
                        size="large"
                        placeholder="Prénom"
                        prefix={<UserOutlined />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="nom"
                      rules={[
                        { required: true, message: "Nom requis" },
                        { min: 2, message: "Nom trop court" },
                        { max: 50, message: "Nom trop long" },
                      ]}
                      className="inscription-form-item-half"
                    >
                      <Input
                        size="large"
                        placeholder="Nom"
                        prefix={<UserOutlined />}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: "Email requis" },
                      { type: "email", message: "Format email invalide" },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="Adresse email"
                      prefix={<MailOutlined />}
                      suffix={emailChecking ? <Spin size="small" /> : null}
                      onBlur={handleEmailBlur}
                    />
                  </Form.Item>

                  <Form.Item
                    name="telephone"
                    rules={[{ required: true, message: "Téléphone requis" }]}
                  >
                    <Input
                      size="large"
                      placeholder="Numéro de téléphone (+221...)"
                      prefix={<PhoneOutlined />}
                      suffix={phoneChecking ? <Spin size="small" /> : null}
                      onBlur={handlePhoneBlur}
                    />
                  </Form.Item>

                  {userType === "bailleur" && (
                    <Form.Item
                      name="nombreBiens"
                      rules={[
                        { required: true, message: "Nombre de biens requis" },
                      ]}
                    >
                      <Select
                        size="large"
                        placeholder="Nombre de biens à gérer"
                        suffixIcon={<HomeOutlined />}
                      >
                        <Option value="1">1 bien</Option>
                        <Option value="2-5">2 à 5 biens</Option>
                        <Option value="6-10">6 à 10 biens</Option>
                        <Option value="10+">Plus de 10 biens</Option>
                      </Select>
                    </Form.Item>
                  )}

                  <Form.Item
                    name="motDePasse"
                    rules={[{ validator: validatePassword }]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="Mot de passe (8+ caractères, majuscule, chiffre, symbole)"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmerMotDePasse"
                    dependencies={["motDePasse"]}
                    rules={[
                      { required: true, message: "Confirmation requise" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("motDePasse") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Les mots de passe ne correspondent pas")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="Confirmer le mot de passe"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="inscription-submit-btn"
                      loading={loading}
                      block
                    >
                      {loading ? "Création du compte..." : "Créer mon compte"}
                    </Button>
                  </Form.Item>

                  <div className="inscription-form-footer">
                    <span>Déjà un compte ? </span>
                    <a href="/connexion" className="inscription-link">
                      Se connecter
                    </a>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Inscription;

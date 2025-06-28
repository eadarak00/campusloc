import React, { useState } from "react";
import { Eye, EyeOff, Fingerprint, Mail, Lock } from "lucide-react";
import { notification } from "antd";
import { login } from "../../api/auth";
import "../../styles/auth/connexion.css";
import { Link } from "react-router-dom";

const Connexion = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Configuration des notifications
  const [notificationApi, contextHolder] = notification.useNotification();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      notification.warning({
        message: "Formulaire incomplet",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Appel API centralisé avec login()
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      // Vérification du succès de la réponse
      if (response.status === 200 || response.data.success) {
        // Extraction des données utilisateur
        const userData = response.data.data?.user || response.data.user;
        const token =
          response.data.data?.access_token ||
          response.data.access_token ||
          response.data.token;

        notificationApi.success({
          message: "Connexion réussie",
          description: `Bienvenue ${
            userData?.nom ||
            userData?.name ||
            userData?.prenom ||
            "sur CampusLoc"
          } !`,
          placement: "topRight",
          duration: 4,
        });

        // Stockage des informations d'authentification
        if (token) {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("user_data", JSON.stringify(userData));

          // Stockage optionnel du refresh token si présent
          const refreshToken =
            response.data.data?.refresh_token || response.data.refresh_token;
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }
        }

        // Log pour débogage
        console.log("Utilisateur connecté:", userData);
        console.log("Token stocké:", token);

        // Redirection après connexion réussie
        setTimeout(() => {
          // Remplacez par votre logique de redirection
          // window.location.href = '/dashboard';
          // ou avec React Router : navigate('/dashboard');
          console.log("Redirection vers le dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);

      // Gestion des erreurs avec les codes de statut
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            notificationApi.error({
              message: "Données invalides",
              description:
                data.message ||
                data.error ||
                "Vérifiez vos informations de connexion.",
              placement: "topRight",
              duration: 4,
            });
            break;

          case 401:
            notificationApi.error({
              message: "Identifiants incorrects",
              description: data.message || "Email ou mot de passe incorrect.",
              placement: "topRight",
              duration: 4,
            });
            break;

          case 403:
            notificationApi.error({
              message: "Compte non autorisé",
              description:
                data.message || "Votre compte est désactivé ou bloqué",
              placement: "topRight",
              duration: 4,
            });
            break;

          case 500:
            notificationApi.error({
              message: "Erreur serveur",
              description:
                "Une erreur est survenue côté serveur. Veuillez réessayer plus tard.",
              placement: "topRight",
              duration: 4,
            });
            break;

          default:
            notificationApi.error({
              message: "Erreur de connexion",
              description:
                data.message ||
                data.error ||
                "Une erreur inattendue est survenue.",
              placement: "topRight",
              duration: 4,
            });
        }
      } else if (error.request) {
        // Erreur réseau
        notificationApi.error({
          message: "Erreur réseau",
          description:
            "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
          placement: "topRight",
          duration: 4,
        });
      } else {
        // Erreur inattendue
        notificationApi.error({
          message: "Erreur inattendue",
          description: "Une erreur inattendue est survenue.",
          placement: "topRight",
          duration: 4,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    console.log("social media link");

    // try {
    //   notification.info({
    //     message: `Connexion ${provider}`,
    //     description: `Redirection vers ${provider}...`,
    //     placement: 'topRight',
    //     duration: 2,
    //   });

    //   // Redirection vers l'endpoint de connexion sociale
    //   // const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    //   // window.location.href = `${baseUrl}/v1/auth/social/${provider.toLowerCase()}`;

    // } catch (error) {
    //   console.error(`Erreur connexion ${provider}:`, error);
    //   notification.error({
    //     message: 'Erreur de connexion sociale',
    //     description: `Impossible de se connecter avec ${provider}. Veuillez réessayer.`,
    //     placement: 'topRight',
    //     duration: 4,
    //   });
    // }
  };

  const handleForgotPassword = async () => {
    console.log("mot de passe oublie");

    // if (!formData.email) {
    //   notification.warning({
    //     message: 'Email requis',
    //     description: 'Veuillez saisir votre email pour réinitialiser votre mot de passe.',
    //     placement: 'topRight',
    //     duration: 3,
    //   });
    //   return;
    // }

    // try {
    //   // Note: Vous devrez ajouter cette fonction dans votre auth.js
    //   // await forgotPassword({ email: formData.email });

    //   // Simulation pour l'instant
    //   console.log('Demande de réinitialisation pour:', formData.email);

    //   notification.success({
    //     message: 'Email envoyé',
    //     description: 'Un lien de réinitialisation a été envoyé à votre adresse email.',
    //     placement: 'topRight',
    //     duration: 5,
    //   });

    // } catch (error) {
    //   console.error('Erreur mot de passe oublié:', error);
    //   notification.error({
    //     message: 'Erreur',
    //     description: error.response?.data?.message || 'Impossible d\'envoyer l\'email de réinitialisation.',
    //     placement: 'topRight',
    //     duration: 4,
    //   });
    // }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      {contextHolder}
      <div className="auth-container">
        <header className="auth-header">
          <h1 className="auth-logo">CampusLoc</h1>
        </header>

        <main className="auth-main">
          {/* Section Formulaire */}
          <section className="auth-form-section">
            <div className="auth-form-container">
              {/* En-tête du formulaire */}
              <div className="auth-form-header">
                <h2 className="auth-title">Bonjour!</h2>
                <p className="auth-description">
                  Pour vous connecter à votre compte, renseignez votre adresse
                  email ainsi que votre mot de passe
                </p>
              </div>

              {/* Formulaire */}
              <form className="auth-form" onSubmit={handleSubmit}>
                {/* Champ Email */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <Mail className="auth-input-icon" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange("email")}
                      placeholder="Votre adresse email"
                      className={`auth-form-input ${
                        errors.email ? "auth-input-error" : ""
                      }`}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "auth-email-error" : undefined
                      }
                    />
                  </div>
                  {errors.email && (
                    <span
                      id="auth-email-error"
                      className="auth-error-message"
                      role="alert"
                    >
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Champ Mot de passe */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <Lock className="auth-input-icon" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange("password")}
                      placeholder="Votre mot de passe"
                      className={`auth-form-input ${
                        errors.password ? "auth-input-error" : ""
                      }`}
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "auth-password-error" : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="auth-password-toggle"
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span
                      id="auth-password-error"
                      className="auth-error-message"
                      role="alert"
                    >
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Mot de passe oublié */}
                <div className="auth-forgot-password">
                  <button
                    type="button"
                    className="auth-forgot-password-link"
                    onClick={handleForgotPassword}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                {/* Bouton de connexion */}
                <button
                  type="submit"
                  className="auth-submit-button"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? "Connexion..." : "Se connecter"}
                </button>
              </form>

              {/* Séparateur */}
              <div className="auth-divider">
                <span className="auth-divider-text">Ou avec</span>
              </div>

              {/* Boutons de connexion sociale */}
              <div className="auth-buttons">
                <div className="auth-social-buttons">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Google")}
                    className="auth-social-button google-button"
                  >
                    <span className="google-icon">G</span>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin("Apple")}
                    className="auth-social-button apple-button"
                  >
                    <span className="apple-icon">🍎</span>
                    <span>Apple</span>
                  </button>
                </div>

                {/* Lien inscription */}
                <div className="auth-signup-link">
                  <span>Je n'ai pas de compte? </span>
                  <Link to="/inscription" className="auth-signup-button">
                    S'inscrire
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Section Illustration */}
          <section className="auth-illustration-section">
            <div className="auth-illustration-container">
              <div className="auth-illustration-content">
                <Fingerprint size={80} className="auth-fingerprint-icon" />
                <h3 className="auth-illustration-title">Sécurité Garantie</h3>
                <p className="auth-illustration-text">
                  Votre connexion est protégée par nos systèmes de sécurité
                  avancés
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Connexion;

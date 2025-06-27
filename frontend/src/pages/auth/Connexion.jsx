import React, { useState } from "react";
import { Eye, EyeOff, Fingerprint, Mail, Lock } from "lucide-react";
import "../../styles/auth/connexion.css"

const Connexion = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
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

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Connexion avec:", formData);
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Connexion avec ${provider}`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
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
            <div className="auth-form">
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
                <button type="button" className="auth-forgot-password-link">
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Bouton de connexion */}
              <button
                type="button"
                onClick={handleSubmit}
                className="auth-submit-button"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </button>
            </div>

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
              <button type="button" className="auth-signup-button">
                S'inscrire
              </button>
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
  );
};

export default Connexion;

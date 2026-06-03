import React, { useState, useContext } from "react";
import { Form, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import heroCover from "../assets/images/hero-img02.jpg";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import { BASE_URL } from "../utils/config";

const Register = () => {
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.message || t("auth.registerFailed"));
        return;
      }

      setSuccess(true);
      dispatch({ type: "REGISTER_SUCCESS" });
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.message || t("toast.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      coverImage={heroCover}
      eyebrow={t("auth.registerEyebrow")}
      title={t("auth.registerCoverTitle")}
      description={t("auth.registerCoverDesc")}
      alternateLink={
        <>
          {t("auth.hasAccount")}
          <Link to="/login">{t("auth.signIn")}</Link>
        </>
      }
    >
      <div className="auth-form__header">
        <h2>{t("auth.registerTitle")}</h2>
        <p>{t("auth.registerSubtitle")}</p>
      </div>

      {error && (
        <div className="auth-message auth-message--error" role="alert">
          <i className="ri-error-warning-line"></i>
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="auth-message auth-message--success" role="status">
          <i className="ri-checkbox-circle-line"></i>
          <span>{t("auth.registerSuccess")}</span>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="username">{t("auth.username")}</label>
            <div className="auth-field__input">
              <i className="ri-user-line"></i>
              <input
                type="text"
                id="username"
                placeholder={t("auth.usernamePlaceholder")}
                value={credentials.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="email">{t("auth.email")}</label>
            <div className="auth-field__input">
              <i className="ri-mail-line"></i>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={credentials.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">{t("auth.password")}</label>
            <div className="auth-field__input">
              <i className="ri-lock-password-line"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-field__toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? t("auth.hidePassword") : t("auth.showPassword")
                }
              >
                <i
                  className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}
                ></i>
              </button>
            </div>
            <p className="auth-field__hint">{t("auth.passwordHint")}</p>
          </div>

          <Button className="btn auth-submit" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <i className="ri-loader-4-line"></i>
                {t("auth.creating")}
              </>
            ) : (
              <>
                {t("auth.createAccount")}
                <i className="ri-arrow-right-line"></i>
              </>
            )}
          </Button>
        </Form>
      )}
    </AuthLayout>
  );
};

export default Register;

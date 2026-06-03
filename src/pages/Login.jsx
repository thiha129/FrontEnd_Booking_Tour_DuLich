import React, { useState, useContext, useEffect } from "react";
import { Form, Button } from "reactstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import heroCover from "../assets/images/hero-img01.jpg";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import { BASE_URL } from "../utils/config";

const Login = () => {
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { dispatch, error: authError, loading, user, initializing } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";
  const displayError = localError || authError;

  useEffect(() => {
    if (!initializing && user) {
      navigate(from, { replace: true });
    }
  }, [user, initializing, navigate, from]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLocalError(null);
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "post",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      const result = await res.json();
      if (!res.ok) {
        setLocalError(result.message || t("auth.loginFailed"));
        dispatch({ type: "LOGIN_FAILURE", payload: result.message });
        return;
      }
      dispatch({ type: "LOGIN_SUCCESS", payload: result.data });
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || t("toast.errorGeneric"));
      dispatch({ type: "LOGIN_FAILURE", payload: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      coverImage={heroCover}
      eyebrow={t("auth.loginEyebrow")}
      title={t("auth.loginCoverTitle")}
      description={t("auth.loginCoverDesc")}
      alternateLink={
        <>
          {t("auth.noAccount")}
          <Link to="/register">{t("auth.signUpFree")}</Link>
        </>
      }
    >
      <div className="auth-form__header">
        <h2>{t("auth.loginTitle")}</h2>
        <p>{t("auth.loginSubtitle")}</p>
      </div>

      {displayError && (
        <div className="auth-message auth-message--error" role="alert">
          <i className="ri-error-warning-line"></i>
          <span>{displayError}</span>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
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
              autoComplete="current-password"
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
        </div>

        <Button
          className="btn auth-submit"
          type="submit"
          disabled={submitting || loading}
        >
          {submitting || loading ? (
            <>
              <i className="ri-loader-4-line"></i>
              {t("auth.signingIn")}
            </>
          ) : (
            <>
              {t("auth.signIn")}
              <i className="ri-arrow-right-line"></i>
            </>
          )}
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default Login;

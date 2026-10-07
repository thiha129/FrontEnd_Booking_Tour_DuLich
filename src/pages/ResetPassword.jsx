import React, { useMemo, useState } from "react";
import { Form, Button } from "reactstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import heroCover from "../assets/images/hero-img01.jpg";
import { useLanguage } from "../i18n/LanguageContext";
import { BASE_URL } from "../utils/config";

const ResetPassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError(t("auth.resetInvalidToken"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.passwordHint"));
      return;
    }

    if (password !== confirm) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.message || t("auth.resetFailed"));
        return;
      }

      setSuccess(result.message || t("auth.resetSuccess"));
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setError(err.message || t("toast.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      coverImage={heroCover}
      eyebrow={t("auth.resetEyebrow")}
      title={t("auth.resetCoverTitle")}
      description={t("auth.resetCoverDesc")}
      alternateLink={
        <>
          {t("auth.rememberPassword")}
          <Link to="/login">{t("auth.signIn")}</Link>
        </>
      }
    >
      <div className="auth-form__header">
        <h2>{t("auth.resetTitle")}</h2>
        <p>{t("auth.resetSubtitle")}</p>
      </div>

      {!token && (
        <div className="auth-message auth-message--error" role="alert">
          <i className="ri-error-warning-line"></i>
          <span>{t("auth.resetInvalidToken")}</span>
        </div>
      )}

      {error && (
        <div className="auth-message auth-message--error" role="alert">
          <i className="ri-error-warning-line"></i>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="auth-message auth-message--success" role="status">
          <i className="ri-checkbox-circle-line"></i>
          <span>{success}</span>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="password">{t("auth.newPassword")}</label>
          <div className="auth-field__input">
            <i className="ri-lock-password-line"></i>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={submitting || !token}
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
              <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
            </button>
          </div>
          <small>{t("auth.passwordHint")}</small>
        </div>

        <div className="auth-field">
          <label htmlFor="confirm">{t("auth.confirmPassword")}</label>
          <div className="auth-field__input">
            <i className="ri-lock-password-line"></i>
            <input
              type={showPassword ? "text" : "password"}
              id="confirm"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              disabled={submitting || !token}
              autoComplete="new-password"
            />
          </div>
        </div>

        <Button
          className="btn auth-submit"
          type="submit"
          disabled={submitting || !token}
        >
          {submitting ? (
            <>
              <i className="ri-loader-4-line"></i>
              {t("auth.updatingPassword")}
            </>
          ) : (
            <>
              {t("auth.updatePassword")}
              <i className="ri-check-line"></i>
            </>
          )}
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default ResetPassword;

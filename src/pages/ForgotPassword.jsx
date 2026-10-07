import React, { useState } from "react";
import { Form, Button } from "reactstrap";
import { Link } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import heroCover from "../assets/images/hero-img01.jpg";
import { useLanguage } from "../i18n/LanguageContext";
import { BASE_URL } from "../utils/config";

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [devResetUrl, setDevResetUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setDevResetUrl(null);

    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.message || t("auth.forgotFailed"));
        return;
      }

      setSuccess(result.message || t("auth.forgotSuccess"));
      if (result.resetUrl) setDevResetUrl(result.resetUrl);
    } catch (err) {
      setError(err.message || t("toast.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      coverImage={heroCover}
      eyebrow={t("auth.forgotEyebrow")}
      title={t("auth.forgotCoverTitle")}
      description={t("auth.forgotCoverDesc")}
      alternateLink={
        <>
          {t("auth.rememberPassword")}
          <Link to="/login">{t("auth.signIn")}</Link>
        </>
      }
    >
      <div className="auth-form__header">
        <h2>{t("auth.forgotTitle")}</h2>
        <p>{t("auth.forgotSubtitle")}</p>
      </div>

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

      {devResetUrl && (
        <div className="auth-message auth-message--info" role="status">
          <i className="ri-links-line"></i>
          <span>
            {t("auth.devResetLink")}:{" "}
            <Link
              to={`/reset-password?token=${encodeURIComponent(
                new URL(devResetUrl).searchParams.get("token") || "",
              )}`}
            >
              {t("auth.openResetLink")}
            </Link>
          </span>
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
              autoComplete="email"
              disabled={submitting}
            />
          </div>
        </div>

        <Button className="btn auth-submit" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <i className="ri-loader-4-line"></i>
              {t("auth.sendingReset")}
            </>
          ) : (
            <>
              {t("auth.sendResetLink")}
              <i className="ri-mail-send-line"></i>
            </>
          )}
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default ForgotPassword;

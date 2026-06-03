import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo3.png";
import LanguageSwitcher from "../LanguageSwitcher";
import { useLanguage } from "../../i18n/LanguageContext";
import "../../styles/login.css";

const AuthLayout = ({
  coverImage,
  eyebrow,
  title,
  description,
  children,
  alternateLink,
}) => {
  const { t } = useLanguage();

  return (
    <div className="auth-page">
      <LanguageSwitcher />
      <aside
        className="auth-page__cover"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="auth-page__cover-overlay" />
        <div className="auth-page__cover-inner">
          <Link to="/home" className="auth-page__brand">
            <img src={logo} alt="Travel Booking" />
          </Link>

          <div className="auth-page__cover-text">
            {eyebrow && <span className="auth-page__eyebrow">{eyebrow}</span>}
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="auth-page__cover-footer">
            <div className="auth-page__stat">
              <strong>2k+</strong>
              <span>{t("auth.happyTravelers")}</span>
            </div>
            <div className="auth-page__stat">
              <strong>120+</strong>
              <span>{t("auth.destinations")}</span>
            </div>
            <div className="auth-page__stat">
              <strong>4.9</strong>
              <span>{t("auth.avgRating")}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="auth-page__main">
        <div className="auth-page__form-wrap">
          <Link to="/home" className="auth-page__back">
            <i className="ri-arrow-left-line"></i>
            {t("auth.backHome")}
          </Link>

          {children}

          {alternateLink && (
            <div className="auth-page__switch">{alternateLink}</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;

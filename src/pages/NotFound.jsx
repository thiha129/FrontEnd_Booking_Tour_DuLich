import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "reactstrap";
import { useLanguage } from "../i18n/LanguageContext";
import "../styles/not-found.css";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <section className="not-found-section">
      <Container>
        <div className="not-found__content text-center">
          <span className="not-found__code">404</span>
          <h1>{t("notFound.title")}</h1>
          <p>{t("notFound.desc")}</p>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <Button className="btn primary__btn">
              <Link to="/home">{t("common.backHome")}</Link>
            </Button>
            <Button className="btn secondary__btn">
              <Link to="/tours">{t("notFound.browseTours")}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NotFound;

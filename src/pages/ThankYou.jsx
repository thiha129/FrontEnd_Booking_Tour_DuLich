import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";
import "../styles/thank-you.css";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

const ThankYou = () => {
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  const { state } = useLocation();
  const { tourName, totalPrice, bookingId } = state || {};

  return (
    <section className="thank-you-section">
      <Container>
        <Row>
          <Col lg="12" className="pt-5 text-center">
            <div className="thank__you">
              <span>
                <i className="ri-checkbox-circle-line"></i>
              </span>
              <h1 className="mb-3 fw-semibold">{t("thankYou.title")}</h1>
              <h3 className="mb-3">{t("thankYou.subtitle")}</h3>

              {(tourName || bookingId) && (
                <div className="thank-you__details">
                  {tourName && (
                    <p>
                      <strong>{t("thankYou.tourLabel")}:</strong> {tourName}
                    </p>
                  )}
                  {totalPrice != null && (
                    <p>
                      <strong>{t("booking.total")}:</strong> ${totalPrice}
                    </p>
                  )}
                  {bookingId && (
                    <p className="thank-you__ref">
                      {t("thankYou.bookingRef")}:{" "}
                      <code>{String(bookingId).slice(-8).toUpperCase()}</code>
                    </p>
                  )}
                </div>
              )}

              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Button className="btn primary__btn thank-you__btn">
                  <Link to="/home">{t("common.backHome")}</Link>
                </Button>
                {user && (
                  <Button className="btn secondary__btn thank-you__btn">
                    <Link to={`/userinfo/${user._id}`}>
                      {t("thankYou.viewBookings")}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default ThankYou;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";
import CommonSection from "../shared/CommonSection";
import TourCard from "../shared/TourCard";
import Newsletter from "../shared/Newsletter";
import { useWishlist } from "../context/WishlistContext";
import { useLanguage } from "../i18n/LanguageContext";
import "../styles/wishlist.css";

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <CommonSection title={t("wishlist.title")} />
      <section className="wishlist-section pt-0">
        <Container>
          {wishlist.length === 0 ? (
            <div className="wishlist-empty text-center">
              <i className="ri-heart-line"></i>
              <h3>{t("wishlist.emptyTitle")}</h3>
              <p>{t("wishlist.emptyDesc")}</p>
              <Button className="btn primary__btn">
                <Link to="/tours">{t("common.exploreTours")}</Link>
              </Button>
            </div>
          ) : (
            <Row>
              {wishlist.map((tour) => (
                <Col lg="3" md="6" xs="12" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default Wishlist;

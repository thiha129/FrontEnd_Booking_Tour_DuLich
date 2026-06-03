import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import "./tour-card.css";
import calculateAvgRating from "../utils/avgRating";
import { useWishlist } from "../context/WishlistContext";
import { useLanguage } from "../i18n/LanguageContext";

const TourCard = ({ tour }) => {
  const { _id, title, city, photo, price, featured, reviews } = tour;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t } = useLanguage();

  const { totalRating, avgRating } = calculateAvgRating(reviews);
  const saved = isInWishlist(_id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(tour);
  };

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
          <img src={photo} alt="tour-img" />
          {featured && <span>{t("common.featured")}</span>}
          <button
            type="button"
            className={`tour__wishlist-btn ${saved ? "active" : ""}`}
            onClick={handleWishlistClick}
            aria-label={saved ? t("common.removeWishlist") : t("common.addWishlist")}
          >
            <i className={saved ? "ri-heart-fill" : "ri-heart-line"}></i>
          </button>
        </div>
        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="tour__location d-flex align-items-center justify-content-center gap-1">
              <i className="ri-map-pin-line"></i>
              {city}
            </span>
            <span className="tour__rating d-flex align-items-center justify-content-center gap-1">
              <i className="ri-star-fill"></i>
              {avgRating === 0 ? null : avgRating}
              {totalRating === 0 ? (
                t("common.notRated")
              ) : (
                <span>({reviews.length})</span>
              )}
            </span>
          </div>
          <h5 className="tour__title">
            <Link to={`/tours/${_id}`}>{title}</Link>
          </h5>
          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              ${price}
              <span> {t("common.perPerson")}</span>
            </h5>
            <button className="btn booking__btn">
              <Link to={`/tours/${_id}`}>{t("common.bookNow")}</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
export default TourCard;

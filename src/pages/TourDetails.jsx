import React, { useRef, useState, useEffect, useContext, useMemo } from "react";
import Slider from "react-slick";
import "../styles/tour-detail.css";
import { Container, Row, Col, Form, ListGroup } from "reactstrap";
import { useParams } from "react-router-dom";

import calculateAvgRating from "../utils/avgRating";
import { parseTourDescription } from "../utils/parseTourDescription";
import avatar from "../assets/images/avatar.jpg";
import Booking from "../components/Booking/Booking";
import Newsletter from "../shared/Newsletter";

import useFetch from "./../hooks/useFetch";
import { BASE_URL } from "./../utils/config";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../i18n/LanguageContext";

const TourDetails = () => {
  const { toast, promptLogin } = useToast();
  const { t, language } = useLanguage();
  const { id } = useParams();
  const reviewMsgRef = useRef("");
  const [tourRating, setTourRating] = useState();
  const { user } = useContext(AuthContext);

  const { data: fetchedTour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);
  const [tour, setTour] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (fetchedTour) {
      setTour(fetchedTour);
    }
  }, [fetchedTour]);

  const galleryImages = useMemo(() => {
    if (!tour) return [];

    if (Array.isArray(tour.photos) && tour.photos.length > 0) {
      return tour.photos.filter(Boolean);
    }

    if (typeof tour.photo === "string" && tour.photo.includes(",")) {
      return tour.photo
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return tour.photo ? [tour.photo] : [];
  }, [tour]);

  const hasGallery = galleryImages.length > 1;

  const avgRating = useMemo(
    () => calculateAvgRating(tour?.reviews || []).avgRating,
    [tour?.reviews],
  );

  const descriptionBlocks = useMemo(
    () => parseTourDescription(tour?.desc).blocks,
    [tour?.desc],
  );

  const userHasReviewed = useMemo(() => {
    if (!user?._id || !tour?.reviews?.length) return false;
    return tour.reviews.some(
      (review) =>
        String(review.userId) === String(user._id) ||
        review.username === user.username,
    );
  }, [tour?.reviews, user]);

  const sliderSettings = {
    dots: hasGallery,
    infinite: hasGallery,
    autoplay: hasGallery,
    autoplaySpeed: 4000,
    speed: 700,
    fade: true,
    arrows: hasGallery,
    pauseOnHover: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_current, next) => setActiveIndex(next),
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
    sliderRef.current?.slickGoTo(index);
  };

  const dateOptions = { day: "numeric", month: "long", year: "numeric" };

  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    try {
      if (!user || user === undefined || user === null) {
        return promptLogin(t("toast.signInToReview"));
      }

      if (!tourRating) {
        return toast.warning(t("toast.selectRating"));
      }

      const res = await fetch(`${BASE_URL}/review/${id}`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          reviewText,
          rating: tourRating,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          return toast.warning(t("toast.alreadyReviewed"));
        }
        return toast.error(result.message || t("toast.reviewFailed"));
      }
      toast.success(result.message || t("toast.reviewSuccess"));
      setTour((prev) => ({
        ...prev,
        reviews: [...(prev?.reviews || []), result.data],
      }));
      reviewMsgRef.current.value = "";
      setTourRating(undefined);
    } catch (err) {
      toast.error(err.message || t("toast.errorGeneric"));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setActiveIndex(0);
  }, [id, tour]);

  const facts = tour
    ? [
        {
          icon: "ri-map-pin-2-line",
          label: t("tours.city"),
          value: tour.city,
        },
        {
          icon: "ri-money-dollar-circle-line",
          label: t("tours.priceFrom"),
          value: `$${tour.price}${t("common.perPerson")}`,
        },
        {
          icon: "ri-route-line",
          label: t("tours.distance"),
          value: `${tour.distance} km`,
        },
        {
          icon: "ri-group-line",
          label: t("tours.maxGroup"),
          value: `${tour.maxGroupSize} ${t("tours.people")}`,
        },
      ]
    : [];

  return (
    <>
      <section className="tour-detail-section">
        <Container>
          {loading && (
            <h4 className="loading-state text-center pt-5">
              {t("common.loading")}
            </h4>
          )}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && tour && (
            <Row className="tour-detail-layout">
              <Col lg="8">
                <div className="tour__content">
                  <div className="tour__media">
                    <div className="tour__slider-wrap">
                      {hasGallery ? (
                        <Slider
                          ref={sliderRef}
                          {...sliderSettings}
                          className="tour__slider"
                        >
                          {galleryImages.map((img, index) => (
                            <div
                              key={`${img}-${index}`}
                              className="tour__slide"
                            >
                              <img
                                src={img}
                                alt={`${tour.title}-${index + 1}`}
                                className="tour__main-image"
                              />
                            </div>
                          ))}
                        </Slider>
                      ) : (
                        <img
                          src={galleryImages[0] || tour.photo}
                          alt={tour.title}
                          className="tour__main-image"
                        />
                      )}
                      {galleryImages.length > 0 && (
                        <span className="tour__photo-count">
                          <i className="ri-image-line"></i>
                          {activeIndex + 1}/{galleryImages.length}
                        </span>
                      )}
                      {tour.featured && (
                        <span className="tour__featured-badge">
                          <i className="ri-flashlight-fill"></i>
                          {t("common.featured")}
                        </span>
                      )}
                    </div>

                    {hasGallery && (
                      <div className="tour__gallery">
                        {galleryImages.map((img, index) => (
                          <button
                            type="button"
                            key={`${img}-${index}`}
                            className={`tour__thumb${
                              index === activeIndex
                                ? " tour__thumb--active"
                                : ""
                            }`}
                            onClick={() => goToSlide(index)}
                            aria-label={`${tour.title} ${index + 1}`}
                          >
                            <img
                              src={img}
                              alt={`${tour.title}-${index + 1}`}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <header className="tour__header">
                    <div className="tour__header-top">
                      <span className="tour__eyebrow">
                        <i className="ri-map-pin-line"></i>
                        {tour.city}
                      </span>
                      <span className="tour__rating-pill">
                        <i className="ri-star-fill"></i>
                        {avgRating === 0 ? (
                          t("common.notRated")
                        ) : (
                          <>
                            {avgRating}
                            <em>({tour.reviews?.length || 0})</em>
                          </>
                        )}
                      </span>
                    </div>
                    <h1 className="tour-detail__title">{tour.title}</h1>
                    <p className="tour__address">
                      <i className="ri-map-pin-user-fill"></i>
                      {tour.address}
                    </p>
                  </header>

                  <div className="tour__facts">
                    {facts.map((fact) => (
                      <div className="tour__fact" key={fact.label}>
                        <span className="tour__fact-icon">
                          <i className={fact.icon}></i>
                        </span>
                        <div>
                          <span className="tour__fact-label">{fact.label}</span>
                          <strong className="tour__fact-value">
                            {fact.value}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <article className="tour__about">
                    <div className="tour__section-heading">
                      <span className="tour__section-icon">
                        <i className="ri-article-line"></i>
                      </span>
                      <div>
                        <h2>{t("tours.description")}</h2>
                        <p>{t("tours.descriptionSubtitle")}</p>
                      </div>
                    </div>

                    <div className="tour__description">
                      {descriptionBlocks.length === 0 ? (
                        <p className="tour__desc-empty">
                          {t("tours.noDescription")}
                        </p>
                      ) : (
                        descriptionBlocks.map((block, index) => {
                          if (block.type === "list") {
                            return (
                              <ul
                                className="tour__desc-list"
                                key={`list-${index}`}
                              >
                                {block.items.map((item, itemIndex) => (
                                  <li key={`${index}-${itemIndex}`}>
                                    <i className="ri-checkbox-circle-fill"></i>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            );
                          }

                          const isLead = index === 0;
                          return (
                            <p
                              key={`p-${index}`}
                              className={
                                isLead
                                  ? "tour__desc-paragraph tour__desc-paragraph--lead"
                                  : "tour__desc-paragraph"
                              }
                            >
                              {block.text}
                            </p>
                          );
                        })
                      )}
                    </div>
                  </article>

                  <div className="tour__highlights">
                    <div className="tour__section-heading">
                      <span className="tour__section-icon tour__section-icon--warm">
                        <i className="ri-sparkling-2-line"></i>
                      </span>
                      <div>
                        <h2>{t("tours.highlights")}</h2>
                        <p>{t("tours.highlightsSubtitle")}</p>
                      </div>
                    </div>
                    <div className="tour__highlight-grid">
                      <div className="tour__highlight-card">
                        <i className="ri-landscape-line"></i>
                        <h3>{t("tours.highlightDestination")}</h3>
                        <p>
                          {t("tours.highlightDestinationDesc", {
                            city: tour.city,
                          })}
                        </p>
                      </div>
                      <div className="tour__highlight-card">
                        <i className="ri-team-line"></i>
                        <h3>{t("tours.highlightGroup")}</h3>
                        <p>
                          {t("tours.highlightGroupDesc", {
                            count: tour.maxGroupSize,
                          })}
                        </p>
                      </div>
                      <div className="tour__highlight-card">
                        <i className="ri-route-line"></i>
                        <h3>{t("tours.highlightDistance")}</h3>
                        <p>
                          {t("tours.highlightDistanceDesc", {
                            distance: tour.distance,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="tour__reviews">
                    <div className="tour__section-heading">
                      <span className="tour__section-icon tour__section-icon--review">
                        <i className="ri-chat-smile-2-line"></i>
                      </span>
                      <div>
                        <h2>
                          {t("tours.reviews")}
                          <span className="tour__reviews-count">
                            {t("tours.reviewsCount", {
                              count: tour.reviews?.length || 0,
                            })}
                          </span>
                        </h2>
                        <p>{t("tours.reviewsSubtitle")}</p>
                      </div>
                    </div>

                    {userHasReviewed ? (
                      <p className="tour__review-notice">
                        <i className="ri-checkbox-circle-line"></i>
                        {t("tours.alreadyReviewed")}
                      </p>
                    ) : (
                      <Form
                        className="tour__review-form"
                        onSubmit={submitHandler}
                      >
                        <label className="tour__review-form-label">
                          {t("tours.yourRating")}
                        </label>
                        <div className="rating__group">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              role="button"
                              tabIndex={0}
                              onClick={() => setTourRating(star)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  setTourRating(star);
                                }
                              }}
                              className={tourRating >= star ? "active" : ""}
                              aria-label={`${star}`}
                            >
                              <i className="ri-star-s-fill"></i>
                            </span>
                          ))}
                        </div>
                        <div className="reviews__input">
                          <input
                            type="text"
                            ref={reviewMsgRef}
                            placeholder={t("tours.shareThoughts")}
                            required
                          />
                          <button
                            className="btn primary__btn text-white"
                            type="submit"
                          >
                            {t("tours.submit")}
                          </button>
                        </div>
                      </Form>
                    )}

                    <ListGroup className="user__reviews">
                      {!tour.reviews?.length && (
                        <p className="tour__reviews-empty">
                          {t("tours.noReviews")}
                        </p>
                      )}
                      {tour.reviews?.map((review) => (
                        <div className="review__item" key={review._id}>
                          <img src={avatar} alt="" />
                          <div className="w-100">
                            <div className="review__item-top">
                              <div>
                                <h5>{review.username}</h5>
                                <p>
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString(
                                    language === "vi" ? "vi-VN" : "en-US",
                                    dateOptions,
                                  )}
                                </p>
                              </div>
                              <span className="review__rating">
                                {review.rating}
                                <i className="ri-star-s-fill"></i>
                              </span>
                            </div>
                            <h6>{review.reviewText}</h6>
                          </div>
                        </div>
                      ))}
                    </ListGroup>
                  </div>
                </div>
              </Col>
              <Col lg="4">
                <Booking tour={tour} avgRating={avgRating} />
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default TourDetails;

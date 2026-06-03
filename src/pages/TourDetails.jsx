import React, { useRef, useState, useEffect, useContext, useMemo } from "react";
import Slider from "react-slick";
import "../styles/tour-detail.css";
import { Container, Row, Col, Form, ListGroup } from "reactstrap";
import { useParams } from "react-router-dom";

import calculateAvgRating from "../utils/avgRating";
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

  const userHasReviewed = useMemo(() => {
    if (!user?._id || !tour?.reviews?.length) return false;
    return tour.reviews.some(
      (review) =>
        String(review.userId) === String(user._id) ||
        review.username === user.username
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

  const options = { day: "numeric", month: "long", year: "numeric" };

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
    } catch (error) {
      toast.error(error.message || t("toast.errorGeneric"));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setActiveIndex(0);
  }, [id, tour]);

  return (
    <>
      <section className="tour-detail-section">
        <Container>
          {loading && (
            <h4 className="loading-state text-center pt-5">{t("common.loading")}</h4>
          )}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && tour && (
            <Row>
              <Col lg="8">
                <div className="tour__content">
                  <div className="tour__slider-wrap">
                    {hasGallery ? (
                      <Slider ref={sliderRef} {...sliderSettings} className="tour__slider">
                        {galleryImages.map((img, index) => (
                          <div key={`${img}-${index}`} className="tour__slide">
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
                  </div>
                  {hasGallery && (
                    <div className="tour__gallery">
                      {galleryImages.map((img, index) => (
                        <button
                          type="button"
                          key={`${img}-${index}`}
                          className={`tour__thumb${
                            index === activeIndex ? " tour__thumb--active" : ""
                          }`}
                          onClick={() => goToSlide(index)}
                          aria-label={`${tour.title} ${index + 1}`}
                        >
                          <img src={img} alt={`${tour.title}-${index + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="tour__info">
                    <h2>{tour.title}</h2>
                    <div className="d-flex align-items-center gap-5">
                      <span className="tour__rating d-flex align-items-center justify-content-center gap-1">
                        <i
                          className="ri-star-fill"
                          style={{ color: "var(--secondary-color)" }}
                        ></i>
                        {(() => {
                          const { totalRating, avgRating } = calculateAvgRating(
                            tour.reviews
                          );
                          return (
                            <>
                              {avgRating === 0 ? null : avgRating}
                              {totalRating === 0 ? (
                                t("common.notRated")
                              ) : (
                                <span>({tour.reviews?.length})</span>
                              )}
                            </>
                          );
                        })()}
                      </span>
                      <span>
                        <i className="ri-map-pin-user-fill"></i>
                        {tour.address}
                      </span>
                    </div>

                    <div className="tour__extra-details">
                      <span>
                        <i className="ri-map-pin-2-line"></i>
                        {tour.city}
                      </span>
                      <span>
                        <i className="ri-money-dollar-circle-line"></i>$
                        {tour.price}
                        {t("common.perPerson")}
                      </span>
                      <span>
                        <i className="ri-map-pin-time-line"></i>
                        {tour.distance}k/m
                      </span>
                      <span>
                        <i className="ri-group-line"></i>
                        {tour.maxGroupSize} {t("tours.people")}
                      </span>
                    </div>
                    <h5>{t("tours.description")}</h5>
                    <p>{tour.desc}</p>
                  </div>

                  <div className="tour__reviews mt-4">
                    <h4>
                      {t("tours.reviews")} (
                      {t("tours.reviewsCount", { count: tour.reviews?.length || 0 })})
                    </h4>

                    {userHasReviewed ? (
                      <p className="tour__review-notice">{t("tours.alreadyReviewed")}</p>
                    ) : (
                      <Form onSubmit={submitHandler}>
                        <div className="d-flex align-items-center gap-3 mb-4 rating__group">
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
                      {tour.reviews?.map((review) => (
                        <div className="review__item" key={review._id}>
                          <img src={avatar} alt="" />
                          <div className="w-100">
                            <div className="d-flex align-items-center justify-content-between">
                              <div>
                                <h5>{review.username}</h5>
                                <p>
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString(
                                    language === "vi" ? "vi-VN" : "en-US",
                                    options
                                  )}
                                </p>
                              </div>
                              <span className="d-flex align-items-center">
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
                <Booking
                  tour={tour}
                  avgRating={
                    calculateAvgRating(tour.reviews).avgRating
                  }
                />
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

import React, { useContext } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/config";
import useFetch from "../hooks/useFetch";
import { Container } from "reactstrap";
import BookingDates from "../components/Booking/BookingDate";
import "../styles/bookingspage.css";
import CommonSection from "../shared/CommonSection";
import { useLanguage } from "../i18n/LanguageContext";
import { AuthContext } from "../context/AuthContext";

const BookingsPage = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const { user, initializing } = useContext(AuthContext);
  const { data: userBooking, loading, error } = useFetch(
    `${BASE_URL}/users/${id}`,
    { auth: true },
  );
  const bookings = Array.isArray(userBooking) ? userBooking : [];

  if (!initializing && user && user._id !== id && user.role !== "admin") {
    return <Navigate to={`/userinfo/${user._id}`} replace />;
  }

  return (
    <div>
      <CommonSection title={t("booking.yourBooking")} />
      <Container className="bookings-section">
        {!loading && !error && bookings.length > 0 && (
          <div className="bookings-section__meta">
            <span className="bookings-section__count">
              {t("booking.yourBooking")}: {bookings.length}
            </span>
          </div>
        )}
        {loading && (
          <h4 className="loading-state text-center pt-5">
            {t("common.loading")}
          </h4>
        )}
        {error && <h4 className="text-center pt-5">{error}</h4>}
        {!loading && !error && bookings.length === 0 && (
          <p className="bookings-empty">{t("booking.empty")}</p>
        )}
        {bookings.length > 0 &&
          bookings.map((booking) => (
            <Link
              to={`/userinfo/booking/${booking._id}`}
              className="booking-card"
              key={booking._id}
            >
              <div className="booking-card__img">
                <img
                  src={booking?.tours?.[0]?.photo}
                  alt={booking?.tourName || "tour-img"}
                />
              </div>
              <div className="booking-card__content">
                <div className="booking-card__title-row">
                  <h2>{booking.tourName}</h2>
                  <span className={`booking-card__status booking-card__status--${booking.status || "pending"}`}>
                    {t(`booking.statuses.${booking.status || "pending"}`)}
                  </span>
                </div>
                <BookingDates booking={booking} />
              </div>
            </Link>
          ))}
      </Container>
    </div>
  );
};

export default BookingsPage;

import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "reactstrap";
import { format } from "date-fns";
import CommonSection from "../shared/CommonSection";
import { BASE_URL } from "../utils/config";
import useFetch from "../hooks/useFetch";
import BookingDates from "../components/Booking/BookingDate";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import "../styles/booking-detail.css";

const BookingDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  const { data, loading, error } = useFetch(`${BASE_URL}/booking/${id}`, { auth: true });
  const booking = Array.isArray(data) ? data[0] : data;
  const tour = booking?.tours?.[0];

  return (
    <div>
      <CommonSection title={t("booking.bookingDetails")} />
      <Container className="booking-detail-section">
        {loading && (
          <h4 className="loading-state text-center pt-5">{t("common.loading")}</h4>
        )}
        {error && <h4 className="text-center pt-5">{error}</h4>}

        {!loading && !error && !booking && (
          <p className="booking-detail-empty">{t("booking.notFound")}</p>
        )}

        {!loading && !error && booking && (
          <div className="booking-detail-card">
            <div className="booking-detail-media">
              <img
                src={tour?.photo}
                alt={booking?.tourName || "booked-tour"}
                className="booking-detail-media__image"
              />
            </div>

            <div className="booking-detail-content">
              <div className="booking-detail-header">
                <h2>{booking.tourName}</h2>
                <span className="booking-detail-badge">
                  {t("booking.bookingRef")}: {String(booking._id).slice(-8).toUpperCase()}
                </span>
              </div>

              <BookingDates booking={booking} className="booking-detail-dates" />

              <div className="booking-detail-info">
                <div>
                  <span>{t("booking.fullName")}</span>
                  <strong>{booking.fullName}</strong>
                </div>
                <div>
                  <span>{t("booking.phone")}</span>
                  <strong>{booking.phone}</strong>
                </div>
                <div>
                  <span>{t("booking.bookedAt")}</span>
                  <strong>
                    {booking.createdAt
                      ? format(new Date(booking.createdAt), "dd/MM/yyyy HH:mm")
                      : "--"}
                  </strong>
                </div>
                <div>
                  <span>{t("booking.status")}</span>
                  <strong className={`booking-status booking-status--${booking.status || "pending"}`}>
                    {t(`booking.statuses.${booking.status || "pending"}`)}
                  </strong>
                </div>
              </div>

              <div className="booking-detail-actions">
                <Link to={`/tours/${tour?._id}`} className="btn secondary__btn">
                  {t("booking.viewTour")}
                </Link>
                {user?._id && (
                  <Link to={`/userinfo/${user._id}`} className="btn primary__btn">
                    {t("thankYou.viewBookings")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default BookingDetailPage;

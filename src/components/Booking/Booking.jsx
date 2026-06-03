import React, { useState, useContext, useEffect, useMemo } from "react";
import "./booking.css";
import { Form, ListGroup, ListGroupItem, Button, FormGroup } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  BOOKING_SERVICE_FEE,
  getBookingNights,
  getBookingSubtotal,
  getBookingTotal,
} from "../../utils/bookingPrice";

const Booking = ({ tour, avgRating }) => {
  const { toast, promptLogin } = useToast();
  const { t } = useLanguage();
  const { price, reviews, title, _id, maxGroupSize } = tour;
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState({
    userId: user?._id || "",
    userEmail: user?.email || "",
    tourName: title,
    fullName: "",
    phone: "",
    guestSize: 1,
    checkIn: "",
    checkOut: "",
    tours: _id,
    totalPrice: 0,
  });

  useEffect(() => {
    if (!user) return;
    setBooking((prev) => ({
      ...prev,
      userId: user._id,
      userEmail: user.email,
    }));
  }, [user]);

  const handleChange = (e) => {
    setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const nights = useMemo(
    () => getBookingNights(booking.checkIn, booking.checkOut),
    [booking.checkIn, booking.checkOut]
  );

  const guestCount = Math.max(Number(booking.guestSize) || 1, 1);
  const subtotal = getBookingSubtotal(price, nights, guestCount);
  const totalAmount = getBookingTotal(price, nights, guestCount, BOOKING_SERVICE_FEE);
  const hasValidDates = nights > 0;

  const handleContinue = (e) => {
    e.preventDefault();

    if (!user) {
      return promptLogin(t("toast.signInToBook"));
    }

    if (!booking.fullName?.trim() || !booking.phone || !booking.checkIn || !booking.checkOut) {
      return toast.warning(t("checkout.fillAllFields"));
    }

    if (new Date(booking.checkOut) <= new Date(booking.checkIn)) {
      return toast.warning(t("checkout.invalidDates"));
    }

    if (guestCount > maxGroupSize) {
      return toast.warning(
        t("booking.maxGuestsExceeded", { max: maxGroupSize })
      );
    }

    navigate("/booking/checkout", {
      state: {
        booking: { ...booking, totalPrice: totalAmount },
        tour: {
          _id: tour._id,
          title: tour.title,
          city: tour.city,
          photo: tour.photo,
          price,
        },
        totalAmount,
        subtotal,
        nights,
        serviceFee: BOOKING_SERVICE_FEE,
      },
    });
  };

  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          ${price} <span>{t("common.perPersonPerNight")}</span>
        </h3>
        <span className="tour__rating d-flex align-items-center justify-content-center gap-1">
          <i className="ri-star-fill"></i>
          {avgRating === 0 ? null : avgRating} ({reviews?.length})
        </span>
      </div>
      <div className="booking__form">
        <h5>{t("booking.information")}</h5>
        <Form className="booking__info-form" onSubmit={handleContinue}>
          <FormGroup>
            <input
              type="text"
              placeholder={t("booking.fullName")}
              id="fullName"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <input
              type="number"
              placeholder={t("booking.phone")}
              id="phone"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <span>{t("booking.checkIn")}</span>
            <input
              type="date"
              id="checkIn"
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <span>{t("booking.checkOut")}</span>
            <input
              type="date"
              id="checkOut"
              required
              onChange={handleChange}
              min={booking.checkIn}
            />
          </FormGroup>
          <FormGroup>
            <input
              type="number"
              placeholder={t("booking.guest")}
              min="1"
              max={maxGroupSize}
              id="guestSize"
              required
              onChange={handleChange}
            />
          </FormGroup>
        </Form>
      </div>

      <div className="booking__bottom">
        <ListGroup>
          {hasValidDates ? (
            <ListGroupItem className="border-0 px-0">
              <h5 className="d-flex align-items-center gap-1 flex-wrap">
                ${price} × {nights} {t("booking.nights")} × {guestCount}{" "}
                {t("booking.guest")}
              </h5>
              <span>${subtotal}</span>
            </ListGroupItem>
          ) : (
            <ListGroupItem className="border-0 px-0 text-muted">
              <small>{t("booking.selectDatesForPrice")}</small>
            </ListGroupItem>
          )}
          <ListGroupItem className="border-0 px-0">
            <h5>{t("booking.serviceCharge")}</h5>
            <span>${BOOKING_SERVICE_FEE}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>{t("booking.total")}</h5>
            <span>{hasValidDates ? `$${totalAmount}` : "—"}</span>
          </ListGroupItem>
        </ListGroup>
        <Button className="btn primary__btn w-100 mt-4" onClick={handleContinue}>
          {t("checkout.continueToPayment")}
          <i className="ri-arrow-right-line ms-2"></i>
        </Button>
      </div>
    </div>
  );
};
export default Booking;

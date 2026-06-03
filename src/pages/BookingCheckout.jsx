import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { format } from "date-fns";
import { getBookingNights, getBookingSubtotal } from "../utils/bookingPrice";
import CommonSection from "../shared/CommonSection";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../i18n/LanguageContext";
import { BASE_URL } from "../utils/config";
import "../styles/booking-checkout.css";

const PAYMENT_METHODS = [
  { id: "card", icon: "ri-bank-card-line", labelKey: "payCreditCard" },
  { id: "momo", icon: "ri-smartphone-line", labelKey: "payMomo" },
  { id: "bank", icon: "ri-bank-line", labelKey: "payBank" },
];

const BookingCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!state?.booking || !state?.tour) {
    return <Navigate to="/tours" replace />;
  }

  const { booking, tour, totalAmount, serviceFee } = state;
  const nights =
    state.nights ?? getBookingNights(booking.checkIn, booking.checkOut);
  const subtotal =
    state.subtotal ??
    getBookingSubtotal(tour.price, nights, booking.guestSize);
  const guestCount = Math.max(Number(booking.guestSize) || 1, 1);

  const handleConfirm = async () => {
    if (!agreed) {
      return toast.warning(t("checkout.agreeRequired"));
    }

    setSubmitting(true);
    try {
      const payload = {
        ...booking,
        totalPrice: totalAmount,
        paymentMethod,
      };

      const res = await fetch(`${BASE_URL}/booking`, {
        method: "post",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        return toast.error(result.message || t("toast.bookingFailed"));
      }

      navigate("/thank-you", {
        replace: true,
        state: {
          tourName: tour.title,
          totalPrice: totalAmount,
          bookingId: result.data?._id,
        },
      });
    } catch (err) {
      toast.error(err.message || t("toast.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CommonSection title={t("checkout.pageTitle")} />

      <section className="checkout-section">
        <Container>
          <div className="checkout-steps" aria-label={t("checkout.stepsLabel")}>
            <div className="checkout-steps__item checkout-steps__item--done">
              <span>1</span>
              <p>{t("checkout.stepInfo")}</p>
            </div>
            <div className="checkout-steps__line checkout-steps__line--done" />
            <div className="checkout-steps__item checkout-steps__item--active">
              <span>2</span>
              <p>{t("checkout.stepPayment")}</p>
            </div>
            <div className="checkout-steps__line" />
            <div className="checkout-steps__item">
              <span>3</span>
              <p>{t("checkout.stepConfirm")}</p>
            </div>
          </div>

          <Row className="g-4">
            <Col lg="7">
              <div className="checkout-card">
                <h4>{t("checkout.paymentMethod")}</h4>
                <p className="checkout-card__hint">{t("checkout.paymentNote")}</p>

                <div className="checkout-payments">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      className={`checkout-payment${
                        paymentMethod === method.id
                          ? " checkout-payment--active"
                          : ""
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <i className={method.icon}></i>
                      <span>{t(`checkout.${method.labelKey}`)}</span>
                      {paymentMethod === method.id && (
                        <i className="ri-checkbox-circle-fill checkout-payment__check"></i>
                      )}
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="checkout-card-fields">
                    <FormGroup>
                      <Label>{t("checkout.cardNumber")}</Label>
                      <Input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        disabled={submitting}
                      />
                    </FormGroup>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <Label>{t("checkout.cardExpiry")}</Label>
                          <Input
                            type="text"
                            placeholder="MM/YY"
                            disabled={submitting}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label>{t("checkout.cardCvc")}</Label>
                          <Input
                            type="text"
                            placeholder="123"
                            disabled={submitting}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                )}

                <FormGroup check className="checkout-terms mt-3">
                  <Input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    disabled={submitting}
                  />
                  <Label check for="agreeTerms">
                    {t("checkout.agreeTerms")}
                  </Label>
                </FormGroup>

                <div className="checkout-actions d-flex flex-wrap gap-3 mt-4">
                  <Button
                    className="btn primary__btn"
                    onClick={handleConfirm}
                    disabled={submitting || !agreed}
                  >
                    {submitting ? (
                      <>
                        <i className="ri-loader-4-line"></i>
                        {t("checkout.processing")}
                      </>
                    ) : (
                      <>
                        {t("checkout.confirmPay")}
                        <i className="ri-secure-payment-line ms-2"></i>
                      </>
                    )}
                  </Button>
                  <Button
                    className="btn secondary__btn"
                    tag={Link}
                    to={`/tours/${tour._id}`}
                    disabled={submitting}
                  >
                    {t("checkout.backToTour")}
                  </Button>
                </div>
              </div>
            </Col>

            <Col lg="5">
              <div className="checkout-summary">
                <h4>{t("checkout.orderSummary")}</h4>

                <div className="checkout-summary__tour">
                  <img src={tour.photo} alt={tour.title} />
                  <div>
                    <h5>{tour.title}</h5>
                    <p>
                      <i className="ri-map-pin-line"></i> {tour.city}
                    </p>
                  </div>
                </div>

                <ul className="checkout-summary__list">
                  <li>
                    <span>{t("booking.fullName")}</span>
                    <strong>{booking.fullName}</strong>
                  </li>
                  <li>
                    <span>{t("booking.phone")}</span>
                    <strong>{booking.phone}</strong>
                  </li>
                  <li>
                    <span>{t("booking.checkIn")}</span>
                    <strong>
                      {format(new Date(booking.checkIn), "dd/MM/yyyy")}
                    </strong>
                  </li>
                  <li>
                    <span>{t("booking.checkOut")}</span>
                    <strong>
                      {format(new Date(booking.checkOut), "dd/MM/yyyy")}
                    </strong>
                  </li>
                  <li>
                    <span>{t("booking.nights")}</span>
                    <strong>{nights}</strong>
                  </li>
                  <li>
                    <span>{t("booking.guest")}</span>
                    <strong>{booking.guestSize}</strong>
                  </li>
                </ul>

                <div className="checkout-summary__pricing">
                  <div className="checkout-summary__row">
                    <span>
                      ${tour.price} × {nights} {t("booking.nights")} × {guestCount}{" "}
                      {t("booking.guest")}
                    </span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="checkout-summary__row">
                    <span>{t("booking.serviceCharge")}</span>
                    <span>${serviceFee}</span>
                  </div>
                  <div className="checkout-summary__row checkout-summary__total">
                    <span>{t("booking.total")}</span>
                    <span>${totalAmount}</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default BookingCheckout;

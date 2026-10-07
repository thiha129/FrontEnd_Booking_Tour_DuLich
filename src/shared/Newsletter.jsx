import React, { useState } from "react";
import "./newsletter.css";
import { Container, Row, Col } from "reactstrap";
import maleTourist from "../assets/images/male-tourist.png";
import { useLanguage } from "../i18n/LanguageContext";
import { BASE_URL } from "../utils/config";

const Newsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMessage({ type: "error", text: t("newsletter.invalidEmail") });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/mail/newsletter`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const result = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text: result.message || t("newsletter.failed"),
        });
        return;
      }

      if (result.alreadySubscribed) {
        setMessage({ type: "info", text: t("newsletter.alreadySubscribed") });
      } else {
        setMessage({ type: "success", text: t("newsletter.success") });
        setEmail("");
      }
    } catch {
      setMessage({ type: "error", text: t("newsletter.failed") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="newsletter">
      <Container>
        <Row>
          <Col lg="6">
            <div className="newsletter__content">
              <h2>{t("newsletter.title")}</h2>
              <form className="newsletter__input" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder={t("newsletter.placeholder")}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMessage(null);
                  }}
                  disabled={submitting}
                  required
                />
                <button
                  className="newsletter__btn btn"
                  type="submit"
                  disabled={submitting}
                >
                  {t("newsletter.subscribe")}
                </button>
              </form>
              {message && (
                <p
                  className={`newsletter__feedback newsletter__feedback--${message.type}`}
                >
                  {message.text}
                </p>
              )}
              <p>{t("newsletter.desc")}</p>
            </div>
          </Col>
          <Col lg="6">
            <div className="newsletter__img">
              <img src={maleTourist} alt="" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default Newsletter;

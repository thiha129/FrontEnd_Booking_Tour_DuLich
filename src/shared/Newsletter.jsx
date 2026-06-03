import React, { useState } from "react";
import "./newsletter.css";
import { Container, Row, Col } from "reactstrap";
import maleTourist from "../assets/images/male-tourist.png";
import { useLanguage } from "../i18n/LanguageContext";

const NEWSLETTER_KEY = "newsletter_subscribers";

const Newsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMessage({ type: "error", text: t("newsletter.invalidEmail") });
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || "[]");
      if (existing.includes(trimmed)) {
        setMessage({ type: "info", text: t("newsletter.alreadySubscribed") });
      } else {
        localStorage.setItem(
          NEWSLETTER_KEY,
          JSON.stringify([...existing, trimmed])
        );
        setMessage({ type: "success", text: t("newsletter.success") });
        setEmail("");
      }
    } catch {
      setMessage({ type: "success", text: t("newsletter.success") });
      setEmail("");
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
                  required
                />
                <button className="newsletter__btn btn" type="submit">
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

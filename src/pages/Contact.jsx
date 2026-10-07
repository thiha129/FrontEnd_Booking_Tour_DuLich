import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import CommonSection from "../shared/CommonSection";
import Newsletter from "../shared/Newsletter";
import { useLanguage } from "../i18n/LanguageContext";
import { BASE_URL } from "../utils/config";
import "../styles/contact.css";

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const contactItems = [
    {
      icon: "ri-map-pin-line",
      title: t("footer.address"),
      value: t("footer.addressValue"),
    },
    {
      icon: "ri-mail-line",
      title: t("footer.email"),
      value: t("footer.emailValue"),
    },
    {
      icon: "ri-phone-fill",
      title: t("footer.phone"),
      value: t("footer.phoneValue"),
    },
    {
      icon: "ri-time-line",
      title: t("contact.workingHours"),
      value: t("contact.workingHoursValue"),
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setStatus(null);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    setErrorMsg("");

    try {
      const res = await fetch(`${BASE_URL}/mail/contact`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(result.message || t("contact.failed"));
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMsg(t("contact.failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CommonSection title={t("contact.pageTitle")} />
      <section className="contact-section">
        <Container>
          <Row className="g-5">
            <Col lg="5">
              <h2 className="contact__title">{t("contact.title")}</h2>
              <p className="contact__desc">{t("contact.desc")}</p>
              <ul className="contact__info-list">
                {contactItems.map((item, index) => (
                  <li key={index}>
                    <span className="contact__info-icon">
                      <i className={item.icon}></i>
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.value}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Col>
            <Col lg="7">
              <div className="contact__form-wrap">
                <h3>{t("contact.formTitle")}</h3>
                {status === "success" && (
                  <div className="contact__alert contact__alert--success">
                    <i className="ri-checkbox-circle-line"></i>
                    {t("contact.success")}
                  </div>
                )}
                {status === "error" && (
                  <div className="contact__alert contact__alert--error">
                    <i className="ri-error-warning-line"></i>
                    {errorMsg}
                  </div>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <input
                          type="text"
                          id="name"
                          placeholder={t("contact.namePlaceholder")}
                          value={form.name}
                          onChange={handleChange}
                          disabled={submitting}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <input
                          type="email"
                          id="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleChange}
                          disabled={submitting}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <input
                      type="text"
                      id="subject"
                      placeholder={t("contact.subjectPlaceholder")}
                      value={form.subject}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <textarea
                      id="message"
                      rows="5"
                      placeholder={t("contact.messagePlaceholder")}
                      value={form.message}
                      onChange={handleChange}
                      disabled={submitting}
                      required
                    />
                  </FormGroup>
                  <Button
                    className="btn primary__btn"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? t("checkout.processing") : t("contact.send")}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default Contact;

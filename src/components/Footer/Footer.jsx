import React from "react";
import "./footer.css";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo3.png";
import { useLanguage } from "../../i18n/LanguageContext";

const socialLinks = [
  { icon: "ri-youtube-line", url: "#" },
  { icon: "ri-github-fill", url: "#" },
  { icon: "ri-facebook-circle-line", url: "#" },
  { icon: "ri-instagram-line", url: "#" },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  const discoverLinks = [
    { path: "/home", display: t("nav.home") },
    { path: "/about", display: t("nav.about") },
    { path: "/tours", display: t("nav.tours") },
    { path: "/wishlist", display: t("nav.wishlist") },
  ];

  const quickLinks = [
    { path: "/login", display: t("nav.login") },
    { path: "/register", display: t("nav.register") },
    { path: "/contact", display: t("nav.contact") },
    { path: "/faq", display: t("nav.faq") },
  ];

  const contactInfo = [
    {
      icon: "ri-map-pin-line",
      label: t("footer.address"),
      value: t("footer.addressValue"),
    },
    {
      icon: "ri-mail-line",
      label: t("footer.email"),
      value: t("footer.emailValue"),
    },
    {
      icon: "ri-phone-fill",
      label: t("footer.phone"),
      value: t("footer.phoneValue"),
    },
  ];

  return (
    <footer className="footer">
      <Container>
        <Row className="footer__main">
          <Col lg="3" md="6" className="mb-4 mb-lg-0">
            <div className="footer__brand">
              <Link to="/home" className="footer__logo-link">
                <img src={logo} alt="Travel Booking" />
              </Link>
              <p>{t("footer.tagline")}</p>
              <div className="footer__social">
                {socialLinks.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t("common.socialLink")}
                  >
                    <i className={item.icon}></i>
                  </a>
                ))}
              </div>
            </div>
          </Col>

          <Col lg="3" md="6" className="mb-4 mb-lg-0">
            <h5 className="footer__title">{t("footer.discover")}</h5>
            <ul className="footer__links">
              {discoverLinks.map((item, index) => (
                <li key={index}>
                  <Link to={item.path}>{item.display}</Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg="3" md="6" className="mb-4 mb-lg-0">
            <h5 className="footer__title">{t("footer.quickLinks")}</h5>
            <ul className="footer__links">
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <Link to={item.path}>{item.display}</Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg="3" md="6">
            <h5 className="footer__title">{t("footer.contact")}</h5>
            <ul className="footer__contact">
              {contactInfo.map((item, index) => (
                <li key={index}>
                  <span className="footer__contact-icon">
                    <i className={item.icon}></i>
                  </span>
                  <div>
                    <span className="footer__contact-label">{item.label}</span>
                    <span className="footer__contact-value">{item.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <p className="footer__copyright">
              &copy; {year} {t("common.copyright")}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

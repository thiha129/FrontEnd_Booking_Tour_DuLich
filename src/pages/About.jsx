import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";
import "../styles/about.css";
import CommonSection from "../shared/CommonSection";
import Subtitle from "../shared/Subtitle";
import Newsletter from "../shared/Newsletter";
import { useLanguage } from "../i18n/LanguageContext";
import aboutImg from "../assets/images/hero-img01.jpg";
import experienceImg from "../assets/images/experience.png";
import teamImg from "../assets/images/hero-img02.jpg";
import worldImg from "../assets/images/world.png";

const About = () => {
  const { t, ta } = useLanguage();
  const stats = ta("about.stats");
  const values = ta("about.values");
  const milestones = ta("about.milestones");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <CommonSection title={t("about.pageTitle")} />

      <section className="about-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg="6" className="animate-fade-in-up">
              <Subtitle subtitle={t("about.storySubtitle")} />
              <h2 className="about__title">
                {t("about.storyTitle")}{" "}
                <span className="about__highlight">{t("about.storyHighlight")}</span>
              </h2>
              <p className="about__text">{t("about.storyP1")}</p>
              <p className="about__text">{t("about.storyP2")}</p>
              <Button className="btn primary__btn mt-2">
                <Link to="/tours">{t("about.exploreTours")}</Link>
              </Button>
            </Col>
            <Col lg="6" className="animate-fade-in-up delay-2">
              <div className="about__img-wrap">
                <img src={aboutImg} alt="Travel adventure" />
                <div className="about__img-badge">
                  <img src={worldImg} alt="" />
                  <div>
                    <strong>120+</strong>
                    <span>{t("about.destinationsBadge")}</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="about-stats">
        <Container>
          <Row>
            {stats.map((item, index) => (
              <Col lg="3" md="6" sm="6" key={index} className="mb-4 mb-lg-0">
                <div className="about-stat-card animate-scale-in">
                  <span className="about-stat-card__number">{item.number}</span>
                  <span className="about-stat-card__label">{item.label}</span>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="about-section about-section--alt">
        <Container>
          <Row className="g-4">
            <Col lg="6">
              <div className="about-mission-card">
                <div className="about-mission-card__icon">
                  <i className="ri-compass-3-line"></i>
                </div>
                <h3>{t("about.missionTitle")}</h3>
                <p>{t("about.missionDesc")}</p>
              </div>
            </Col>
            <Col lg="6">
              <div className="about-mission-card about-mission-card--vision">
                <div className="about-mission-card__icon">
                  <i className="ri-eye-line"></i>
                </div>
                <h3>{t("about.visionTitle")}</h3>
                <p>{t("about.visionDesc")}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="about-section">
        <Container>
          <Row className="text-center mb-5">
            <Col lg="12">
              <Subtitle subtitle={t("about.valuesSubtitle")} />
              <h2 className="about__title about__title--center">
                {t("about.valuesTitle")}
              </h2>
            </Col>
          </Row>
          <Row className="g-4">
            {values.map((item, index) => (
              <Col lg="3" md="6" key={index}>
                <div className="about-value-card">
                  <span className="about-value-card__icon">
                    <i className={item.icon}></i>
                  </span>
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="about-section about-section--alt">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg="6">
              <Subtitle subtitle={t("about.journeySubtitle")} />
              <h2 className="about__title">{t("about.journeyTitle")}</h2>
              <ul className="about-timeline">
                {milestones.map((item, index) => (
                  <li key={index} className="about-timeline__item">
                    <span className="about-timeline__year">{item.year}</span>
                    <p>{item.text}</p>
                  </li>
                ))}
              </ul>
            </Col>
            <Col lg="6">
              <div className="about__img-grid">
                <img
                  src={experienceImg}
                  alt="Experience"
                  className="about__img-grid-main"
                />
                <img src={teamImg} alt="Our team" className="about__img-grid-sub" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="about-cta">
        <Container>
          <div className="about-cta__box animate-fade-in-up">
            <h2>{t("about.ctaTitle")}</h2>
            <p>{t("about.ctaDesc")}</p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Button className="btn primary__btn">
                <Link to="/tours">{t("about.viewAllTours")}</Link>
              </Button>
              <Button className="btn secondary__btn about-cta__btn-light">
                <Link to="/register">{t("about.createAccount")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default About;

import React from "react";
import "../styles/home.css";
import { Container, Row, Col } from "reactstrap";
import heroImg from "../assets/images/hero-img01.jpg";
import heroImg02 from "../assets/images/hero-img02.jpg";
import heroVideo from "../assets/images/hero-video.mp4";
import worldImg from "../assets/images/world.png";
import experienceImg from "../assets/images/experience.png";

import Subtitle from "../shared/Subtitle";
import SearchBar from "../shared/SearchBar";
import ServiceList from "../services/ServiceList";
import FeaturedTourList from "../components/Featured-tours/FeaturedTourList";
import MasonryImagesGallery from "../components/Image-gallery/MasonryImagesGallery";
import Testimonials from "../components/Testimonial/Testimonials";
import Newsletter from "../shared/Newsletter";
import { useLanguage } from "../i18n/LanguageContext";

const Home = () => {
  const { t } = useLanguage();

  return (
    <>
      <section className="hero-section">
        <Container>
          <Row>
            <Col lg="6">
              <div className="hero__content animate-fade-in-up">
                <div className="hero__subtitle d-flex align-items-center">
                  <Subtitle subtitle={t("home.heroSubtitle")} />
                  <img src={worldImg} alt="" />
                </div>
                <h1>
                  {t("home.heroTitle")}
                  <span className="highlight">{t("home.heroTitleHighlight")}</span>
                </h1>
                <p>{t("home.heroDesc")}</p>
              </div>
            </Col>
            <Col lg="2" className="animate-fade-in-up delay-2">
              <div className="hero__img-box">
                <img src={heroImg} alt="Travel destination" />
              </div>
            </Col>
            <Col lg="2" className="animate-fade-in-up delay-3">
              <div className="hero__img-box hero__video-box mt-4">
                <video src={heroVideo} controls autoPlay muted loop />
              </div>
            </Col>
            <Col lg="2" className="animate-fade-in-up delay-4">
              <div className="hero__img-box mt-5">
                <img src={heroImg02} alt="Travel experience" />
              </div>
            </Col>
            <SearchBar />
          </Row>
        </Container>
      </section>

      <section className="services-section">
        <Container>
          <Row>
            <Col lg="3" md="12" className="mb-4 mb-lg-0">
              <h5 className="services__subtitle">{t("home.servicesSubtitle")}</h5>
              <h2 className="services__title section-title">
                {t("home.servicesTitle")}
              </h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>

      <section className="featured-section">
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <Subtitle subtitle={t("home.featuredSubtitle")} />
              <h2 className="feartured__tour-title section-title">
                {t("home.featuredTitle")}
              </h2>
            </Col>
            <FeaturedTourList />
          </Row>
        </Container>
      </section>

      <section className="experience-section">
        <Container>
          <Row>
            <Col lg="6">
              <div className="experience__content">
                <Subtitle subtitle={t("home.experienceSubtitle")} />
                <h2 className="section-title">
                  {t("home.experienceTitle")}
                  <br /> {t("home.experienceTitleBr")}
                </h2>
                <p>{t("home.experienceDesc")}</p>
              </div>
              <div className="counter__wrapper d-flex align-items-center gap-5">
                <div className="counter__box">
                  <span>12+</span>
                  <h6>{t("home.counterTrips")}</h6>
                </div>
                <div className="counter__box">
                  <span>2k+</span>
                  <h6>{t("home.counterClients")}</h6>
                </div>
                <div className="counter__box">
                  <span>15</span>
                  <h6>{t("home.counterYears")}</h6>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="experience__img">
                <img src={experienceImg} alt="Travel experience" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="gallery-section">
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={t("home.gallerySubtitle")} />
              <h2 className="gallery__title section-title">
                {t("home.galleryTitle")}
              </h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="testimonial-section">
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={t("home.testimonialSubtitle")} />
              <h2 className="testimonial__title section-title">
                {t("home.testimonialTitle")}
              </h2>
            </Col>
            <Col lg="12">
              <Testimonials />
            </Col>
          </Row>
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default Home;

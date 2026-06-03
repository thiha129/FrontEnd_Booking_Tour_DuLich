import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Collapse, Button } from "reactstrap";
import CommonSection from "../shared/CommonSection";
import Newsletter from "../shared/Newsletter";
import { useLanguage } from "../i18n/LanguageContext";
import "../styles/faq.css";

const FAQ = () => {
  const { t, ta } = useLanguage();
  const faqItems = ta("faq.items");
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <>
      <CommonSection title={t("faq.pageTitle")} />
      <section className="faq-section">
        <Container>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div className="faq-item" key={index}>
                <button
                  type="button"
                  className={`faq-item__question ${openIndex === index ? "active" : ""}`}
                  onClick={() => toggle(index)}
                  aria-expanded={openIndex === index}
                >
                  {item.q}
                  <i className="ri-arrow-down-s-line"></i>
                </button>
                <Collapse isOpen={openIndex === index}>
                  <p className="faq-item__answer">{item.a}</p>
                </Collapse>
              </div>
            ))}
          </div>
          <div className="faq-cta text-center">
            <p>{t("faq.stillQuestions")}</p>
            <Button className="btn primary__btn">
              <Link to="/contact">{t("faq.contactSupport")}</Link>
            </Button>
          </div>
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default FAQ;

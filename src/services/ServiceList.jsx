import React from "react";
import ServiceCard from "./ServiceCard";
import { Col } from "reactstrap";
import weatherImg from "../assets/images/weather.png";
import guideImg from "../assets/images/guide.png";
import customizationImg from "../assets/images/customization.png";
import { useLanguage } from "../i18n/LanguageContext";

const serviceImages = [weatherImg, guideImg, customizationImg];

const ServiceList = () => {
  const { ta } = useLanguage();
  const services = ta("home.services");

  return (
    <>
      {services.map((item, index) => (
        <Col lg="3" md="6" sm="12" className="mb-4" key={index}>
          <ServiceCard
            item={{
              ...item,
              imgUrl: serviceImages[index],
            }}
          />
        </Col>
      ))}
    </>
  );
};
export default ServiceList;

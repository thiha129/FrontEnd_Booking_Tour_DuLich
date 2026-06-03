import React, { useRef } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";
import { BASE_URL } from "./../utils/config";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../i18n/LanguageContext";

const SearchBar = () => {
  const locationRef = useRef("");
  const distanceRef = useRef(0);
  const maxGroupSizeRef = useRef(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const searchHandle = async () => {
    const location = locationRef.current.value;
    const distance = distanceRef.current.value;
    const maxGroupSize = maxGroupSizeRef.current.value;

    if (location === "" || distance === "" || maxGroupSize === "") {
      return toast.warning(t("toast.searchFillAll"));
    }
    const res = await fetch(
      `${BASE_URL}/tours/search/getTourBySearch?city=${encodeURIComponent(location)}&distance=${encodeURIComponent(distance)}&maxGroupSize=${encodeURIComponent(maxGroupSize)}`
    );
    if (!res.ok) {
      toast.error(t("toast.searchFailed"));
      return;
    }

    const result = await res.json();
    navigate(
      `/tours/search?city=${encodeURIComponent(location)}&distance=${encodeURIComponent(distance)}&maxGroupSize=${encodeURIComponent(maxGroupSize)}`,
      { state: result.data }
    );
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4">
          <FormGroup className="d-flex gap-3 form__group form__group-fast m-4">
            <span>
              <i className="ri-map-pin-line"></i>
            </span>
            <div>
              <h6>{t("search.location")}</h6>
              <input
                type="text"
                placeholder={t("search.locationPlaceholder")}
                ref={locationRef}
              />
            </div>
          </FormGroup>
          <FormGroup className="d-flex gap-3 form__group form__group-fast m-4">
            <span>
              <i className="ri-map-pin-time-line"></i>
            </span>
            <div>
              <h6>{t("search.distance")}</h6>
              <input
                type="number"
                placeholder={t("search.distancePlaceholder")}
                ref={distanceRef}
              />
            </div>
          </FormGroup>
          <FormGroup className="d-flex gap-3 form__group form__group-last m-4">
            <span>
              <i className="ri-group-line"></i>
            </span>
            <div>
              <h6>{t("search.maxPeople")}</h6>
              <input
                type="number"
                placeholder={t("search.maxPeoplePlaceholder")}
                ref={maxGroupSizeRef}
              />
            </div>
          </FormGroup>
          <span className="search__icon" type="submit" onClick={searchHandle}>
            <i className="ri-search-line"></i>
          </span>
        </Form>
      </div>
    </Col>
  );
};
export default SearchBar;

import React, { useMemo } from "react";
import { Col } from "reactstrap";
import FilterSelect from "./FilterSelect";
import "./tour-sort-filter.css";
import { useLanguage } from "../i18n/LanguageContext";

const TourSortFilter = ({
  sortBy,
  order,
  minPrice,
  maxPrice,
  onSortByChange,
  onOrderChange,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPriceFilter,
}) => {
  const { t } = useLanguage();
  const orderDisabled = sortBy === "default";

  const sortByOptions = useMemo(
    () => [
      {
        value: "default",
        label: t("tours.sortDefault"),
        icon: "ri-time-line",
      },
      {
        value: "price",
        label: t("tours.sortPrice"),
        icon: "ri-money-dollar-circle-line",
      },
      {
        value: "rating",
        label: t("tours.sortRating"),
        icon: "ri-star-line",
      },
    ],
    [t]
  );

  const orderOptions = useMemo(
    () => [
      {
        value: "asc",
        label: t("tours.orderAsc"),
        icon: "ri-sort-asc",
      },
      {
        value: "desc",
        label: t("tours.orderDesc"),
        icon: "ri-sort-desc",
      },
    ],
    [t]
  );

  const handlePriceKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onApplyPriceFilter();
    }
  };

  return (
    <Col lg="12" className="tour-sort-filter-col">
      <div className="tour-sort-filter">
        <div className="tour-sort-filter__bar">
          <div className="tour-sort-filter__group">
            <span className="tour-sort-filter__icon" aria-hidden="true">
              <i className="ri-sort-desc"></i>
            </span>
            <div className="tour-sort-filter__field">
              <span className="tour-sort-filter__caption">
                {t("tours.sortBy")}
              </span>
              <FilterSelect
                value={sortBy}
                options={sortByOptions}
                onChange={onSortByChange}
                ariaLabel={t("tours.sortBy")}
              />
            </div>
          </div>

          <div
            className={`tour-sort-filter__group ${
              orderDisabled ? "tour-sort-filter__group--disabled" : ""
            }`}
          >
            <span className="tour-sort-filter__icon" aria-hidden="true">
              <i className="ri-arrow-up-down-line"></i>
            </span>
            <div className="tour-sort-filter__field">
              <span className="tour-sort-filter__caption">
                {t("tours.sortOrder")}
              </span>
              <FilterSelect
                value={order}
                options={orderOptions}
                onChange={onOrderChange}
                disabled={orderDisabled}
                ariaLabel={t("tours.sortOrder")}
              />
            </div>
          </div>

          <div className="tour-sort-filter__group tour-sort-filter__group--price">
            <span className="tour-sort-filter__icon" aria-hidden="true">
              <i className="ri-price-tag-3-line"></i>
            </span>
            <div className="tour-sort-filter__field">
              <span className="tour-sort-filter__caption">
                {t("tours.priceRange")}
              </span>
              <div className="tour-sort-filter__price-row">
                <label className="tour-sort-filter__price-box">
                  <span className="tour-sort-filter__currency">$</span>
                  <input
                    type="number"
                    min="0"
                    placeholder={t("tours.minPrice")}
                    value={minPrice}
                    onChange={(e) => onMinPriceChange(e.target.value)}
                    onKeyDown={handlePriceKeyDown}
                    aria-label={t("tours.minPrice")}
                  />
                </label>
                <span className="tour-sort-filter__sep" aria-hidden="true">
                  <i className="ri-arrow-right-line"></i>
                </span>
                <label className="tour-sort-filter__price-box">
                  <span className="tour-sort-filter__currency">$</span>
                  <input
                    type="number"
                    min="0"
                    placeholder={t("tours.maxPrice")}
                    value={maxPrice}
                    onChange={(e) => onMaxPriceChange(e.target.value)}
                    onKeyDown={handlePriceKeyDown}
                    aria-label={t("tours.maxPrice")}
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="tour-sort-filter__btn"
            onClick={onApplyPriceFilter}
            title={t("tours.applyFilter")}
            aria-label={t("tours.applyFilter")}
          >
            <i className="ri-filter-3-line"></i>
          </button>
        </div>
      </div>
    </Col>
  );
};

export default TourSortFilter;

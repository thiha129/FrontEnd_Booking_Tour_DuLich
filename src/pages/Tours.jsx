import React, { useEffect, useMemo } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/tour.css";
import SearchBar from "../shared/SearchBar";
import TourSortFilter from "../shared/TourSortFilter";
import Newsletter from "../shared/Newsletter";
import TourCard from "../shared/TourCard";
import { Container, Row, Col } from "reactstrap";
import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { BASE_URL } from "../utils/config";
import { useLanguage } from "../i18n/LanguageContext";

const PAGE_SIZE = 8;

const buildQueryString = ({ page, sortBy, order, minPrice, maxPrice }) => {
  const params = new URLSearchParams({ page: String(page) });
  if (sortBy && sortBy !== "default") {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }
  if (minPrice !== "") params.set("minPrice", minPrice);
  if (maxPrice !== "") params.set("maxPrice", maxPrice);
  return params.toString();
};

const parsePageFromParams = (searchParams) => {
  const raw = parseInt(searchParams.get("page") || "1", 10);
  if (Number.isNaN(raw) || raw < 1) return 0;
  return raw - 1;
};

const Tours = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => parsePageFromParams(searchParams), [searchParams]);
  const sortBy = searchParams.get("sortBy") || "default";
  const order = searchParams.get("order") || "asc";
  const appliedMinPrice = searchParams.get("minPrice") || "";
  const appliedMaxPrice = searchParams.get("maxPrice") || "";

  const [minPrice, setMinPrice] = React.useState(appliedMinPrice);
  const [maxPrice, setMaxPrice] = React.useState(appliedMaxPrice);

  useEffect(() => {
    setMinPrice(appliedMinPrice);
    setMaxPrice(appliedMaxPrice);
  }, [appliedMinPrice, appliedMaxPrice]);

  const updateSearchParams = (updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  };

  const goToPage = (pageIndex) => {
    const displayPage = pageIndex + 1;
    updateSearchParams({
      page: displayPage <= 1 ? null : displayPage,
    });
  };

  const queryString = useMemo(
    () =>
      buildQueryString({
        page,
        sortBy,
        order,
        minPrice: appliedMinPrice,
        maxPrice: appliedMaxPrice,
      }),
    [page, sortBy, order, appliedMinPrice, appliedMaxPrice]
  );

  const { data: tours, loading, error } = useFetch(
    `${BASE_URL}/tours?${queryString}`
  );
  const { data: tourCount } = useFetch(
    `${BASE_URL}/tours/search/getTourCount?${buildQueryString({
      page: 0,
      sortBy,
      order,
      minPrice: appliedMinPrice,
      maxPrice: appliedMaxPrice,
    })}`
  );

  const pageCount = useMemo(
    () => Math.ceil((tourCount || 0) / PAGE_SIZE) || 1,
    [tourCount]
  );

  useEffect(() => {
    if (pageCount > 0 && page >= pageCount) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("page");
        return next;
      });
    }
  }, [page, pageCount, setSearchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, tourCount]);

  const handleSortByChange = (value) => {
    updateSearchParams({
      sortBy: value === "default" ? null : value,
      order: value === "default" ? null : order,
      page: null,
    });
  };

  const handleOrderChange = (value) => {
    updateSearchParams({ order: value, page: null });
  };

  const handleApplyPriceFilter = () => {
    updateSearchParams({
      minPrice: minPrice.trim() || null,
      maxPrice: maxPrice.trim() || null,
      page: null,
    });
  };

  const canGoPrev = page > 0;
  const canGoNext = page < pageCount - 1;

  return (
    <>
      <CommonSection title={t("tours.pageTitle")} />
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
        </Container>
      </section>
      <section className="pt-0 tours-page-section">
        <Container>
          <Row>
            <TourSortFilter
              sortBy={sortBy}
              order={order}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onSortByChange={handleSortByChange}
              onOrderChange={handleOrderChange}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onApplyPriceFilter={handleApplyPriceFilter}
            />
          </Row>
          {loading && (
            <h4 className="loading-state text-center pt-5">
              {t("common.loading")}
            </h4>
          )}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && tours?.length === 0 && (
            <h4 className="text-center pt-5">{t("tours.notFound")}</h4>
          )}
          {!loading && !error && tours?.length > 0 && (
            <Row>
              {tours.map((tour) => (
                <Col lg="3" md="6" xs="12" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))}
              {pageCount > 1 && (
                <Col lg="12">
                  <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-2">
                    <button
                      type="button"
                      className="pagination__nav"
                      disabled={!canGoPrev}
                      onClick={() => goToPage(page - 1)}
                      aria-label={t("tours.prevPage")}
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                    {[...Array(pageCount).keys()].map((number) => (
                      <span
                        key={number}
                        role="button"
                        tabIndex={0}
                        onClick={() => goToPage(number)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            goToPage(number);
                          }
                        }}
                        className={page === number ? "active__page" : ""}
                      >
                        {number + 1}
                      </span>
                    ))}
                    <button
                      type="button"
                      className="pagination__nav"
                      disabled={!canGoNext}
                      onClick={() => goToPage(page + 1)}
                      aria-label={t("tours.nextPage")}
                    >
                      <i className="ri-arrow-right-s-line"></i>
                    </button>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};
export default Tours;

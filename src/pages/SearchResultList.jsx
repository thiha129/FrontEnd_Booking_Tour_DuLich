import React, { useEffect, useState } from "react";
import CommonSection from "../shared/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { useLocation, useSearchParams } from "react-router-dom";
import TourCard from "../shared/TourCard";
import Newsletter from "../shared/Newsletter";
import { BASE_URL } from "../utils/config";
import { useLanguage } from "../i18n/LanguageContext";

const SearchResultList = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState(null);

  const city = searchParams.get("city");
  const distance = searchParams.get("distance");
  const maxGroupSize = searchParams.get("maxGroupSize");

  useEffect(() => {
    if (location.state) {
      setData(location.state);
      setLoading(false);
      return;
    }

    if (!city || !distance || !maxGroupSize) {
      setLoading(false);
      setData([]);
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${BASE_URL}/tours/search/getTourBySearch?city=${encodeURIComponent(city)}&distance=${encodeURIComponent(distance)}&maxGroupSize=${encodeURIComponent(maxGroupSize)}`,
        );
        if (!res.ok) throw new Error(t("toast.searchFailed"));
        const result = await res.json();
        setData(result.data || []);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [location.state, t, city, distance, maxGroupSize, language]);

  return (
    <>
      <CommonSection title={t("tours.searchTitle")} />
      <section>
        <Container>
          {loading && (
            <h4 className="loading-state text-center pt-5">
              {t("tours.searching")}
            </h4>
          )}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row>
              {data?.length === 0 ? (
                <h4 className="text-center bookings-empty w-100">
                  {t("tours.notFound")}
                </h4>
              ) : (
                data?.map((tour) => (
                  <Col lg="3" md="6" xs="12" className="mb-4" key={tour._id}>
                    <TourCard tour={tour} />
                  </Col>
                ))
              )}
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};
export default SearchResultList;

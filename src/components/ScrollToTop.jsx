import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/scroll-to-top.css";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className="scroll-to-top"
      onClick={scrollUp}
      aria-label="Scroll to top"
    >
      <i className="ri-arrow-up-line"></i>
    </button>
  );
};

export default ScrollToTop;

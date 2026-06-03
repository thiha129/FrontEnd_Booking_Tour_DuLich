import React, { useRef, useEffect, useContext } from "react";
import { Container, Row, Button } from "reactstrap";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo3.png";
import "./header.css";
import { AuthContext } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useLanguage } from "../../i18n/LanguageContext";
import LanguageSwitcher from "../LanguageSwitcher";
import { BASE_URL } from "../../utils/config";

const SCROLL_THRESHOLD = 80;
const HOME_PATH = "/home";

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, dispatch } = useContext(AuthContext);
  const { wishlistCount } = useWishlist();
  const { t } = useLanguage();

  const isHome = pathname === HOME_PATH;

  const navLinks = [
    { path: "/home", label: t("nav.home") },
    { path: "/tours", label: t("nav.tours") },
    { path: "/about", label: t("nav.about") },
    { path: "/contact", label: t("nav.contact") },
    ...(user?.role === "admin" ? [{ path: "/admin", label: t("nav.admin") }] : []),
  ];

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // still clear client state if network fails
    }
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  useEffect(() => {
    const updateSolidHeader = () => {
      const scrolled =
        document.body.scrollTop > SCROLL_THRESHOLD ||
        document.documentElement.scrollTop > SCROLL_THRESHOLD;

      const shouldSolid = !isHome || scrolled;
      headerRef.current?.classList.toggle("header--solid", shouldSolid);
    };

    updateSolidHeader();
    window.addEventListener("scroll", updateSolidHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateSolidHeader);
  }, [isHome, pathname]);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");
  const closeMenu = () => menuRef.current.classList.remove("show__menu");

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            <div className="logo">
              <Link to="/home">
                <img src={logo} alt="Travel Booking" />
              </Link>
            </div>

            <div className="navigation" ref={menuRef} onClick={closeMenu}>
              <ul
                className="menu d-flex align-items-center gap-5"
                onClick={(e) => e.stopPropagation()}
              >
                {navLinks.map((item) => (
                  <li className="nav__item" key={item.path}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active__link" : ""
                      }
                      onClick={closeMenu}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav__right d-flex align-items-center gap-3">
              <LanguageSwitcher />
              <Link
                to="/wishlist"
                className="nav__wishlist"
                onClick={closeMenu}
                title={t("nav.wishlist")}
              >
                <i className="ri-heart-line"></i>
                {wishlistCount > 0 && (
                  <span className="nav__wishlist-badge">{wishlistCount}</span>
                )}
              </Link>
              <div className="nav__btns d-flex align-items-center gap-3">
                {user ? (
                  <>
                    <Link
                      to={`/userinfo/${user._id}`}
                      className="user__info d-flex align-items-center gap-2"
                    >
                      <i className="ri-user-line text-black"></i>
                      <h5 className="mb-0">{user.username}</h5>
                    </Link>
                    <Button className="btn btn-dark" onClick={logout}>
                      {t("nav.logout")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="btn secondary__btn">
                      <Link to="/login">{t("nav.login")}</Link>
                    </Button>
                    <Button className="btn primary__btn">
                      <Link to="/register">{t("nav.register")}</Link>
                    </Button>
                  </>
                )}
              </div>
              <span className="mobile__menu" onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};
export default Header;

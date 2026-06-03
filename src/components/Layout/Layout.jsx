import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Routers from "../../router/Routers";
import ScrollToTop from "../ScrollToTop";

const AUTH_PATHS = ["/login", "/register"];

const Layout = () => {
    const { pathname } = useLocation();
    const isAuthPage = AUTH_PATHS.includes(pathname);

    return (
        <>
        <ScrollToTop />
        {!isAuthPage && <Header />}
        <main className={isAuthPage ? "app-main" : "app-main app-main--with-header"}>
            <Routers />
        </main>
        {!isAuthPage && <Footer />}
        </>
    );
}
export default Layout;

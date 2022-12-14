import React from "react";
import Footer from "./Footer";
import Navbar from "./navbar/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="cc-container">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;

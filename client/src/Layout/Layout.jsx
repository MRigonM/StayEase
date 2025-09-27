import React from "react";
import { Footer } from "../components/footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
   
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;

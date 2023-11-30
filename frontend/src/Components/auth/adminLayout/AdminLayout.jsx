import Navbar from "../../utilis/Navbar";
import Footer from "../../utilis/Footer";
import { Outlet } from "react-router-dom";

import React from "react";
import Sidebar from "../../utilis/Sidebar";

function AdminLayout() {
  return (
    <div className="main-wrapper">
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default AdminLayout;

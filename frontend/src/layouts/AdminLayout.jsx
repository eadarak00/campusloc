import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

const AdminLayout = () => {
  return (
    <div
      className="d-flex flex-column min-vh-100 bailleur-layout"
      style={{ backgroundColor: "#FAF9F6", color: "#374151" }}
    >
      <Sidebar>
        <Outlet />
      </Sidebar>
    </div>
  );
};

export default AdminLayout;

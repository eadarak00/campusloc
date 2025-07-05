import React from "react";
import { Outlet } from "react-router-dom";
import SidebarTopbar from "../components/bailleur/SidebarTop";

const BailleurLayout = () => {
  return (
    <div
      className="d-flex flex-column min-vh-100 bailleur-layout"
      style={{ backgroundColor: "#FAF9F6", color: "#374151" }}
    >
      <SidebarTopbar>
        <Outlet />
      </SidebarTopbar>
    </div>
  );
};

export default BailleurLayout;

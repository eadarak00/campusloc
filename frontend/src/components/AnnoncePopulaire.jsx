// AnnoncesPopulaires.jsx
import React from "react";
import { Button, Dropdown, Menu } from "antd";
import {
  FilterOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "../styles/AnnoncesPopulaires.css";

const menuItems = (label) => ({
  items: [
    { key: "1", label: `${label} option 1` },
    { key: "2", label: `${label} option 2` },
  ],
});

const AnnoncesPopulaires = () => {
  return (
    <div className="annonces-container container">
      <h2 className="annonces-title">Annonces Populaires</h2>
      <div className="annonces-filters">
        <Button icon={<FilterOutlined />} className="filter-btn">
          Filter
        </Button>

        <Dropdown menu={menuItems("Chambre")}>
          <Button className="dropdown-btn">
            Chambre <DownOutlined />
          </Button>
        </Dropdown>

        <Dropdown menu={menuItems("Price")}>
          <Button className="dropdown-btn">
            Price <DownOutlined />
          </Button>
        </Dropdown>

        <Dropdown menu={menuItems("Location")}>
          <Button className="dropdown-btn">
            Location <DownOutlined />
          </Button>
        </Dropdown>

        <Button className="voir-tous-btn">Voir Tous</Button>
      </div>
    </div>
  );
};

export default AnnoncesPopulaires;

import React from "react";
import { Card, Typography, Row, Col } from "antd";
import {
  HomeOutlined,
  PlusCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/routes";

const { Title, Paragraph } = Typography;

const AnnoncesBailleur = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
  
  const handleNavigate = (path) => {
    navigate(path);
  }

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} xl={8}>
          <Card 
          bordered 
          hoverable
          onClick={() =>  handleNavigate(ROUTES.ANNONCES_ACTIFS_BAILLEUR)}
          >
            <Card.Meta
              avatar={
                <HomeOutlined style={{ fontSize: 32, color: "#4F46E5" }} />
              }
              title="Mes annonces"
              description="Voir, modifier ou supprimer vos annonces."
            />
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card bordered hoverable
          onClick={() =>  handleNavigate(ROUTES.CREATION_ANNONCE)

          }
          >
            <Card.Meta
              avatar={
                <PlusCircleOutlined
                  style={{ fontSize: 32, color: "#16A34A" }}
                />
              }
              title="Créer une annonce"
              description="Publiez une nouvelle location rapidement."
            />
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card bordered hoverable
           onClick={() =>  handleNavigate(ROUTES.ANNONCES_EN_ATTENTES)}
          >
            <Card.Meta
              avatar={
                <ClockCircleOutlined
                  style={{ fontSize: 32, color: "#F59E0B" }}
                />
              }
              title="En attente"
              description="Annonces en cours de validation."
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnnoncesBailleur;

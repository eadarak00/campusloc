import React from "react";
import { Card, Typography, Row, Col } from "antd";
import {
  HomeOutlined,
  PlusCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/routes";
import { getAdminFromStorage } from "../../utils/authUtils";

const { Title, Paragraph } = Typography;

const AnnoncesAdmin = () => {
  const navigate = useNavigate();
  const userData = getAdminFromStorage();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} xl={8}>
          <Card
            variant="borderless"
            hoverable
            onClick={() => handleNavigate(ROUTES.TOUTES_ANNONCES_ADMIN)}
          >
            <Card.Meta
              avatar={
                <AppstoreOutlined style={{ fontSize: 32, color: "#6366F1" }} />
              }
              title="Toutes les annonces"
              description="Consultez toutes les annonces de la plateforme."
            />
          </Card>
        </Col>
        
        <Col xs={24} md={12} xl={8}>
          <Card
            variant="borderless"
            hoverable
            onClick={() => handleNavigate(ROUTES.ANNONCES_EN_ATTENTES_ADMIN)}
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

export default AnnoncesAdmin;

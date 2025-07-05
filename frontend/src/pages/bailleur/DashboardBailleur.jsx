import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { HomeOutlined, PlusCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const DashboardBailleur = () => {
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Bienvenue, {userData.prenom} 👋</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} xl={8}>
          <Card bordered hoverable>
            <Card.Meta
              avatar={<HomeOutlined style={{ fontSize: 32, color: '#4F46E5' }} />}
              title="Mes annonces"
              description="Voir, modifier ou supprimer vos annonces."
            />
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card bordered hoverable>
            <Card.Meta
              avatar={<PlusCircleOutlined style={{ fontSize: 32, color: '#16A34A' }} />}
              title="Créer une annonce"
              description="Publiez une nouvelle location rapidement."
            />
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card bordered hoverable>
            <Card.Meta
              avatar={<ClockCircleOutlined style={{ fontSize: 32, color: '#F59E0B' }} />}
              title="En attente"
              description="Annonces en cours de validation."
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardBailleur;

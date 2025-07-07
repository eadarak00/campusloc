import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { HomeOutlined, PlusCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const DashboardBailleur = () => {
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Bienvenue, {userData.prenom} 👋</Title>

    </div>
  );
};

export default DashboardBailleur;

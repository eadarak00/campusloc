import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { HomeOutlined, PlusCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getAdminFromStorage } from '../../utils/authUtils';

const { Title, Paragraph } = Typography;

const DashboardAdmin = () => {
  const user = getAdminFromStorage();

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Bienvenue, cher {user.prenom} 👋</Title>

    </div>
  );
};

export default DashboardAdmin;

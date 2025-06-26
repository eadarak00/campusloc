import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Space } from 'antd';
import { HomeOutlined, NotificationOutlined, InfoCircleOutlined, ContactsOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import '../styles/navbar.css'

const { Header } = Layout;

export default function Navbar() {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
    //   icon: <HomeOutlined />,
      label: <Link to="/">Accueil</Link>,
    },
    {
      key: '/annonces',
    //   icon: <NotificationOutlined />,
      label: <Link to="/annonces">Annonce</Link>,
    },
    {
      key: '/a-propos',
    //   icon: <InfoCircleOutlined />,
      label: <Link to="/a-propos">A Propos</Link>,
    },
    {
      key: '/contact',
    //   icon: <ContactsOutlined />,
      label: <Link to="/contact">Contact</Link>,
    },
  ];

  return (
    <Header 
      style={{ 
        backgroundColor: '#FCFBF8',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }} className='font-poppins font-semibold'>
        <Link 
          to="/" 
          style={{ 
            fontSize: '24px', 
            color: '#C58A51',
            textDecoration: 'none'
          }}
          className='font-poppins font-semibold'    
        >
          CampusLoc
        </Link>
      </div>

      {/* Menu de navigation */}
      <Menu
        mode="horizontal"
        className='font-poppins font-medium navbar-link'
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ 
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '16px',
          fontWeight: '500',
          flex: 1,
          justifyContent: 'center'
        }}
      />

      {/* Boutons de droite */}
      <Space size="middle">
        <Link to="/connexion">
          <Button
            type="primary"
            shape="round"
            size="middle"
            className='button-primary font-medium'
          >
            Se connecter
          </Button>
        </Link>
        <Link to="/inscription">
          <Button
            type="primary"
            shape="round"
            size="middle"
            className='button-black font-medium'
          >
            S'inscrire
          </Button>
        </Link>
      </Space>
    </Header>
  );
}
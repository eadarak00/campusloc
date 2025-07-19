import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Space, Drawer, Badge, Avatar, Dropdown } from 'antd';
import { 
  HomeOutlined, 
  NotificationOutlined, 
  HeartOutlined, 
  ContactsOutlined, 
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import '../styles/navbar.css'

const { Header } = Layout;

export default function NavbarProspect({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Menu items pour la navigation principale
  const menuItems = [
    {
      key: '/',
      label: <Link to="/" onClick={() => setDrawerVisible(false)}>Accueil</Link>,
    },
    {
      key: '/annonces',
      label: <Link to="/annonces" onClick={() => setDrawerVisible(false)}>Annonce</Link>,
    },
    {
      key: '/a-propos',
      label: <Link to="/a-propos" onClick={() => setDrawerVisible(false)}>A Propos</Link>,
    },
    {
      key: '/contact',
      label: <Link to="/contact" onClick={() => setDrawerVisible(false)}>Contact</Link>,
    },
  ];

  // Menu items pour l'avatar dropdown
  const avatarMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profil">Mon Profil</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/paramètres">Paramètres</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Déconnexion',
      onClick: handleLogout,
    },
  ];

  function handleLogout() {
    // Logique de déconnexion
    console.log('Déconnexion...');
    // Redirection vers la page d'accueil
    navigate('/');
  }

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  return (
    <Header 
      style={{ 
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: '0 5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'relative'
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }} className='font-poppins font-semibold campusloc-title'>
        <Link 
          to="/" 
          style={{ 
            fontSize: '20px', 
            color: '#C58A51',
            textDecoration: 'none'
          }}
          className='font-poppins font-semibold'    
        >
          CampusLoc
        </Link>
      </div>

      {/* Menu Desktop - Caché sur mobile */}
      <Menu
        mode="horizontal"
        className='font-poppins font-medium navbar-link desktop-menu'
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ 
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '16px',
          fontWeight: '500',
          flex: 1,
          justifyContent: 'center',
          display: 'none'
        }}
      />

      {/* Actions utilisateur connecté - Desktop */}
      <Space size="middle" className="desktop-buttons" style={{ display: 'none' }}>
        {/* Notifications */}
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<NotificationOutlined />}
            size="large"
            style={{ color: '#C58A51' }}
            onClick={() => navigate('/notifications')}
          />
        </Badge>

        {/* Favoris */}
        <Badge count={5} size="small">
          <Button
            type="text"
            icon={<HeartOutlined />}
            size="large"
            style={{ color: '#C58A51' }}
            onClick={() => navigate('/favoris')}
          />
        </Badge>

        {/* Contacts */}
        <Button
          type="text"
          icon={<ContactsOutlined />}
          size="large"
          style={{ color: '#C58A51' }}
          onClick={() => navigate('/contacts')}
        />

        {/* Avatar avec menu déroulant */}
        <Dropdown
          menu={{
            items: avatarMenuItems,
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Avatar 
              size={40}
              src={user?.avatar}
              style={{ backgroundColor: '#C58A51' }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <span className='font-poppins font-medium' style={{ color: '#333', fontSize: '14px' }}>
              {user?.name || 'Utilisateur'}
            </span>
          </div>
        </Dropdown>
      </Space>

      {/* Bouton Menu Mobile - Visible uniquement sur mobile */}
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={showDrawer}
        className="mobile-menu-button"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#C58A51',
          fontSize: '18px'
        }}
      />

      {/* Drawer pour menu mobile */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className='font-poppins font-semibold' style={{ color: '#C58A51', fontSize: '20px' }}>
              CampusLoc
            </span>
            <Avatar 
              size={32}
              src={user?.avatar}
              style={{ backgroundColor: '#C58A51' }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </div>
        }
        placement="right"
        closable={true}
        onClose={onClose}
        open={drawerVisible}
        width={280}
        styles={{
          body: { padding: 0 }
        }}
      >
        {/* Informations utilisateur dans le drawer */}
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
          <Avatar 
            size={64}
            src={user?.avatar}
            style={{ backgroundColor: '#C58A51', marginBottom: '8px' }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <div className='font-poppins font-medium' style={{ fontSize: '16px', color: '#333' }}>
            {user?.name || 'Utilisateur'}
          </div>
          <div className='font-poppins' style={{ fontSize: '14px', color: '#666' }}>
            {user?.email || 'email@example.com'}
          </div>
        </div>

        {/* Actions rapides dans le drawer mobile */}
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <Space size="large" style={{ width: '100%', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <Badge count={3} size="small">
                <Button
                  type="text"
                  icon={<NotificationOutlined />}
                  size="large"
                  style={{ color: '#C58A51' }}
                  onClick={() => {
                    navigate('/notifications');
                    setDrawerVisible(false);
                  }}
                />
              </Badge>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Notifications</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Badge count={5} size="small">
                <Button
                  type="text"
                  icon={<HeartOutlined />}
                  size="large"
                  style={{ color: '#C58A51' }}
                  onClick={() => {
                    navigate('/favoris');
                    setDrawerVisible(false);
                  }}
                />
              </Badge>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Favoris</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button
                type="text"
                icon={<ContactsOutlined />}
                size="large"
                style={{ color: '#C58A51' }}
                onClick={() => {
                  navigate('/contacts');
                  setDrawerVisible(false);
                }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Contacts</div>
            </div>
          </Space>
        </div>

        {/* Menu de navigation */}
        <Menu
          mode="vertical"
          className='font-poppins font-medium'
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ 
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '16px',
            fontWeight: '500'
          }}
        />
        
        {/* Actions utilisateur dans le drawer mobile */}
        <div style={{ padding: '20px 16px', borderTop: '1px solid #f0f0f0' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Link to="/profil" style={{ display: 'block' }}>
              <Button
                type="text"
                icon={<UserOutlined />}
                size="large"
                block
                className='font-medium'
                style={{ 
                  textAlign: 'left',
                  color: '#333',
                  height: '40px'
                }}
                onClick={() => setDrawerVisible(false)}
              >
                Mon Profil
              </Button>
            </Link>
            
            <Link to="/paramètres" style={{ display: 'block' }}>
              <Button
                type="text"
                icon={<SettingOutlined />}
                size="large"
                block
                className='font-medium'
                style={{ 
                  textAlign: 'left',
                  color: '#333',
                  height: '40px'
                }}
                onClick={() => setDrawerVisible(false)}
              >
                Paramètres
              </Button>
            </Link>

            <Button
              type="primary"
              icon={<LogoutOutlined />}
              size="large"
              block
              danger
              className='font-medium'
              onClick={() => {
                handleLogout();
                setDrawerVisible(false);
              }}
              style={{ marginTop: '16px' }}
            >
              Déconnexion
            </Button>
          </Space>
        </div>
      </Drawer>
    </Header>
  );
}
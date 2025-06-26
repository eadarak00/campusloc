// import React from 'react';
// import { Link, useLocation } from "react-router-dom";
// import { Layout, Menu, Button, Space } from 'antd';
// import { HomeOutlined, NotificationOutlined, InfoCircleOutlined, ContactsOutlined } from '@ant-design/icons';
// import 'antd/dist/reset.css';
// import '../styles/navbar.css'

// const { Header } = Layout;

// export default function Navbar() {
//   const location = useLocation();

//   const menuItems = [
//     {
//       key: '/',
//     //   icon: <HomeOutlined />,
//       label: <Link to="/">Accueil</Link>,
//     },
//     {
//       key: '/annonces',
//     //   icon: <NotificationOutlined />,
//       label: <Link to="/annonces">Annonce</Link>,
//     },
//     {
//       key: '/a-propos',
//     //   icon: <InfoCircleOutlined />,
//       label: <Link to="/a-propos">A Propos</Link>,
//     },
//     {
//       key: '/contact',
//     //   icon: <ContactsOutlined />,
//       label: <Link to="/contact">Contact</Link>,
//     },
//   ];

//   return (
//     <Header 
//       style={{ 
//         backgroundColor: '#FCFBF8',
//         boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
//         padding: '0 24px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         height: '64px'
//       }}
//     >
//       {/* Logo */}
//       <div style={{ display: 'flex', alignItems: 'center' }} className='font-poppins font-semibold'>
//         <Link 
//           to="/" 
//           style={{ 
//             fontSize: '24px', 
//             color: '#C58A51',
//             textDecoration: 'none'
//           }}
//           className='font-poppins font-semibold'    
//         >
//           CampusLoc
//         </Link>
//       </div>

//       {/* Menu de navigation */}
//       <Menu
//         mode="horizontal"
//         className='font-poppins font-medium navbar-link'
//         selectedKeys={[location.pathname]}
//         items={menuItems}
//         style={{ 
//           backgroundColor: 'transparent',
//           border: 'none',
//           fontSize: '16px',
//           fontWeight: '500',
//           flex: 1,
//           justifyContent: 'center'
//         }}
//       />

//       {/* Boutons de droite */}
//       <Space size="middle">
//         <Link to="/connexion">
//           <Button
//             type="primary"
//             shape="round"
//             size="middle"
//             className='button-primary font-medium'
//           >
//             Se connecter
//           </Button>
//         </Link>
//         <Link to="/inscription">
//           <Button
//             type="primary"
//             shape="round"
//             size="middle"
//             className='button-black font-medium'
//           >
//             S'inscrire
//           </Button>
//         </Link>
//       </Space>
//     </Header>
//   );
// }

import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Space, Drawer } from 'antd';
import { HomeOutlined, NotificationOutlined, InfoCircleOutlined, ContactsOutlined, MenuOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import '../styles/navbar.css'

const { Header } = Layout;

export default function Navbar() {
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);

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

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  return (
    <Header 
      style={{ 
        backgroundColor: '#FCFBF8',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'relative'
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }} className='font-poppins font-semibold'>
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

      {/* Boutons Desktop - Cachés sur mobile */}
      <Space size="small" className="desktop-buttons" style={{ display: 'none' }}>
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
          <span className='font-poppins font-semibold' style={{ color: '#C58A51', fontSize: '20px' }}>
            CampusLoc
          </span>
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
        
        {/* Boutons dans le drawer mobile */}
        <div style={{ padding: '20px 16px', borderTop: '1px solid #f0f0f0' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Link to="/connexion" style={{ display: 'block' }}>
              <Button
                type="primary"
                shape="round"
                size="large"
                block
                className='button-primary font-medium'
                onClick={() => setDrawerVisible(false)}
              >
                Se connecter
              </Button>
            </Link>
            <Link to="/inscription" style={{ display: 'block' }}>
              <Button
                type="primary"
                shape="round"
                size="large"
                block
                className='button-black font-medium'
                onClick={() => setDrawerVisible(false)}
              >
                S'inscrire
              </Button>
            </Link>
          </Space>
        </div>
      </Drawer>
    </Header>
  );
}
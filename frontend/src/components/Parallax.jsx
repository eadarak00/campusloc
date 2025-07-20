import React, { useState, useEffect } from 'react';
import { Button, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

import "../../src/styles/parallax.css"

const ParallaxHousing = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.5}px)`,
  };

  const backgroundStyle = {
    transform: `translateY(${scrollY * 0.3}px)`,
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="parallax-container">
        <div className="parallax__background-layer" 
        // style={backgroundStyle}
        ></div>
        <div className="parallax__content-layer" 
        // style={parallaxStyle}
        >
          <div className="parallax__hero-content">
            <h1 className="parallax__main-title">
              Trouvez un logement près du campus en quelques clics.
            </h1>
            <p className="parallax__subtitle">
              Étudiants, professeurs... CampusLoc simplifie votre recherche<br />
              de logement à petit prix
            </p>
            <div className="parallax__button-container">
              <Space size="middle" wrap>
                <Button 
                  type="default" 
                  size="large" 
                  icon={<SearchOutlined />}
                  className="search-btn"
                >
                  Rechercher un logement
                </Button>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<PlusOutlined />}
                  className="publish-btn"
                >
                  Publier une annonce
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxHousing;
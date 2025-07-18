import React from 'react';
import { SearchOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';

import '../styles/process.css'

const ProcessSteps = () => {
  const steps = [
    {
      number: 'No.1',
      title: 'Rechercher un logement',
      description: 'Utilisez les filtres pour trouver un logement proche du campus',
      icon: <SearchOutlined />
    },
    {
      number: 'No.2',
      title: 'Payer pour contacter',
      description: 'Payez une petite commission pour débloquer le contact',
      icon: <CreditCardOutlined />
    },
    {
      number: 'No.3',
      title: 'Visitez et validez',
      description: 'Contactez le bailleur, visitez et emménagez',
      icon: <CheckCircleOutlined />
    }
  ];

  return (
    <div className="ps-container container-fluid">
      <div className="ps-wrapper">
        {steps.map((step, index) => (
          <div key={index} className="ps-step">
            <div className="ps-number">{step.number}</div>
            <h3 className="ps-title">{step.title}</h3>
            <p className="ps-description">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessSteps;
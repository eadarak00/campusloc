// PaymentModal.js
import React, { useState } from "react";
import { Modal, Button, Radio, Space, Typography, message, Card } from "antd";
import {
  CreditCardOutlined,
  MobileOutlined,
  PhoneOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import OrangeLogo from "../assets/logos/orangeMoney.jpg";
import WaveLogo from "../assets/logos/wave.png";

const { Text } = Typography;

const PaymentModal = ({ visible, onClose, onPaiementConfirm, contactId }) => {
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    if (!selectedOperator) {
      message.warning("Veuillez sélectionner un opérateur de paiement.");
      return;
    }
    setLoading(true);
    await onPaiementConfirm(contactId, selectedOperator);
    setLoading(false);
    onClose(); // Ferme la modale après avoir lancé le paiement
  };

  // const paymentOptions = [
  //   {
  //     value: "ORANGE_MONEY",
  //     label: "Orange Money",
  //     icon: <PhoneOutlined className="text-2xl text-orange-600" />,
  //     description: "Paiement mobile Orange",
  //     color: "#FF6600"
  //   },
  //   {
  //     value: "WAVE",
  //     label: "Wave",
  //     icon: <WalletOutlined className="text-2xl text-sky-400" />,
  //     description: "Portefeuille mobile Wave",
  //     color: "#00D4FF"
  //   }
  // ];

  const paymentOptions = [
    {
      value: "ORANGE_MONEY",
      label: "Orange Money",
      icon: (
        <img
          src={OrangeLogo}
          alt="Orange Money"
            className="w-20 h-20 object-contain"
        />
      ),
      description: "Paiement mobile Orange",
      color: "#FF6600",
    },
    {
      value: "WAVE",
      label: "Wave",
      icon: (
        <img src={WaveLogo} alt="Wave"   className="w-20 h-20 object-contain" />
      ),
      description: "Portefeuille mobile Wave",
      color: "#00D4FF",
    },
  ];

  return (
    <Modal
      title={
        <div className="text-center">
          <CreditCardOutlined className="mr-2 text-blue-500" />
          Choisir le mode de paiement
        </div>
      }
      visible={visible}
      onCancel={onClose}
      width={500}
      className="payment-modal"
      footer={[
        <Button key="back" onClick={onClose}>
          Annuler
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
          disabled={!selectedOperator}
        >
          Procéder au paiement
        </Button>,
      ]}
    >
      <div className="py-5">
        <Text strong className="block mb-5 text-center">
          Sélectionnez votre opérateur mobile préféré :
        </Text>

        <Radio.Group
          onChange={(e) => setSelectedOperator(e.target.value)}
          value={selectedOperator}
          className="w-full"
        >
          <Space direction="vertical" size="large" className="w-full">
            {paymentOptions.map((option) => (
              <Card
                key={option.value}
                hoverable
                className={`
                  ${
                    selectedOperator === option.value
                      ? `border-2 shadow-lg`
                      : "border border-gray-300"
                  } 
                  rounded-lg transition-all duration-300 ease-in-out cursor-pointer
                  hover:shadow-md
                `}
                style={{
                  borderColor:
                    selectedOperator === option.value
                      ? option.color
                      : undefined,
                }}
                bodyStyle={{ padding: "16px" }}
                onClick={() => setSelectedOperator(option.value)}
              >
                <Radio value={option.value} className="w-full">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center w-20 h-20  bg-white shadow-md border"
                      style={{
                        backgroundColor: `${option.color}15`,
                        borderColor: `${option.color}30`,
                      }}
                    >
                      {option.icon}
                    </div>
                    <div>
                      <Text
                        strong
                        className="text-base"
                        style={{ color: option.color }}
                      >
                        {option.label}
                      </Text>
                      <br />
                      <Text type="secondary" className="text-sm">
                        {option.description}
                      </Text>
                    </div>
                  </div>
                </Radio>
              </Card>
            ))}
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default PaymentModal;

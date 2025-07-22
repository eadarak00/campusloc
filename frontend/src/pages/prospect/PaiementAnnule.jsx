import React from "react";
import { Result, Button } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import ROUTES from "../../routes/routes";

const PaiementAnnule = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");


  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 px-4">
      <Result
        status="warning"
        title="Paiement annulé"
        subTitle="Vous avez annulé le paiement. Vous pouvez réessayer à tout moment."
        extra={[
          <Button type="primary" key="retry" onClick={() => navigate(ROUTES.CONTACTS_PROSPECT)}>
            Revenir aux contacts
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaiementAnnule;

import React, { useState, useEffect } from "react";
import { Segmented, Table, Tag, Button, Space, Spin, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getAllActivesAnnonces,
  getAllAnnonces,
  getAllInactivesAnnonces,
} from "../../api/annonceAPI";

const getTypeLogementText = (type) => {
  const types = {
    CHAMBRE_INDIVIDUELLE: "Chambre individuelle",
    CHAMBRE_PARTAGEE: "Chambre partagée",
    APPARTEMENT: "Appartement",
    MAISON: "Maison",
    STUDIO: "Studio",
  };
  return types[type] || type;
};

const formatPrice = (price, charges = 0) => {
  return charges > 0
    ? `${price}€/mois + ${charges}€ charges`
    : `${price}€/mois`;
};

const ListeAnnoncesAdmin = () => {
  const [filter, setFilter] = useState("TOUTES");
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAnnonces = async (statut) => {
    setLoading(true);
    try {
      let data = [];

      switch (statut) {
        case "ACTIVES":
          data = (await getAllActivesAnnonces()).data;
          break;

        case "INACTIVES":
          data = (await getAllInactivesAnnonces()).data;
          break;

        case "VALIDÉES":
          data = (await getAllAnnonces()).data.filter(
            (a) => a.statut === "ACCEPTER"
          );
          break;

        case "REFUSÉES":
          data = (await getAllAnnonces()).data.filter(
            (a) => a.statut === "REFUSER"
          );
          break;

        default:
          data = (await getAllAnnonces()).data;
          break;
      }

      setAnnonces(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Erreur lors du chargement des annonces");
      setAnnonces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces(filter);
  }, [filter]);

  const columns = [
    {
      title: "Titre",
      dataIndex: "titre",
      key: "titre",
    },
    {
      title: "Type de logement",
      dataIndex: "typeDeLogement",
      key: "typeDeLogement",
      render: (type) => <Tag color="blue">{getTypeLogementText(type)}</Tag>,
    },
    {
      title: "Prix",
      key: "prix",
      render: (_, record) => formatPrice(record.prix, record.charges),
    },
    {
      title: "Adresse",
      key: "adresse",
      render: (_, record) => `${record.adresse || "-"}, ${record.ville || "-"}`,
    },
    {
      title: "Pièces",
      dataIndex: "pieces",
      key: "pieces",
      render: (val) => `${val || 0} pièce(s)`,
    },
    {
      title: "Propriétaire",
      key: "proprietaire",
      render: (_, record) => record.nomProprietaire || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/annonces/${record.id}`)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Segmented
        options={["TOUTES", "ACTIVES", "INACTIVES", "VALIDÉES", "REFUSÉES"]}
        value={filter}
        onChange={setFilter}
        block
        style={{ marginBottom: 24 }}
      />

      {loading ? (
        <Spin tip="Chargement des annonces...">
          <div style={{ minHeight: 200 }} />
        </Spin>
      ) : (
        <Table
          columns={columns}
          dataSource={Array.isArray(annonces) ? annonces : []}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default ListeAnnoncesAdmin;

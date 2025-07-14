import React, { useEffect, useState } from "react";
import { Table, Button, Tag, message, Popconfirm, Space } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  acceptAnnonce,
  getPendingAnnonces,
  refuseAnnonce,
} from "../../api/annonceAPI";
import { useNavigate } from "react-router-dom";

const AnnonceAValider = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const fetchAnnonces = async () => {
    setLoading(true);
    try {
      const response = await getPendingAnnonces();
      setAnnonces(response.data || []);
    } catch (error) {
      message.error("Erreur lors du chargement des annonces.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptAnnonce(id);
      message.success("Annonce acceptée !");
      fetchAnnonces();
    } catch (error) {
      message.error("Erreur lors de l'acceptation.");
    }
  };

  const handleRefuse = async (id) => {
    try {
      await refuseAnnonce(id);
      message.success("Annonce refusée !");
      fetchAnnonces();
    } catch (error) {
      message.error("Erreur lors du refus.");
    }
  };

  const handleShowDetails = (id) => {
    navigate(`/admin/annonces/${id}`);
  };

  const handleBatchAction = async (action) => {
    if (selectedRowKeys.length === 0) {
      return message.warning("Aucune annonce sélectionnée.");
    }

    setLoading(true);
    const actionFn = action === "accept" ? acceptAnnonce : refuseAnnonce;
    const actionLabel = action === "accept" ? "acceptée(s)" : "refusée(s)";

    try {
      await Promise.all(selectedRowKeys.map((id) => actionFn(id)));
      message.success(`Annonce(s) ${actionLabel} avec succès`);
      setSelectedRowKeys([]);
      fetchAnnonces();
    } catch (error) {
      message.error(`Erreur lors du traitement des annonces`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const columns = [
    {
      title: "Titre",
      dataIndex: "titre",
      key: "titre",
    },
    {
      title: "Type",
      dataIndex: "typeDeLogement",
      key: "typeDeLogement",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Ville",
      dataIndex: "ville",
      key: "ville",
    },
    {
      title: "Prix",
      dataIndex: "prix",
      key: "prix",
      render: (prix) => `${prix} €`,
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (statut) => <Tag color="orange">{statut}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleShowDetails(record.id)}>
            Détails
          </Button>
          <Popconfirm
            title="Confirmer l'acceptation ?"
            onConfirm={() => handleAccept(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="primary" icon={<CheckOutlined />} />
          </Popconfirm>
          <Popconfirm
            title="Confirmer le refus ?"
            onConfirm={() => handleRefuse(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button danger icon={<CloseOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Annonces à valider</h2>

      <Space style={{ marginBottom: 16 }}>
        <Popconfirm
          title="Confirmer l'acceptation des annonces sélectionnées ?"
          onConfirm={() => handleBatchAction("accept")}
          okText="Oui"
          cancelText="Non"
        >
          <Button type="primary" icon={<CheckOutlined />} disabled={selectedRowKeys.length === 0}>
            Accepter sélectionnées
          </Button>
        </Popconfirm>

        <Popconfirm
          title="Confirmer le refus des annonces sélectionnées ?"
          onConfirm={() => handleBatchAction("refuse")}
          okText="Oui"
          cancelText="Non"
        >
          <Button danger icon={<CloseOutlined />} disabled={selectedRowKeys.length === 0}>
            Refuser sélectionnées
          </Button>
        </Popconfirm>
      </Space>

      <Table
        columns={columns}
        dataSource={annonces}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AnnonceAValider;

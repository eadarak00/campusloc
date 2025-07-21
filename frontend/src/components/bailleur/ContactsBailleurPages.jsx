import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Card, Button, message } from "antd";
import { MailOutlined, UserOutlined, CalendarOutlined, TagFilled } from "@ant-design/icons";
import { listerContactsDuBailleur } from "../../api/ContactAPI";

const { Title, Text } = Typography;

const ContactsBailleurPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await listerContactsDuBailleur();
        setContacts(res.data || []);
      } catch (error) {
        message.error("Erreur de chargement des contacts.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleEnvoyerMessage = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const columns = [
    {
      title: (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-500" />
          <span>Prospect</span>
        </div>
      ),
      dataIndex: "nomProspect",
      key: "nomProspect",
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-900">{text} {record.prenomProspect}</div>
          <div className="text-sm text-gray-500">{record.emailProspect}</div>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <TagFilled className="text-gray-500" />
          <span>Annonce</span>
        </div>
      ),
      dataIndex: "titreAnnonce",
      key: "titreAnnonce",
      render: (text) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-gray-500" />
          <span>Date de contact</span>
        </div>
      ),
      dataIndex: "dateContact",
      key: "dateContact",
      render: (text) => (
        <div className="text-sm text-gray-700">
          {new Date(text).toLocaleDateString("fr-FR")}<br />
          <span className="text-xs text-gray-400">
            {new Date(text).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<MailOutlined />}
          onClick={() => handleEnvoyerMessage(record.emailProspect)}
        >
          Envoyer message
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6 shadow-sm">
          <Title level={2}>Contacts validés</Title>
          <Text>Liste des contacts avec les prospects ayant payé</Text>
        </Card>

        <Card>
          {loading ? (
            <div className="text-center py-20">
              <Spin size="large" />
              <p className="mt-4 text-gray-500">Chargement en cours...</p>
            </div>
          ) : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={contacts}
              pagination={{
                pageSize: 6,
                showQuickJumper: true,
                showSizeChanger: false,
              }}
              locale={{
                emptyText: "Aucun contact validé trouvé.",
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default ContactsBailleurPage;

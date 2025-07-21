import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, Spin, Card, Segmented, Badge, Button, message } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MailOutlined,
  CalendarOutlined,
  TagFilled,
  PhoneOutlined,
} from "@ant-design/icons";
import { listerContactsParProspect } from "../../api/ContactAPI";

const { Title, Text } = Typography;

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("EN_ATTENTE");

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await listerContactsParProspect();
        setContacts(res.data || []);
      } catch (error) {
        message.error("Erreur de chargement des contacts.");
        console.error("Erreur chargement des contacts :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    setFilteredContacts(contacts.filter(c => c.statut === filterType));
  }, [contacts, filterType]);

  const getStatusColor = (statut) => {
    switch (statut) {
      case "EN_ATTENTE": return "orange";
      case "ACCEPTE": return "green";
      case "REJETE": return "red";
      default: return "gray";
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case "EN_ATTENTE": return "En attente";
      case "ACCEPTE": return "Accepté";
      case "REJETE": return "Rejeté";
      default: return statut;
    }
  };

  const getFilterStats = (status) =>
    contacts.filter(c => c.statut === status).length;

  const handlePaiement = (contactId) => {
    message.info(`Redirection vers paiement pour contact ${contactId}`);
    // Redirection vers /paiement/${contactId} si tu veux
  };

  const handleContacter = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const columns = [
    {
      title: (
        <div className="flex items-center space-x-2">
          <TagFilled className="text-gray-500" />
          <span>Annonce</span>
        </div>
      ),
      dataIndex: "titreAnnonce",
      key: "titreAnnonce",
      render: (text) => (
        <div className="font-semibold text-gray-900">{text}</div>
      ),
    },
    {
      title: (
        <div className="flex items-center space-x-2">
          <CalendarOutlined className="text-gray-500" />
          <span>Date</span>
        </div>
      ),
      dataIndex: "dateContact",
      key: "dateContact",
      render: (text) => (
        <div className="text-sm text-gray-700">
          {new Date(text).toLocaleDateString("fr-FR")}<br />
          <span className="text-xs text-gray-400">
            {new Date(text).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (statut) => (
        <Tag
          color={getStatusColor(statut)}
          icon={statut === "ACCEPTE" ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          className="rounded-full font-medium"
        >
          {getStatusText(statut)}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.statut === "EN_ATTENTE") {
          return (
            <Button type="primary" onClick={() => handlePaiement(record.id)}>
              Procéder au paiement
            </Button>
          );
        } else if (record.statut === "ACCEPTE") {
          return (
            <div className="space-y-1">
              <div className="text-sm text-gray-700">
                <UserOutlined className="mr-1" />
                {record.nomProprietaire} {record.prenomProprietaire}
              </div>
              <div className="text-sm text-gray-500">
                <PhoneOutlined className="mr-1" />
                {record.telephoneProprietaire}
              </div>
              <Button
                type="link"
                onClick={() => handleContacter(record.emailProprietaire)}
              >
                Contacter
              </Button>
            </div>
          );
        } else {
          return <Text type="secondary">Aucune action</Text>;
        }
      },
    },
  ];

  const segmentedOptions = [
    {
      label: (
        <div className="flex items-center gap-1">
          <ClockCircleOutlined className="text-orange-500" />
          <span>En attente</span>
          {/* <Badge count={getFilterStats("EN_ATTENTE")} size="small" /> */}
        </div>
      ),
      value: "EN_ATTENTE",
    },
    {
      label: (
        <div className="flex items-center gap-1">
          <CheckCircleOutlined className="text-green-500" />
          <span>Acceptés</span>
          {/* <Badge count={getFilterStats("ACCEPTE")} size="small" /> */}
        </div>
      ),
      value: "ACCEPTE",
    },
    {
      label: (
        <div className="flex items-center gap-1">
          <ClockCircleOutlined className="text-red-500" />
          <span>Rejetés</span>
          {/* <Badge count={getFilterStats("REJETE")} size="small" /> */}
        </div>
      ),
      value: "REJETE",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Title level={2}>Mes Contacts</Title>
              <Text>Filtrez et suivez vos contacts selon leur statut</Text>
            </div>
            <Segmented
              options={segmentedOptions}
              value={filterType}
              onChange={setFilterType}
              size="large"
            />
          </div>
        </Card>

        {/* Stats Card */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
           <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 shadow-sm">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                 <ClockCircleOutlined className="text-orange-600 text-xl" />
               </div>
               <div>
                 <div className="text-2xl font-bold text-orange-800">{getFilterStats("EN_ATTENTE")}</div>
                 <div className="text-orange-600 font-medium">En attente</div>
               </div>
             </div>
           </Card>

           <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-sm">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                 <CheckCircleOutlined className="text-green-600 text-xl" />
               </div>
               <div>
                 <div className="text-2xl font-bold text-green-800">{getFilterStats("ACCEPTE")}</div>
                 <div className="text-green-600 font-medium">Acceptés</div>
               </div>
             </div>
           </Card>

           <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 shadow-sm">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                 <ClockCircleOutlined className="text-red-600 text-xl" />
               </div>
               <div>
                 <div className="text-2xl font-bold text-red-800">{getFilterStats("REJETE")}</div>
                 <div className="text-red-600 font-medium">Rejetés</div>
               </div>
             </div>
           </Card>
         </div>

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
              dataSource={filteredContacts}
              pagination={{
                pageSize: 6,
                showQuickJumper: true,
                showSizeChanger: false,
              }}
              locale={{
                emptyText: "Aucun contact trouvé pour ce statut.",
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default ContactsPage;

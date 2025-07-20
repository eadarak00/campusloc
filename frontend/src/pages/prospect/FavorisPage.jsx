import React, { useEffect, useState } from "react";
import { Pagination, Empty, message, Spin } from "antd";
import { listerFavoris, supprimerFavori } from "../../api/favorisAPI";
import AnnonceCard from "../../components/bailleur/AnnonceCard";
import { getAnnonceById } from "../../api/annonceAPI";
import '../../styles/Favoris.css'

const FavorisPage = () => {
  const [favoris, setFavoris] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [annoncesParPage] = useState(6);
  const [loading, setLoading] = useState(true);

  const fetchFavoris = async () => {
    try {
      setLoading(true);

      const res = await listerFavoris();
      const favorisIds = res.data?.map((f) => f.annonceId) || [];

      const promises = favorisIds.map((id) => getAnnonceById(id));
      const annonces = await Promise.all(promises);
      const annoncesCompletes = annonces.map((r) => r.data);

      setFavoris(annoncesCompletes);
    } catch (error) {
      console.error("Erreur chargement favoris :", error);
      message.error("Impossible de charger vos favoris");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoris();
  }, []);

  const handleFavoriteChange = async (id, newValue) => {
    if (!newValue) {
      try {
        await supprimerFavori(id);
        setFavoris((prev) => prev.filter((a) => a.id !== id));
        message.success("Annonce retirée des favoris");
      } catch (err) {
        message.error("Erreur lors de la suppression du favori");
      }
    }
  };

  // Pagination
  const indexOfLast = currentPage * annoncesParPage;
  const indexOfFirst = indexOfLast - annoncesParPage;
  const annoncesActuelles = favoris.slice(indexOfFirst, indexOfLast);

  return (
    <div className="favoris-page-container min-h-screen bg-gray-50">
      {/* Header simple */}
      <div className="favoris-page-header border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="favoris-header-content flex items-center justify-between">
            <div>
              <h1 className="favoris-page-title text-2xl font-semibold text-gray-900 mb-1">
                Mes favoris
              </h1>
              {!loading && favoris.length > 0 && (
                <p className="favoris-page-subtitle text-gray-600">
                  {favoris.length} annonce{favoris.length > 1 ? 's' : ''} sauvegardée{favoris.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            <div className="favoris-icon-container">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="favoris-page-content max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="favoris-loading-container flex flex-col items-center justify-center py-16">
            <Spin size="large" />
            <p className="favoris-loading-text text-gray-500 mt-4">
              Chargement...
            </p>
          </div>
        ) : favoris.length === 0 ? (
          <div className="favoris-empty-container">
            <div className="favoris-empty-wrapper bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="favoris-empty-icon w-16 h-16 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <Empty 
                description="Aucune annonce favorite pour le moment"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Grille des annonces */}
            <div className="favoris-grid-container">
              <div className="favoris-grid-wrapper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {annoncesActuelles.map((annonce) => (
                  <div 
                    key={annonce.id} 
                    className="favoris-card-container transition-all duration-200 hover:-translate-y-1"
                  >
                    <AnnonceCard
                      annonce={annonce}
                      isFavorite={true}
                      onFavoriteChange={handleFavoriteChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {favoris.length > annoncesParPage && (
              <div className="favoris-pagination-container flex justify-center">
                <div className="favoris-pagination-wrapper bg-white rounded-lg border border-gray-200 px-6 py-4">
                  <Pagination
                    current={currentPage}
                    total={favoris.length}
                    pageSize={annoncesParPage}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    showTotal={(total, range) => (
                      <span className="favoris-pagination-info text-sm text-gray-500 mr-4">
                        {range[0]}-{range[1]} sur {total}
                      </span>
                    )}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FavorisPage;
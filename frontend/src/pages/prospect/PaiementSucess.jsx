// import React, { useEffect } from "react";
// import { Result, Button } from "antd";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import ROUTES from "../../routes/routes";
// import { validerPaiement } from "../../api/PaiementAPI";

// const PaiementSucces = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const reference = searchParams.get("reference");
//   const contactId = searchParams.get("contactId");
//   const token = searchParams.get("token");

//   useEffect(() => {
//     if (reference && contactId) {
//       validerPaiement(reference, contactId, token)
//         .then((res) => {
//           console.log("Paiement validé:", res.data);
//         })
//         .catch((error) => {
//           console.error("Erreur validation:", error);
//         });
//     }
//   }, [reference, contactId, token]);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
//       <Result
//         status="success"
//         title="Paiement effectué avec succès !"
//         subTitle="Merci pour votre confiance. Vous serez contacté par le propriétaire sous peu."
//         extra={[
//           <Button
//             type="primary"
//             key="home"
//             onClick={() => navigate(ROUTES.DASHBOARD_PROSPECT)}
//           >
//             Retour à l&apos;accueil
//           </Button>,
//           <Button
//             key="contacts"
//             onClick={() => navigate(ROUTES.CONTACTS_PROSPECT)}
//           >
//             Voir mes contacts
//           </Button>,
//         ]}
//       />
//     </div>
//   );
// };

// export default PaiementSucces;


import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ROUTES from "../../routes/routes";
import { validerPaiement } from "../../api/PaiementAPI";

const PaiementSucces = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");
  const contactId = searchParams.get("contactId");
  const token = searchParams.get("token");

  useEffect(() => {
    if (reference && contactId) {
      validerPaiement(reference, contactId, token)
        .then((res) => {
          console.log("Paiement validé:", res.data);
        })
        .catch((error) => {
          console.error("Erreur validation:", error);
        });
    }
  }, [reference, contactId, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-2xl border border-green-100 overflow-hidden transform transition-all duration-300 hover:scale-105">
          {/* Header avec animation */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-10 transform -skew-y-6 scale-150"></div>
            <div className="relative z-10">
              {/* Icône de succès animée */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4 animate-pulse">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="3" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                Paiement Réussi !
              </h1>
              <div className="h-1 w-20 bg-white bg-opacity-50 rounded-full mx-auto"></div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="p-8 text-center">
            <div className="mb-8">
              <h2 className="text-gray-800 text-lg font-semibold mb-3">
                Transaction effectuée avec succès
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Merci pour votre confiance. Vous serez contacté par le propriétaire sous peu pour finaliser votre demande.
              </p>
            </div>

            {/* Informations de référence */}
            {reference && (
              <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Référence de transaction</p>
                <p className="font-mono text-sm text-gray-800 bg-white px-3 py-2 rounded-lg border">
                  {reference}
                </p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="space-y-4">
              <button
                onClick={() => navigate(ROUTES.DASHBOARD_PROSPECT)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  Retour à l'accueil
                </span>
              </button>
              
              <button
                onClick={() => navigate(ROUTES.CONTACTS_PROSPECT)}
                className="w-full bg-white text-gray-700 font-medium py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:text-green-600 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  Voir mes contacts
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Message de confirmation en bas */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Paiement sécurisé et confidentiel
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaiementSucces;
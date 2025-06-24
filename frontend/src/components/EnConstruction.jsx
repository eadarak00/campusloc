import React from "react";

const EnConstruction = ({ nomPage = "Cette page" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4" style={{backgroundColor: '#FAF9F6'}}>
      <div className="max-w-lg mx-auto">
        {/* Card principale */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200/30 p-8 text-center relative overflow-hidden" style={{backgroundColor: 'rgba(245, 241, 235, 0.95)'}}>
          {/* Effet de brillance en arrière-plan */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent -skew-x-12 transform translate-x-full animate-pulse"></div>
          
          {/* Icône animée */}
          <div className="relative mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300" style={{background: 'linear-gradient(135deg, #D4B483, #DEBB85)'}}>
              <span className="text-3xl animate-bounce">🚧</span>
            </div>
            {/* Cercles décoratifs */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-70 animate-ping" style={{backgroundColor: '#D4B483'}}></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full opacity-60 animate-pulse" style={{backgroundColor: '#DEBB85'}}></div>
          </div>

          {/* Titre avec gradient */}
          <h2 className="text-3xl font-bold mb-4" style={{color: '#2F2F2F', fontFamily: 'Poppins, sans-serif'}}>
            {nomPage}
          </h2>
          
          {/* Barre de progression animée */}
          <div className="w-full rounded-full h-2 mb-6 overflow-hidden" style={{backgroundColor: 'rgba(212, 180, 131, 0.3)'}}>
            <div className="h-2 rounded-full animate-pulse" style={{width: '65%', background: 'linear-gradient(90deg, #D4B483, #DEBB85)'}}></div>
          </div>

          {/* Message principal */}
          <p className="text-lg mb-6 leading-relaxed" style={{color: '#2F2F2F', fontFamily: 'Poppins, sans-serif'}}>
            La page <span className="font-semibold px-2 py-1 rounded-lg" style={{color: '#2F2F2F', backgroundColor: 'rgba(212, 180, 131, 0.2)'}}>{nomPage}</span> est actuellement en construction.
          </p>
          
          {/* Message secondaire avec icône */}
          <div className="flex items-center justify-center space-x-2 mb-6" style={{color: 'rgba(47, 47, 47, 0.7)'}}>
            <span className="text-sm">⚡</span>
            <p className="text-sm italic" style={{fontFamily: 'Poppins, sans-serif'}}>Notre équipe travaille dessus activement</p>
            <span className="text-sm">⚡</span>
          </div>

          {/* Bouton CTA */}
          <button className="text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl" style={{background: 'linear-gradient(135deg, #D4B483, rgba(154, 95, 5, 0.71))', fontFamily: 'Poppins, sans-serif'}}>
            <span className="flex items-center space-x-2">
              <span>🔔</span>
              <span>Me notifier</span>
            </span>
          </button>

          {/* Points décoratifs en bas */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#D4B483'}}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: '#DEBB85', animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{backgroundColor: 'rgba(154, 95, 5, 0.71)', animationDelay: '0.2s'}}></div>
          </div>
        </div>

        {/* Texte en bas */}
        <p className="text-center text-sm mt-4" style={{color: 'rgba(47, 47, 47, 0.6)', fontFamily: 'Poppins, sans-serif'}}>
          Revenez bientôt pour découvrir les nouveautés ! ✨
        </p>
      </div>
    </div>
  );
};

export default EnConstruction;
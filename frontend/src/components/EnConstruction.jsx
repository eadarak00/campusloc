import React from "react";

const EnConstruction = ({ nomPage }) => {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-md border border-gray-200 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🚧 {nomPage}</h2>
      <p className="text-gray-600 text-lg">
        La page <strong>{nomPage}</strong> est en construction. Revenez bientôt
        !
      </p>
    </div>
  );
};

export default EnConstruction;
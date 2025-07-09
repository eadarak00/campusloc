import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ROUTES from './routes';

/**
 * @param {ReactNode} children - les composants protégés
 * @param {string[]} allowedRoles - rôles autorisés (ex: ['ADMIN', 'BAILLEUR'])
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to={ROUTES.CONNEXION} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      return children;
    } else {
      return <Navigate to={ROUTES.NOT_FOUND} replace />;
    }
  } catch (err) {
    console.error("Erreur de décodage du token :", err);
    return <Navigate to={ROUTES.CONNEXION} replace />;
  }
};

export default ProtectedRoute;

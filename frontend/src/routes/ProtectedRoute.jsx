import { Navigate } from 'react-router-dom';
import ROUTES from './routes';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? children : <Navigate to={ROUTES.CONNEXION} replace />;
};

export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import ROUTES from './routes'
import { Children } from "react";

const ProtectedRoute = ({Children}) => {
    const isAuthenticated = !! localStorage.getItem('token');
    return isAuthenticated ? Children : <Navigate to={ROUTES.CONNEXION} replace/>
}

export default ProtectedRoute;

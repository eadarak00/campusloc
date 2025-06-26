import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ROUTES from './routes';
import Home from '../pages/Home';
import Connexion from '../pages/auth/Connexion';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.CONNEXION} element={<Connexion />} />
    </Routes>
  </Router>
);

export default AppRouter;
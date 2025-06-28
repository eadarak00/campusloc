import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ROUTES from './routes';
import Home from '../pages/Home';
import Connexion from '../pages/auth/Connexion';
import PublicLayout from '../layouts/PublicLayout';
import Inscription from '../pages/auth/Inscription';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.CONNEXION} element={<Connexion />} />
        <Route path={ROUTES.INSCRIPTION} element={<Inscription />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;

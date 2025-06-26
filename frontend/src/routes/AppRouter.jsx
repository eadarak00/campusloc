import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ROUTES from './routes';
import Home from '../pages/Home';
import Connexion from '../pages/auth/Connexion';
import PublicLayout from '../layouts/PublicLayout';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.CONNEXION} element={<Connexion />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;

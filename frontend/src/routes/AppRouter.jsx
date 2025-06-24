import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ROUTES from './routes';
import Home from '../pages/Home';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />

    </Routes>
  </Router>
);

export default AppRouter;
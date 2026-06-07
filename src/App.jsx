import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Budget from './pages/budget';
import Expense from './pages/expense';
import Leaderboard from './pages/leaderboard';
import Landing from './pages/landing';
import Login from './pages/login';
import Register from './pages/register';
import NotFoundPage from './pages/not-found.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import PublicRoute from './components/auth/PublicRoute.jsx';
import './styles/main.scss';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

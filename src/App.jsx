import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthProvider.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import Home from './pages/home';
import Budget from './pages/budget';
import Expense from './pages/expense';
import Leaderboard from './pages/leaderboard';
import Landing from './pages/landing';
import Login from './pages/login';
import Register from './pages/register';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import './styles/main.scss';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Route>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

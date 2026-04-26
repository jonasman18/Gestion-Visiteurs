import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import AjoutVisiteur from './AjoutVisiteur';
import ListeVisiteurs from './ListeVisiteurs';
import Bilan from './Bilan';
import Accueil from './Accueil';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import Register from './Register';
import { getUser, removeToken } from './lib/auth';
import './App.css';
import PKIStatus from './PKIStatus';

function App() {
  // ✅ Charge l'utilisateur depuis le JWT au démarrage
  const [user, setUser] = useState(getUser);
  const isAuthenticated = !!user;

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <Router>
      <div className="app-background">
        <div className="container mt-4">
          {isAuthenticated && (
            <nav>
              <span className="me-3">
                👤 <strong>{user.nom}</strong>
              </span>
              <Link to="/accueil" className='btn btn-outline-primary me-2'>Accueil</Link>
              <Link to="/ajout" className="btn btn-outline-primary me-2">Ajout</Link>
              <Link to="/liste" className="btn btn-outline-primary me-2">Liste</Link>
              <Link to="/bilan" className="btn btn-outline-primary me-2">Bilan</Link>
              <Link to="/pki-status" className="btn btn-outline-primary me-2">PKI Status</Link>
              {/* ✅ Bouton déconnexion */}
              <button
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </nav>
          )}
          <hr />

          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/accueil"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Accueil user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/ajout"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <AjoutVisiteur />
                </PrivateRoute>
              }
            />
            <Route
              path="/liste"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <ListeVisiteurs />
                </PrivateRoute>
              }
            />
            <Route
              path="/bilan"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Bilan />
                </PrivateRoute>
              }
            />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/pki-status"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <PKIStatus />
                </PrivateRoute>
              }
            />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
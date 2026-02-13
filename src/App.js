import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import AjoutVisiteur from './AjoutVisiteur';
import ListeVisiteurs from './ListeVisiteurs';
import Bilan from './Bilan';
import Accueil from './Accueil';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import Register from './Register';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;
  const handleLogin = (userData) => {setUser(userData)}
  return (
    <Router>
      <div className="app-background">
        <div className="container mt-4">
          {isAuthenticated && (
            <nav>
              
              <Link to="/" className='btn btn-outline-primary'>Login</Link>
              <Link to="/accueil" className='btn btn-outline-primary'>Accueil</Link>
              <Link to="/ajout" className="btn btn-outline-primary me-2">Ajout</Link>
              <Link to="/liste" className="btn btn-outline-primary me-2">Liste</Link>
              <Link to="/bilan" className="btn btn-outline-primary">Bilan</Link>
            </nav>
          )}
          <hr />

          <Routes>
            <Route path="/" element={<Login onLogin={setUser} />} />
            <Route
              path="/login"
              element={
                <Login onLogin={handleLogin} />

              }
            />
            <Route
              path="/accueil"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Accueil />
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
            <Route 
              path="/register"
              element={
                <Register/>
              }
              />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
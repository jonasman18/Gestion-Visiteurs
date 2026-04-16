import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// 🔥 URL BACKEND
const API_URL = "https://api-1-kkrk.onrender.com";

export default function Register() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/register.php`, {
        nom,
        email,
        password
      });

      setMessage(res.data.message);
      setType(res.data.success ? 'success' : 'error');

      if (res.data.success) {
        setTimeout(() => navigate('/login'), 1500);
      }

    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'inscription");
      setType('error');
    }
  };

  const titleStyle = {
    color: '#ffffff'
  };

  return (
    <div className="form-container">
      <h2 style={titleStyle}>Créer un compte</h2>

      <form onSubmit={handleRegister} className="form-box">
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">S'inscrire</button>

        <p className="redirect-link">
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </p>

        {message && (
          <div className={`alert ${type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
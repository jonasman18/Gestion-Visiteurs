import React, { useState } from 'react';
import axios from 'axios';
import './AjoutVisiteur.css';

// 🔥 URL BACKEND
const API_URL = "https://api-1-kkrk.onrender.com";

function AjoutVisiteur() {
  const [nom, setNom] = useState('');
  const [jours, setJours] = useState('');
  const [tarif, setTarif] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const afficherMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${API_URL}/visiteurs.php`, {
      nom: nom,
      nombre_jours: jours,
      tarif_journalier: tarif
    })
    .then(res => {
      afficherMessage(res.data.message || "Ajout réussi");
      setNom('');
      setJours('');
      setTarif('');
    })
    .catch(err => {
      console.error(err);
      afficherMessage("Erreur lors de l'ajout", 'error');
    });
  };

  return (
    <div className="ajout-container">
      <h2>Ajouter un visiteur</h2>

      <form onSubmit={handleSubmit} className="ajout-form">
        <div className="form-group">
          <label>Nom :</label>
          <input
            type="text"
            value={nom}
            onChange={e => setNom(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Nombre de jours :</label>
          <input
            type="number"
            value={jours}
            onChange={e => setJours(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Tarif journalier :</label>
          <input
            type="number"
            value={tarif}
            onChange={e => setTarif(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Ajouter
        </button>
      </form>

      {/* Message */}
      {message && (
        <div className={`alert ${messageType === 'error' ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default AjoutVisiteur;
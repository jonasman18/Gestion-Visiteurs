import React, { useState } from 'react';
import axios from 'axios';
import './ModifierVisiteur.css';
import { authHeaders } from './lib/auth';

// 🔥 URL BACKEND
const API_URL = "https://api-1-kkrk.onrender.com";

function ModifierVisiteur({ visiteur, onClose }) {
  const [nom, setNom] = useState(visiteur.nom);
  const [jours, setJours] = useState(visiteur.nombre_jours);
  const [tarif, setTarif] = useState(visiteur.tarif_journalier);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const afficherMessage = (text, type = 'success') => {
    setMessage(text);
    setType(type);
    setTimeout(() => {
      setMessage('');
      setType('');
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`${API_URL}/visiteurs.php`, {
      id: visiteur.id,
      nom: nom,
      nombre_jours: jours,
      tarif_journalier: tarif
    }, authHeaders())
    .then(res => {
      afficherMessage(res.data.message || "Modification réussie");

      setTimeout(() => {
        onClose();
      }, 1000);
    })
    .catch(err => {
      console.error(err);
      afficherMessage("Erreur lors de la modification", 'error');
    });
  };

  return (
    <div className="modifier-visiteur-card">
      <h4 className="modifier-visiteur-title">Modifier Visiteur</h4>

      <form onSubmit={handleSubmit} className="modifier-visiteur-form">
        <div className="modifier-visiteur-group">
          <label>Nom :</label>
          <input
            value={nom}
            onChange={e => setNom(e.target.value)}
            required
          />
        </div>

        <div className="modifier-visiteur-group">
          <label>Nombre de jours :</label>
          <input
            type="number"
            value={jours}
            onChange={e => setJours(e.target.value)}
            required
          />
        </div>

        <div className="modifier-visiteur-group">
          <label>Tarif journalier :</label>
          <input
            type="number"
            value={tarif}
            onChange={e => setTarif(e.target.value)}
            required
          />
        </div>

        <div className="modifier-visiteur-buttons">
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={onClose} className="btn-annuler">
            Annuler
          </button>
        </div>
      </form>

      {message && (
        <div className={`modifier-visiteur-alert ${type === 'error' ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default ModifierVisiteur;
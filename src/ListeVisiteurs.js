import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModifierVisiteur from './ModifierVisiteur';
import './ListeVisiteurs.css';

function ListeVisiteurs() {
  const [visiteurs, setVisiteurs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'

  const fetchVisiteurs = () => {
    axios.get('http://localhost/api/visiteurs.php')
      .then(res => setVisiteurs(res.data))
      .catch(err => {
        console.error(err);
        setMessage('Erreur lors du chargement');
        setMessageType('error');
      });
  };

  useEffect(() => {
    fetchVisiteurs();
  }, []);

  const afficherMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const supprimer = (id) => {
    if (window.confirm("Supprimer ce visiteur ?")) {
      axios.delete(`http://localhost/api/visiteurs.php?id=${id}`)
        .then(res => {
          fetchVisiteurs();
          afficherMessage(res.data.message || "Suppression réussie");
        })
        .catch(err => {
          console.error(err);
          afficherMessage("Erreur lors de la suppression", 'error');
        });
    }
  };

  return (
    <div className="liste-visiteurs-container">
      <h2>Liste des visiteurs</h2>

      {selected && (
        <ModifierVisiteur
          visiteur={selected}
          onClose={() => {
            setSelected(null);
            fetchVisiteurs();
            afficherMessage("Modification réussie");
          }}
        />
      )}

      <table className="liste-visiteurs-table mt-3">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Nombre de jours</th>
            <th>Tarif journalier</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visiteurs.map((v) => (
            <tr key={v.id}>
              <td>{v.nom}</td>
              <td>{v.nombre_jours}</td>
              <td>{v.tarif_journalier}</td>
              <td>{v.nombre_jours * v.tarif_journalier}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => setSelected(v)}>Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={() => supprimer(v.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Message de confirmation */}
      {message && (
        <div className={`alert ${messageType === 'error' ? 'alert-danger' : 'alert-success'}`} role="alert">
          {message}
        </div>
      )}
    </div>
  );
}

export default ListeVisiteurs;
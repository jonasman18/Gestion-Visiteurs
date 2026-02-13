export default function Accueil() {
    return (
        <div style={{ textAlign: "center", padding: "50px", color: "blue" }}>
            <h2> Bienvenue dans l'application de gestion de visiteurs</h2>
            <p> Utiliser le menu ci-dessus pour naviguer entre les fonctionnalités.</p>
        </div>
    )
}

/*import React from "react";
import { Link } from "react-router-dom";

function Accueil({ user, onLogout}) {
    return (
        <div className="accueil">
            <h1> Bienvenue, {user.nom || user.email} !</h1>
            <p> Vous etes connecté.</p>
            <Link to="/ListeVisiteurs">Voir la liste des visiteurs</Link> <br/>
            <button onClick={onLogout}>Se deconnecter</button>
        </div>    
    );
}
export default Accueil;*/
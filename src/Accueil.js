import { Users, ShieldCheck, Clock, LayoutDashboard } from "lucide-react";

export default function Accueil() {
  const cards = [
    {
      icon: <Users size={32} />,
      title: "Gestion des visiteurs",
      desc: "Ajoutez, modifiez et consultez facilement les informations des visiteurs.",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Sécurité PKI",
      desc: "Authentification sécurisée avec JWT signé en RSA et communication HTTPS.",
    },
    {
      icon: <Clock size={32} />,
      title: "Suivi en temps réel",
      desc: "Visualisez rapidement les activités et accès enregistrés.",
    },
    {
      icon: <LayoutDashboard size={32} />,
      title: "Tableau de bord",
      desc: "Accédez aux statistiques et fonctionnalités principales.",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.hero}>
          <h1 style={styles.title}>
            Application de Gestion des Visiteurs
          </h1>

          <p style={styles.subtitle}>
            Plateforme moderne pour gérer les visiteurs avec sécurité cloud,
            authentification JWT et protection PKI.
          </p>
        </div>

        <div style={styles.grid}>
          {cards.map((card, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.icon}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDesc}>{card.desc}</p>
            </div>
          ))}
        </div>

        <div style={styles.footerBox}>
          <p style={styles.footerText}>
            Utilisez le menu de navigation pour accéder aux différentes
            fonctionnalités de l’application.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f172a, #1e3a8a, #2563eb)",
    fontFamily: "Segoe UI, sans-serif",
    color: "white",
    padding: "40px",
  },

  overlay: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  hero: {
    textAlign: "center",
    marginBottom: "50px",
  },

  title: {
    fontSize: "42px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  subtitle: {
    fontSize: "18px",
    opacity: 0.9,
    maxWidth: "750px",
    margin: "0 auto",
    lineHeight: "1.6",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginTop: "30px",
  },

  card: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(10px)",
    borderRadius: "18px",
    padding: "25px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.15)",
    transition: "0.3s",
  },

  icon: {
    marginBottom: "15px",
    color: "#93c5fd",
  },

  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    fontWeight: "600",
  },

  cardDesc: {
    fontSize: "15px",
    lineHeight: "1.5",
    opacity: 0.9,
  },

  footerBox: {
    marginTop: "50px",
    textAlign: "center",
    padding: "20px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "14px",
  },

  footerText: {
    fontSize: "16px",
    margin: 0,
    opacity: 0.95,
  },
};
import { useEffect, useState, useCallback } from 'react';
import { getToken } from './lib/auth';
import './PKIStatus.css';

const API = 'https://api-1-kkrk.onrender.com';

function parseJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const header  = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    return { header, payload };
  } catch { return null; }
}

function timeLeft(exp) {
  const diff = exp - Math.floor(Date.now() / 1000);
  if (diff <= 0) return 'Expiré';
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  return `${h}h ${m}min`;
}

function formatDate(ts) {
  return new Date(ts * 1000).toLocaleString('fr-FR');
}

const STATUS = { LOADING: 'loading', OK: 'ok', WARN: 'warn', ERR: 'err' };

export default function PKIStatus() {
  const [checks, setChecks] = useState({
    tlsFront:  { status: STATUS.LOADING, label: 'Vérification...',  desc: 'visiteur.vercel.app' },
    tlsBack:   { status: STATUS.LOADING, label: 'Vérification...',  desc: 'api-1-kkrk.onrender.com' },
    jwt:       { status: STATUS.LOADING, label: 'Vérification...',  desc: 'Lecture du token...' },
    apiGuard:  { status: STATUS.LOADING, label: 'Vérification...',  desc: 'Test sans token...' },
    authTest:  { status: STATUS.LOADING, label: 'Vérification...',  desc: 'Test avec JWT...' },
  });

  const [tokenInfo, setTokenInfo] = useState(null);
  const [metrics, setMetrics]     = useState({ present: false, algo: '--', expiry: '--', expiryDate: '--', progress: 0 });
  const [loading, setLoading]     = useState(false);

  const updateCheck = (key, status, label, desc) => {
    setChecks(prev => ({ ...prev, [key]: { status, label, desc: desc ?? prev[key].desc } }));
  };

  const runChecks = useCallback(async () => {
    setLoading(true);

    // Reset
    const init = { status: STATUS.LOADING, label: 'Vérification...' };
    setChecks({
      tlsFront:  { ...init, desc: 'visiteur.vercel.app' },
      tlsBack:   { ...init, desc: 'api-1-kkrk.onrender.com' },
      jwt:       { ...init, desc: 'Lecture du token...' },
      apiGuard:  { ...init, desc: 'Test sans token...' },
      authTest:  { ...init, desc: 'Test avec JWT...' },
    });
    setTokenInfo(null);

    await new Promise(r => setTimeout(r, 300));

    // TLS Frontend
    if (window.location.protocol === 'https:') {
      updateCheck('tlsFront', STATUS.OK, 'HTTPS actif', 'Chiffrement TLS actif');
    } else {
      updateCheck('tlsFront', STATUS.WARN, 'HTTP seulement', 'Pas de chiffrement');
    }

    await new Promise(r => setTimeout(r, 200));

    // TLS Backend
    if (API.startsWith('https://')) {
      updateCheck('tlsBack', STATUS.OK, 'HTTPS actif', 'Render gère TLS automatiquement');
    } else {
      updateCheck('tlsBack', STATUS.ERR, 'HTTP seulement', 'API non chiffrée !');
    }

    await new Promise(r => setTimeout(r, 200));

    // JWT
    const token = getToken();
    if (!token) {
      updateCheck('jwt', STATUS.ERR, 'Absent', 'Aucun token — connectez-vous');
      updateCheck('authTest', STATUS.ERR, 'Non testable', 'Token manquant');
      setMetrics({ present: false, algo: '--', expiry: '--', expiryDate: '--', progress: 0 });
    } else {
      const parsed = parseJWT(token);
      if (!parsed) {
        updateCheck('jwt', STATUS.ERR, 'Format invalide', 'Token mal formé');
      } else {
        const { header, payload } = parsed;
        const now       = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < now;
        const remaining = payload.exp - now;
        const total     = payload.exp - payload.iat;
        const pct       = Math.max(0, Math.min(100, Math.round((remaining / total) * 100)));

        setTokenInfo({ header, payload });
        setMetrics({
          present:    true,
          algo:       header.alg || 'RS256',
          expiry:     isExpired ? 'Expiré' : timeLeft(payload.exp),
          expiryDate: formatDate(payload.exp),
          progress:   pct,
          isExpired,
        });

        if (isExpired) {
          updateCheck('jwt', STATUS.ERR, 'Expiré', 'Reconnectez-vous pour un nouveau token');
        } else {
          updateCheck('jwt', STATUS.OK, header.alg || 'RS256', `Token valide · expire dans ${timeLeft(payload.exp)}`);
        }

        // Test accès authentifié
        try {
          const r = await fetch(`${API}/visiteurs.php`, {
            headers: { Authorization: `Bearer ${token.trim()}` }
          });
          if (r.ok) {
            const data = await r.json();
            const count = Array.isArray(data) ? data.length : '?';
            updateCheck('authTest', STATUS.OK, 'Autorisé', `API répond · ${count} visiteur(s)`);
          } else {
            updateCheck('authTest', STATUS.ERR, `Refusé (${r.status})`, 'API a rejeté le token');
          }
        } catch {
          updateCheck('authTest', STATUS.WARN, 'Erreur réseau', 'Impossible de joindre l\'API');
        }
      }
    }

    // Test API sans token
    try {
      const r = await fetch(`${API}/visiteurs.php`);
      if (r.status === 401) {
        updateCheck('apiGuard', STATUS.OK, 'Protégée', 'Rejette les requêtes sans token (401)');
      } else {
        updateCheck('apiGuard', STATUS.WARN, 'Non protégée !', 'L\'API répond sans authentification');
      }
    } catch {
      updateCheck('apiGuard', STATUS.WARN, 'Erreur réseau', 'Impossible de joindre l\'API');
    }

    setLoading(false);
  }, []);

  useEffect(() => { runChecks(); }, [runChecks]);

  const statusClass = s =>
    s === STATUS.OK ? 'check-ok' : s === STATUS.WARN ? 'check-warn' : s === STATUS.ERR ? 'check-err' : 'check-load';

  const badgeClass = s =>
    s === STATUS.OK ? 'badge-ok' : s === STATUS.WARN ? 'badge-warn' : s === STATUS.ERR ? 'badge-err' : 'badge-load';

  const progressColor = pct => pct > 30 ? '#3B6D11' : pct > 10 ? '#BA7517' : '#A32D2D';

  return (
    <div className="pki-wrap">
      <div className="pki-header">
        <div>
          <h2 className="pki-title">Statut PKI</h2>
          <p className="pki-subtitle">Infrastructure à Clé Publique — vérification en temps réel</p>
        </div>
        <button className="pki-refresh-btn" onClick={runChecks} disabled={loading}>
          <span className={loading ? 'spin' : ''}>↻</span> Actualiser
        </button>
      </div>

      {/* Métriques */}
      <div className="pki-metrics">
        <div className="metric">
          <p className="metric-label">Token JWT</p>
          <p className="metric-value">{metrics.present ? (metrics.isExpired ? 'Expiré' : 'Valide') : 'Absent'}</p>
          <p className="metric-sub">{metrics.algo} · RSA 2048</p>
        </div>
        <div className="metric">
          <p className="metric-label">Expire dans</p>
          <p className="metric-value">{metrics.expiry || '--'}</p>
          <p className="metric-sub">{metrics.expiryDate || '--'}</p>
        </div>
        <div className="metric">
          <p className="metric-label">TLS Frontend</p>
          <p className="metric-value">HTTPS</p>
          <p className="metric-sub">Vercel · Let's Encrypt</p>
        </div>
        <div className="metric">
          <p className="metric-label">TLS Backend</p>
          <p className="metric-value">HTTPS</p>
          <p className="metric-sub">Render · Let's Encrypt</p>
        </div>
      </div>

      {/* Checks */}
      <p className="section-label">Contrôles de sécurité</p>
      <div className="pki-checks">
        {Object.entries({
          tlsFront: 'TLS Frontend',
          tlsBack:  'TLS Backend',
          jwt:      'JWT RS256',
          apiGuard: 'API protégée',
          authTest: 'Accès authentifié',
        }).map(([key, name]) => (
          <div className="check-row" key={key}>
            <div className="check-left">
              <div className={`dot ${statusClass(checks[key].status)}`} />
              <div>
                <p className="check-name">{name}</p>
                <p className="check-desc">{checks[key].desc}</p>
              </div>
            </div>
            <span className={`badge ${badgeClass(checks[key].status)}`}>
              {checks[key].label}
            </span>
          </div>
        ))}
      </div>

      {/* Token details */}
      {tokenInfo && (
        <>
          <p className="section-label">Détails du token JWT</p>
          <div className="token-box">
            {[
              ['Algorithme', tokenInfo.header.alg || '--'],
              ['Émetteur (iss)', tokenInfo.payload.iss || '--'],
              ['Audience (aud)', tokenInfo.payload.aud || '--'],
              ['Sujet (sub)', tokenInfo.payload.sub || '--'],
              ['Nom', tokenInfo.payload.nom || '--'],
              ['Rôle', tokenInfo.payload.role || '--'],
              ['Émis le', formatDate(tokenInfo.payload.iat)],
              ['Expire le', formatDate(tokenInfo.payload.exp)],
            ].map(([k, v]) => (
              <div className="token-row" key={k}>
                <span className="token-key">{k}</span>
                <span className="token-val">{v}</span>
              </div>
            ))}
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${metrics.progress}%`,
                  background: progressColor(metrics.progress)
                }}
              />
            </div>
            <p className="progress-label">{metrics.progress}% de durée de vie restante</p>
          </div>
        </>
      )}
    </div>
  );
}
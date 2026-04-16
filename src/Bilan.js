import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// 🔥 URL BACKEND
const API_URL = "https://api-1-kkrk.onrender.com";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Bilan() {
  const [bilan, setBilan] = useState({ total: 0, minimum: 0, maximum: 0 });

  useEffect(() => {
    axios.get(`${API_URL}/bilan.php`)
      .then(res => setBilan(res.data))
      .catch(err => console.error(err));
  }, []);

  const data = {
    labels: ["Total", "Minimum", "Maximum"],
    datasets: [{
      data: [bilan.total, bilan.minimum, bilan.maximum],
      backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"]
    }]
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  const titleStyle = {
    color: '#ffffff'
  };

  return (
    <div>
      <h2 style={titleStyle}>Bilan des paiements</h2>

      <p>Total : {bilan.total} Ar</p>
      <p>Minimum : {bilan.minimum} Ar</p>
      <p>Maximum : {bilan.maximum} Ar</p>

      <div style={{
        width: '500px',
        height: '480px',
        margin: '20px auto'
      }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
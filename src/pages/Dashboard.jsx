import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import "./Dashboard.css";

function Dashboard() {
  const [animales, setAnimales] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchAnimales() {
      try {
        const response = await fetch("https://fedegan-backend.onrender.com/animales");
        const data = await response.json();
        setAnimales(data);
      } catch (error) {
        console.error("Error al obtener los animales:", error);
      } finally {
        setCargando(false);
      }
    }

    fetchAnimales();
  }, []);

  // Datos de resumen
  const total = animales.length;
  const vacunados = animales.filter((a) => a.vacunado).length;
  const noVacunados = total - vacunados;
  const cobertura = total > 0 ? Math.round((vacunados / total) * 100) : 0;

  // Ejemplo de datos para gráfico de vacunación por finca
  const vacunacionPorFinca = animales.reduce((acc, animal) => {
    const finca = animal.finca || "Sin Finca";
    const existente = acc.find((f) => f.name === finca);
    if (existente) {
      existente.vacunados += animal.vacunado ? 1 : 0;
      existente.total += 1;
    } else {
      acc.push({
        name: finca,
        vacunados: animal.vacunado ? 1 : 0,
        total: 1,
      });
    }
    return acc;
  }, []);

  // Prepara datos para gráfico barras: porcentaje vacunados por finca
  const dataBarChart = vacunacionPorFinca.map((f) => ({
    name: f.name,
    porcentaje: Math.round((f.vacunados / f.total) * 100),
  }));

  // Datos para gráfico circular (Pie)
  const pieData = [
    { name: "Vacunados", value: vacunados, color: "#4caf50" },
    { name: "No vacunados", value: noVacunados, color: "#f44336" },
  ];

  const COLORS = pieData.map((d) => d.color);

  return (
    <div className="dashboard">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Control Sanitario y Trazabilidad Ganadera</p>
      </header>

      <div className="dashboard-grid">
        {/* Resumen sanitario */}
        <div className="dashboard-card">
          <h2>Resumen Sanitario</h2>
          <div className="card-content coverage-summary">
            <div className="summary-item">
              <span className="summary-label">Total Bovinos Registrados</span>
              <span className="summary-value">{total}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Bovinos Vacunados</span>
              <span className="summary-value">{vacunados}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Cobertura Nacional</span>
              <span className="summary-value">{cobertura}%</span>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="dashboard-card charts">
          <h2>Gráficos de Vacunación</h2>
          <div className="card-content">
            {/* Pie chart */}
            <div style={{ width: "100%", height: 250, marginBottom: 40 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar chart */}
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={dataBarChart} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={60} />
                  <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="porcentaje" fill="#3f51b5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Listado de animales */}
        <div className="dashboard-card animals" style={{ gridColumn: "1 / -1" }}>
          <h2>Listado de Animales</h2>
          <div className="card-content">
            {cargando ? (
              <p>Cargando datos...</p>
            ) : total === 0 ? (
              <p>No hay registros disponibles.</p>
            ) : (
              <table className="animals-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Finca</th>
                    <th>Vacunado</th>
                  </tr>
                </thead>
                <tbody>
                  {animales.map((a) => (
                    <tr key={a._id}>
                      <td>{a.nombre}</td>
                      <td>{a.finca}</td>
                      <td>{a.vacunado ? "✅ Sí" : "❌ No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

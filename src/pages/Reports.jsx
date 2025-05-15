import { useEffect, useState } from "react";
import { IconPDF, IconExcel } from "../components/Icons";
import "./Reports.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function Reports() {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    region: "",
    dateFrom: "",
    dateTo: "",
    disease: "",
    status: "",
    farm: "",
  });

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token no encontrado. Inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://fedegan-backend.onrender.com/animales", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error al obtener reportes: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos de reportes:", data);
        setReportData(data);
        setFilteredData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSearch = () => {
    let filtered = [...reportData];

    if (filters.region) {
      filtered = filtered.filter(
        (item) =>
          item.region?.toLowerCase() === filters.region.toLowerCase() ||
          item.departamento?.toLowerCase() === filters.region.toLowerCase()
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.date || item.fecha) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.date || item.fecha) <= new Date(filters.dateTo)
      );
    }

    if (filters.disease) {
      filtered = filtered.filter(
        (item) =>
          (item.disease || item.enfermedad || "").toLowerCase() ===
          filters.disease.toLowerCase()
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (item) =>
          (item.status || item.estado || "").toLowerCase() ===
          filters.status.toLowerCase()
      );
    }

    if (filters.farm) {
      filtered = filtered.filter((item) =>
        (item.finca || "").toLowerCase().includes(filters.farm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      region: "",
      dateFrom: "",
      dateTo: "",
      disease: "",
      status: "",
      farm: "",
    });
    setFilteredData(reportData);
  };

  const exportToExcel = () => {
    if (!filteredData.length) {
      alert("No hay datos para exportar.");
      return;
    }

    const data = filteredData.map((item) => ({
      Nombre: item.nombre || item.animalId,
      Finca: item.finca,
      Ubicación: item.location || item.ubicacion,
      Fecha: item.date || item.fecha,
      Lote: item.lote_vacuna || item.loteVacuna || item.vaccineBatch,
      Tipo_Vacuna: item.tipo_vacuna || item.tipoVacuna || item.vaccineType,
      Observaciones: item.observations || item.observaciones,
      Vacunado: item.vacunado ? "Sí" : "No",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vacunación");
    XLSX.writeFile(wb, "registro_vacunacion.xlsx");
  };

  const exportToPDF = () => {
    if (!filteredData.length) {
      alert("No hay datos para exportar.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Registro de Vacunación", 14, 10);

    const rows = filteredData.map((item) => [
      item.nombre || item.animalId,
      item.finca,
      item.location || item.ubicacion,
      item.date || item.fecha,
      item.lote_vacuna || item.loteVacuna || item.vaccineBatch,
      item.tipo_vacuna || item.tipoVacuna || item.vaccineType,
      item.observations || item.observaciones,
      item.vacunado ? "Sí" : "No",
    ]);

    autoTable(doc, {
      head: [["Nombre", "Finca", "Ubicación", "Fecha", "Lote", "Tipo_Vacuna", "Observaciones", "Vacunado"]],
      body: rows,
      startY: 20,
    });

    doc.save("registro_vacunacion.pdf");
  };

  return (
    <div className="reports-page">
      <header className="page-header">
        <h1>Consultas y Reportes</h1>
        <p className="subtitle">Genere informes y consulte datos de vacunación</p>
      </header>

      <div className="reports-container">
        <div className="reports-filters">
          <h2>Filtros de Búsqueda</h2>
          <div className="filter-grid">
            <div className="filter-group">
              <label htmlFor="region">Región/Departamento</label>
              <select id="region" value={filters.region} onChange={handleFilterChange}>
                <option value="">Todos los departamentos</option>
                <option value="antioquia">Antioquia</option>
                <option value="cordoba">Córdoba</option>
                <option value="meta">Meta</option>
                <option value="casanare">Casanare</option>
                <option value="santander">Santander</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="dateFrom">Fecha Desde</label>
              <input
                type="date"
                id="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="dateTo">Fecha Hasta</label>
              <input
                type="date"
                id="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="disease">Enfermedad</label>
              <select id="disease" value={filters.disease} onChange={handleFilterChange}>
                <option value="">Todas las enfermedades</option>
                <option value="aftosa">Fiebre Aftosa</option>
                <option value="brucelosis">Brucelosis</option>
                <option value="rabia">Rabia Bovina</option>
                <option value="carbunco">Carbunco Bacteridiano</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="status">Estado de Validación</label>
              <select id="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">Todos los estados</option>
                <option value="approved">Aprobado</option>
                <option value="pending">Pendiente</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="farm">Finca</label>
              <input
                type="text"
                id="farm"
                placeholder="Nombre de la finca"
                value={filters.farm}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Limpiar Filtros
            </button>
            <button className="btn btn-primary" onClick={handleSearch}>
              Buscar
            </button>
          </div>
        </div>

        <div className="reports-results">
          <div className="results-header">
            <h2>Resultados</h2>
            <div className="export-options">
              <button onClick={exportToPDF} className="btn btn-export pdf">
                <IconPDF /> Exportar PDF
              </button>
              <button onClick={exportToExcel} className="btn btn-export excel">
                <IconExcel /> Exportar Excel
              </button>
            </div>
          </div>

          {loading ? (
            <p>Cargando reportes...</p>
          ) : error ? (
            <p className="error-message">❌ {error}</p>
          ) : (
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Finca</th>
                    <th>Ubicación</th>
                    <th>Fecha Vacunación</th>
                    <th>Lote Vacuna</th>
                    <th>Tipo Vacuna</th>
                    <th>Observaciones</th>
                    <th>Vacunado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        No se encontraron resultados.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((record, index) => (
                      <tr key={index}>
                        <td>{record.nombre || record.animalId}</td>
                        <td>{record.finca}</td>
                        <td>{record.location || record.ubicacion}</td>
                        <td>{record.date || record.fecha}</td>
                        <td>{record.lote_vacuna || record.loteVacuna || record.vaccineBatch}</td>
                        <td>{record.tipo_vacuna || record.tipoVacuna || record.vaccineType}</td>
                        <td>{record.observations || record.observaciones}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              record.vacunado ? "aprobado" : "pendiente"
                            }`}
                          >
                            {record.vacunado ? "Sí" : "No"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="pagination">
            <button className="pagination-btn">&laquo;</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;

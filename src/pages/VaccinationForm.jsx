import { useState } from "react";
import "./VaccinationForm.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function VaccinationForm() {
  const [formData, setFormData] = useState({
    animalId: "",
    farm: "",
    location: "",
    date: "",
    vaccineBatch: "",
    vaccineType: "",
    observations: "",
    vacunado: true, // Ahora manejado por checkbox
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token no encontrado. Inicia sesión primero.");
      return;
    }

    const animalData = {
      nombre: formData.animalId,
      finca: formData.farm,
      vacunado: formData.vacunado,
    };

    try {
      const response = await fetch("https://fedegan-backend.onrender.com/animales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(animalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el animal");
      }

      const result = await response.json();
      alert("Registro guardado con éxito.");
      console.log("Respuesta:", result);
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  return (
    <div className="vaccination-form-container">
      <header className="page-header">
        <h1>Registro de Vacunación</h1>
        <p className="subtitle">Ingrese los datos de la vacunación realizada</p>
      </header>

      <form className="vaccination-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="animalId">Nombre del Animal *</label>
            <input
              type="text"
              id="animalId"
              name="animalId"
              value={formData.animalId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="farm">Finca *</label>
            <input
              type="text"
              id="farm"
              name="farm"
              value={formData.farm}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Ubicación *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Nuevo checkbox */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="vacunado"
                checked={formData.vacunado}
                onChange={handleChange}
              />
              El animal fue vacunado
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="date">Fecha de Vacunación *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={!formData.vacunado}
              required={formData.vacunado}
            />
          </div>

          <div className="form-group">
            <label htmlFor="vaccineType">Tipo de Vacuna *</label>
            <select
              id="vaccineType"
              name="vaccineType"
              value={formData.vaccineType}
              onChange={handleChange}
              disabled={!formData.vacunado}
              required={formData.vacunado}
            >
              <option value="">Seleccione tipo de vacuna</option>
              <option value="aftosa">Fiebre Aftosa</option>
              <option value="brucelosis">Brucelosis</option>
              <option value="rabia">Rabia Bovina</option>
              <option value="carbunco">Carbunco Bacteridiano</option>
              <option value="tuberculosis">Tuberculosis</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="vaccineBatch">Lote de Vacuna *</label>
            <input
              type="text"
              id="vaccineBatch"
              name="vaccineBatch"
              value={formData.vaccineBatch}
              onChange={handleChange}
              disabled={!formData.vacunado}
              required={formData.vacunado}
              placeholder="Ej: LOT-2025-0123"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="observations">Observaciones</label>
            <textarea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Observaciones adicionales sobre la vacunación"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary">Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar Registro</button>
        </div>
      </form>
    </div>
  );
}

export default VaccinationForm;

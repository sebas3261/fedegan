import './ValidationModule.css';

function ValidationModule() {
  // Datos de ejemplo para la tabla
  const validationRecords = [
    {
      id: 'VAC-2025-001',
      animalId: 'COL123456789',
      farm: 'Hacienda El Paraíso',
      location: 'Montería, Córdoba',
      date: '2025-05-10',
      vaccineType: 'Fiebre Aftosa',
      vaccineBatch: 'LOT-2025-0123',
      status: 'pending'
    },
    {
      id: 'VAC-2025-002',
      animalId: 'COL987654321',
      farm: 'Finca La Esperanza',
      location: 'Puerto López, Meta',
      date: '2025-05-09',
      vaccineType: 'Brucelosis',
      vaccineBatch: 'LOT-2025-0456',
      status: 'pending'
    },
    {
      id: 'VAC-2025-003',
      animalId: 'COL456789123',
      farm: 'Rancho Grande',
      location: 'Yopal, Casanare',
      date: '2025-05-08',
      vaccineType: 'Rabia Bovina',
      vaccineBatch: 'LOT-2025-0789',
      status: 'approved'
    },
    {
      id: 'VAC-2025-004',
      animalId: 'COL789123456',
      farm: 'Hacienda Los Alpes',
      location: 'San Vicente, Antioquia',
      date: '2025-05-07',
      vaccineType: 'Fiebre Aftosa',
      vaccineBatch: 'LOT-2025-0123',
      status: 'rejected'
    },
    {
      id: 'VAC-2025-005',
      animalId: 'COL321654987',
      farm: 'Finca El Porvenir',
      location: 'Arauca, Arauca',
      date: '2025-05-06',
      vaccineType: 'Brucelosis',
      vaccineBatch: 'LOT-2025-0456',
      status: 'pending'
    }
  ];

  return (
    <div className="validation-module">
      <header className="page-header">
        <h1>Validación Técnica</h1>
        <p className="subtitle">Revisión y aprobación de registros de vacunación</p>
      </header>

      <div className="validation-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Estado:</label>
          <select id="status-filter" defaultValue="pending">
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="date-filter">Fecha:</label>
          <input type="date" id="date-filter" />
        </div>
        <div className="filter-group">
          <label htmlFor="location-filter">Ubicación:</label>
          <input type="text" id="location-filter" placeholder="Departamento o municipio" />
        </div>
        <button className="btn btn-secondary">Filtrar</button>
      </div>

      <div className="validation-table-container">
        <table className="validation-table">
          <thead>
            <tr>
              <th>ID Registro</th>
              <th>ID Animal</th>
              <th>Finca</th>
              <th>Ubicación</th>
              <th>Fecha</th>
              <th>Tipo Vacuna</th>
              <th>Lote</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {validationRecords.map((record) => (
              <tr key={record.id} className={record.status}>
                <td>{record.id}</td>
                <td>{record.animalId}</td>
                <td>{record.farm}</td>
                <td>{record.location}</td>
                <td>{record.date}</td>
                <td>{record.vaccineType}</td>
                <td>{record.vaccineBatch}</td>
                <td>
                  <span className={`status-badge ${record.status}`}>
                    {record.status === 'pending' && 'Pendiente'}
                    {record.status === 'approved' && 'Aprobado'}
                    {record.status === 'rejected' && 'Rechazado'}
                  </span>
                </td>
                <td className="actions-cell">
                  {record.status === 'pending' && (
                    <>
                      <button className="btn-icon approve">
                        <span className="icon-approve"></span>
                      </button>
                      <button className="btn-icon reject">
                        <span className="icon-reject"></span>
                      </button>
                      <button className="btn-icon view">
                        <span className="icon-view"></span>
                      </button>
                    </>
                  )}
                  {record.status !== 'pending' && (
                    <button className="btn-icon view">
                      <span className="icon-view"></span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="validation-form">
        <h2>Formulario de Validación</h2>
        <div className="validation-form-content">
          <div className="form-group">
            <label htmlFor="record-id">ID de Registro</label>
            <input type="text" id="record-id" placeholder="Seleccione un registro para validar" readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="validation-notes">Observaciones</label>
            <textarea id="validation-notes" rows="3" placeholder="Ingrese observaciones sobre la validación"></textarea>
          </div>
          <div className="form-actions">
            <button className="btn btn-danger">Rechazar</button>
            <button className="btn btn-success">Aprobar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ValidationModule;
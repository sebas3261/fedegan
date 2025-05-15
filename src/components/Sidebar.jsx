import { useState } from 'react';
import './Sidebar.css';
import { 
  IconDashboard, 
  IconVaccination, 
  IconValidation, 
  IconReports, 
  IconLogout,
  IconMenu
} from './Icons';

function Sidebar({ currentPage, setCurrentPage, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
    { id: 'vaccination', label: 'Registro', icon: <IconVaccination /> },
    { id: 'reports', label: 'Reportes', icon: <IconReports /> },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className="logo">FEDEGÁN</h2>
        <button className="menu-toggle" onClick={toggleSidebar}>
          <IconMenu />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </button>
            </li>
          ))}
          <li>
            <button className="nav-item logout" onClick={onLogout}>
              <span className="icon"><IconLogout /></span>
              <span className="label">Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
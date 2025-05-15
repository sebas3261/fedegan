import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VaccinationForm from './pages/VaccinationForm';
import ValidationModule from './pages/ValidationModule';
import Reports from './pages/Reports';
import Login from './pages/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const renderPage = () => {
    if (!isLoggedIn) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'vaccination':
        return <VaccinationForm />;
      case 'validation':
        return <ValidationModule />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      {isLoggedIn && (
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          onLogout={handleLogout} 
        />
      )}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
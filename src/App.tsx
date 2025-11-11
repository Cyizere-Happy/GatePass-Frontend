import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StudentVisitRequests from './pages/StudentVisitRequests';
import Verification from './pages/Verification';
import Students from './pages/Students';
import VisitingDays from './pages/VisitingDays';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AuthForm from './components/AuthLogin'; 

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'student-visits':
        return <StudentVisitRequests />;
      case 'verification':
        return <Verification />;
      case 'students':
        return <Students />;
      case 'visiting-days':
        return <VisitingDays />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  // Show main app after authentication
  return (
    <div className="flex h-screen" style={{backgroundColor: '#deeefa'}}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
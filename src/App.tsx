import { useState } from 'react';
import { AuthProvider } from './AuthContext';
import { Header } from './components/Header';
import { UploadPage } from './pages/UploadPage';
import { Dashboard } from './pages/Dashboard';
import './index.css';

type Page = 'upload' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('upload');

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />

        {currentPage === 'upload' ? <UploadPage /> : <Dashboard />}
      </div>
    </AuthProvider>
  );
}

export default App;

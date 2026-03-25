import { useState, useCallback } from 'react';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { UploadPage } from './pages/UploadPage';
import { Dashboard } from './pages/Dashboard';
import { SharedView } from './pages/SharedView';
import { Footer } from './components/Footer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './index.css';

type Page = 'upload' | 'dashboard';

// Read shared project ID from URL once on load
const getSharedProjectId = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('project');
};

const sharedProjectId = getSharedProjectId();

// Common wrapper components defined outside of App to avoid unecessary re-mounts
const AppProviders: React.FC<{
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}> = ({ children, currentPage, onNavigate }) => (
  <ErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="flex min-h-screen flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
            <Header currentPage={currentPage} onNavigate={onNavigate} />
            <main className="flex-1">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('upload');
  const [activeSharedId, setActiveSharedId] = useState<string | null>(sharedProjectId);

  const handleNavigate = useCallback((page: Page): void => {
    setCurrentPage(page);
    setActiveSharedId(null); // Clear shared view when navigating to upload/dashboard
    // Remove ?project=ID from URL without reloading
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.pushState({}, '', url.toString());
    window.scrollTo(0, 0);
  }, []);

  useKeyboardShortcuts({
    onNavigateUpload: useCallback(() => handleNavigate('upload'), [handleNavigate]),
    onNavigateDashboard: useCallback(() => handleNavigate('dashboard'), [handleNavigate]),
  });

  if (activeSharedId) {
    return (
      <AppProviders currentPage={currentPage} onNavigate={handleNavigate}>
        <SharedView projectId={activeSharedId} />
      </AppProviders>
    );
  }

  return (
    <AppProviders currentPage={currentPage} onNavigate={handleNavigate}>
      {currentPage === 'upload' ? <UploadPage /> : <Dashboard />}
    </AppProviders>
  );
}

export default App;

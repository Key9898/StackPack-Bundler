export interface HeaderProps {
  currentPage: 'upload' | 'dashboard';
  onNavigate: (page: 'upload' | 'dashboard') => void;
}

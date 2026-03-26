import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../pages/Dashboard';

vi.mock('../firebaseConfig', () => ({ db: {} }));

vi.mock('../AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('../contexts/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock('../services/FirebaseService', () => ({
  FirebaseService: {
    fetchUserProjects: vi.fn(),
    deleteProject: vi.fn(),
    updateVisibility: vi.fn(),
  },
}));

vi.mock('../utils/BundlerLogic', () => ({
  downloadFile: vi.fn(),
}));

describe('Dashboard — unauthenticated', () => {
  it('shows My Projects heading when user is not logged in', () => {
    render(<Dashboard />);
    expect(screen.getByText('My Projects')).toBeInTheDocument();
  });

  it('shows the sign in description message', () => {
    render(<Dashboard />);
    expect(
      screen.getByText(/Please sign in to view and manage your bundled projects/i)
    ).toBeInTheDocument();
  });

  it('does not show project grid when unauthenticated', () => {
    render(<Dashboard />);
    expect(screen.queryByText('No projects yet')).not.toBeInTheDocument();
  });
});

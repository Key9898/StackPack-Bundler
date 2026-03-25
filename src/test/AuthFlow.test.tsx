import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthModal } from '../components/AuthModal';

// Mock useAuth hook
vi.mock('../AuthContext', () => ({
  useAuth: () => ({
    signInWithGoogle: vi.fn(),
    signInWithEmail: vi.fn().mockResolvedValue(undefined),
    signUpWithEmail: vi.fn().mockResolvedValue(undefined),
    user: null,
    loading: false,
    signOut: vi.fn(),
  }),
}));

describe('AuthModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(<AuthModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();
  });

  it('renders sign in form when isOpen is true', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('renders Google sign in button', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Google')).toBeInTheDocument();
  });

  it('toggles to sign up form when Sign Up link is clicked', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('shows username field in sign up mode', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.getByPlaceholderText('Choose a username')).toBeInTheDocument();
  });

  it('toggles back to sign in from sign up', () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('calls onClose when the header close button is clicked', () => {
    const mockClose = vi.fn();
    render(<AuthModal isOpen={true} onClose={mockClose} />);
    // The close button is the first button inside the gradient header area
    const allButtons = screen.getAllByRole('button');
    // Header close button contains an X icon (first button in the gradient header)
    const headerCloseBtn = allButtons.find((btn) => btn.className.includes('hover:bg-white/20'));
    expect(headerCloseBtn).toBeDefined();
    fireEvent.click(headerCloseBtn!);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});

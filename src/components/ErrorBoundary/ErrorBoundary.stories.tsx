import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorBoundary } from './ErrorBoundary';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FallbackUI: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="p-4 bg-red-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-amber-900 mb-2">Something went wrong</h2>
        <p className="text-amber-700 mb-6 text-sm">An unexpected error occurred.</p>
        <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-2 px-6 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all">
          Try Again
        </button>
      </div>
    </div>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <ErrorBoundary>
      <div className="p-8 text-center">
        <p className="text-gray-600">This is normal content inside ErrorBoundary.</p>
      </div>
    </ErrorBoundary>
  ),
};

export const CustomFallback: Story = {
  render: () => (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center bg-red-50 rounded-lg">
          <p className="text-red-600 font-semibold">Custom error message</p>
        </div>
      }
    >
      <div className="p-8 text-center">
        <p className="text-gray-600">Content with custom fallback.</p>
      </div>
    </ErrorBoundary>
  ),
};

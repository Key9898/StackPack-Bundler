import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeyboardHints } from './KeyboardHints';

const meta: Meta<typeof KeyboardHints> = {
  title: 'Components/KeyboardHints',
  component: KeyboardHints,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

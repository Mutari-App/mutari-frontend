// CustomPin.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomPin from '@/modules/ItineraryMakerModule/module-elements/CustomPin';

describe('CustomPin', () => {
  test('renders the number if provided', () => {
    render(<CustomPin number={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('renders default color if no color is provided', () => {
    const { container } = render(<CustomPin number={1} />);
    const pin = container.firstChild as HTMLElement;
    expect(pin.className).toContain('bg-blue-800');
  });

  test('uses custom color class if provided', () => {
    const { container } = render(<CustomPin number={2} color="bg-red-500" />);
    const pin = container.firstChild as HTMLElement;
    expect(pin.className).toContain('bg-red-500');
  });

  test('renders tooltip title but it is hidden by default', () => {
    render(<CustomPin number={3} title="This is a pin" />);
    const tooltip = screen.getByText('This is a pin');
    expect(tooltip).toBeInTheDocument();
    // Tooltip should be hidden (CSS class 'hidden' is applied)
    expect(tooltip.className).toContain('hidden');
  });

  test('does not render title if not provided', () => {
    render(<CustomPin number={4} />);
    const tooltip = screen.queryByText(/.+/); // query any non-empty string
    expect(tooltip?.className).not.toContain('group-hover:flex');
  });
});

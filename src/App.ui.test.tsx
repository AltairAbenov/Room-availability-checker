// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';

afterEach(cleanup);

const checkButton = () => screen.getByRole('button', { name: 'Check availability' }) as HTMLButtonElement;

describe('UI: App behaviour (rendered in jsdom)', () => {
  it('U-1 filters rooms, clears the result on room switch (F5) and shows the empty state (F4)', () => {
    render(<App />);

    // Filter: 25 attendees + projector -> only B-202 (blocked) and D-404.
    fireEvent.change(screen.getByLabelText('Attendees'), { target: { value: '25' } });
    fireEvent.click(screen.getByLabelText('projector'));
    const select = screen.getByLabelText(/Room \(2 matching\)/) as HTMLSelectElement;
    expect(select.value).toBe('B-202');

    // Blocked room is never available (F3).
    fireEvent.click(checkButton());
    expect(screen.getByRole('status').textContent).toContain('blocked');

    // Switching room removes the old result immediately (F5) ...
    fireEvent.change(select, { target: { value: 'D-404' } });
    expect(screen.queryByRole('status')).toBeNull();
    // ... and the new check uses D-404's own booking (660-720).
    fireEvent.click(checkButton());
    expect(screen.getByRole('status').textContent).toContain('Overlaps existing booking 660-720');

    // No room fits 500 people: empty state, check disabled (F4).
    fireEvent.change(screen.getByLabelText('Attendees'), { target: { value: '500' } });
    expect(screen.getByRole('status').textContent).toContain('No rooms match');
    expect(checkButton().disabled).toBe(true);
  });
});

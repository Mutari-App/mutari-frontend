import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MeatballsMenu } from '@/modules/ItineraryModule/module-elements/MeatballsMenu'
import React from 'react'

global.alert = jest.fn()
global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true })
  ) as jest.Mock;

describe('MeatballsMenu Component', () => {
    it('renders all buttons, with non-delete buttons disabled', () => {
      render(<MeatballsMenu />);
  
      expect(screen.getByText('Invite')).toBeDisabled();
      expect(screen.getByText('Share')).toBeDisabled();
      expect(screen.getByText('Make public')).toBeDisabled();
      expect(screen.getByText('Mark as completed')).toBeDisabled();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  
    it('opens the confirmation modal when Delete is clicked', () => {
      render(<MeatballsMenu />);
  
      fireEvent.click(screen.getByText('Delete'));
  
      expect(screen.getByText('Apakah anda yakin?')).toBeInTheDocument();
      expect(screen.getByText('Anda ingin menghapus itinerary ini?')).toBeInTheDocument();
    });
  
    it('closes the modal when Batal is clicked', () => {
      render(<MeatballsMenu />);
  
      fireEvent.click(screen.getByText('Delete'));
      fireEvent.click(screen.getByText('Batal'));
      expect(screen.queryByText('Apakah anda yakin?')).not.toBeInTheDocument();
    });
  
    it('calls the DELETE API when Hapus is clicked', async () => {
      render(<MeatballsMenu />);
  
      fireEvent.click(screen.getByText('Delete'));
      fireEvent.click(screen.getByText('Hapus'));
  
      await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    });
  });

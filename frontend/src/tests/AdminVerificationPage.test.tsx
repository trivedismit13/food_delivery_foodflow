import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminVerificationPage from '../pages/admin/AdminVerificationPage';
import { useGetPendingVerifications, useApproveVerification, useRejectVerification } from '../queries/verification';

vi.mock('../queries/verification', () => ({
  useGetPendingVerifications: vi.fn(),
  useApproveVerification: vi.fn(),
  useRejectVerification: vi.fn(),
}));

describe('AdminVerificationPage', () => {
  const mockApprove = vi.fn();
  const mockReject = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useApproveVerification as any).mockReturnValue({ mutate: mockApprove });
    (useRejectVerification as any).mockReturnValue({ mutate: mockReject });
  });

  it('renders pending records', () => {
    (useGetPendingVerifications as any).mockReturnValue({
      data: [
        {
          verificationId: 1,
          creator: { restaurantId: 10, name: 'Chef Mario' },
          foodLicenceNumber: 'FSSAI123',
          foodLicenceUrl: 'http://test.local/doc',
        }
      ],
      isLoading: false,
    });

    render(<AdminVerificationPage />);
    expect(screen.getByText('Chef Mario')).toBeInTheDocument();
    expect(screen.getByText('FSSAI123')).toBeInTheDocument();
  });

  it('Approve action calls correct mutation', () => {
    (useGetPendingVerifications as any).mockReturnValue({
      data: [{ verificationId: 1, creator: { restaurantId: 10, name: 'Chef Mario' } }],
      isLoading: false,
    });

    render(<AdminVerificationPage />);
    fireEvent.click(screen.getByRole('button', { name: /approve/i }));

    expect(mockApprove).toHaveBeenCalledWith(
      { creatorId: 10, level: 2 },
      expect.any(Object)
    );
  });

  it('Reject dialog requires a reason and calls correct mutation', () => {
    (useGetPendingVerifications as any).mockReturnValue({
      data: [{ verificationId: 1, creator: { restaurantId: 10, name: 'Chef Mario' } }],
      isLoading: false,
    });

    render(<AdminVerificationPage />);
    
    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /reject/i }));
    
    expect(screen.getByText('Reject Verification')).toBeInTheDocument();
    
    const confirmButton = screen.getByRole('button', { name: /confirm reject/i });
    expect(confirmButton).toBeDisabled();

    const textarea = screen.getByPlaceholderText(/FSSAI certificate is blurry/i);
    fireEvent.change(textarea, { target: { value: 'Incomplete documents' } });

    expect(confirmButton).not.toBeDisabled();
    
    fireEvent.click(confirmButton);

    expect(mockReject).toHaveBeenCalledWith(
      { creatorId: 10, reason: 'Incomplete documents' },
      expect.any(Object)
    );
  });
});

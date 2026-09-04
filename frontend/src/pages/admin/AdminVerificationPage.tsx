import { useState } from 'react';
import { useGetPendingVerifications, useApproveVerification, useRejectVerification } from '@/queries/verification';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminVerificationPage() {
  const { data: verifications, isLoading } = useGetPendingVerifications();
  const { mutate: approveVerification } = useApproveVerification();
  const { mutate: rejectVerification } = useRejectVerification();

  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectModalState, setRejectModalState] = useState<{ isOpen: boolean; creatorId: number | null }>({ isOpen: false, creatorId: null });
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (creatorId: number) => {
    setProcessingId(creatorId);
    approveVerification({ creatorId, level: 2 }, {
      onSuccess: () => {
        setProcessingId(null);
        toast.success('Creator verification approved!');
      },
      onError: () => {
        setProcessingId(null);
        toast.error('Failed to approve verification');
      }
    });
  };

  const openRejectModal = (creatorId: number) => {
    setRejectModalState({ isOpen: true, creatorId });
    setRejectReason('');
  };

  const handleReject = () => {
    if (!rejectModalState.creatorId || !rejectReason.trim()) return;
    
    setProcessingId(rejectModalState.creatorId);
    rejectVerification(
      { creatorId: rejectModalState.creatorId, reason: rejectReason.trim() },
      {
        onSuccess: () => {
          setProcessingId(null);
          setRejectModalState({ isOpen: false, creatorId: null });
          toast.success('Creator verification rejected.');
        },
        onError: () => {
          setProcessingId(null);
          toast.error('Failed to reject verification');
        }
      }
    );
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-900">Pending Verifications</h1>
        <p className="text-stone-500 mt-2">Review and approve creator verification requests.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
            <tr>
              <th className="p-4 font-semibold">Creator</th>
              <th className="p-4 font-semibold">FSSAI Number</th>
              <th className="p-4 font-semibold">Documents</th>
              <th className="p-4 font-semibold">Ingredients</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {verifications?.map((v) => (
              <tr key={v.verificationId} className="hover:bg-stone-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-stone-900">{v.creator?.name}</div>
                  <div className="text-xs text-stone-500">ID: {v.creator?.restaurantId}</div>
                </td>
                <td className="p-4 text-stone-700">{v.foodLicenceNumber}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 text-xs text-blue-600">
                    {v.foodLicenceUrl && <a href={v.foodLicenceUrl} target="_blank" rel="noreferrer" className="hover:underline">FSSAI Cert</a>}
                    {v.kitchenPhotoUrl1 && <a href={v.kitchenPhotoUrl1} target="_blank" rel="noreferrer" className="hover:underline">Kitchen 1</a>}
                    {v.kitchenPhotoUrl2 && <a href={v.kitchenPhotoUrl2} target="_blank" rel="noreferrer" className="hover:underline">Kitchen 2</a>}
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-xs text-stone-600 max-w-xs truncate" title={v.ingredientDeclaration}>{v.ingredientDeclaration}</p>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => handleApprove(v.creator?.restaurantId ?? 0)}
                    disabled={processingId === v.creator?.restaurantId}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-stone-300 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    {processingId === v.creator?.restaurantId ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approve
                  </button>
                  <button 
                    onClick={() => openRejectModal(v.creator?.restaurantId ?? 0)}
                    disabled={processingId === v.creator?.restaurantId}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-stone-300 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    {processingId === v.creator?.restaurantId ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Reject
                  </button>
                </td>
              </tr>
            ))}
            {(!verifications || verifications.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-stone-500">No pending verifications.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rejectModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-stone-900 mb-2">Reject Verification</h3>
            <p className="text-sm text-stone-500 mb-4">Please provide a reason for rejecting this creator's verification request.</p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., FSSAI certificate is blurry and unreadable..."
              className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 min-h-[100px] mb-4"
            />
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setRejectModalState({ isOpen: false, creatorId: null })}
                disabled={!!processingId}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                disabled={!rejectReason.trim() || !!processingId}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {processingId ? <Loader2 size={16} className="animate-spin" /> : null}
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

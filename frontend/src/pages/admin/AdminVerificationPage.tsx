import { useState } from 'react';
import { useGetPendingVerifications, useApproveVerification } from '@/queries/verification';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminVerificationPage() {
  const { data: verifications, isLoading } = useGetPendingVerifications();
  const { mutate: approveVerification } = useApproveVerification();

  const [processingId, setProcessingId] = useState<number | null>(null);

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
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleApprove(v.creator?.restaurantId ?? 0)}
                    disabled={processingId === v.creator?.restaurantId}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-stone-300 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    {processingId === v.creator?.restaurantId ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approve
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
    </div>
  );
}

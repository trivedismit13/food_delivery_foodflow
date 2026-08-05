import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export interface CreatorVerification {
  verificationId: number;
  currentLevel: number;
  foodLicenceNumber?: string;
  foodLicenceUrl?: string;
  kitchenPhotoUrl1?: string;
  kitchenPhotoUrl2?: string;
  ingredientDeclaration?: string;
  creator?: {
    restaurantId: number;
    name: string;
  };
}

export const useGetVerificationStatus = (creatorId: number) => {
  return useQuery({
    queryKey: ['verification', creatorId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: CreatorVerification }>(`/creators/${creatorId}/verification`);
      return res.data.data;
    },
    enabled: !!creatorId
  });
};

export const useSubmitLevel2Verification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ creatorId, payload }: { creatorId: number, payload: any }) => {
      const res = await apiClient.put<{ data: CreatorVerification }>(`/creators/${creatorId}/verification/level-2`, payload);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['verification', variables.creatorId] });
      queryClient.invalidateQueries({ queryKey: ['creators', variables.creatorId] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    }
  });
};

export const useGetPendingVerifications = () => {
  return useQuery({
    queryKey: ['admin-verifications-pending'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: CreatorVerification[] }>('/verification/pending');
      return res.data.data;
    }
  });
};

export const useApproveVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ creatorId, level }: { creatorId: number, level: number }) => {
      const res = await apiClient.put<{ data: CreatorVerification }>(`/verification/${creatorId}/approve?level=${level}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-verifications-pending'] });
    }
  });
};

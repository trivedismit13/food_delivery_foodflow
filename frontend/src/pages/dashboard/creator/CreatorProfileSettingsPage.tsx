import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCreatorById } from '@/queries/creators';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Save, User } from 'lucide-react';

interface UpdateCreatorProfilePayload {
  bio?: string;
  city?: string;
  pickupAddress?: string;
  instagramHandle?: string;
  cuisine?: string;
}

function useUpdateCreatorProfile(creatorId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateCreatorProfilePayload) => {
      const response = await apiClient.put(`/creators/${creatorId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['creator', creatorId] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
}

export default function CreatorProfileSettingsPage() {
  const { creatorProfile } = useAuthStore();
  const creatorId = creatorProfile?.restaurantId;

  const { data: creatorData, isLoading } = useCreatorById(creatorId);

  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [cuisine, setCuisine] = useState('');

  // Populate form once data loads
  useEffect(() => {
    if (creatorData) {
      setBio((creatorData as any).bio || '');
      setCity((creatorData as any).city || '');
      setPickupAddress((creatorData as any).pickupAddress || '');
      setInstagramHandle((creatorData as any).instagramHandle || '');
      setCuisine((creatorData as any).cuisine || '');
    }
  }, [creatorData]);

  const { mutate: updateProfile, isPending: isSaving } = useUpdateCreatorProfile(creatorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (bio.length > 500) {
      toast.error('Bio must be 500 characters or fewer');
      return;
    }
    if (city.length > 100) {
      toast.error('City must be 100 characters or fewer');
      return;
    }
    if (pickupAddress.length > 255) {
      toast.error('Pickup address must be 255 characters or fewer');
      return;
    }
    if (instagramHandle.length > 100) {
      toast.error('Instagram handle must be 100 characters or fewer');
      return;
    }
    if (cuisine.length > 50) {
      toast.error('Cuisine must be 50 characters or fewer');
      return;
    }

    updateProfile({ bio, city, pickupAddress, instagramHandle, cuisine });
  };

  if (!creatorId) {
    return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Profile Settings</h1>
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-100 text-stone-500">
          Creator profile not found. Please log in as a creator.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Profile Settings</h1>
      <p className="text-stone-500 mb-8">Manage your public creator profile.</p>

      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 flex justify-center items-center border border-stone-100">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Creator Identity (read-only) */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-bold border border-orange-200 shrink-0">
                {(creatorData as any)?.name?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">{(creatorData as any)?.name || 'Your Creator Name'}</h2>
                <p className="text-sm text-stone-500 capitalize">{(creatorData as any)?.creatorType?.replace('_', ' ').toLowerCase() || 'Creator'}</p>
              </div>
            </div>
            <p className="text-xs text-stone-400">
              Creator name and type are set during registration. Contact support to change them.
            </p>
          </div>

          {/* Editable Fields */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-stone-900 mb-2">Public Profile</h2>

            {/* Bio */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="block text-sm font-semibold text-stone-700">Bio</label>
                <span className={`text-xs ${bio.length > 480 ? 'text-orange-500' : 'text-stone-400'}`}>
                  {bio.length}/500
                </span>
              </div>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Tell customers about your food, your story, and what makes your creations special..."
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 resize-none transition"
              />
            </div>

            {/* Cuisine */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-stone-700">Cuisine Type</label>
              <input
                type="text"
                value={cuisine}
                onChange={e => setCuisine(e.target.value)}
                maxLength={50}
                placeholder="e.g. Indian, Baked Goods, Korean"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-stone-700">City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                maxLength={100}
                placeholder="e.g. Mumbai"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
              />
            </div>

            {/* Pickup Address */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-stone-700">Pickup Address</label>
              <input
                type="text"
                value={pickupAddress}
                onChange={e => setPickupAddress(e.target.value)}
                maxLength={255}
                placeholder="Full pickup address visible to customers after ordering"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
              />
              <p className="text-xs text-stone-400">This address will be shown to customers after they place an order.</p>
            </div>

            {/* Instagram Handle */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-stone-700">Instagram Handle</label>
              <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-300 focus-within:border-orange-400 transition">
                <span className="px-4 py-3 bg-stone-50 text-stone-500 text-sm border-r border-stone-200 shrink-0">@</span>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={e => setInstagramHandle(e.target.value.replace('@', ''))}
                  maxLength={100}
                  placeholder="yourhandle"
                  className="flex-1 px-4 py-3 text-sm focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-300 text-white font-bold rounded-xl transition-colors shadow-sm"
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

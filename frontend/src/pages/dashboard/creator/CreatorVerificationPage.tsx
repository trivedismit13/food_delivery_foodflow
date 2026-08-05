import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { VerificationBadge } from '@/components/creators/VerificationBadge';
import { CheckCircle2, Circle, Clock, Upload, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useGetVerificationStatus, useSubmitLevel2Verification } from '@/queries/verification';

export default function CreatorVerificationPage() {
  const { user, creatorProfile } = useAuthStore();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const creatorId = creatorProfile?.restaurantId || user?.userId;
  const { data: verificationStatus, refetch } = useGetVerificationStatus(creatorId || 0);
  const { mutate: submitLevel2 } = useSubmitLevel2Verification();

  useEffect(() => {
    if (verificationStatus) {
      // In FoodFlow, 0 means unverified, 1 means level 1, 2 means level 2
      if (verificationStatus.currentLevel === 0) {
        // Technically identity verified (phone) is level 1
        setCurrentLevel(1);
      } else if (verificationStatus.currentLevel === 1 && verificationStatus.foodLicenceUrl) {
         // Submitted for level 2 but pending
         setCurrentLevel(1.5); 
      } else if (verificationStatus.currentLevel >= 2) {
         setCurrentLevel(2);
      }
      
      if (verificationStatus.foodLicenceNumber) setFssaiNum(verificationStatus.foodLicenceNumber);
      if (verificationStatus.foodLicenceUrl) setFssaiCertUrl(verificationStatus.foodLicenceUrl);
      if (verificationStatus.kitchenPhotoUrl1) setKitchenPhoto1(verificationStatus.kitchenPhotoUrl1);
      if (verificationStatus.kitchenPhotoUrl2) setKitchenPhoto2(verificationStatus.kitchenPhotoUrl2);
      if (verificationStatus.ingredientDeclaration) setIngredients(verificationStatus.ingredientDeclaration);
    }
  }, [verificationStatus]);
  
  // Form state
  const [fssaiNum, setFssaiNum] = useState('');
  const [fssaiCertUrl, setFssaiCertUrl] = useState('');
  const [kitchenPhoto1, setKitchenPhoto1] = useState('');
  const [kitchenPhoto2, setKitchenPhoto2] = useState('');
  const [ingredients, setIngredients] = useState('');

  const handleSubmitL2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorId) return;
    
    setIsSubmitting(true);
    
    const payload = {
      foodLicenceNumber: fssaiNum,
      foodLicenceUrl: fssaiCertUrl,
      kitchenPhotoUrl1: kitchenPhoto1,
      kitchenPhotoUrl2: kitchenPhoto2,
      ingredientDeclaration: ingredients,
    };
    
    submitLevel2({ creatorId, payload }, {
      onSuccess: () => {
        setIsSubmitting(false);
        toast.success("Verification Level 2 submitted for review!");
        refetch();
      },
      onError: () => {
        setIsSubmitting(false);
        toast.error("Failed to submit verification.");
      }
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 md:p-12 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={32} />
            <h1 className="font-display text-4xl font-bold">Build Customer Trust</h1>
          </div>
          <p className="text-orange-50 text-lg font-medium leading-relaxed">
            Verified creators get <span className="font-bold underline decoration-orange-300 underline-offset-4">3x more orders</span> on average. 
            Complete your verification steps below to earn badges that display on your profile.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Timeline */}
        <div className="flex-1 w-full space-y-6">
          
          {/* STEP 1: Identity */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-green-500 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full flex items-start justify-end p-3 text-green-600">
              <CheckCircle2 size={24} />
            </div>
            
            <div className="flex gap-4 items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">Identity Verified</h3>
                <p className="text-sm text-stone-500 mt-1">Completed during registration.</p>
              </div>
            </div>
            
            <div className="pl-14 space-y-2 text-sm font-medium text-stone-700">
              <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Phone number verified</p>
              <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Account created</p>
            </div>
          </div>

          {/* STEP 2: Food Business */}
          <div className={cn("bg-white rounded-2xl p-6 md:p-8 border-2 shadow-sm transition-colors", currentLevel === 1 ? "border-orange-400" : "border-green-500")}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-start">
                <div className={cn("w-10 h-10 rounded-full font-bold flex items-center justify-center shrink-0", 
                  currentLevel === 1 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                )}>2</div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">Food Business Verification</h3>
                  <p className="text-sm text-stone-500 mt-1">Prove your kitchen meets safety standards.</p>
                </div>
              </div>
              {currentLevel === 1 ? (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Circle size={12} className="fill-orange-500" /> Action Required
                </span>
              ) : currentLevel === 1.5 ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Clock size={12} /> Under Review
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <CheckCircle2 size={12} className="fill-green-500 text-white" /> Approved
                </span>
              )}
            </div>

            {currentLevel === 1 && (
              <form onSubmit={handleSubmitL2} className="pl-14 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">FSSAI Registration Number *</label>
                  <input required type="text" value={fssaiNum} onChange={e=>setFssaiNum(e.target.value)} placeholder="e.g. 215XXXXXXXXXXX or 'Applied'" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">FSSAI Certificate Photo URL *</label>
                  <div className="flex gap-2">
                    <input required type="url" value={fssaiCertUrl} onChange={e=>setFssaiCertUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" />
                    <button type="button" className="bg-stone-100 text-stone-600 px-4 rounded-xl border border-stone-200 hover:bg-stone-200"><Upload size={18}/></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Kitchen Photo 1 *</label>
                    <input required type="url" value={kitchenPhoto1} onChange={e=>setKitchenPhoto1(e.target.value)} placeholder="Photo showing cooking area" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Kitchen Photo 2 *</label>
                    <input required type="url" value={kitchenPhoto2} onChange={e=>setKitchenPhoto2(e.target.value)} placeholder="Photo showing storage area" className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Ingredient Declaration *</label>
                  <p className="text-xs text-stone-500 mb-2">Tell customers what ingredients and brands you use. Example: "I use Amul butter, Aashirvaad atta, and fresh vegetables from the local market. No artificial colors."</p>
                  <textarea required value={ingredients} onChange={e=>setIngredients(e.target.value)} rows={3} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm resize-none" />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-stone-300 text-white font-bold rounded-xl py-3 px-6 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Submit for Verification"}
                </button>
              </form>
            )}
            
            {currentLevel === 1.5 && (
              <div className="pl-14 text-sm font-medium text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-100 mt-4">
                Your application is currently under review by our team. This usually takes 24-48 hours.
              </div>
            )}
            
            {currentLevel >= 2 && (
              <div className="pl-14 text-sm font-medium text-green-700 bg-green-50 p-4 rounded-xl border border-green-100 mt-4 flex flex-col gap-2">
                <p><strong>FSSAI:</strong> {fssaiNum}</p>
                <p><strong>Ingredients:</strong> {ingredients}</p>
              </div>
            )}
          </div>

          {/* STEP 3: Inspection */}
          <div className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-200 opacity-70">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-500 font-bold flex items-center justify-center shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-bold text-stone-500">On-site Kitchen Inspection</h3>
                  <p className="text-sm text-stone-400 mt-1">Our team visits your kitchen.</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-stone-200 text-stone-500 text-xs font-bold rounded-full uppercase tracking-wider shrink-0">
                Locked
              </span>
            </div>
            <div className="pl-14 mt-4">
              <p className="text-sm text-stone-500 font-medium">Coming soon. Achieving Level 2 verification unlocks inspection eligibility.</p>
            </div>
          </div>

        </div>

        {/* Right Column: Preview */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-stone-900 mb-2">Trust Preview</h3>
            <p className="text-sm text-stone-500 mb-6 pb-6 border-b border-stone-100">Here's how customers will see your verification badges on your profile.</p>
            
            {/* Mini Creator Card Preview */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm mb-3">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <h4 className="font-bold text-stone-900 text-lg mb-1">{user?.name || "Your Kitchen"}</h4>
              <p className="text-xs text-stone-500 mb-4">Home Chef</p>
              
              <div className="flex justify-center">
                <VerificationBadge level={currentLevel === 1 ? 1 : 2} />
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Unlocks at Level 2</p>
              <ul className="text-sm text-stone-600 space-y-2">
                <li className="flex items-center gap-2">✅ Display FSSAI status</li>
                <li className="flex items-center gap-2">✅ Show ingredient promise</li>
                <li className="flex items-center gap-2">✅ Ranked higher in search</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

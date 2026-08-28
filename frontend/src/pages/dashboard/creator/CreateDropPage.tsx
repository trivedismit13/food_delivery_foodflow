import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropCard } from '@/components/drops/DropCard';
import { useAuthStore } from '@/store/authStore';
import { Upload, X, Search, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateDrop } from '@/queries/drops';
import { useMenu } from '@/queries/menu';
import { ValidationError } from '@/lib/api';

export default function CreateDropPage() {
  const navigate = useNavigate();
  const { user, creatorProfile } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [dropDate, setDropDate] = useState('');
  const [cutoffTime, setCutoffTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const [maxOrders, setMaxOrders] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Menu Catalog
  const { data: menuItems = [], isLoading: isLoadingMenu } = useMenu(creatorProfile?.restaurantId);
  const createDropMutation = useCreateDrop();

  const normalizedMenuItems = (menuItems as any[]).map((item) => ({
    ...item,
    itemId: item.itemId ?? item.menuItemId,
    price: item.price ?? 0,
  }));

  const handleAddItem = (menuItem: any) => {
    const normalizedItem = {
      ...menuItem,
      itemId: menuItem.itemId ?? menuItem.menuItemId,
      dropPrice: String(menuItem.price ?? ''),
      availableQty: '1',
    };

    if (!selectedItems.find(i => (i.itemId ?? i.menuItemId) === normalizedItem.itemId)) {
      setSelectedItems([...selectedItems, normalizedItem]);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setSelectedItems(selectedItems.filter(i => i.itemId !== itemId));
  };

  const handleItemUpdate = (itemId: number, field: string, value: string) => {
    setSelectedItems(selectedItems.map(i => i.itemId === itemId ? { ...i, [field]: value } : i));
  };

  const handlePhotoSelection = (file: File | null | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoUrl(result);
      toast.success('Photo attached successfully.');
    };
    reader.onerror = () => {
      toast.error('Unable to read the selected image.');
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handlePhotoSelection(event.dataTransfer.files?.[0]);
  };

  const clearPhoto = () => {
    setPhotoUrl('');
  };

  // Derived state for the preview
  const previewDrop = {
    dropId: 999,
    title: title || "Your Drop Title",
    creatorId: user?.userId || 1,
    creatorName: user?.name || "Creator",
    creatorVerificationLevel: creatorProfile?.verificationLevel || 1,
    status: 'ANNOUNCED' as const,
    maxOrders: parseInt(maxOrders) || 0,
    currentOrders: 0,
    orderCutoffTime: cutoffTime ? new Date(cutoffTime).toISOString() : new Date().toISOString(),
    dropDate: dropDate ? new Date(dropDate).toISOString() : new Date().toISOString(),
    pickupLocation: pickupLocation || "TBD",
    pickupTime: pickupTime || "TBD",
    minPrice: selectedItems.length > 0 
      ? Math.min(...selectedItems.map(i => parseInt(i.dropPrice || i.price))) 
      : 0,
    description: description || "Drop description will appear here.",
    dropPhotoUrl: photoUrl || null,
    type: 'Meals'
  };

  const handlePublish = async () => {
    if (!title || !description || selectedItems.length === 0 || !maxOrders || !dropDate || !cutoffTime || !pickupLocation || !pickupTime) {
      toast.error("Please fill in all required fields and add at least one item.");
      return;
    }

    const maxOrdersNum = parseInt(maxOrders, 10);
    if (isNaN(maxOrdersNum) || maxOrdersNum <= 0) {
      toast.error("Total Maximum Orders must be greater than 0.");
      return;
    }

    const invalidItem = selectedItems.find(item => {
      const qty = parseInt(item.availableQty || '1', 10);
      const price = parseFloat(item.dropPrice || item.price || '0');
      return isNaN(qty) || qty <= 0 || isNaN(price) || price < 0;
    });

    if (invalidItem) {
      toast.error("Item quantities must be > 0 and prices >= 0.");
      return;
    }

    const cutoffDate = new Date(cutoffTime);
    const dropDateObj = new Date(dropDate);
    if (cutoffDate >= dropDateObj) {
      toast.error("Order cutoff time must be before the drop date.");
      return;
    }
    
    setIsSaving(true);
    try {
      await createDropMutation.mutateAsync({
        title,
        description,
        dropDate,
        orderCutoffTime: new Date(cutoffTime).toISOString(),
        pickupLocation,
        pickupTime,
        maxOrders: parseInt(maxOrders),
        dropPhotoUrl: photoUrl || undefined,
        specialNotes,
        items: selectedItems.map((item) => ({
          itemId: item.itemId ?? item.menuItemId,
          quantityAvailable: parseInt(item.availableQty || '1', 10),
          dropPrice: parseFloat(item.dropPrice || item.price || '0')
        }))
      } as any);
      // Navigate is handled in onSuccess in the query hook
    } catch (e: any) {
      if (e instanceof ValidationError) {
        setFieldErrors(e.fieldErrors);
      }
      // other errors are handled in the query hook via toast
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      
      {/* LEFT COLUMN: Form (Scrollable) */}
      <div className="w-full lg:w-[60%] h-full overflow-y-auto p-4 md:p-8 bg-white border-r border-stone-200">
        <div className="max-w-2xl mx-auto space-y-10 pb-24">
          
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Create New Drop</h1>
            <p className="text-stone-500">Fill out the details below to schedule your next drop.</p>
          </div>

          {/* Section 1: Basic Info */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">1. Basic Info</h2>
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Drop Title *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunday Special Mutton Biryani"
                maxLength={60}
                className={`w-full text-lg bg-stone-50 border ${fieldErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-orange-500 focus:ring-orange-500'} rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all`}
              />
              {fieldErrors.title && <p className="text-red-500 text-xs mt-1">{fieldErrors.title}</p>}
              <div className="text-right text-xs text-stone-400 mt-1">{title.length}/60</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Description *</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what makes this drop special. Customers want to know how it's made, what makes it unique, and why they should order."
                rows={4}
                maxLength={500}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none transition-all"
              />
              <div className="text-right text-xs text-stone-400 mt-1">{description.length}/500</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Drop Photo</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoSelection(e.target.files?.[0])}
              />
              <div
                className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center hover:bg-stone-50 hover:border-orange-300 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handlePhotoDrop}
              >
                {photoUrl ? (
                  <div className="space-y-3">
                    <img
                      src={photoUrl}
                      alt="Drop preview"
                      className="mx-auto h-40 w-full max-w-xs rounded-xl object-cover border border-stone-200"
                    />
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-stone-700">Photo ready to be attached</p>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearPhoto();
                        }}
                        className="text-xs font-semibold text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-3 group-hover:text-orange-500 transition-colors" />
                    <p className="text-sm font-medium text-stone-700 mb-1">Drag photo here or click to upload</p>
                    <p className="text-xs text-stone-500">JPG, PNG, or WebP up to 5MB</p>
                  </>
                )}
              </div>
              <div className="mt-3">
                <label className="block text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">Or use an image URL</label>
                <input 
                  type="text" 
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Schedule */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">2. Schedule</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Drop Date *</label>
                <input 
                  type="date" 
                  value={dropDate}
                  onChange={(e) => setDropDate(e.target.value)}
                  className={`w-full bg-stone-50 border ${fieldErrors.dropDate ? 'border-red-500' : 'border-stone-200'} rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500`}
                />
                {fieldErrors.dropDate && <p className="text-red-500 text-xs mt-1">{fieldErrors.dropDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Order Cutoff Time *</label>
                <input 
                  type="datetime-local" 
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.target.value)}
                  className={`w-full bg-stone-50 border ${fieldErrors.orderCutoffTime ? 'border-red-500' : 'border-stone-200'} rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500`}
                />
                {fieldErrors.orderCutoffTime && <p className="text-red-500 text-xs mt-1">{fieldErrors.orderCutoffTime}</p>}
                <p className="text-xs text-stone-500 mt-1">Customers cannot order after this time.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Pickup Location *</label>
                <input 
                  type="text" 
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Near VIT Main Gate"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Pickup Time *</label>
                <input 
                  type="text" 
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="e.g. 4:00 PM - 6:00 PM"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

          </section>

          {/* Section 3: Items */}
          <section className="space-y-6">
            <div className="flex justify-between items-end border-b border-stone-100 pb-2">
              <h2 className="text-xl font-bold text-stone-900">3. Items & Inventory</h2>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Total Maximum Orders *</label>
              <input 
                type="number" 
                value={maxOrders}
                onChange={(e) => setMaxOrders(e.target.value)}
                placeholder="e.g. 20"
                className="w-1/3 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
              />
              <p className="text-xs text-stone-500 mt-1">Total slots available across all items. Start small!</p>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h3 className="font-semibold text-stone-800 mb-3 text-sm flex items-center gap-2">
                <Search size={16} className="text-stone-400"/> Add from your menu
              </h3>
              <div className="flex flex-wrap gap-2">
                {normalizedMenuItems.length === 0 ? (
                  <p className="text-sm text-stone-500">No menu items were found for this creator yet.</p>
                ) : normalizedMenuItems.map(item => {
                  const isAdded = selectedItems.find(i => (i.itemId ?? i.menuItemId) === (item.itemId ?? item.menuItemId));
                  return (
                    <button
                      key={item.itemId}
                      onClick={() => !isAdded && handleAddItem(item)}
                      disabled={isAdded !== undefined}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        isAdded 
                          ? 'bg-stone-200 border-stone-200 text-stone-400 cursor-not-allowed' 
                          : 'bg-white border-stone-300 text-stone-700 hover:border-orange-400 hover:text-orange-600'
                      }`}
                    >
                      <Plus size={14} /> {item.name} (₹{item.price})
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedItems.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-stone-800 text-sm">Selected Items for Drop</h3>
                {selectedItems.map((item) => (
                  <div key={item.itemId} className="flex flex-wrap md:flex-nowrap items-center gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-bold text-stone-800 text-sm">{item.name}</p>
                      <p className="text-xs text-stone-500">Menu price: ₹{item.price}</p>
                    </div>
                    
                    <div className="w-24">
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Available Qty</label>
                      <input 
                        type="number" 
                        value={item.availableQty}
                        onChange={(e) => handleItemUpdate(item.itemId, 'availableQty', e.target.value)}
                        placeholder="e.g. 10"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    
                    <div className="w-28">
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Drop Price (₹)</label>
                      <input 
                        type="number" 
                        value={item.dropPrice}
                        onChange={(e) => handleItemUpdate(item.itemId, 'dropPrice', e.target.value)}
                        placeholder={`e.g. ${item.price}`}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    
                    <button 
                      onClick={() => handleRemoveItem(item.itemId)}
                      className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 mt-4 md:mt-0"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section 4: Notes */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">4. Notes</h2>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Special instructions for customers (Optional)</label>
              <textarea 
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. 'Please bring your own container' or 'Nut-free kitchen'"
                rows={2}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none transition-all"
              />
            </div>
          </section>

        </div>
      </div>

      {/* RIGHT COLUMN: Live Preview (Sticky) */}
      <div className="w-full lg:w-[40%] bg-stone-100 h-full overflow-y-auto flex flex-col items-center p-6 border-t lg:border-t-0">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-stone-500 text-sm font-medium">Live Preview</span>
            <div className="h-px bg-stone-300 flex-1"></div>
          </div>
          
          <div className="pointer-events-none w-full shadow-2xl rounded-3xl transition-transform hover:scale-[1.02] duration-300">
            <DropCard {...(previewDrop as any)} />
          </div>

          <p className="text-center text-xs text-stone-400 mt-6 max-w-[250px] mx-auto">
            This is exactly how customers will see your drop in the discovery feed.
          </p>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-stone-200 p-4 px-6 flex justify-end gap-3 z-50">
        <button 
          className="px-6 py-2.5 rounded-xl font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
          disabled={isSaving}
        >
          Save as Draft
        </button>
        <button 
          onClick={handlePublish}
          disabled={isSaving}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-stone-300 text-white px-8 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : "Publish Drop"}
        </button>
      </div>

    </div>
  );
}

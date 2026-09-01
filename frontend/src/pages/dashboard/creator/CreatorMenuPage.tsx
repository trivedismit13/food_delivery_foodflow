import { useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import type { MenuItemResponse } from '@/types/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMenu, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '@/queries/menu';

export default function CreatorMenuPage() {
  const { creatorProfile } = useAuthStore();
  const queryClient = useQueryClient();
  const [isSlideoverOpen, setIsSlideoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    availableQty: '',
    isVeg: true,
  });

  const { data: menuItems = [], isLoading: isLoadingMenu } = useMenu(creatorProfile?.restaurantId);

  const categories = useMemo<string[]>(() => ['All', ...Array.from(new Set<string>(menuItems.map((item: MenuItemResponse) => item.category)))], [menuItems]);

  const filteredMenu = useMemo<MenuItemResponse[]>(() => menuItems.filter((item: MenuItemResponse) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  }), [menuItems, searchQuery, activeCategory]);

  const createMenuMutation = useCreateMenuItem(creatorProfile?.restaurantId);
  const deleteMenuMutation = useDeleteMenuItem(creatorProfile?.restaurantId);

  // We should also handle onSuccess differently since it's now in the hook, but let's override it or just use a toast effect.
  // Actually, wait, useCreateMenuItem does not show toast inside the hook.
  // We can wrap the mutate call.

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorProfile?.restaurantId) {
      toast.error('You need to be signed in as a creator to manage menu items.');
      return;
    }

    const trimmedName = form.name.trim();
    const trimmedCategory = form.category.trim();
    const price = Number(form.price);
    const availableQty = Number(form.availableQty || 0);

    if (!trimmedName || !trimmedCategory || !Number.isFinite(price) || price <= 0) {
      toast.error('Please fill in the item name, category, and a valid price.');
      return;
    }

    createMenuMutation.mutate({
      name: trimmedName,
      description: form.description.trim(),
      price,
      isVeg: form.isVeg,
      category: trimmedCategory,
      availableQty,
    }, {
      onSuccess: () => {
        setForm({ name: '', description: '', price: '', category: '', availableQty: '', isVeg: true });
        setIsSlideoverOpen(false);
        toast.success('Menu item saved successfully!');
      },
      onError: (error: unknown) => {
        const message = error instanceof Error
          ? error.message
          : 'Could not save the menu item.';
        toast.error(message);
      }
    });
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900 mb-1">Your Menu</h1>
          <p className="text-stone-500">Manage your catalog of items available for drops.</p>
        </div>
        <button 
          onClick={() => setIsSlideoverOpen(true)}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 shrink-0">
        <div className="relative w-full md:w-96 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap border shadow-sm",
                activeCategory === cat 
                  ? "bg-stone-800 border-stone-800 text-white" 
                  : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-white border border-stone-200 rounded-2xl shadow-sm">
        {isLoadingMenu ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center text-stone-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading menu...</p>
          </div>
        ) : filteredMenu.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-2xl mb-4">🍽️</div>
            <p className="text-stone-900 font-semibold mb-1">No items found</p>
            <p className="text-stone-500 text-sm">Try adjusting your search or add a new item.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredMenu.map((item: MenuItemResponse) => (
              <div key={item.menuItemId} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className={cn("w-4 h-4 border flex items-center justify-center rounded-sm shrink-0", item.isVegetarian ? "border-green-600" : "border-red-600")}>
                      <div className={cn("w-2 h-2 rounded-full", item.isVegetarian ? "bg-green-600" : "bg-red-600")}></div>
                    </div>
                    <h3 className="font-bold text-stone-900 truncate">{item.name}</h3>
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0">{item.category}</span>
                  </div>
                  <p className="text-sm text-stone-500 pl-7 line-clamp-2">{item.description}</p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3 shrink-0 sm:pl-4 sm:border-l border-stone-100 pl-7">
                  <div>
                    <p className="font-bold text-stone-900 text-lg">₹{item.price}</p>
                    <p className="text-xs text-stone-400">Qty: {item.isAvailable ? 'Available' : 'Unavailable'}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteMenuMutation.mutate(item.menuItemId, {
                      onSuccess: () => toast.success('Menu item removed.'),
                      onError: () => toast.error('Could not delete the menu item.')
                    })} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" disabled={deleteMenuMutation.isPending}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-over Form Panel */}
      <AnimatePresence>
        {isSlideoverOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSlideoverOpen(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-stone-200"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <h2 className="text-xl font-bold text-stone-900">Add Menu Item</h2>
                <button 
                  onClick={() => setIsSlideoverOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-stone-400 hover:bg-stone-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <form id="menuForm" onSubmit={handleSaveItem} className="space-y-5">
                  
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Item Name *</label>
                    <input required type="text" value={form.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" placeholder="e.g. Chicken 65" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">Description</label>
                    <textarea rows={3} value={form.description} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm resize-none" placeholder="What's in it?" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1.5">Base Price (₹) *</label>
                      <input required type="number" min="0" value={form.price} onChange={(e) => handleInputChange('price', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" placeholder="250" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1.5">Category *</label>
                      <select required value={form.category} onChange={(e) => handleInputChange('category', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 text-sm appearance-none">
                        <option value="">Select category...</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Appetizers">Appetizers</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Sides">Sides</option>
                        <option value="Breads">Breads</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-1.5">Default Quantity</label>
                      <input type="number" min="0" value={form.availableQty} onChange={(e) => handleInputChange('availableQty', e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" placeholder="e.g. 50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-3">Dietary Type *</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-stone-700 cursor-pointer">
                          <input type="radio" name="diet" value="veg" checked={form.isVeg} onChange={() => handleInputChange('isVeg', true)} className="text-green-600 focus:ring-green-500" /> Veg
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium text-stone-700 cursor-pointer">
                          <input type="radio" name="diet" value="nonveg" checked={!form.isVeg} onChange={() => handleInputChange('isVeg', false)} className="text-red-600 focus:ring-red-500" /> Non-Veg
                        </label>
                      </div>
                    </div>
                  </div>
                  
                </form>
              </div>

              <div className="p-6 border-t border-stone-100 bg-stone-50">
                <button 
                  type="submit" 
                  form="menuForm"
                  disabled={createMenuMutation.isPending}
                  className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white font-bold rounded-xl py-3.5 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {createMenuMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : "Save Item"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function CreatorProfileSettingsPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Profile Settings</h1>
      <p className="text-stone-500 mb-8">Manage your public creator profile.</p>
      
      <div className="bg-white rounded-3xl p-12 text-center border border-stone-100">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
          ⚙️
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Settings Coming Soon</h2>
        <p className="text-stone-500">Update your avatar, bio, and kitchen details here.</p>
      </div>
    </div>
  );
}

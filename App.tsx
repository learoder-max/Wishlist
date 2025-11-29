import React, { useState, useMemo } from 'react';
import { MOCK_USERS, MOCK_ITEMS } from './constants';
import { User, WishlistItem, ViewState } from './types';
import { Navigation } from './components/Navigation';
import { WishlistItemCard } from './components/WishlistItemCard';
import { AddItemModal } from './components/AddItemModal';
import { EditProfileModal } from './components/EditProfileModal';
import { Settings, LogOut, ChevronRight, Gift, Globe, Lock } from 'lucide-react';

export default function App() {
  // State
  // We manage users in state to allow updates. 
  // We assume the first user (id 'u1') is the logged-in user for this demo.
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const currentUser = users.find(u => u.id === 'u1') || users[0];

  const [items, setItems] = useState<WishlistItem[]>(MOCK_ITEMS);
  const [view, setView] = useState<ViewState>({ type: 'feed' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | undefined>(undefined);

  // Computed
  const feedItems = useMemo(() => {
    // Show items from everyone (except private ones not owned by me)
    // Sorted by newest
    return items
      .filter(item => {
        if (item.userId === currentUser.id) return true; // Show my items (private or public)
        return !item.isPrivate; // Show only public items from others
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [items, currentUser.id]);

  const getProfileItems = (userId: string) => {
    const isMe = userId === currentUser.id;
    return items.filter(item => item.userId === userId && (isMe || !item.isPrivate));
  };

  // Actions
  const handleAddItem = (partialItem: Partial<WishlistItem>) => {
    if (partialItem.id) {
      // Edit
      setItems(prev => prev.map(item => item.id === partialItem.id ? { ...item, ...partialItem } as WishlistItem : item));
    } else {
      // Add
      const newItem: WishlistItem = {
        ...partialItem,
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.id,
        createdAt: Date.now(),
        // Ensure required fields are set
        title: partialItem.title || 'Untitled',
        url: partialItem.url || '',
        isPrivate: partialItem.isPrivate || false,
      } as WishlistItem;
      setItems(prev => [newItem, ...prev]);
    }
    setEditingItem(undefined);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this wish?')) {
      setItems(prev => prev.filter(i => i.id !== itemId));
    }
  };

  const handleUpdateProfile = (data: Partial<User>) => {
    setUsers(prev => prev.map(u => 
      u.id === currentUser.id ? { ...u, ...data } : u
    ));
    setIsProfileModalOpen(false);
  };

  const handleEditClick = (item: WishlistItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  // Views
  const renderFeed = () => (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-slate-800">Discover</h1>
        <p className="text-slate-500 text-sm">See what your friends are wishing for.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {feedItems.map(item => {
          const owner = users.find(u => u.id === item.userId);
          return (
            <WishlistItemCard
              key={item.id}
              item={item}
              owner={owner}
              isOwner={item.userId === currentUser.id}
              onEdit={handleEditClick}
              onDelete={handleDeleteItem}
            />
          );
        })}
        {feedItems.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400">
            <Gift size={48} className="mx-auto mb-4 opacity-50" />
            <p>No wishes yet. Be the first to add one!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderFriends = () => (
    <div className="space-y-6 pb-24">
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-slate-800">Friends</h1>
        <p className="text-slate-500 text-sm">View their full wishlists.</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
        {users.filter(u => u.id !== currentUser.id).map(user => {
          const itemCount = items.filter(i => i.userId === user.id && !i.isPrivate).length;
          return (
            <button
              key={user.id}
              onClick={() => setView({ type: 'profile', userId: user.id })}
              className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left"
            >
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-slate-100" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{user.name}</h3>
                <p className="text-sm text-slate-500 mb-1">{user.bio}</p>
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                  {itemCount} public items
                </div>
              </div>
              <ChevronRight className="text-slate-300" />
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderProfile = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return <div>User not found</div>;

    const isMe = userId === currentUser.id;
    const userItems = getProfileItems(userId);
    const publicItems = userItems.filter(i => !i.isPrivate);
    const privateItems = userItems.filter(i => i.isPrivate);

    // If it's me, I want to see tabs or sections. For simplicity, just sections.
    return (
      <div className="pb-24">
        {/* Profile Header */}
        <div className="relative bg-white pb-6 mb-6 border-b border-slate-200">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="px-4 -mt-12 flex items-end justify-between">
            <div className="flex items-end">
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover" />
            </div>
            {isMe && (
               <button 
                 onClick={() => setIsProfileModalOpen(true)}
                 className="mb-2 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
                 aria-label="Edit Profile"
               >
                 <Settings size={20} />
               </button>
            )}
          </div>
          <div className="px-4 mt-4">
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-slate-600">{user.bio}</p>
          </div>
        </div>

        {/* Wishlist Content */}
        <div className="px-4 space-y-8">
          
          {/* Public List */}
          <section>
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <Globe size={18} className="text-indigo-500" />
                 Public Wishlist
               </h2>
               <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{publicItems.length} items</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publicItems.length > 0 ? (
                publicItems.map(item => (
                  <WishlistItemCard
                    key={item.id}
                    item={item}
                    isOwner={isMe}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteItem}
                  />
                ))
              ) : (
                <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-slate-400 text-sm">No public items yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Private List (Only visible to me) */}
          {isMe && (
            <section className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <Lock size={18} className="text-slate-500" />
                   Private Wishlist
                 </h2>
                 <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{privateItems.length} items</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {privateItems.length > 0 ? (
                  privateItems.map(item => (
                    <WishlistItemCard
                      key={item.id}
                      item={item}
                      isOwner={isMe}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteItem}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-slate-400 text-sm">Your secret wishes go here.</p>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-4xl mx-auto border-x border-slate-200 shadow-xl overflow-hidden">
      {/* View Router */}
      <main className="min-h-screen">
        {view.type === 'feed' && renderFeed()}
        {view.type === 'friends' && renderFriends()}
        {view.type === 'profile' && renderProfile(view.userId)}
      </main>

      <Navigation 
        currentView={view} 
        onNavigate={setView} 
        onAddClick={openAddModal}
        currentUserId={currentUser.id}
      />

      <AddItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddItem}
        initialData={editingItem}
      />

      <EditProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleUpdateProfile}
        currentUser={currentUser}
      />
    </div>
  );
}
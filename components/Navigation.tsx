import React from 'react';
import { Home, Users, User, PlusCircle } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onAddClick: () => void;
  currentUserId: string;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, onAddClick, currentUserId }) => {
  
  const getButtonClass = (isActive: boolean) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-50 px-2 pb-safe">
      <button 
        onClick={() => onNavigate({ type: 'feed' })}
        className={getButtonClass(currentView.type === 'feed')}
      >
        <Home size={24} />
        <span className="text-xs font-medium">Feed</span>
      </button>

      <button 
        onClick={() => onNavigate({ type: 'friends' })}
        className={getButtonClass(currentView.type === 'friends')}
      >
        <Users size={24} />
        <span className="text-xs font-medium">Friends</span>
      </button>

      <div className="relative -top-5">
        <button 
          onClick={onAddClick}
          className="flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-full text-white shadow-lg hover:bg-indigo-700 transition-transform active:scale-95"
        >
          <PlusCircle size={28} />
        </button>
      </div>

      <button 
        onClick={() => onNavigate({ type: 'profile', userId: currentUserId })}
        className={getButtonClass(currentView.type === 'profile' && currentView.userId === currentUserId)}
      >
        <User size={24} />
        <span className="text-xs font-medium">Me</span>
      </button>
    </nav>
  );
};

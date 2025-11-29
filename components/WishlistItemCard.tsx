import React from 'react';
import { ExternalLink, Lock, Globe, Edit2, Trash2 } from 'lucide-react';
import { WishlistItem, User } from '../types';

interface WishlistItemCardProps {
  item: WishlistItem;
  owner?: User;
  isOwner: boolean;
  onEdit?: (item: WishlistItem) => void;
  onDelete?: (itemId: string) => void;
}

export const WishlistItemCard: React.FC<WishlistItemCardProps> = ({ item, owner, isOwner, onEdit, onDelete }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="aspect-square w-full bg-slate-100 relative overflow-hidden">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="text-sm">No Image</span>
          </div>
        )}
        
        {/* Privacy Badge (Only visible to owner) */}
        {isOwner && (
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            {item.isPrivate ? <Lock size={10} /> : <Globe size={10} />}
            <span>{item.isPrivate ? 'Private' : 'Public'}</span>
          </div>
        )}

        {/* Owner Avatar (Only visible in Feed) */}
        {!isOwner && owner && (
          <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-white/90 backdrop-blur-sm p-1 pr-3 rounded-full shadow-sm">
            <img src={owner.avatar} alt={owner.name} className="w-6 h-6 rounded-full" />
            <span className="text-xs font-medium text-slate-700">{owner.name}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-slate-900 line-clamp-2 leading-tight flex-1 pr-2" title={item.title}>
            {item.title}
          </h3>
          {item.price !== undefined && (
            <span className="font-bold text-emerald-600 whitespace-nowrap">
              {item.currency}{item.price.toFixed(2)}
            </span>
          )}
        </div>
        
        {item.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Visit Store <ExternalLink size={12} />
          </a>

          {isOwner && (
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit && onEdit(item)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              >
                <Edit2 size={14} />
              </button>
              <button 
                onClick={() => onDelete && onDelete(item.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Upload, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { WishlistItem } from '../types';
import { analyzeProductUrl } from '../services/geminiService';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<WishlistItem>) => void;
  initialData?: WishlistItem;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setUrl(initialData.url);
      setTitle(initialData.title);
      setPrice(initialData.price?.toString() || '');
      setImageUrl(initialData.imageUrl || '');
      setDescription(initialData.description || '');
      setIsPrivate(initialData.isPrivate);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setPrice('');
    setImageUrl('');
    setDescription('');
    setIsPrivate(false);
    setError(null);
  };

  const handleMagicFill = async () => {
    if (!url) {
      setError("Please enter a URL first.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    try {
      const data = await analyzeProductUrl(url);
      if (data) {
        if (data.title) setTitle(data.title);
        if (data.price) setPrice(data.price.toString());
        if (data.description) setDescription(data.description);
      } else {
        setError("Could not extract info. Please fill manually.");
      }
    } catch (e) {
      setError("Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      url,
      title,
      price: price ? parseFloat(price) : undefined,
      currency: '$', // Defaulting for MVP
      imageUrl,
      description,
      isPrivate
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Wish' : 'Add New Wish'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* URL Input Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Product URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/product..."
                className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
              />
              <button 
                type="button"
                onClick={handleMagicFill}
                disabled={isAnalyzing || !url}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-indigo-100 disabled:opacity-50 transition-colors"
              >
                {isAnalyzing ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                <span className="hidden sm:inline">Magic Fill</span>
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {error}
              </p>
            )}
            <p className="text-xs text-slate-400">
              Tip: Paste a URL and click Magic Fill to auto-detect details!
            </p>
          </div>

          {/* Image Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Product Image</label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0 relative group">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setImageUrl('')} 
                        className="text-white text-xs bg-red-500 px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <Upload size={24} className="text-slate-300" />
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                 <div className="relative">
                    <LinkIcon size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="w-full p-2.5 pl-9 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">OR</span>
                    <label className="cursor-pointer text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors font-medium">
                      Upload from Device
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                 </div>
              </div>
            </div>
          </div>

          {/* Details Form */}
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Vintage Lamp"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full p-3 pl-7 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
               </div>
               
               <div className="flex items-center pt-6">
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isPrivate ? 'bg-slate-800' : 'bg-slate-200'}`} onClick={() => setIsPrivate(!isPrivate)}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isPrivate ? 'translate-x-5' : ''}`} />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">
                      {isPrivate ? 'Private' : 'Public'}
                    </span>
                 </label>
               </div>
             </div>

             <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Note (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Size, color preference, etc."
                  rows={3}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            Save Wish
          </button>
        </div>
      </div>
    </div>
  );
};

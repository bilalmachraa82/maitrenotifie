
import React, { useState } from 'react';

interface ValidationScreenProps {
  text: string;
  summary: string;
  imageUrl: string | null;
  onUpdate: (val: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const ValidationScreen: React.FC<ValidationScreenProps> = ({ text, summary, imageUrl, onUpdate, onConfirm, onCancel }) => {
  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-white playfair italic">Revision Maestria</h2>
        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Confirmez les instructions avant diffusion.</p>
      </div>

      {imageUrl && (
        <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 glass shadow-2xl">
          <div 
            className={`transition-all duration-700 ${showFullImage ? 'h-auto max-h-[600px]' : 'h-32'} overflow-hidden cursor-pointer relative`}
            onClick={() => setShowFullImage(!showFullImage)}
          >
            <img 
              src={imageUrl} 
              alt="Source originale" 
              className="w-full object-cover"
            />
            {!showFullImage && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-4">
                <span className="text-gold text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="animate-pulse">●</span> Inspecter le Manuscrit
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1 bento-card p-6 rounded-[2rem] border-indigo-500/20 bg-indigo-500/5">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">Séance du Jour</p>
                <p className="text-xs italic text-slate-400 leading-relaxed font-medium">"{summary}"</p>
          </div>
          <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Message Final aux Parents</label>
                <textarea 
                  className="w-full h-48 glass gold-border rounded-[2rem] p-8 focus:border-gold outline-none text-white leading-relaxed font-medium placeholder:text-slate-700 transition-all shadow-inner text-sm"
                  value={text}
                  onChange={(e) => onUpdate(e.target.value)}
                  placeholder="Rédigez ou modifiez les devoirs aqui..."
                />
          </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onCancel}
          className="py-5 glass border-white/5 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all"
        >
          Annuler
        </button>
        <button 
          onClick={onConfirm}
          className="py-5 bg-gold text-indigo-950 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          Envoyer aux Parents
        </button>
      </div>
    </div>
  );
};

export default ValidationScreen;

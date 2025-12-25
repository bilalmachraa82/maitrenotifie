
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
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">Valider le contenu</h2>
        <p className="text-gray-500 text-sm">Comparez la transcription avec la photo originale.</p>
      </div>

      {/* Image Preview Card */}
      {imageUrl && (
        <div className="relative group overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
          <div 
            className={`transition-all duration-300 ${showFullImage ? 'h-auto max-h-[500px]' : 'h-32'} overflow-hidden cursor-pointer relative`}
            onClick={() => setShowFullImage(!showFullImage)}
          >
            <img 
              src={imageUrl} 
              alt="Tableau original" 
              className="w-full object-cover"
            />
            {!showFullImage && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-2">
                <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Voir la photo originale
                </span>
              </div>
            )}
          </div>
          {showFullImage && (
            <button 
              onClick={() => setShowFullImage(false)}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-xs flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-bold mb-1">Résumé de la leçon :</p>
          <p className="italic">{summary}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">Message final pour les parents</label>
        <textarea 
          className="w-full h-40 border-2 border-indigo-50 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-200 outline-none text-gray-800 leading-relaxed shadow-inner font-medium"
          value={text}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder="L'IA n'a pas pu lire... écrivez les devoirs ici."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onCancel}
          className="py-4 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button 
          onClick={onConfirm}
          className="py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 transform active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Envoyer maintenant
        </button>
      </div>
    </div>
  );
};

export default ValidationScreen;

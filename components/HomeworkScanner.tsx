
import React, { useRef } from 'react';

interface HomeworkScannerProps {
  isProcessing: boolean;
  onCapture: (file: File) => void;
  onCancel: () => void;
}

const HomeworkScanner: React.FC<HomeworkScannerProps> = ({ isProcessing, onCapture, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="relative">
            <div className="h-24 w-24 border-4 border-indigo-100 rounded-full"></div>
            <div className="h-24 w-24 border-4 border-t-indigo-600 rounded-full animate-spin absolute top-0 left-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
            </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analyse de l'image...</h2>
          <p className="text-gray-500 mt-2">Notre IA identifie les devoirs sur le tableau.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm max-w-sm">
            Conseil : Assurez-vous que la lumière est bonne et le texte lisible.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Capturer les devoirs</h2>
        <p className="text-gray-500">Sélectionnez une photo du tableau ou utilisez la caméra.</p>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-full aspect-square md:aspect-video bg-gray-100 border-4 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-indigo-300 transition-all group"
      >
        <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p className="font-bold text-gray-700">Prendre une photo ou Choisir un fichier</p>
        <p className="text-sm text-gray-400 mt-1">Cliquez pour ouvrir la galerie ou la caméra</p>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button 
        onClick={onCancel}
        className="w-full py-4 text-gray-500 font-semibold hover:text-gray-700"
      >
        Retour à la classe
      </button>
    </div>
  );
};

export default HomeworkScanner;

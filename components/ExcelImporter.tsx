
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Class, Student } from '../types';

interface ExcelImporterProps {
  onImport: (importedClasses: Class[]) => void;
  onClose: () => void;
}

const ExcelImporter: React.FC<ExcelImporterProps> = ({ onImport, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet) as any[];

      const classMap: Record<string, Class> = {};

      json.forEach((row, index) => {
        // Adaptateur pour les noms de colonnes flexibles (Français/Portugais/Anglais)
        const className = row.Classe || row.Turma || row.Class || 'Sans Classe';
        const studentName = row.Nom || row.Nome || row.Student || row.Eleve || row.Élève;
        const parentEmail = row.Email || row.Mail || row['Email Parent'];

        if (studentName && parentEmail) {
          if (!classMap[className]) {
            classMap[className] = {
              id: `imported-${Date.now()}-${index}`,
              name: className,
              students: []
            };
          }

          classMap[className].students.push({
            id: `student-${Date.now()}-${index}`,
            name: studentName,
            parentEmail: parentEmail,
            parentPhone: ''
          });
        }
      });

      const importedClasses = Object.values(classMap);
      if (importedClasses.length > 0) {
        onImport(importedClasses);
      } else {
        alert("Aucune donnée valide trouvée. Vérifiez que votre fichier contient les colonnes : Classe, Nom, Email.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slideDown">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase italic leading-none">Importation Excel</h2>
              <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">Élancourt &bull; Assistant João Ferreira</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-4 mb-6 text-sm text-indigo-800 space-y-2 border border-indigo-100">
            <p className="font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Format du fichier attendu :
            </p>
            <ul className="list-disc ml-5 opacity-80 space-y-1">
              <li>Colonnes requises : <strong>Classe</strong>, <strong>Nom</strong>, <strong>Email</strong>.</li>
              <li>Fichiers acceptés : .xlsx, .xls, .csv</li>
              <li>Les élèves seront regroupés par nom de classe.</li>
            </ul>
          </div>

          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              w-full py-12 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
              ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[0.98]' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-indigo-300'}
            `}
          >
            <div className={`h-20 w-20 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m-4 4l2-2m-2 2l-2-2m3-12l9 9m0 0l-9 9m9-9H3" />
              </svg>
            </div>
            <p className="font-black text-gray-800 uppercase tracking-tight">Déposez votre fichier ici</p>
            <p className="text-sm text-gray-400 mt-1">Ou cliquez pour parcourir vos dossiers</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".xlsx,.xls,.csv" 
              className="hidden" 
            />
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="text-gray-500 font-bold text-sm uppercase tracking-widest hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelImporter;

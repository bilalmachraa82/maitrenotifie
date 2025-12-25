
import React, { useState } from 'react';
import { Class } from '../types';

interface DashboardProps {
  classes: Class[];
  onSelectClass: (c: Class) => void;
  onAddClass: (name: string) => void;
  onDeleteClass: (id: string) => void;
  onOpenImport: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ classes, onSelectClass, onAddClass, onDeleteClass, onOpenImport }) => {
  const [newClassName, setNewClassName] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 leading-none">Mes Classes</h2>
          <p className="text-gray-500 text-sm mt-2">Gérez vos élèves et envoyez les devoirs.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onOpenImport}
            className="p-3 bg-white text-indigo-600 rounded-xl shadow-md border border-indigo-100 hover:bg-indigo-50 hover:scale-110 transition-all group"
            title="Importer depuis Excel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m-4 4l2-2m-2 2l-2-2m3-12l9 9m0 0l-9 9m9-9H3" />
            </svg>
          </button>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className={`p-3 rounded-xl shadow-lg transition-all duration-300 ${showAdd ? 'bg-rose-500 rotate-45' : 'bg-indigo-600'} text-white hover:scale-110`}
            title="Ajouter une classe"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white p-5 rounded-2xl shadow-xl border border-indigo-100 flex flex-col gap-3 animate-slideDown">
          <label className="text-xs font-bold text-indigo-600 uppercase">Nouvelle Classe de Musique</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ex: Piano Débutant - Mercredi"
              className="flex-1 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-indigo-300 transition-colors"
              value={newClassName}
              autoFocus
              onChange={(e) => setNewClassName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && newClassName && (onAddClass(newClassName), setNewClassName(''), setShowAdd(false))}
            />
            <button 
              onClick={() => { if(newClassName) { onAddClass(newClassName); setNewClassName(''); setShowAdd(false); } }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Créer
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {classes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="text-4xl mb-4">🎼</div>
            <p className="text-gray-400 font-medium">Vous n'avez pas encore de classes.</p>
            <p className="text-gray-300 text-xs mt-1">Utilisez le bouton + ou importez un fichier Excel.</p>
          </div>
        ) : (
          classes.map((c) => (
            <div key={c.id} className="group relative">
              <button
                onClick={() => onSelectClass(c)}
                className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all text-left overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner font-bold text-xl uppercase italic">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{c.name}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1.5 font-medium uppercase tracking-wider text-[10px]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {c.students.length} élève{c.students.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteClass(c.id); }}
                className="absolute -top-2 -right-2 bg-white text-gray-300 hover:text-rose-500 hover:scale-110 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all z-20"
                title="Supprimer la classe"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;

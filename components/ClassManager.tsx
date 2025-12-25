
import React, { useState } from 'react';
import { Class, Student } from '../types';

interface ClassManagerProps {
  classData: Class;
  onAddStudent: (s: Omit<Student, 'id'>) => void;
  onDeleteStudent: (id: string) => void;
  onStartScan: () => void;
  onBack: () => void;
}

const ClassManager: React.FC<ClassManagerProps> = ({ classData, onAddStudent, onDeleteStudent, onStartScan, onBack }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="bg-white text-gray-500 hover:text-indigo-600 p-2.5 rounded-xl shadow-sm border border-gray-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-900 truncate max-w-[200px] md:max-w-none">{classData.name}</h2>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden relative group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Action Rapide</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Capture de Cours</h3>
          <p className="text-white/70 text-sm mb-6 max-w-[250px]">Prenez en photo le tableau pour envoyer instantanément les devoirs aux parents.</p>
          <button 
            onClick={onStartScan}
            className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Photographier le tableau
          </button>
        </div>
        {/* Décoration musicale fond */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
            <svg className="w-40 h-40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            Liste des élèves
            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">{classData.students.length}</span>
          </h4>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="text-indigo-600 text-sm font-bold hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            {showForm ? 'Fermer' : '+ Nouvel élève'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4 animate-slideDown">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-indigo-400 uppercase ml-1">Prénom / Nom</label>
                    <input 
                        placeholder="Ex: Clara Dupont"
                        className="w-full border-2 border-white rounded-xl px-4 py-3 text-sm focus:border-indigo-300 outline-none shadow-sm transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-indigo-400 uppercase ml-1">Email du parent</label>
                    <input 
                        type="email"
                        placeholder="Ex: parent@email.com"
                        className="w-full border-2 border-white rounded-xl px-4 py-3 text-sm focus:border-indigo-300 outline-none shadow-sm transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  if(name && email) {
                    onAddStudent({ name, parentEmail: email, parentPhone: '' });
                    setName(''); setEmail(''); setShowForm(false);
                  }
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-bold flex-1 shadow-lg shadow-indigo-100"
              >
                Ajouter l'élève
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {classData.students.length === 0 ? (
            <div className="text-center py-12 text-slate-300 italic text-sm">
                Aucun élève inscrit dans cette classe.
            </div>
          ) : (
            classData.students.map(s => (
              <div key={s.id} className="group flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600 border border-indigo-100">
                    {s.name.charAt(0)}
                    </div>
                    <div>
                    <p className="text-sm font-bold text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.parentEmail}</p>
                    </div>
                </div>
                <button 
                    onClick={() => onDeleteStudent(s.id)}
                    className="p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="Retirer l'élève"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassManager;

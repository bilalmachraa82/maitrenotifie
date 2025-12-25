
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
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button 
            onClick={onBack} 
            className="glass p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <div>
            <h2 className="text-3xl font-black text-white playfair italic">{classData.name}</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Gestion des effectifs</p>
        </div>
      </div>

      <div className="relative group rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
        {/* Background Image for Header */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                alt="Instrument"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>
        </div>

        <div className="relative z-10 p-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-indigo-600/80 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white">Action AI</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-3">Capturer la Séance</h3>
          <p className="text-slate-300 text-sm mb-8 max-w-sm leading-relaxed font-medium">
              Photographiez le tableau blanc ou le carnet de notes. L'intelligence artificielle extraira automatiquement les devoirs pour tous les parents.
          </p>
          <button 
            onClick={onStartScan}
            className="bg-white text-indigo-950 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Ouvrir l'Objectif
          </button>
        </div>
      </div>

      <div className="glass rounded-[3rem] p-10 border border-white/5">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="font-black text-white text-lg uppercase tracking-wider">Liste de Présence</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Total: {classData.students.length} Élèves</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="glass px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-all border border-white/5"
          >
            {showForm ? 'Masquer' : '+ Ajouter'}
          </button>
        </div>

        {showForm && (
          <div className="mb-10 p-8 glass rounded-[2rem] border border-white/10 space-y-6 animate-slideDown">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom de l'élève</label>
                    <input 
                        placeholder="Ex: Marc Antoine"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Parent (Email)</label>
                    <input 
                        type="email"
                        placeholder="Ex: parent@musique.fr"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>
            <button 
              onClick={() => {
                if(name && email) {
                  onAddStudent({ name, parentEmail: email, parentPhone: '' });
                  setName(''); setEmail(''); setShowForm(false);
                }
              }}
              className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-500 transition-all"
            >
              Enregistrer l'inscription
            </button>
          </div>
        )}

        <div className="grid gap-3">
          {classData.students.length === 0 ? (
            <div className="text-center py-16 opacity-20 italic text-sm font-medium uppercase tracking-widest">
                Dossier vide.
            </div>
          ) : (
            classData.students.map(s => (
              <div key={s.id} className="group flex items-center justify-between p-5 glass rounded-[1.8rem] hover:bg-white/5 transition-all border border-white/5">
                <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl glass flex items-center justify-center text-sm font-black text-indigo-400 group-hover:text-white transition-colors border border-white/5">
                    {s.name.charAt(0)}
                    </div>
                    <div>
                    <p className="text-sm font-black text-white group-hover:translate-x-1 transition-transform">{s.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.parentEmail}</p>
                    </div>
                </div>
                <button 
                    onClick={() => onDeleteStudent(s.id)}
                    className="p-3 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
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

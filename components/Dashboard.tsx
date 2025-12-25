
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

  const totalStudents = classes.reduce((acc, c) => acc + c.students.length, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Welcome Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-black playfair italic text-gradient-gold tracking-tighter">Tableau de Bord</h2>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.4em] font-medium flex items-center gap-2">
             Conservatoire de Musique <span className="h-px w-8 bg-slate-800"></span> Session João Ferreira
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={onOpenImport}
            className="flex-1 lg:flex-none glass gold-border px-6 py-3 rounded-2xl text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest">Base de Données</span>
          </button>
          
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className={`flex-1 lg:flex-none px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl ${showAdd ? 'bg-rose-500 text-white' : 'bg-gold text-indigo-950'}`}
          >
            {showAdd ? 'Fermer' : 'Nouvelle Classe'}
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5 auto-rows-[140px]">
        
        {/* Quick Stats Block - Small Bento */}
        <div className="md:col-span-2 lg:col-span-3 bento-card rounded-[2.5rem] p-6 flex flex-col justify-between">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Effectif Total</p>
            <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-white">{totalStudents}</span>
                <span className="text-[10px] text-gold mb-1 font-bold">ÉLÈVES</span>
            </div>
        </div>

        {/* Classes Counter - Small Bento */}
        <div className="md:col-span-2 lg:col-span-3 bento-card rounded-[2.5rem] p-6 flex flex-col justify-between">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sessions Actives</p>
            <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-white">{classes.length}</span>
                <span className="text-[10px] text-indigo-400 mb-1 font-bold">CLASSES</span>
            </div>
        </div>

        {/* AI Action Preview - Medium Bento */}
        <div className="md:col-span-2 lg:col-span-6 bento-card rounded-[2.5rem] p-6 bg-indigo-600/10 border-indigo-500/20 flex items-center gap-6">
            <div className="h-16 w-16 glass rounded-3xl flex items-center justify-center text-indigo-400">
                <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div>
                <p className="text-white text-sm font-bold">Extraction Intelligente</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1 italic">V2.5 Ready</p>
            </div>
        </div>

        {/* Form to Add Class - Expands when open */}
        {showAdd && (
          <div className="col-span-full bento-card rounded-[3rem] p-10 gold-border bg-white/5 animate-slideDown row-span-2">
            <label className="text-[11px] font-black text-gold uppercase tracking-[0.4em] mb-4 block">Initialisation d'un nouveau Dossier</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Ex: Théorie Musicale II - Lundi 14h"
                className="flex-1 bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 outline-none focus:border-gold transition-all text-white placeholder:text-slate-600 font-medium"
                value={newClassName}
                autoFocus
                onChange={(e) => setNewClassName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && newClassName && (onAddClass(newClassName), setNewClassName(''), setShowAdd(false))}
              />
              <button 
                onClick={() => { if(newClassName) { onAddClass(newClassName); setNewClassName(''); setShowAdd(false); } }}
                className="bg-white text-indigo-950 px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-gold transition-all shadow-2xl"
              >
                Confirmer
              </button>
            </div>
          </div>
        )}

        {/* Class Cards - Grid Loop */}
        {classes.length === 0 ? (
          <div className="col-span-full row-span-3 bento-card rounded-[3rem] flex flex-col items-center justify-center border-dashed opacity-50">
            <div className="text-5xl mb-6 grayscale opacity-30">🎻</div>
            <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">Aucune classe répertoriée</p>
          </div>
        ) : (
          classes.map((c) => (
            <div 
              key={c.id} 
              className="md:col-span-3 lg:col-span-4 row-span-2 bento-card rounded-[3rem] p-8 group cursor-pointer"
              onClick={() => onSelectClass(c)}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="h-14 w-14 glass rounded-[1.5rem] flex items-center justify-center text-gold font-black text-xl playfair italic border border-white/5 group-hover:scale-110 transition-transform duration-500">
                  {c.name.charAt(0)}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteClass(c.id); }}
                  className="p-2 text-slate-800 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div>
                <h3 className="font-bold text-xl text-white group-hover:text-gold transition-colors">{c.name}</h3>
                <div className="flex items-center gap-4 mt-4">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="h-6 w-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                {i}
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{c.students.length} Élèves inscrits</span>
                </div>
              </div>

              {/* Decorative Staff Lines inside card */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold/10 group-hover:bg-gold/40 transition-all"></div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Dashboard;

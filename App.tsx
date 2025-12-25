
import React, { useState, useEffect } from 'react';
import { AppState, Class, Student } from './types';
import { loadClasses, saveClasses } from './utils/storage';
import { extractHomeworkFromImage } from './services/geminiService';

// Components
import Dashboard from './components/Dashboard';
import ClassManager from './components/ClassManager';
import HomeworkScanner from './components/HomeworkScanner';
import ValidationScreen from './components/ValidationScreen';
import ExcelImporter from './components/ExcelImporter';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>(AppState.DASHBOARD);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [extractedHomework, setExtractedHomework] = useState<{ text: string; summary: string } | null>(null);
  const [capturedImageBase64, setCapturedImageBase64] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    setClasses(loadClasses());
  }, []);

  const handleAddClass = (name: string) => {
    const newClass: Class = {
      id: Date.now().toString(),
      name,
      students: []
    };
    const updated = [...classes, newClass];
    setClasses(updated);
    saveClasses(updated);
  };

  const handleDeleteClass = (classId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette classe ?")) {
      const updated = classes.filter(c => c.id !== classId);
      setClasses(updated);
      saveClasses(updated);
    }
  };

  const handleAddStudent = (classId: string, student: Omit<Student, 'id'>) => {
    const updated = classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          students: [...c.students, { ...student, id: Date.now().toString() }]
        };
      }
      return c;
    });
    setClasses(updated);
    saveClasses(updated);
    const updatedClass = updated.find(c => c.id === classId);
    if (updatedClass) setSelectedClass(updatedClass);
  };

  const handleDeleteStudent = (classId: string, studentId: string) => {
    const updated = classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          students: c.students.filter(s => s.id !== studentId)
        };
      }
      return c;
    });
    setClasses(updated);
    saveClasses(updated);
    const updatedClass = updated.find(c => c.id === classId);
    if (updatedClass) setSelectedClass(updatedClass);
  };

  const handleImportExcel = (importedClasses: Class[]) => {
    // Fusionner les classes importées avec les existantes
    const updatedClasses = [...classes];
    
    importedClasses.forEach(impClass => {
      const existingIdx = updatedClasses.findIndex(c => c.name.toLowerCase() === impClass.name.toLowerCase());
      if (existingIdx > -1) {
        // Ajouter les élèves à la classe existante
        updatedClasses[existingIdx].students = [...updatedClasses[existingIdx].students, ...impClass.students];
      } else {
        // Créer une nouvelle classe
        updatedClasses.push(impClass);
      }
    });

    setClasses(updatedClasses);
    saveClasses(updatedClasses);
    setShowImportModal(false);
    alert(`${importedClasses.length} classe(s) traitée(s) avec succès.`);
  };

  const handleImageCapture = async (file: File) => {
    setIsProcessing(true);
    setCurrentScreen(AppState.SCANNING);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setCapturedImageBase64(base64);
      try {
        const result = await extractHomeworkFromImage(base64);
        setExtractedHomework({ text: result.homeworkText, summary: result.summary });
        setCurrentScreen(AppState.VALIDATING);
      } catch (err) {
        alert("Erreur lors de l'analyse de l'image. Vérifiez votre connexion.");
        setCurrentScreen(AppState.CLASS_DETAIL);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendNotifications = () => {
    setCurrentScreen(AppState.SENDING);
    setTimeout(() => {
      setCurrentScreen(AppState.DASHBOARD);
      setExtractedHomework(null);
      setCapturedImageBase64(null);
      setSelectedClass(null);
      alert("Les devoirs ont été envoyés avec succès aux parents !");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center selection:bg-indigo-100 font-sans">
      {/* Header Institutionnel - École de Musique d'Élancourt */}
      <header className="w-full bg-indigo-800 text-white shadow-2xl sticky top-0 z-50 overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none rotate-12">
            <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center relative z-10">
            <div 
                className="flex items-center gap-3 cursor-pointer group" 
                onClick={() => { setSelectedClass(null); setCurrentScreen(AppState.DASHBOARD); }}
            >
                <div className="bg-white text-indigo-800 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tight leading-none uppercase italic">MaîtreNotifie</h1>
                    <div className="flex flex-col mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">École de Musique d'Élancourt</span>
                        <span className="text-[9px] font-medium opacity-70 italic">Assistant : João Ferreira</span>
                    </div>
                </div>
            </div>
            {selectedClass && (
                <div className="hidden sm:block bg-indigo-700 px-4 py-1.5 rounded-2xl text-xs font-bold border border-indigo-600 shadow-inner">
                    {selectedClass.name}
                </div>
            )}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl p-4 flex-1">
        {currentScreen === AppState.DASHBOARD && (
          <Dashboard 
            classes={classes} 
            onSelectClass={(c) => { setSelectedClass(c); setCurrentScreen(AppState.CLASS_DETAIL); }}
            onAddClass={handleAddClass}
            onDeleteClass={handleDeleteClass}
            onOpenImport={() => setShowImportModal(true)}
          />
        )}

        {currentScreen === AppState.CLASS_DETAIL && selectedClass && (
          <ClassManager 
            classData={selectedClass} 
            onAddStudent={(s) => handleAddStudent(selectedClass.id, s)}
            onDeleteStudent={(sId) => handleDeleteStudent(selectedClass.id, sId)}
            onStartScan={() => setCurrentScreen(AppState.SCANNING)}
            onBack={() => { setSelectedClass(null); setCurrentScreen(AppState.DASHBOARD); }}
          />
        )}

        {currentScreen === AppState.SCANNING && (
          <HomeworkScanner 
            isProcessing={isProcessing}
            onCapture={handleImageCapture}
            onCancel={() => setCurrentScreen(AppState.CLASS_DETAIL)}
          />
        )}

        {currentScreen === AppState.VALIDATING && extractedHomework && (
          <ValidationScreen 
            text={extractedHomework.text}
            summary={extractedHomework.summary}
            imageUrl={capturedImageBase64}
            onUpdate={(newText) => setExtractedHomework(prev => prev ? { ...prev, text: newText } : null)}
            onConfirm={handleSendNotifications}
            onCancel={() => { setCapturedImageBase64(null); setCurrentScreen(AppState.CLASS_DETAIL); }}
          />
        )}

        {currentScreen === AppState.SENDING && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-8">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-indigo-600 border-opacity-20 border-t-opacity-100"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">🎼</div>
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Transmission en cours</h2>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                Notification envoyée aux parents d'Élancourt pour la classe : <br/>
                <span className="font-bold text-indigo-600">{selectedClass?.name}</span>
            </p>
          </div>
        )}
      </main>

      {/* Modale d'importation */}
      {showImportModal && (
        <ExcelImporter 
          onImport={handleImportExcel} 
          onClose={() => setShowImportModal(false)} 
        />
      )}

      {/* Footer Institutionnel */}
      <footer className="w-full text-center p-10 text-gray-400 text-xs border-t border-gray-100 bg-white bg-opacity-50 backdrop-blur-sm mt-8">
        <div className="max-w-sm mx-auto space-y-2">
            <p className="font-black text-gray-500 uppercase tracking-widest text-[10px]">École de Musique d'Élancourt</p>
            <p className="leading-relaxed opacity-70">
                Plateforme de communication pédagogique <br/>
                Développement & Support : <strong>Assistant João Ferreira</strong>
            </p>
            <div className="flex justify-center gap-4 pt-4 opacity-30 grayscale scale-75">
                <span className="text-xl">♩</span>
                <span className="text-xl">♪</span>
                <span className="text-xl">♫</span>
                <span className="text-xl">♬</span>
            </div>
            <p className="pt-4 text-[9px] font-medium">&copy; {new Date().getFullYear()} - MaîtreNotifie v2.0</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

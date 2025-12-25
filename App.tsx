
import React, { useState, useEffect } from 'react';
import { AppState, Class, Student } from './types';
import { loadClasses, saveClasses } from './utils/storage';
import { extractHomeworkFromImage } from './services/geminiService';
import { sendHomeworkEmail } from './services/emailService';

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
    const updatedClasses = [...classes];
    importedClasses.forEach(impClass => {
      const existingIdx = updatedClasses.findIndex(c => c.name.toLowerCase() === impClass.name.toLowerCase());
      if (existingIdx > -1) {
        updatedClasses[existingIdx].students = [...updatedClasses[existingIdx].students, ...impClass.students];
      } else {
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

  const handleSendNotifications = async () => {
    if (!selectedClass || !extractedHomework) return;
    
    setCurrentScreen(AppState.SENDING);

    const parentEmails = selectedClass.students
      .map(s => s.parentEmail)
      .filter(email => email && email.includes('@'));

    if (parentEmails.length === 0) {
      alert("Aucun email parent valide trouvé dans cette classe.");
      setCurrentScreen(AppState.CLASS_DETAIL);
      return;
    }

    const success = await sendHomeworkEmail({
      to: parentEmails,
      subject: `Devoirs de Musique : ${selectedClass.name}`,
      className: selectedClass.name,
      homeworkText: extractedHomework.text,
      summary: extractedHomework.summary
    });

    if (success) {
      alert("Les devoirs ont été envoyés avec succès aux parents !");
    } else {
      alert("Le message a été simulé. Configurez votre RESEND_API_KEY pour un envoi réel.");
    }

    setCurrentScreen(AppState.DASHBOARD);
    setExtractedHomework(null);
    setCapturedImageBase64(null);
    setSelectedClass(null);
  };

  return (
    <div className="min-h-screen selection:bg-gold/30">
      {/* Premium Header */}
      <header className="w-full h-24 sticky top-0 z-50 px-8 flex items-center justify-between glass border-b border-white/5">
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => { setSelectedClass(null); setCurrentScreen(AppState.DASHBOARD); }}
        >
          <div className="bg-gold p-3 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform">
             <svg className="w-6 h-6 text-indigo-950" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
             </svg>
          </div>
          <div>
            <h1 className="text-xl font-black playfair italic text-white tracking-widest leading-none">MaîtreNotifie</h1>
            <span className="text-[8px] font-black uppercase tracking-[0.6em] text-gold opacity-80">Assistant João Ferreira</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status du Réseau</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    OPÉRATIONNEL
                </span>
            </div>
            <div className="h-12 w-px bg-white/5"></div>
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-black text-gold">
                JF
            </div>
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto p-8 py-12">
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
          <div className="max-w-4xl mx-auto">
              <ClassManager 
                classData={selectedClass} 
                onAddStudent={(s) => handleAddStudent(selectedClass.id, s)}
                onDeleteStudent={(sId) => handleDeleteStudent(selectedClass.id, sId)}
                onStartScan={() => setCurrentScreen(AppState.SCANNING)}
                onBack={() => { setSelectedClass(null); setCurrentScreen(AppState.DASHBOARD); }}
              />
          </div>
        )}

        {currentScreen === AppState.SCANNING && (
          <div className="max-w-3xl mx-auto">
              <HomeworkScanner 
                isProcessing={isProcessing}
                onCapture={handleImageCapture}
                onCancel={() => setCurrentScreen(AppState.CLASS_DETAIL)}
              />
          </div>
        )}

        {currentScreen === AppState.VALIDATING && extractedHomework && (
          <div className="max-w-3xl mx-auto">
              <ValidationScreen 
                text={extractedHomework.text}
                summary={extractedHomework.summary}
                imageUrl={capturedImageBase64}
                onUpdate={(newText) => setExtractedHomework(prev => prev ? { ...prev, text: newText } : null)}
                onConfirm={handleSendNotifications}
                onCancel={() => { setCapturedImageBase64(null); setCurrentScreen(AppState.CLASS_DETAIL); }}
              />
          </div>
        )}

        {currentScreen === AppState.SENDING && (
          <div className="flex flex-col items-center justify-center py-24 text-center bento-card rounded-[4rem] p-12 max-w-2xl mx-auto">
            <div className="relative mb-12">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-gold"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">🎼</div>
            </div>
            <h2 className="text-4xl font-black text-white playfair italic mb-3">Diffusion Maestria</h2>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-bold">
                Les parents de la classe <span className="text-gold">{selectedClass?.name}</span> <br/> reçoivent les consignes...
            </p>
          </div>
        )}
      </main>

      {showImportModal && (
        <ExcelImporter 
          onImport={handleImportExcel} 
          onClose={() => setShowImportModal(false)} 
        />
      )}

      <footer className="w-full text-center p-20 mt-12 glass border-t border-white/5">
        <div className="max-w-md mx-auto space-y-6">
            <div className="flex justify-center gap-12 opacity-10">
                <span className="text-4xl text-gold">♩</span>
                <span className="text-4xl text-gold">♪</span>
                <span className="text-4xl text-gold">♫</span>
            </div>
            <p className="font-black text-slate-700 uppercase tracking-[0.8em] text-[9px]">Conservatoire National d'Élancourt</p>
            <p className="playfair italic text-slate-500 text-sm">
              "La musique est la langue des émotions."
            </p>
            <p className="pt-8 text-[7px] font-black uppercase tracking-[0.5em] text-slate-800">Designed for João Ferreira &bull; Powered by Gemini 3</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

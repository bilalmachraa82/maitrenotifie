
import React, { useRef, useState, useEffect } from 'react';

interface HomeworkScannerProps {
  isProcessing: boolean;
  onCapture: (file: File) => void;
  onCancel: () => void;
}

const HomeworkScanner: React.FC<HomeworkScannerProps> = ({ isProcessing, onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);

  // Initialize Camera
  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setHasCamera(true);
      } catch (err) {
        console.error("Camera access denied or not available", err);
        setHasCamera(false);
      }
    }

    if (!isProcessing) {
      setupCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isProcessing]);

  const captureFrame = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onCapture(file);
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-fadeIn glass rounded-[3rem] p-12">
        <div className="relative">
            <div className="h-32 w-32 border-4 border-indigo-500/10 rounded-full"></div>
            <div className="h-32 w-32 border-4 border-t-indigo-500 rounded-full animate-spin absolute top-0 left-0"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
            </div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-white playfair italic">Analyse Musicale...</h2>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-bold">L'IA identifie les devoirs sur votre capture.</p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-6 py-4 rounded-2xl text-xs max-w-sm italic">
            Conseil : Assurez-vous que l'écriture est lisible pour une transcription optimale.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-white playfair italic">Objectif Pédagogique</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Capturez le tableau ou les notes en temps réel</p>
      </div>

      <div className="relative w-full aspect-[4/3] md:aspect-video glass rounded-[3rem] overflow-hidden border-2 border-white/10 shadow-2xl">
        {hasCamera === false ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group"
          >
            <div className="h-20 w-20 glass rounded-full flex items-center justify-center text-slate-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white font-bold uppercase tracking-widest text-xs">Caméra non disponible</p>
            <p className="text-[10px] text-slate-500 mt-1 uppercase">Cliquez pour importer une photo</p>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            {/* Scanner Overlay UI */}
            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20"></div>
            <div className="absolute inset-10 border border-white/20 rounded-2xl pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-400"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-400"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-400"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-400"></div>
                
                {/* Pulsing Scanning Line */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-indigo-400/50 shadow-[0_0_15px_rgba(129,140,248,0.8)] animate-[scan_3s_ease-in-out_infinite]"></div>
            </div>

            {/* Shutter Button */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="glass p-4 rounded-2xl text-white/50 hover:text-white transition-all"
                  title="Choisir un fichier"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>

                <button 
                    onClick={captureFrame}
                    className="h-20 w-20 rounded-full border-4 border-white p-1 hover:scale-110 transition-transform active:scale-90"
                >
                    <div className="w-full h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]"></div>
                </button>

                <div className="w-14"></div> {/* Spacer for balance */}
            </div>
          </>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="flex justify-center">
        <button 
            onClick={onCancel}
            className="px-8 py-3 glass border-white/10 rounded-full text-slate-500 font-bold uppercase tracking-[0.3em] text-[9px] hover:text-white transition-colors"
        >
            Retour au dossier de classe
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-150px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(150px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default HomeworkScanner;

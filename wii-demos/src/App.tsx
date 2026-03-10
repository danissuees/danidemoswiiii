import { useState, useEffect, useRef } from 'react';

// ==========================================
// 🎵 AQUÍ AGREGAS TUS CANCIONES EN ORDEN 🎵
// ==========================================
const MIS_DEMOS = [
  { archivo: 'salvame', titulo: 'salvame' },
];

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [canalActivo, setCanalActivo] = useState<{archivo: string, titulo: string} | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reloj
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; 
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = days[currentTime.getDay()];
  const month = currentTime.getMonth() + 1; 
  const date = currentTime.getDate();

  const basePath = import.meta.env.BASE_URL;

  // Función de Play/Pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error("Error al reproducir:", error);
          alert("Asegúrate de que el archivo exista en public/musica/");
        });
      }
    }
  };

  // 🎵 Función directa conectada al HTML
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (total && total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

  // Adelantar/Atrasar
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const barra = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - barra.left; 
      const porcentaje = Math.max(0, Math.min(100, (clickX / barra.width) * 100)); 
      
      audioRef.current.currentTime = (porcentaje / 100) * audioRef.current.duration;
      setProgress(porcentaje);
    }
  };

  const cerrarCanal = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCanalActivo(null);
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-wii-scanlines text-gray-600 overflow-hidden font-sans select-none relative">
      
      <div className="h-6 md:h-10 flex-shrink-0 w-full"></div>

      <div className="flex-1 w-full flex items-center justify-center px-10 relative min-h-0">
        
        <div className="w-full max-w-5xl h-full max-h-[550px] grid grid-cols-4 grid-rows-3 gap-3 md:gap-4 z-10">
          {Array.from({ length: 12 }).map((_, i) => {
            const demo = MIS_DEMOS[i];

            if (demo) {
              return (
                <div 
                  key={i} 
                  onClick={() => setCanalActivo(demo)}
                  className="bg-gradient-to-b from-white to-[#e6e6e6] rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.2)] border-[3px] border-transparent hover:border-[#38b6ff] hover:shadow-[0_0_15px_rgba(56,182,255,0.8)] transition-all duration-200 cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group"
                >
                  <div className="absolute top-0 w-full h-1/2 bg-white/30 rounded-t-xl z-10 pointer-events-none"></div>
                  
                  <img 
                    src={`${basePath}imagenes/${demo.archivo}.jpg`} 
                    alt={demo.titulo}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                    }}
                  />
                  
                  <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-sm py-1.5 border-t border-gray-300 z-20">
                     <p className="text-gray-600 font-bold text-xs md:text-sm text-center px-2 truncate">
                       {demo.titulo}
                     </p>
                  </div>
                </div>
              );
            }

            return (
              <div key={i} className="bg-wii-empty rounded-xl border border-gray-300 flex items-center justify-center shadow-inner relative overflow-hidden">
                 <span className="text-gray-400/30 font-bold text-2xl md:text-4xl tracking-widest absolute">danii</span>
              </div>
            );
          })}
        </div>

        <div className="absolute right-2 md:right-6 opacity-70 hover:opacity-100 cursor-pointer hover:scale-110 transition-all z-20">
           <div className="w-0 h-0 border-t-[10px] md:border-t-[15px] border-t-transparent border-l-[15px] md:border-l-[25px] border-l-[#38b6ff] border-b-[10px] md:border-b-[15px] border-b-transparent drop-shadow-md"></div>
        </div>
      </div>

      <div className="w-full h-24 md:h-28 flex-shrink-0 relative mt-2">
        <div className="absolute bottom-0 w-full h-full bg-gradient-to-b from-[#f5f5f5] to-[#c4c4c4] border-t-[3px] border-[#42b6f5] rounded-t-[50%_25px] md:rounded-t-[50%_40px] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]"></div>
        
        <div className="relative w-full h-full flex justify-between items-center px-8 md:px-12 z-10">
          
          <div className="flex items-end gap-3 md:gap-4 mt-2">
            <button 
              onClick={() => window.open('https://www.instagram.com/acordesenventa/', '_blank')}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-white to-[#d9d9d9] border-2 border-gray-300 shadow-[0_4px_6px_rgba(0,0,0,0.2)] flex items-center justify-center font-extrabold text-[#999999] text-lg md:text-xl hover:scale-105 active:scale-95 transition-all hover:text-[#E1306C] hover:border-[#E1306C]"
            >
              danii
            </button>
            <div className="w-5 h-6 md:w-6 md:h-8 border-2 border-[#999999] rounded-sm mb-1 md:mb-2 opacity-60">
              <div className="w-full h-1/4 border-b-2 border-[#999999]"></div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-4">
             <div className="text-2xl md:text-4xl font-mono text-[#7a7a7a] tracking-widest font-light flex items-baseline gap-1">
               {formattedHours}:{formattedMinutes} <span className="text-sm md:text-xl">{ampm}</span>
             </div>
             <div className="text-[#666666] font-bold text-sm md:text-lg">
               {dayName} {month}/{date}
             </div>
          </div>

          <button 
            onClick={() => window.open('https://open.spotify.com/intl-es/artist/1qmQaRbCM5p4b5PxiqD7Gt', '_blank')}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-white to-[#d9d9d9] border-2 border-gray-300 shadow-[0_4px_6px_rgba(0,0,0,0.2)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all mt-2 group"
          >
             <div className="w-0 h-0 border-t-[8px] md:border-t-[10px] border-t-transparent border-l-[14px] md:border-l-[18px] border-l-[#999999] border-b-[8px] md:border-b-[10px] border-b-transparent ml-1.5 group-hover:border-l-[#1DB954] transition-colors duration-300"></div>
          </button>
        </div>
      </div>

      {/* ======================= MODAL REPRODUCTOR ======================= */}
      {canalActivo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4"
          onClick={cerrarCanal} 
        >
          
          <div 
            className="bg-white p-2 rounded-[2rem] w-full max-w-4xl h-full max-h-[600px] shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-zoom-in"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="bg-wii-scanlines w-full h-full rounded-[1.5rem] border-[4px] border-gray-300 flex flex-col relative overflow-hidden shadow-inner">
              
              <div className="w-full h-16 md:h-20 bg-gradient-to-b from-gray-50 to-gray-300 flex items-center justify-center border-b-[3px] border-gray-400 shadow-sm relative shrink-0">
                 <h2 className="text-2xl md:text-3xl font-extrabold text-[#7a7a7a] tracking-widest drop-shadow-sm">
                   {canalActivo.titulo}
                 </h2>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative min-h-0 bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(230,230,230,1)_100%)]">
                 
                 <div className={`w-48 h-48 md:w-72 md:h-72 rounded-2xl border-[6px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden relative bg-white flex items-center justify-center shrink-0 transition-transform duration-500 ${isPlaying ? 'scale-105 shadow-[0_0_30px_rgba(100,220,240,0.6)]' : ''}`}>
                   <img 
                      src={`${basePath}imagenes/${canalActivo.archivo}.jpg`} 
                      alt={canalActivo.titulo}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/eeeeee/999999?text=Sin+Portada';
                      }}
                   />
                   <div className="absolute top-0 w-full h-1/2 bg-white/20 pointer-events-none"></div>
                 </div>
                 
                 {/* 🎵 AQUÍ ESTÁ LA MAGIA: onTimeUpdate directamente en la etiqueta */}
                 <audio 
                   ref={audioRef}
                   src={`${basePath}musica/${canalActivo.archivo}.mp3`} 
                   onTimeUpdate={handleTimeUpdate}
                   onEnded={() => {
                     setIsPlaying(false);
                     setProgress(0);
                   }}
                   className="hidden" 
                 />

                 {/* BARRA DE PROGRESO */}
                 <div 
                    className="w-full max-w-md mt-8 h-4 md:h-5 bg-gray-400/50 rounded-full border-[3px] border-gray-400 shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)] overflow-hidden relative cursor-pointer"
                    onClick={handleSeek}
                 >
                    <div 
                      className="h-full bg-gradient-to-r from-white to-[#cceeff] shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
                      style={{ width: `${progress}%` }}
                    ></div>
                 </div>
              </div>

              <div className="w-full h-24 md:h-28 bg-gradient-to-t from-gray-400 to-gray-200 flex items-center justify-between px-10 border-t-[3px] border-gray-400 shrink-0">
                 
                 <button 
                   onClick={cerrarCanal} 
                   className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-b from-white to-[#d9d9d9] rounded-full font-extrabold text-[#7a7a7a] text-sm md:text-lg border-2 border-gray-400 shadow-[0_5px_10px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 active:translate-y-1 transition-all"
                 >
                  Menu
                 </button>
                 
                 <button 
                   onClick={togglePlay} 
                   className={`absolute left-1/2 transform -translate-x-1/2 px-12 py-3 md:px-16 md:py-4 rounded-full font-black text-xl md:text-2xl border-[3px] shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 active:translate-y-2 transition-all z-10 
                     ${isPlaying 
                        ? 'bg-gradient-to-b from-red-100 to-red-300 border-red-400 text-red-600 hover:shadow-[0_0_25px_rgba(255,100,100,0.6)]' 
                        : 'bg-gradient-to-b from-white to-[#e6e6e6] border-[#38b6ff] text-[#555555] hover:shadow-[0_0_25px_rgba(56,182,255,0.6)]'}`}
                 >
                    {isPlaying ? 'PAUSE' : 'START'}
                 </button>

                 <div className="w-[100px]"></div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
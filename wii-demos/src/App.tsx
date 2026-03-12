import { useState, useEffect, useRef } from 'react';

// ==========================================
// 🎵 AQUÍ AGREGAS TUS CANCIONES EN ORDEN 🎵
// ==========================================
const MIS_DEMOS = [
  { archivo: 'salvame', titulo: 'salvame' },
  { archivo: 'tienes tu', titulo: 'tienes tu' },
  { archivo: 'el amar', titulo: 'el amar' },
];

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [canalActivo, setCanalActivo] = useState<{archivo: string, titulo: string} | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [paginaActual, setPaginaActual] = useState(0);
  const TOTAL_PANTALLAS = 4; 
  const CANALES_POR_PANTALLA = 12;

  // ⏳ Estado de la pantalla de advertencia
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(true);

  const basePath = import.meta.env.BASE_URL;

  // Reloj
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🚀 SISTEMA DE PANTALLA DE CARGA (15 Segundos o Saltar)
  useEffect(() => {
    setMostrarAdvertencia(true); // Mostramos la pantalla negra al cambiar de página

    // 1. Temporizador fijo de 15 segundos
    const timer = setTimeout(() => {
      setMostrarAdvertencia(false);
    }, 15000);

    // 2. Mandamos a pedir las fotos en el fondo (sin obligar a la página a esperarlas)
    const inicio = paginaActual * CANALES_POR_PANTALLA;
    const fin = inicio + (CANALES_POR_PANTALLA * 2); // Pedimos las de esta página y la que sigue
    const demosAPrecargar = MIS_DEMOS.slice(inicio, fin);
    
    demosAPrecargar.forEach(demo => {
      const imgClandestina = new window.Image();
      imgClandestina.src = `${basePath}imagenes/${demo.archivo}.jpg`;
    });

    // Limpiamos el temporizador si el usuario cambia de página rápido
    return () => clearTimeout(timer);
  }, [paginaActual, basePath]);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; 
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dayName = days[currentTime.getDay()];
  const month = currentTime.getMonth() + 1; 
  const date = currentTime.getDate();

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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (total && total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

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

  const irSiguientePantalla = () => {
    if (paginaActual < TOTAL_PANTALLAS - 1) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const irPantallaAnterior = () => {
    if (paginaActual > 0) {
      setPaginaActual(paginaActual - 1);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen bg-wii-scanlines text-gray-600 overflow-hidden font-sans select-none relative">
      
      {/* ========================================================= */}
      {/* ⚠️ PANTALLA NEGRA (15 seg. o Saltar) ⚠️ */}
      {/* ========================================================= */}
      {mostrarAdvertencia && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center select-none">
          
          <style>{`
            @keyframes wiiLoad {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
            .animate-wii-load {
              animation: wiiLoad 1.5s infinite linear;
            }
            .blink-text {
              animation: blinker 2s linear infinite;
            }
            @keyframes blinker {
              50% { opacity: 0.3; }
            }
          `}</style>

          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <span className="text-white text-3xl md:text-5xl">⚠️</span>
          </div>
          
          <p className="text-white font-sans text-xs sm:text-sm md:text-xl leading-loose md:leading-[2.5] max-w-4xl tracking-[0.15em] md:tracking-[0.2em] font-medium mb-12 uppercase">
            BIENVENIDXS A MI PAGINA DE DEMOS, <br className="hidden md:block"/>
            AQUI SUBIRE DE VEZ EN CUANDO MATERIAL TONTO <br className="hidden md:block"/>
            O INEDITO DE LO QUE HAGA, GRACIAS!
          </p>

          <div className="w-48 md:w-64 h-1 md:h-1.5 border border-gray-700 rounded-full overflow-hidden relative bg-gray-900 mb-16">
            <div className="w-1/2 h-full bg-white absolute top-0 left-0 animate-wii-load rounded-full shadow-[0_0_8px_white]"></div>
          </div>

          {/* 👇 BOTÓN PARA SALTAR 👇 */}
          <button 
            onClick={() => setMostrarAdvertencia(false)}
            className="group flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer font-sans text-sm md:text-lg tracking-widest mt-4"
          >
            Presiona 
            <span className="mx-2 inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border-[2px] md:border-[3px] border-white/80 group-hover:border-white rounded-full font-bold text-lg md:text-xl bg-white/5 group-hover:bg-white/20 transition-all blink-text">
              A
            </span> 
            para continuar
          </button>

        </div>
      )}


      <div className="h-4 sm:h-6 md:h-10 flex-shrink-0 w-full"></div>

      <div className="flex-1 w-full flex items-center justify-center px-6 sm:px-10 relative min-h-0">
        
        {paginaActual > 0 && !mostrarAdvertencia && (
          <div 
            onClick={irPantallaAnterior}
            className="absolute left-1 md:left-4 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100 cursor-pointer hover:scale-110 active:scale-90 transition-all z-20"
          >
             <div className="w-0 h-0 border-t-[10px] md:border-t-[15px] border-t-transparent border-r-[15px] md:border-r-[25px] border-r-[#38b6ff] border-b-[10px] md:border-b-[15px] border-b-transparent drop-shadow-md"></div>
          </div>
        )}

        <div className="w-full max-w-5xl h-[85%] sm:h-full max-h-[550px] grid grid-cols-3 md:grid-cols-4 grid-rows-4 md:grid-rows-3 gap-2 sm:gap-3 md:gap-4 z-10 px-2 sm:px-0">
          
          {Array.from({ length: CANALES_POR_PANTALLA }).map((_, i) => {
            const indexReal = (paginaActual * CANALES_POR_PANTALLA) + i;
            const demo = MIS_DEMOS[indexReal];

            if (demo) {
              return (
                <div 
                  key={indexReal} 
                  onClick={() => setCanalActivo(demo)}
                  className="w-full h-full bg-gradient-to-b from-white to-[#e6e6e6] rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.2)] border-[2px] sm:border-[3px] border-transparent hover:border-[#38b6ff] hover:shadow-[0_0_15px_rgba(56,182,255,0.8)] transition-all duration-200 cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group animate-fade-in"
                >
                  <div className="absolute top-0 w-full h-1/2 bg-white/30 rounded-t-xl z-10 pointer-events-none"></div>
                  
                  <img 
                    src={`${basePath}imagenes/${demo.archivo}.jpg`} 
                    alt={demo.titulo}
                    decoding="async"
                    loading="lazy" /* Lo cambiamos a lazy para que no congele la pagina */
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                    }}
                  />
                  
                  <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-sm py-1 sm:py-1.5 border-t border-gray-300 z-20">
                     <p className="text-gray-600 font-bold text-[10px] sm:text-xs md:text-sm text-center px-1 sm:px-2 truncate">
                       {demo.titulo}
                     </p>
                  </div>
                </div>
              );
            }

            return (
              <div key={indexReal} className="w-full h-full bg-wii-empty rounded-xl border border-gray-300 flex items-center justify-center shadow-inner relative overflow-hidden animate-fade-in">
                 <span className="text-gray-400/30 font-bold text-xl sm:text-2xl md:text-4xl tracking-widest absolute">danii</span>
              </div>
            );
          })}
        </div>

        {paginaActual < TOTAL_PANTALLAS - 1 && !mostrarAdvertencia && (
          <div 
            onClick={irSiguientePantalla}
            className="absolute right-1 md:right-4 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100 cursor-pointer hover:scale-110 active:scale-90 transition-all z-20"
          >
             <div className="w-0 h-0 border-t-[10px] md:border-t-[15px] border-t-transparent border-l-[15px] md:border-l-[25px] border-l-[#38b6ff] border-b-[10px] md:border-b-[15px] border-b-transparent drop-shadow-md"></div>
          </div>
        )}
      </div>

      <div className="w-full h-20 sm:h-24 md:h-28 flex-shrink-0 relative mt-2 sm:mt-0">
        <div className="absolute bottom-0 w-full h-full bg-gradient-to-b from-[#f5f5f5] to-[#c4c4c4] border-t-[2px] sm:border-t-[3px] border-[#42b6f5] rounded-t-[50%_15px] sm:rounded-t-[50%_25px] md:rounded-t-[50%_40px] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]"></div>
        
        <div className="relative w-full h-full flex justify-between items-center px-4 sm:px-8 md:px-12 z-10 pb-2">
          
          <div className="flex items-end gap-2 sm:gap-3 md:gap-4 mt-2">
            <button 
              onClick={() => window.open('https://www.instagram.com/acordesenventa/', '_blank')}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-white to-[#d9d9d9] border-2 border-gray-300 shadow-md flex items-center justify-center font-extrabold text-[#999999] text-xs sm:text-sm md:text-xl hover:scale-105 active:scale-95 transition-all hover:text-[#E1306C] hover:border-[#E1306C]"
            >
              danii
            </button>
            <div className="hidden sm:block w-4 h-5 md:w-6 md:h-8 border-2 border-[#999999] rounded-sm mb-1 opacity-60">
              <div className="w-full h-1/4 border-b-2 border-[#999999]"></div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-2 sm:mt-4">
             <div className="text-xl sm:text-2xl md:text-4xl font-mono text-[#7a7a7a] tracking-widest font-light flex items-baseline gap-1">
               {formattedHours}:{formattedMinutes} <span className="text-xs sm:text-sm md:text-xl">{ampm}</span>
             </div>
             <div className="text-[#666666] font-bold text-xs sm:text-sm md:text-lg">
               {dayName} {date}/{month}
             </div>
          </div>

          <button 
            onClick={() => window.open('https://open.spotify.com/intl-es/artist/1qmQaRbCM5p4b5PxiqD7Gt', '_blank')}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-white to-[#d9d9d9] border-2 border-gray-300 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all mt-2 group"
          >
             <div className="w-0 h-0 border-t-[6px] sm:border-t-[8px] md:border-t-[10px] border-t-transparent border-l-[10px] sm:border-l-[14px] md:border-l-[18px] border-l-[#999999] border-b-[6px] sm:border-b-[8px] md:border-b-[10px] border-b-transparent ml-1.5 group-hover:border-l-[#1DB954] transition-colors duration-300"></div>
          </button>
        </div>
      </div>

      {canalActivo && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-2 sm:p-4"
          onClick={cerrarCanal} 
        >
          
          <div 
            className="bg-white p-1 sm:p-2 rounded-[1.5rem] sm:rounded-[2rem] w-full max-w-4xl max-h-[90dvh] shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-zoom-in flex flex-col"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="bg-wii-scanlines w-full h-full rounded-[1.2rem] sm:rounded-[1.5rem] border-[3px] sm:border-[4px] border-gray-300 flex flex-col relative overflow-hidden shadow-inner flex-1">
              
              <div className="w-full h-12 sm:h-16 md:h-20 bg-gradient-to-b from-gray-50 to-gray-300 flex items-center justify-center border-b-[2px] sm:border-b-[3px] border-gray-400 shadow-sm relative shrink-0">
                 <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#7a7a7a] tracking-widest drop-shadow-sm truncate px-4">
                   {canalActivo.titulo}
                 </h2>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-8 relative min-h-0 bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(230,230,230,1)_100%)]">
                 
                 <div className={`w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 rounded-xl sm:rounded-2xl border-[4px] sm:border-[6px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden relative bg-white flex items-center justify-center shrink-0 transition-transform duration-500 ${isPlaying ? 'scale-105 shadow-[0_0_30px_rgba(100,220,240,0.6)]' : ''}`}>
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

                 <div 
                    className="w-full max-w-xs sm:max-w-md mt-4 sm:mt-8 h-3 sm:h-4 md:h-5 bg-gray-400/50 rounded-full border-[2px] sm:border-[3px] border-gray-400 shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)] overflow-hidden relative cursor-pointer"
                    onClick={handleSeek}
                 >
                    <div 
                      className="h-full bg-gradient-to-r from-white to-[#cceeff] shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
                      style={{ width: `${progress}%` }}
                    ></div>
                 </div>
              </div>

              <div className="w-full h-16 sm:h-20 md:h-28 bg-gradient-to-t from-gray-400 to-gray-200 flex items-center justify-between px-4 sm:px-10 border-t-[2px] sm:border-t-[3px] border-gray-400 shrink-0">
                 
                 <button 
                   onClick={cerrarCanal} 
                   className="px-4 py-1.5 sm:px-6 sm:py-2 md:px-8 md:py-3 bg-gradient-to-b from-white to-[#d9d9d9] rounded-full font-extrabold text-[#7a7a7a] text-xs sm:text-sm md:text-lg border-2 border-gray-400 shadow-md hover:scale-105 active:scale-95 transition-all"
                 >
                  Menu
                 </button>
                 
                 <button 
                   onClick={togglePlay} 
                   className={`absolute left-1/2 transform -translate-x-1/2 px-8 py-2 sm:px-12 sm:py-3 md:px-16 md:py-4 rounded-full font-black text-sm sm:text-xl md:text-2xl border-[2px] sm:border-[3px] shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 active:translate-y-1 sm:active:translate-y-2 transition-all z-10 
                     ${isPlaying 
                        ? 'bg-gradient-to-b from-red-100 to-red-300 border-red-300 sm:border-red-400 text-red-600 hover:shadow-[0_0_15px_rgba(255,100,100,0.6)]' 
                        : 'bg-gradient-to-b from-white to-[#e6e6e6] border-[#38b6ff] text-[#555555] hover:shadow-[0_0_15px_rgba(56,182,255,0.6)]'}`}
                 >
                    {isPlaying ? 'PAUSA' : 'REPRODUCIR'}
                 </button>

                 <div className="w-[60px] sm:w-[100px]"></div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
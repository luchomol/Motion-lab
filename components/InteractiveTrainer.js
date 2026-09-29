'use client';

import { useState, useEffect } from 'react';

const COLORS = [
  { id: 'matte-black', label: 'Negro Mate', hex: '#1a1a1a', filter: 'grayscale(100%) brightness(50%)' },
  { id: 'olive-green', label: 'Verde Oliva', hex: '#4b5320', filter: 'sepia(100%) hue-rotate(50deg) saturate(150%) brightness(70%)' },
  { id: 'race-red', label: 'Rojo Carrera', hex: '#e50000', filter: 'sepia(100%) hue-rotate(-50deg) saturate(300%) brightness(90%)' },
  { id: 'electric-blue', label: 'Azul Eléctrico', hex: '#0033ff', filter: 'sepia(100%) hue-rotate(180deg) saturate(300%) brightness(100%)' },
  { id: 'crisp-white', label: 'Blanco Nítido', hex: '#f8f9fa', filter: 'grayscale(100%) brightness(150%)' },
  { id: 'energetic-orange', label: 'Naranja Energético', hex: '#ff6600', filter: 'sepia(100%) hue-rotate(-20deg) saturate(300%) brightness(100%)' },
];

const MATERIALS_A = ['Compresión', 'Malla Transpirable'];
const MATERIALS_B = ['Nylon Táctico', 'Caucho Premium'];

export default function InteractiveTrainer() {
  const [activeColor, setActiveColor] = useState(COLORS[0]);
  const [activeMaterial, setActiveMaterial] = useState(MATERIALS_A[0]);
  const [isInteracting, setIsInteracting] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Text flashing effect
  useEffect(() => {
    let timeout;
    if (isInteracting) {
      timeout = setTimeout(() => {
        setIsInteracting(false);
      }, 3000); // Back to default after 3 seconds
    }
    return () => clearTimeout(timeout);
  }, [isInteracting]);

  // Continuous slow 3D rotation simulation
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setRotation(prev => (prev + 0.3) % 360);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleInteraction = () => {
    setIsInteracting(false); // Reset to force re-trigger if already true
    setTimeout(() => setIsInteracting(true), 50); 
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] max-h-[900px] bg-[#05070c] overflow-hidden flex items-center justify-center font-sans border-t border-slate-800">
      
      {/* Background Environment (Dark luxury gym texturized) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-md scale-105"
        style={{ backgroundImage: 'url(/images/motion-lab-field.jpg)' }} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#05070c]/90" />

      {/* Main Subject (Animated Rotation) */}
      <div 
        className="relative z-10 w-full max-w-[500px] h-3/4 flex justify-center items-center"
        style={{ perspective: '1500px' }}
      >
        <div 
          className="w-full h-full relative flex justify-center items-center"
          style={{ transform: `rotateY(${Math.sin(rotation * Math.PI / 180) * 20}deg)`, transformStyle: 'preserve-3d' }}
        >
          {/* Sujeto central aislado (simulado con mascara de gradiente para difuminar bordes) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/trainer-interactive.jpg" 
            alt="Trainer Subject" 
            className="w-full max-w-[400px] object-contain transition-all duration-700 ease-in-out drop-shadow-2xl"
            style={{ 
              filter: activeColor.filter,
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)'
            }}
          />
        </div>
      </div>

      {/* Animated Text */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none w-full mix-blend-screen">
        <div className="relative">
          {/* Default Text */}
          <div className={`transition-all duration-500 ease-out ${isInteracting ? 'opacity-0 blur-md scale-95' : 'opacity-100 blur-0 scale-100'}`}>
            <h2 className="text-6xl sm:text-8xl md:text-9xl font-black text-white/90 tracking-tighter uppercase drop-shadow-2xl">
              DEFINE
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-slate-300 tracking-[0.3em] uppercase mt-1 drop-shadow-md">
              According to your path
            </p>
          </div>

          {/* Interacting State Text */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full transition-all duration-500 ease-out ${isInteracting ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105'}`}>
            <h2 className="text-6xl sm:text-8xl md:text-9xl font-black text-sky-400/90 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              YOUR VIBE
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-sky-200 tracking-[0.3em] uppercase mt-1 drop-shadow-md">
              Tailored to your Training
            </p>
          </div>
        </div>
      </div>

      {/* Bottom UI Controls */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-3xl bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Materials */}
        <div className="flex-1 w-full">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 text-center md:text-left">
            Material
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {[...MATERIALS_A, ...MATERIALS_B].map(mat => (
              <button
                key={mat}
                onClick={() => { setActiveMaterial(mat); handleInteraction(); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  activeMaterial === mat 
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Divider (Desktop) */}
        <div className="hidden md:block w-px h-16 bg-slate-700/50" />

        {/* Colors */}
        <div className="flex-1 w-full">
           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 text-center md:text-left">
             Acabado Premium
           </p>
           <div className="flex flex-wrap justify-center md:justify-start gap-3">
             {COLORS.map(color => (
               <button
                 key={color.id}
                 onClick={() => { setActiveColor(color); handleInteraction(); }}
                 className={`w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center relative cursor-pointer group ${
                   activeColor.id === color.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-110 ring-1 ring-slate-700'
                 }`}
                 style={{ backgroundColor: color.hex }}
                 title={color.label}
               >
                 <span className="sr-only">{color.label}</span>
                 {/* Hover tooltip */}
                 <span className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                   {color.label}
                 </span>
               </button>
             ))}
           </div>
        </div>

      </div>

    </section>
  );
}

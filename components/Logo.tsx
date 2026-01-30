import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = "h-12", variant = 'light' }) => {
  const isDark = variant === 'dark';
  const bluePrimary = isDark ? "#60a5fa" : "#005696";
  const greenBrand = "#84cc16";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="2" width="96" height="96" rx="4" fill={isDark ? "#1e293b" : "#ffffff"} stroke={isDark ? "#334155" : "#e2e8f0"} strokeWidth="1.5" />
        
        {/* Abstract "A" Construction - Professional & Clean */}
        <path d="M50 20 L80 80 H65 L50 50 L35 80 H20 Z" fill={bluePrimary} />
        <path d="M50 20 L65 50 H35 Z" fill={greenBrand} opacity="0.9" />
        
        {/* Data Accents */}
        <rect x="75" y="15" width="10" height="10" rx="1" fill={greenBrand} />
        <rect x="15" y="75" width="8" height="8" rx="1" fill={bluePrimary} opacity="0.5" />
      </svg>
      
      <div className="flex flex-col justify-center leading-none select-none">
        <div className="flex items-center gap-0.5">
          <span className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AZARI
          </span>
          <span className="text-2xl font-black tracking-tighter text-[#84cc16]">
            AH
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-slate-500">
            MANAGEMENT
          </span>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
            GROUP
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo;
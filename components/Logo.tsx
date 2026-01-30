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
        className="h-full w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="48" fill={isDark ? "#1e293b" : "#ffffff"} stroke={isDark ? "#334155" : "#e2e8f0"} strokeWidth="1" />
        {/* Dynamic Grid Pattern */}
        <g opacity="0.9">
          <rect x="25" y="30" width="10" height="10" rx="1.5" fill={bluePrimary} />
          <rect x="40" y="25" width="10" height="10" rx="1.5" fill={bluePrimary} />
          <rect x="55" y="20" width="10" height="10" rx="1.5" fill={bluePrimary} />
          <rect x="70" y="25" width="10" height="10" rx="1.5" fill={greenBrand} />
          <rect x="20" y="45" width="10" height="10" rx="1.5" fill={bluePrimary} />
          <rect x="35" y="45" width="10" height="10" rx="1.5" fill={bluePrimary} />
          <rect x="55" y="45" width="10" height="10" rx="1.5" fill={greenBrand} />
          <rect x="75" y="45" width="10" height="10" rx="1.5" fill={greenBrand} />
          <rect x="25" y="60" width="10" height="10" rx="1.5" fill={bluePrimary} />
          <rect x="45" y="65" width="10" height="10" rx="1.5" fill={bluePrimary} />
          <rect x="65" y="60" width="10" height="10" rx="1.5" fill={greenBrand} />
        </g>
      </svg>
      
      <div className="flex flex-col justify-center leading-none select-none">
        <div className="flex items-center">
          <span className={`text-xl md:text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#005696]'}`}>
            AZARI
          </span>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-[#84cc16]">
            AH
          </span>
        </div>
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 mt-1">
          MANAGEMENT
        </span>
      </div>
    </div>
  );
};

export default Logo;
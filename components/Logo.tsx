
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = "h-12", variant = 'light' }) => {
  const isDark = variant === 'dark';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized Pixelated Globe */}
        <circle cx="50" cy="50" r="45" fill={isDark ? "#1e293b" : "#f8fafc"} stroke={isDark ? "#334155" : "#e2e8f0"} strokeWidth="0.5" />
        
        {/* Blue Pixels */}
        <rect x="25" y="35" width="6" height="6" rx="1" fill="#2563eb" />
        <rect x="35" y="25" width="6" height="6" rx="1" fill="#3b82f6" />
        <rect x="45" y="20" width="6" height="6" rx="1" fill="#2563eb" />
        <rect x="20" y="45" width="6" height="6" rx="1" fill="#1d4ed8" />
        <rect x="30" y="55" width="6" height="6" rx="1" fill="#3b82f6" />
        <rect x="25" y="65" width="6" height="6" rx="1" fill="#2563eb" />
        <rect x="40" y="75" width="6" height="6" rx="1" fill="#1d4ed8" />
        <rect x="55" y="80" width="6" height="6" rx="1" fill="#3b82f6" />
        
        {/* Green Pixels */}
        <rect x="65" y="25" width="6" height="6" rx="1" fill="#84cc16" />
        <rect x="75" y="35" width="6" height="6" rx="1" fill="#65a30d" />
        <rect x="80" y="50" width="6" height="6" rx="1" fill="#84cc16" />
        <rect x="70" y="65" width="6" height="6" rx="1" fill="#65a30d" />
        <rect x="60" y="55" width="6" height="6" rx="1" fill="#bef264" />
        <rect x="50" y="40" width="6" height="6" rx="1" fill="#84cc16" />
      </svg>
      
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center">
          <span className={`text-xl md:text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AZARI
          </span>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-[#84cc16]">
            AH
          </span>
        </div>
        <span className={`text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Management
        </span>
        <span className={`text-[10px] md:text-[12px] font-black tracking-[0.1em] uppercase ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
          Group
        </span>
      </div>
    </div>
  );
};

export default Logo;

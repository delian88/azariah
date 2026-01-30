
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = "h-12", variant = 'light' }) => {
  const isDark = variant === 'dark';
  
  // Brand Colors
  const bluePrimary = isDark ? "#60a5fa" : "#005696"; // Deep corporate blue
  const greenBrand = "#84cc16"; // Signature green
  const greyText = isDark ? "#94a3b8" : "#71717a"; // Management grey
  const whiteText = "#ffffff";
  const darkText = "#0f172a";

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Refined 3D-effect Pixel Globe SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="globeGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor={isDark ? "#1e293b" : "#ffffff"} />
            <stop offset="100%" stopColor={isDark ? "#0f172a" : "#f1f5f9"} />
          </radialGradient>
        </defs>
        
        {/* Subtle Sphere Base */}
        <circle cx="50" cy="50" r="46" fill="url(#globeGrad)" />
        
        {/* Blue Grid/Pixels - Structured for depth */}
        <g fill={bluePrimary}>
          <rect x="22" y="38" width="8" height="8" rx="1" opacity="0.9" />
          <rect x="32" y="28" width="8" height="8" rx="1" opacity="0.8" />
          <rect x="42" y="22" width="8" height="8" rx="1" opacity="1" />
          <rect x="18" y="50" width="8" height="8" rx="1" opacity="0.7" />
          <rect x="28" y="60" width="8" height="8" rx="1" opacity="0.9" />
          <rect x="40" y="72" width="8" height="8" rx="1" opacity="0.8" />
          <rect x="12" y="42" width="6" height="6" rx="1" opacity="0.5" />
          <rect x="55" y="82" width="8" height="8" rx="1" opacity="0.6" />
        </g>
        
        {/* Green Grid/Pixels - Brand highlights */}
        <g fill={greenBrand}>
          <rect x="62" y="24" width="8" height="8" rx="1" />
          <rect x="74" y="36" width="8" height="8" rx="1" />
          <rect x="82" y="50" width="8" height="8" rx="1" opacity="0.9" />
          <rect x="70" y="64" width="8" height="8" rx="1" opacity="0.8" />
          <rect x="58" y="52" width="8" height="8" rx="1" />
          <rect x="48" y="38" width="8" height="8" rx="1" opacity="0.7" />
          <rect x="52" y="15" width="6" height="6" rx="1" opacity="0.5" />
        </g>
      </svg>
      
      {/* Clean Professional Typography */}
      <div className="flex flex-col justify-center select-none">
        {/* AZARIAH */}
        <div className="flex items-center">
          <span 
            className="text-2xl md:text-3xl font-extrabold tracking-tighter"
            style={{ color: isDark ? whiteText : bluePrimary }}
          >
            AZAR
          </span>
          <span 
            className="text-2xl md:text-3xl font-extrabold tracking-tighter"
            style={{ color: greenBrand }}
          >
            IAH
          </span>
        </div>
        
        {/* MANAGEMENT */}
        <span 
          className="text-[9px] md:text-[11px] font-medium tracking-[0.45em] uppercase leading-none mt-0.5"
          style={{ color: greyText }}
        >
          Management
        </span>
        
        {/* GROUP */}
        <span 
          className="text-sm md:text-base font-black tracking-[0.15em] uppercase leading-tight"
          style={{ color: isDark ? bluePrimary : bluePrimary }}
        >
          Group
        </span>
      </div>
    </div>
  );
};

export default Logo;

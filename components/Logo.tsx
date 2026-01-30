import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = "h-12", variant = 'light' }) => {
  const isDark = variant === 'dark';
  
  // Colors sampled from the provided logo image
  const bluePrimary = "#005696"; 
  const greenBrand = "#84cc16"; 
  const greyManagement = "#71717a";
  const whiteText = "#ffffff";

  return (
    <div className={`flex items-center gap-2 md:gap-3 lg:gap-4 ${className}`}>
      {/* Precision Pixel Globe SVG based on the provided image */}
      <svg 
        viewBox="0 0 120 120" 
        className="h-full w-auto shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
            <feOffset dx="0.5" dy="0.5" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#shadow)">
          {/* Blue Pixels - Left and Central hemisphere */}
          <g fill={bluePrimary}>
            <rect x="35" y="10" width="8" height="8" rx="0.5" />
            <rect x="45" y="8" width="8" height="8" rx="0.5" />
            <rect x="55" y="10" width="8" height="8" rx="0.5" />
            <rect x="25" y="22" width="8" height="8" rx="0.5" />
            <rect x="35" y="20" width="8" height="8" rx="0.5" />
            <rect x="45" y="18" width="8" height="8" rx="0.5" />
            <rect x="55" y="20" width="8" height="8" rx="0.5" />
            <rect x="15" y="38" width="9" height="9" rx="0.5" />
            <rect x="26" y="35" width="9" height="9" rx="0.5" />
            <rect x="38" y="33" width="9" height="9" rx="0.5" />
            <rect x="50" y="35" width="9" height="9" rx="0.5" />
            <rect x="10" y="55" width="10" height="10" rx="0.5" />
            <rect x="22" y="52" width="10" height="10" rx="0.5" />
            <rect x="35" y="50" width="10" height="10" rx="0.5" />
            <rect x="12" y="72" width="9" height="9" rx="0.5" />
            <rect x="24" y="70" width="9" height="9" rx="0.5" />
            <rect x="38" y="68" width="9" height="9" rx="0.5" />
            <rect x="18" y="88" width="8" height="8" rx="0.5" />
            <rect x="28" y="86" width="8" height="8" rx="0.5" />
            <rect x="40" y="84" width="8" height="8" rx="0.5" />
            <rect x="30" y="102" width="7" height="7" rx="0.5" />
            <rect x="40" y="100" width="7" height="7" rx="0.5" />
          </g>

          {/* Green Pixels - Top Right and Edge highlighting */}
          <g fill={greenBrand}>
            <rect x="68" y="12" width="8" height="8" rx="0.5" />
            <rect x="78" y="18" width="8" height="8" rx="0.5" />
            <rect x="88" y="28" width="8" height="8" rx="0.5" />
            <rect x="65" y="25" width="8" height="8" rx="0.5" />
            <rect x="75" y="32" width="8" height="8" rx="0.5" />
            <rect x="85" y="42" width="8" height="8" rx="0.5" />
            <rect x="60" y="45" width="9" height="9" rx="0.5" />
            <rect x="52" y="62" width="9" height="9" rx="0.5" />
            <rect x="45" y="78" width="8" height="8" rx="0.5" />
            <rect x="55" y="92" width="7" height="7" rx="0.5" />
            <rect x="50" y="108" width="6" height="6" rx="0.5" />
          </g>
        </g>
      </svg>
      
      {/* Accurate Typography */}
      <div className="flex flex-col justify-center leading-[1.1] select-none">
        {/* AZARIAH */}
        <div className="flex items-center font-black tracking-tight text-xl md:text-2xl lg:text-4xl">
          <span style={{ color: isDark ? whiteText : bluePrimary }}>AZAR</span>
          <span style={{ color: greenBrand }}>IAH</span>
        </div>
        
        {/* MANAGEMENT */}
        <div 
          className="text-[6px] md:text-[8px] lg:text-[12px] font-bold tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.4em] uppercase"
          style={{ color: isDark ? "#94a3b8" : greyManagement }}
        >
          Management
        </div>
        
        {/* GROUP */}
        <div 
          className="text-sm md:text-lg lg:text-2xl font-black tracking-[0.1em] md:tracking-[0.15em] uppercase"
          style={{ color: isDark ? whiteText : bluePrimary }}
        >
          Group
        </div>
      </div>
    </div>
  );
};

export default Logo;
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = "h-8", variant = 'light' }) => {
  const isDark = variant === 'dark';
  
  // Colors sampled from the official logo
  const colorBlue = "#005696";
  const colorGreen = "#84cc16";
  const colorGray = "#71717a"; // Management text color
  const managementColor = isDark ? "#94a3b8" : colorGray;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Globe Icon - SVG recreation of the tiled globe */}
      <svg 
        viewBox="0 0 100 100" 
        className="h-full w-auto flex-shrink-0"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="GlobeTiles">
          <path d="M45 10 C30 15, 20 25, 15 40 L22 40 C25 30, 32 22, 45 18 Z" fill={colorBlue} />
          <path d="M40 25 C28 30, 22 40, 20 50 L27 50 C29 42, 33 34, 40 30 Z" fill={colorBlue} />
          <path d="M38 55 C20 60, 25 80, 45 90 L45 82 C35 78, 32 65, 38 62 Z" fill={colorBlue} />
          
          <rect x="35" y="15" width="4" height="4" fill={colorBlue} />
          <rect x="42" y="12" width="4" height="4" fill={colorBlue} />
          <rect x="50" y="10" width="4" height="4" fill={colorBlue} />
          <rect x="58" y="11" width="4" height="4" fill={colorGreen} />
          <rect x="66" y="15" width="4" height="4" fill={colorGreen} />

          <rect x="30" y="25" width="4" height="4" fill={colorBlue} />
          <rect x="38" y="22" width="4" height="4" fill={colorBlue} />
          <rect x="47" y="20" width="4" height="4" fill={colorBlue} />
          <rect x="56" y="20" width="4" height="4" fill={colorGreen} />
          <rect x="65" y="22" width="4" height="4" fill={colorGreen} />
          <rect x="74" y="28" width="4" height="4" fill={colorGreen} />

          <rect x="25" y="38" width="5" height="5" fill={colorBlue} />
          <rect x="33" y="35" width="5" height="5" fill={colorBlue} />
          <rect x="42" y="33" width="5" height="5" fill={colorBlue} />
          <rect x="52" y="33" width="5" height="5" fill={colorGreen} />
          <rect x="62" y="35" width="5" height="5" fill={colorGreen} />
          <rect x="72" y="42" width="5" height="5" fill={colorGreen} />

          <rect x="22" y="52" width="5" height="5" fill={colorBlue} />
          <rect x="30" y="50" width="5" height="5" fill={colorBlue} />
          <rect x="39" y="48" width="5" height="5" fill={colorBlue} />
          <rect x="50" y="48" width="5" height="5" fill={colorGreen} />
          <rect x="61" y="50" width="5" height="5" fill={colorGreen} />

          <rect x="28" y="65" width="6" height="6" fill={colorBlue} />
          <rect x="38" y="63" width="6" height="6" fill={colorBlue} />
          <rect x="49" y="63" width="6" height="6" fill={colorGreen} />
          <rect x="60" y="65" width="6" height="6" fill={colorGreen} />

          <rect x="35" y="78" width="7" height="7" fill={colorBlue} />
          <rect x="48" y="76" width="7" height="7" fill={colorGreen} />
        </g>
      </svg>
      
      {/* Brand Typography - Refined sizing for compact header */}
      <div className="flex flex-col leading-[0.8] -space-y-0.5">
        <div className="font-bold tracking-tighter text-xl md:text-2xl uppercase flex items-baseline">
          <span style={{ color: isDark ? "#ffffff" : colorBlue }}>AZARI</span>
          <span style={{ color: colorGreen }}>AH</span>
        </div>
        <div 
          className="text-[7px] md:text-[8px] font-medium tracking-[0.2em] uppercase"
          style={{ color: managementColor }}
        >
          MANAGEMENT
        </div>
        <div 
          className="text-sm md:text-base font-black tracking-widest uppercase"
          style={{ color: isDark ? colorGreen : colorBlue }}
        >
          GROUP
        </div>
      </div>
    </div>
  );
};

export default Logo;
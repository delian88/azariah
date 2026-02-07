import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = "h-8", variant = 'light' }) => {
  const isDark = variant === 'dark';
  const colorPrimary = isDark ? "#ffffff" : "#0f172a";
  const colorAccent = "#84cc16";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* The iconic square symbol */}
      <div className="relative w-10 h-10 flex-shrink-0">
        <div className="absolute inset-0 border-[5px] border-current" style={{ color: colorPrimary }}></div>
        <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5" style={{ backgroundColor: colorAccent }}></div>
      </div>
      
      {/* Brand Typography */}
      <div className="flex flex-col -space-y-1">
        <div className="flex items-center font-black tracking-tighter text-2xl md:text-3xl lg:text-4xl leading-none">
          <span style={{ color: colorPrimary }}>AZARIAH</span>
          <span className="ml-0.5" style={{ color: colorAccent }}>.</span>
        </div>
        <div 
          className="text-[8px] md:text-[9px] font-black tracking-[0.4em] uppercase leading-none whitespace-nowrap"
          style={{ color: isDark ? "#94a3b8" : "#475569" }}
        >
          MANAGE
        </div>
      </div>
    </div>
  );
};

export default Logo;
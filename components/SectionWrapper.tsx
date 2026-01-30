
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  id?: string;
  className?: string;
  bg?: 'light' | 'dark' | 'white';
}

const SectionWrapper: React.FC<Props> = ({ children, id, className = "", bg = "white" }) => {
  const bgClasses = {
    light: 'bg-slate-50',
    dark: 'bg-slate-900 text-white',
    white: 'bg-white'
  };

  return (
    <section id={id} className={`py-20 px-6 md:px-12 lg:px-24 ${bgClasses[bg]} ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;

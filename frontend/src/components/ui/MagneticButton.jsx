import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from './GlassCard';

export function MagneticButton({
  children,
  className,
  onClick,
  variant = 'primary', // primary, outline, ghost
  ...props
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "premium-button inline-flex items-center justify-center px-6 py-3 font-semibold text-sm transition-colors duration-300";
  
  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]",
    outline: "border-2 border-white/10 hover:border-white/20 text-white bg-white/5 hover:bg-white/10",
    ghost: "text-white/70 hover:text-white hover:bg-white/5"
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(baseStyles, variants[variant], className)}
      onClick={onClick}
      {...props}
    >
      {/* Glossy top highlight */}
      <span className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

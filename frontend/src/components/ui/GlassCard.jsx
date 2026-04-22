import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function GlassCard({ children, className, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={cn(
        "glass rounded-2xl p-6 relative overflow-hidden group",
        className
      )}
      {...props}
    >
      {/* Subtle top glare */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Hover glow effect background */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

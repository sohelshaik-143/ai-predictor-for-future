import React, { useEffect, useState, useRef } from "react";

export default function DashboardCard({ title, value, growth, icon }) {
  const [displayValue, setDisplayValue] = useState(0);
  const frame = useRef();

  // Animate numbers smoothly using requestAnimationFrame
  useEffect(() => {
    if (typeof value !== "number") return;

    let start = 0;
    const duration = 800; // animation duration in ms
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) frame.current = requestAnimationFrame(animate);
      else setDisplayValue(value);
    };

    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, [value]);

  const isPositive = growth >= 0;

  return (
    <div
      className={`relative flex flex-col justify-center items-center bg-gradient-to-tr from-white/10 to-white/5 backdrop-blur-xl border border-yellow-400 p-6 rounded-3xl text-center text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl`}
      role="region"
      aria-label={title}
    >
      {/* Optional Icon */}
      {icon && (
        <div className="absolute top-4 right-4 text-4xl opacity-20 pointer-events-none select-none">
          {icon}
        </div>
      )}

      {/* Title */}
      <div className="text-sm text-white/70 tracking-wider uppercase mb-1">
        {title}
      </div>

      {/* Value */}
      <div className="text-3xl md:text-5xl font-extrabold mt-1 text-white drop-shadow-md">
        {typeof value === "number" ? `₹ ${displayValue.toLocaleString()}` : value}
      </div>

      {/* Growth Indicator */}
      {growth !== undefined && (
        <div
          className={`mt-3 text-sm font-semibold flex items-center space-x-1 ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
          title="Growth compared to previous period"
        >
          <span className="text-lg">{isPositive ? "▲" : "▼"}</span>
          <span>{Math.abs(growth)}%</span>
        </div>
      )}

      {/* Subtle animated background effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 opacity-10 animate-pulse pointer-events-none"></div>
    </div>
  );
}
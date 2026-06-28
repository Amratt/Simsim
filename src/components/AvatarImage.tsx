import React from 'react';

interface AvatarImageProps {
  avatarId: 'green' | 'red' | 'blue';
  className?: string;
}

export default function AvatarImage({ avatarId, className = "w-12 h-12" }: AvatarImageProps) {
  // Define precise color palettes based on the attached images
  const palettes = {
    green: {
      border: '#2e4c27',     // Deep pine green
      dark: '#4c7b41',       // Rich olive green
      medium: '#6ba25e',     // Bright sage green
      light: '#a9d09a',      // Soft mint green
      pale: '#f1f8ef',       // Warm pale shell cream
      leaf: '#4c7b41',       // Leaves color
      leafAccent: '#6ba25e', // Leaves accent
    },
    red: {
      border: '#5c1e1e',     // Deep pomegranate wine
      dark: '#9b3d3d',       // Crimson berry red
      medium: '#bf5e5e',     // Terracotta rose
      light: '#e1a0a0',      // Soft dusty pink
      pale: '#faf2f2',       // Pure pale rose cream
      leaf: '#9b3d3d',       // Leaves color
      leafAccent: '#bf5e5e', // Leaves accent
    },
    blue: {
      border: '#163155',     // Deep lapis lazuli
      dark: '#2c5fa1',       // Azure ocean blue
      medium: '#4d8cd1',     // Soft cobalt blue
      light: '#9cbde3',      // Sky ice blue
      pale: '#f2f6fa',       // Bleached blue reflection
      leaf: '#2c5fa1',       // Leaves color
      leafAccent: '#4d8cd1', // Leaves accent
    }
  };

  const p = palettes[avatarId] || palettes.green;

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`select-none shrink-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer shadow containment circle */}
      <circle cx="50" cy="53" r="41" fill="rgba(0,0,0,0.04)" />
      
      {/* Pristine base white card circle */}
      <circle cx="50" cy="53" r="40" fill="#ffffff" />

      {/* BOTANICAL LEAF SPROUT ON TOP (Y-aligned at 16) */}
      <g id="sprout-top">
        {/* Central Vertical Leaf */}
        <path 
          d="M50 8C50 8 53 14 53 17C53 20 50 20 50 20C50 20 47 20 47 17C47 14 50 8 50 8Z" 
          fill={p.leaf} 
        />
        {/* Left Tilted Leaf */}
        <path 
          d="M48 10C48 10 40 12 40 16C40 19 43 18 43 18C43 18 45 16 48 10Z" 
          fill={p.leafAccent} 
        />
        {/* Right Tilted Leaf */}
        <path 
          d="M52 10C52 10 60 12 60 16C60 19 57 18 57 18C57 18 55 16 52 10Z" 
          fill={p.leafAccent} 
        />
        {/* Small sprout accent dots */}
        <circle cx="39" cy="18" r="1.5" fill={p.leaf} />
        <circle cx="61" cy="18" r="1.5" fill={p.leaf} />
      </g>

      {/* SOLID SHELL BORDER */}
      <circle cx="50" cy="55" r="33" fill="none" stroke={p.border} strokeWidth="2" />

      {/* MAIN TURTLE SHELL PATTERN */}
      <g id="turtle-shell">
        {/* Outer segmented ring */}
        <circle cx="50" cy="55" r="31" fill={p.pale} stroke={p.border} strokeWidth="1.5" />
        
        {/* Shell inner polygonal shapes */}
        {/* Central hexagon */}
        <path 
          d="M50 45 L59 50 L59 60 L50 65 L41 60 L41 50 Z" 
          fill={p.medium} 
          stroke={p.border} 
          strokeWidth="1.2" 
        />
        
        {/* Inner concentric ring inside central hexagon */}
        <circle cx="50" cy="55" r="6" fill={p.dark} stroke={p.border} strokeWidth="1" />
        <circle cx="50" cy="55" r="2" fill={p.pale} />

        {/* Diagonal sector dividers to outer ring */}
        <line x1="50" y1="45" x2="50" y2="24" stroke={p.border} strokeWidth="1.2" />
        <line x1="59" y1="50" x2="72" y2="40" stroke={p.border} strokeWidth="1.2" />
        <line x1="59" y1="60" x2="72" y2="70" stroke={p.border} strokeWidth="1.2" />
        <line x1="50" y1="65" x2="50" y2="86" stroke={p.border} strokeWidth="1.2" />
        <line x1="41" y1="60" x2="28" y2="70" stroke={p.border} strokeWidth="1.2" />
        <line x1="41" y1="50" x2="28" y2="40" stroke={p.border} strokeWidth="1.2" />

        {/* Regional designs inside the top, bottom, and side quadrants */}
        {/* Top-Mid segment circle badge */}
        <circle cx="50" cy="34" r="3.5" fill={p.dark} />
        <circle cx="50" cy="34" r="1.5" fill={p.light} />

        {/* Bottom-Mid segment arch */}
        <path d="M44 80 Q50 72 56 80" fill="none" stroke={p.border} strokeWidth="1.2" />
        <circle cx="50" cy="76" r="2.5" fill={p.medium} stroke={p.border} strokeWidth="0.8" />

        {/* Left & Right custom arcs */}
        <path d="M26 55 Q34 55 34 47" fill="none" stroke={p.border} strokeWidth="1" />
        <circle cx="30" cy="49" r="1.5" fill={p.light} />

        <path d="M74 55 Q66 55 66 47" fill="none" stroke={p.border} strokeWidth="1" />
        <circle cx="70" cy="49" r="1.5" fill={p.light} />

        {/* Decorative dot series on outer perimeter */}
        <circle cx="41" cy="31" r="1" fill={p.border} />
        <circle cx="59" cy="31" r="1" fill={p.border} />
        <circle cx="70" cy="51" r="1.2" fill={p.border} />
        <circle cx="70" cy="59" r="1.2" fill={p.border} />
        <circle cx="59" cy="79" r="1" fill={p.border} />
        <circle cx="41" cy="79" r="1" fill={p.border} />
        <circle cx="30" cy="59" r="1.2" fill={p.border} />
        <circle cx="30" cy="51" r="1.2" fill={p.border} />
      </g>
    </svg>
  );
}

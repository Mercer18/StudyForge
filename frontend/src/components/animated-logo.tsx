"use client"

import React from 'react'

export function AnimatedLogo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <style>{`
        @keyframes voxel-fly-1 {
          0% { transform: translate(95px, 20px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          80% { transform: translate(72px, 32px) rotate(180deg); opacity: 1; }
          90%, 100% { transform: translate(72px, 32px) scale(0); opacity: 0; }
        }
        @keyframes voxel-fly-2 {
          0% { transform: translate(85px, 85px) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          85% { transform: translate(70px, 60px) rotate(360deg); opacity: 1; }
          95%, 100% { transform: translate(70px, 60px) scale(0); opacity: 0; }
        }
        @keyframes voxel-fly-3 {
          0% { transform: translate(10px, 15px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          75% { transform: translate(68px, 22px) rotate(-180deg); opacity: 1; }
          85%, 100% { transform: translate(68px, 22px) scale(0); opacity: 0; }
        }
        @keyframes voxel-fly-4 {
          0% { transform: translate(80px, 5px) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          80% { transform: translate(74px, 48px) rotate(270deg); opacity: 1; }
          90%, 100% { transform: translate(74px, 48px) scale(0); opacity: 0; }
        }
        @keyframes voxel-fly-5 {
          0% { transform: translate(45px, 95px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          80% { transform: translate(71px, 75px) rotate(90deg); opacity: 1; }
          90%, 100% { transform: translate(71px, 75px) scale(0); opacity: 0; }
        }
      `}</style>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]"
      >
        {/* Glow Filters */}
        <defs>
          <filter id="logo-glow-heavy" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="logo-glow-subtle" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Holographic Wireframe Grid (The remaining 20% skeleton) */}
        <path
          d="M25 15 H75 V85 H25 Z"
          stroke="url(#wireframe-gradient-logo)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="opacity-45"
        />
        <line x1="35" y1="35" x2="65" y2="35" stroke="url(#wireframe-gradient-logo)" strokeWidth="1" strokeDasharray="2 2" className="opacity-25" />
        <line x1="35" y1="50" x2="65" y2="50" stroke="url(#wireframe-gradient-logo)" strokeWidth="1" strokeDasharray="2 2" className="opacity-25" />
        <line x1="35" y1="65" x2="65" y2="65" stroke="url(#wireframe-gradient-logo)" strokeWidth="1" strokeDasharray="2 2" className="opacity-25" />

        {/* 2. Solidified Document Body (75-80% complete premium gold) */}
        <path
          d="M25 15 H75 V85 H25 Z"
          fill="url(#gold-gradient-logo)"
          filter="url(#logo-glow-subtle)"
          className="opacity-90 transition-all duration-500"
          style={{
            clipPath: 'polygon(0% 0%, 75% 0%, 71% 100%, 0% 100%)' // Cuts off the right-side edge to simulate in-process assembly
          }}
        />

        {/* Flat Inner Lines representing parsed knowledge */}
        <path d="M35 35 H55" stroke="#050409" strokeWidth="3" strokeLinecap="round" className="opacity-70" />
        <path d="M35 50 H52" stroke="#050409" strokeWidth="3" strokeLinecap="round" className="opacity-70" />
        <path d="M35 65 H54" stroke="#050409" strokeWidth="3" strokeLinecap="round" className="opacity-70" />

        {/* 3. Swirling Orbital Energy Bands (Ra.One style rings) */}
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="12"
          stroke="url(#energy-gradient-logo)"
          strokeWidth="1"
          fill="none"
          transform="rotate(-28 50 50)"
          strokeDasharray="140"
          className="animate-[spin_5s_linear_infinite]"
          filter="url(#logo-glow-heavy)"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="12"
          stroke="url(#energy-gradient-logo)"
          strokeWidth="0.75"
          fill="none"
          transform="rotate(32 50 50)"
          strokeDasharray="160"
          className="animate-[spin_7s_linear_infinite_reverse] opacity-50"
        />

        {/* 4. Active Swirling Voxels flying in to fill the right gap */}
        <rect width="4.5" height="4.5" fill="#f59e0b" className="animate-[voxel-fly-1_3s_infinite_ease-in-out]" filter="url(#logo-glow-subtle)" />
        <rect width="3.5" height="3.5" fill="#fbbf24" className="animate-[voxel-fly-2_4s_infinite_ease-in-out_0.5s]" filter="url(#logo-glow-subtle)" />
        <rect width="5" height="5" fill="#d97706" className="animate-[voxel-fly-3_2.5s_infinite_ease-in-out_1s]" filter="url(#logo-glow-heavy)" />
        <rect width="3" height="3" fill="#fbbf24" className="animate-[voxel-fly-4_3.5s_infinite_ease-in-out_1.5s]" filter="url(#logo-glow-subtle)" />
        <rect width="4" height="4" fill="#f59e0b" className="animate-[voxel-fly-5_2.8s_infinite_ease-in-out_0.2s]" filter="url(#logo-glow-subtle)" />

        {/* Gradients */}
        <defs>
          <linearGradient id="gold-gradient-logo" x1="25" y1="15" x2="75" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="wireframe-gradient-logo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="energy-gradient-logo" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

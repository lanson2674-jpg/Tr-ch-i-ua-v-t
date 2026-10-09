import React from 'react';
import { DuckAccessory } from '../types';

interface DuckAvatarProps {
  color: string;
  accessory: DuckAccessory;
  size?: number; // size in pixels
  isSwimming?: boolean;
  isWinner?: boolean;
  direction?: 'right' | 'left';
  className?: string;
}

export const DuckAvatar: React.FC<DuckAvatarProps> = ({
  color,
  accessory,
  size = 56,
  isSwimming = false,
  isWinner = false,
  direction = 'right',
  className = '',
}) => {
  // Beak and outline colors adjusted to base duck color
  const beakColor = '#EA580C';
  const beakHighlight = '#FB923C';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: direction === 'left' ? 'scaleX(-1)' : 'none',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        className={`overflow-visible filter drop-shadow-sm ${isSwimming ? 'animate-swim-bob' : ''} ${isWinner ? 'animate-bounce' : ''}`}
      >
        <defs>
          <linearGradient id={`duckGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.15" />
          </linearGradient>

          {/* Water ripple glow */}
          <radialGradient id="waterRipple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Water ripple underneath when swimming */}
        {isSwimming && (
          <ellipse
            cx="48"
            cy="84"
            rx="40"
            ry="11"
            fill="url(#waterRipple)"
            className="animate-pulse"
            opacity="0.85"
          />
        )}

        {/* Tail feathers */}
        <path
          d="M 18 56 C 8 50, 6 42, 12 37 C 15 48, 24 53, 30 55 Z"
          fill={color}
        />
        <path
          d="M 18 56 C 8 50, 6 42, 12 37 C 15 48, 24 53, 30 55 Z"
          fill={`url(#duckGrad-${color})`}
        />

        {/* Duck Body */}
        <ellipse
          cx="48"
          cy="64"
          rx="32"
          ry="23"
          fill={color}
        />
        <ellipse
          cx="48"
          cy="64"
          rx="32"
          ry="23"
          fill={`url(#duckGrad-${color})`}
        />

        {/* Wing */}
        <path
          d="M 32 63 C 32 54, 44 54, 52 59 C 55 68, 43 75, 34 72 C 30 70, 32 66, 32 63 Z"
          fill="#000"
          fillOpacity="0.08"
        />
        <path
          d="M 33 62 C 33 55, 43 55, 50 60 C 53 67, 42 73, 35 70 C 32 68, 33 65, 33 62 Z"
          fill={color}
        />
        {/* Wing feather lines */}
        <path
          d="M 40 64 Q 45 68 49 66"
          stroke="#000"
          strokeOpacity="0.18"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Duck Head */}
        <circle
          cx="66"
          cy="38"
          r="19"
          fill={color}
        />
        <circle
          cx="66"
          cy="38"
          r="19"
          fill={`url(#duckGrad-${color})`}
        />

        {/* Beak / Mỏ vịt */}
        <path
          d="M 78 37 C 88 35, 96 40, 95 44 C 94 48, 86 50, 77 46 Z"
          fill={beakColor}
        />
        <path
          d="M 78 38 C 85 36, 92 39, 93 42 C 86 42, 80 43, 78 38 Z"
          fill={beakHighlight}
        />
        {/* Beak line */}
        <path
          d="M 78 43 L 90 43"
          stroke="#9A3412"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Cute Big Eye */}
        <ellipse
          cx="69"
          cy="33"
          rx="5"
          ry="6"
          fill="#1E293B"
        />
        {/* Main pupil reflection */}
        <circle
          cx="71"
          cy="31.5"
          r="2.2"
          fill="#FFFFFF"
        />
        {/* Secondary reflection */}
        <circle
          cx="67.5"
          cy="35"
          r="1"
          fill="#FFFFFF"
        />
        {/* Cute blush on cheek */}
        <ellipse
          cx="64"
          cy="43"
          rx="4.5"
          ry="2.8"
          fill="#F43F5E"
          opacity="0.45"
        />

        {/* ACCESSORIES */}
        {accessory === 'grad_cap' && (
          <g transform="translate(48, 11)">
            {/* Mortarboard skullcap */}
            <path d="M 12 14 Q 18 10 24 14 L 23 18 Q 18 16 13 18 Z" fill="#1E293B" />
            {/* Diamond top plate */}
            <polygon points="18,5 34,11 18,17 2,11" fill="#0F172A" />
            <polygon points="18,6 32,11 18,16 4,11" fill="#1E293B" />
            {/* Button */}
            <circle cx="18" cy="11" r="1.5" fill="#EAB308" />
            {/* Gold tassel */}
            <path d="M 18 11 Q 25 15 27 21" stroke="#EAB308" strokeWidth="1.6" fill="none" />
            <circle cx="27" cy="22" r="1.5" fill="#CA8A04" />
          </g>
        )}

        {accessory === 'crown' && (
          <g transform="translate(54, 9)">
            {/* Gold Crown */}
            <path
              d="M 4 17 L 2 7 L 8 11 L 13 4 L 18 11 L 24 7 L 22 17 Z"
              fill="#EAB308"
              stroke="#CA8A04"
              strokeWidth="1.2"
            />
            {/* Jewels */}
            <circle cx="13" cy="7" r="1.5" fill="#EF4444" />
            <circle cx="3" cy="9" r="1" fill="#3B82F6" />
            <circle cx="23" cy="9" r="1" fill="#3B82F6" />
            <rect x="4" y="15" width="18" height="2" rx="1" fill="#FDE047" />
          </g>
        )}

        {accessory === 'sunglasses' && (
          <g transform="translate(62, 28)">
            {/* Black cool shades */}
            <path
              d="M 3 4 C 3 1, 14 1, 14 4 C 14 8, 4 9, 3 4 Z"
              fill="#0F172A"
              stroke="#334155"
              strokeWidth="1"
            />
            <path
              d="M 14 4 L 17 4"
              stroke="#0F172A"
              strokeWidth="1.8"
            />
            <path
              d="M 17 4 C 17 1, 28 1, 28 4 C 28 8, 18 9, 17 4 Z"
              fill="#0F172A"
              stroke="#334155"
              strokeWidth="1"
            />
            {/* White flare reflection on glasses */}
            <line x1="6" y1="3" x2="11" y2="7" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="20" y1="3" x2="25" y2="7" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        )}

        {accessory === 'chef' && (
          <g transform="translate(50, 6)">
            {/* Chef hat base band */}
            <rect x="10" y="20" width="18" height="5" rx="1" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
            {/* Puffy top */}
            <path
              d="M 9 20 C 6 15, 6 9, 12 7 C 14 3, 21 3, 24 6 C 29 4, 33 10, 31 16 C 32 19, 29 21, 27 20 Z"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="1.2"
            />
            <path d="M 14 19 L 14 10" stroke="#E2E8F0" strokeWidth="1" />
            <path d="M 19 19 L 19 8" stroke="#E2E8F0" strokeWidth="1" />
            <path d="M 24 19 L 24 9" stroke="#E2E8F0" strokeWidth="1" />
          </g>
        )}

        {accessory === 'pirate' && (
          <g transform="translate(54, 14)">
            {/* Pirate Bandana with skull */}
            <path
              d="M 4 14 Q 13 8 22 13 Q 25 18 20 22 Q 12 18 3 19 Z"
              fill="#DC2626"
            />
            {/* Bandana tie knot hanging behind */}
            <path d="M 3 17 Q -2 19 -4 25 Q 1 23 4 19" fill="#B91C1C" />
            {/* White skull marker */}
            <circle cx="14" cy="15" r="2.2" fill="#FFFFFF" />
            <rect x="13.2" y="17" width="1.6" height="1" fill="#FFFFFF" />
          </g>
        )}

        {accessory === 'propeller' && (
          <g transform="translate(55, 9)">
            {/* Multi-color beanie */}
            <path d="M 5 18 C 5 11, 21 11, 21 18 Z" fill="#3B82F6" />
            <path d="M 13 11 L 13 5" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
            {/* Propeller blades */}
            <ellipse cx="7" cy="5" rx="5" ry="1.8" fill="#EF4444" transform="rotate(-15, 7, 5)" />
            <ellipse cx="19" cy="5" rx="5" ry="1.8" fill="#10B981" transform="rotate(15, 19, 5)" />
            <circle cx="13" cy="5" r="1.5" fill="#FACC15" />
          </g>
        )}

        {accessory === 'flower' && (
          <g transform="translate(56, 17)">
            {/* Pink blossom */}
            <circle cx="6" cy="6" r="3" fill="#FB7185" />
            <circle cx="12" cy="6" r="3" fill="#FB7185" />
            <circle cx="6" cy="12" r="3" fill="#FB7185" />
            <circle cx="12" cy="12" r="3" fill="#FB7185" />
            <circle cx="9" cy="9" r="2.5" fill="#FACC15" />
          </g>
        )}

        {accessory === 'headband' && (
          <g transform="translate(58, 22)">
            {/* Red athletic headband */}
            <path
              d="M 2 13 Q 10 7 18 10"
              stroke="#EF4444"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lightning bolt badge */}
            <polygon points="10,6 7,11 10,11 8,15 13,9 10,9" fill="#FDE047" />
          </g>
        )}
      </svg>
    </div>
  );
};

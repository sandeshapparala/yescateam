'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GalleryItem {
  id: number;
  color: string;
  size: 'small' | 'medium' | 'large';
  position: number; // Position from left to right (-3, -2, -1, 0, 1, 2, 3, 4)
  tag?: string;
}

// Define 8 gallery items with fixed positions and solid colors
const galleryItems: GalleryItem[] = [
  {
    id: 1,
    color: 'bg-blue-900',
    size: 'large',
    position: -3,
    tag: '1000X TREND',
  },
  {
    id: 2,
    color: 'bg-purple-900',
    size: 'medium',
    position: -2,
  },
  {
    id: 3,
    color: 'bg-indigo-700',
    size: 'small',
    position: -1,
    tag: '1000X',
  },
  {
    id: 4,
    color: 'bg-violet-800',
    size: 'small',
    position: 0,
  },
  {
    id: 5,
    color: 'bg-fuchsia-700',
    size: 'small',
    position: 1,
  },
  {
    id: 6,
    color: 'bg-pink-800',
    size: 'medium',
    position: 2,
  },
  {
    id: 7,
    color: 'bg-rose-800',
    size: 'large',
    position: 3,
    tag: '1000X',
  },
  {
    id: 8,
    color: 'bg-red-900',
    size: 'large',
    position: 4,
  },
];

const HeroGallery = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize the refs array
  useEffect(() => {
    cardsRef.current = Array(galleryItems.length).fill(null);
  }, []);

  // Set up the fixed concave 3D gallery effect
  useEffect(() => {
    if (!galleryRef.current) return;
    
    const cards = cardsRef.current.filter(Boolean);
    
    // Create the 3D concave gallery effect
    cards.forEach((card, index) => {
      if (!card) return;
      
      const item = galleryItems[index];
      
      // Calculate size based on the card's position
      let width, height;
      let rotationY = 0;
      
      switch(item.size) {
        case 'large':
          width = 320;
          height = 460;
          break;
        case 'medium':
          width = 260;
          height = 400;
          break;
        case 'small':
          width = 220;
          height = 350;
          break;
      }
      
      // Calculate position based on the fixed position value
      const position = item.position;
      
      // Calculate x position - distribute cards across the viewport
      // Use percentages of viewport width to create proper spacing
      const viewportWidth = window.innerWidth;
      const spacing = viewportWidth * 0.09; // Adjust spacing between cards
      
      // Create the curved/concave arrangement
      const xPos = position * spacing;
      
      // Create concave effect - center cards are forward, edges are pushed back
      // The calculation creates a parabolic curve with center at z=0 and edges pushed back
      const zPos = -Math.pow(Math.abs(position), 1.5) * 70;
      
      // The rotationY values create the concave effect
      // Cards at edges are rotated more to face center
      if (position < -1) rotationY = 25 + (Math.abs(position) - 1) * 5; // Left side cards face right
      else if (position > 1) rotationY = -25 - (Math.abs(position) - 1) * 5; // Right side cards face left
      else rotationY = 0; // Center cards face forward
      
      // Apply positioning and styling
      gsap.set(card, {
        width: `${width}px`,
        height: `${height}px`,
      });
      
      // Position cards with GSAP
      gsap.to(card, {
        x: xPos,
        z: zPos,
        rotationY,
        opacity: 1,
        duration: 0,
      });
    });
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-lg">
      {/* Left side statistics display */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-green-900/95 text-white px-4 py-3 rounded-lg">
          <div className="text-3xl font-bold">$53,060.04</div>
          <div className="text-green-400 text-sm">+$22,273.25 +72.35%</div>
        </div>
      </div>
      
      {/* Right side statistics display */}
      <div className="absolute top-6 right-6 z-10">
        <div className="bg-green-900/95 text-white px-4 py-3 rounded-lg">
          <div className="text-3xl font-bold">$53,060.04</div>
          <div className="text-green-400 text-sm">+$22,273.25</div>
        </div>
      </div>

      {/* Gallery container with more dramatic perspective for concave effect */}
      <div 
        ref={galleryRef}
        className="w-full h-full relative"
        style={{ 
          perspective: '800px', // Increased perspective for more dramatic concave effect
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="absolute w-full h-full flex items-center justify-center">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                if (el) {
                  cardsRef.current[index] = el;
                }
              }}
              className="absolute rounded-lg overflow-hidden shadow-xl"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
              }}
            >
              <div className="relative w-full h-full">
                {/* Card content with debugging border and fallback */}
                <div className={`absolute inset-0 flex items-center justify-center text-white ${item.color}`}>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <span className="font-bold text-xl">Card {index + 1}</span>
                    <p className="text-sm opacity-75">YESCA {new Date().getFullYear()}</p>
                  </div>
                </div>
                
                {/* Top right timestamp */}
                <div className="absolute top-3 right-3 bg-black/30 text-white px-2 py-1 rounded backdrop-blur-sm text-sm">
                  1:50
                </div>
                
                {/* Red tag */}
                {item.tag && (
                  <div className="absolute top-6 left-6 bg-red-600 text-white py-1 px-3 text-xl font-bold">
                    {item.tag}
                  </div>
                )}
                
                {/* Bottom gradient overlay for text visibility */}
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom labels */}
      <div className="absolute bottom-6 w-full flex justify-between px-20 text-gray-500 text-sm">
        <span>human-vetted</span>
        <span>viewsss</span>
        <span>AI analysed</span>
      </div>
      
      {/* Add pagination dots from reference image */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-8 h-2 bg-white rounded-full"></div>
        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
      </div>
    </div>
  );
};

export default HeroGallery;
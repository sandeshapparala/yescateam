'use client';

import Carousel3D from '../../../components/home/Carousel3D';
import UnicornBackground from '../../../components/home/unicorn/UnicornBackground';

export default function Carousel3DDemo() {
  return (
    <>
      {/* Unicorn Studio Background Component */}
      <UnicornBackground 
        blurOverlay={true} 
        overlayOpacity={0.3} 
        blueIntensity={0.6}
      />

      {/* Main content */}
      <div style={{ 
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'transparent', 
        color: 'white', 
        fontFamily: 'sans-serif',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Carousel3D />
      </div>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          background: #000;
          overflow-x: hidden;
        }
      `}</style>
    </>
  );
}
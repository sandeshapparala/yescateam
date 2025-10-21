'use client';

import { useEffect } from 'react';

// TypeScript declarations for UnicornStudio
declare global {
  interface Window {
    __unicornStudioLoaded?: boolean;
    UnicornStudio?: {
      isInitialized: boolean;
      init: () => void;
    };
  }
}

interface UnicornBackgroundProps {
  projectId?: string;
  sceneId?: string;
  blurOverlay?: boolean;
  overlayOpacity?: number;
  blueIntensity?: number;
}

export default function UnicornBackground({ 
  projectId = "uyHjeqAD3OkD10tavjsD",
  sceneId = "id-3zimblm6fyxon1vrlpff59",
  blurOverlay = true,
  overlayOpacity = 0.1,
  blueIntensity = 0.3
}: UnicornBackgroundProps) {
  useEffect(() => {
    // Initialize Unicorn Studio
    function initUnicornStudio() {
      if (!window.__unicornStudioLoaded) {
        window.__unicornStudioLoaded = true;
        window.UnicornStudio = window.UnicornStudio || { 
          isInitialized: false, 
          init: () => {} 
        };

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.25/dist/unicornStudio.umd.js";
        script.onload = initializeUnicorn;
        (document.head || document.body).appendChild(script);
      } else {
        initializeUnicorn();
      }
    }

    function initializeUnicorn() {
      if (typeof window.UnicornStudio !== "undefined" && typeof window.UnicornStudio.init === "function") {
        try {
          window.UnicornStudio.isInitialized = false;
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        } catch (err) {
          console.error("UnicornStudio initialization failed:", err);
        }
      } else {
        console.warn("UnicornStudio runtime not available yet.");
      }
    }

    initUnicornStudio();
  }, []);

  return (
    <>
      {/* Unicorn Studio Background */}
      <div className="unicorn-bg">
        <div 
          id="unicorn-root"
          data-us-project={projectId}
          data-scene-id={sceneId}
        >
          <canvas aria-label="Unicorn Studio Scene" role="img"></canvas>
        </div>
      </div>

      {/* Optional blur overlay layer */}
      {blurOverlay && (
        <div 
          className="blur-overlay"
          style={{ 
            background: `linear-gradient(135deg, 
              rgba(30, 64, 175, ${blueIntensity}), 
              rgba(59, 130, 246, ${blueIntensity * 0.7}), 
              rgba(0, 0, 0, ${overlayOpacity})
            )`,
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)'
          }}
        ></div>
      )}

      <style jsx>{`
        .unicorn-bg {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
          transform: scale(1.1);
        }
        
        .blur-overlay {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1;
          pointer-events: none;
        }
        
        #unicorn-root, #unicorn-root canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          background: transparent;
        }
      `}</style>
    </>
  );
}
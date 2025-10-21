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

interface UnicornGradientBackgroundProps {
  projectId?: string;
}

export default function UnicornGradientBackground({ 
  projectId = "GpkJ5XhbrHZIjww9A7WS"
}: UnicornGradientBackgroundProps) {
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
        script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.30/dist/unicornStudio.umd.js";
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
      {/* Unicorn Studio Gradient Background */}
      <div className="unicorn-gradient-bg">
        <div 
          data-us-project={projectId}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <style jsx>{`
        .unicorn-gradient-bg {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        
        .unicorn-gradient-bg > div {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1.2);
          min-width: 100vw;
          min-height: 100vh;
        }
      `}</style>
    </>
  );
}
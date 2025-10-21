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

interface UnicornInteractiveBackgroundProps {
  projectId?: string;
  enableInteraction?: boolean;
}

export default function UnicornInteractiveBackground({ 
  projectId = "XRAESMg9FSik4q12eOmd",
  enableInteraction = true
}: UnicornInteractiveBackgroundProps) {
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
      {/* Unicorn Studio Interactive Background */}
      <div className="unicorn-interactive-bg">
        <div 
          data-us-project={projectId}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <style jsx>{`
        .unicorn-interactive-bg {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          pointer-events: ${enableInteraction ? 'auto' : 'none'};
          overflow: hidden;
        }
        
        .unicorn-interactive-bg > div {
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
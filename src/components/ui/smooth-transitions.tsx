"use client";

import { useEffect } from "react";

export function SmoothTransitions() {
  useEffect(() => {
    // Add smooth transitions for theme changes
    const style = document.createElement("style");
    style.textContent = `
      * {
        transition: background-color 0.3s ease, 
                   border-color 0.3s ease, 
                   color 0.3s ease !important;
      }
      
      /* Smooth page transitions */
      html {
        scroll-behavior: smooth;
      }
      
      /* Reduce motion for users who prefer it */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}

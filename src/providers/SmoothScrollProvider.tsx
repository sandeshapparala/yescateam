'use client';

import { useEffect } from 'react';
import {initSmoothScroll} from "@/app/utils/smoothScroll";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize smooth scrolling
    const lenis = initSmoothScroll();

    // Cleanup on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
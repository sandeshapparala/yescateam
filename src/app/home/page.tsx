import React from 'react'
import Image from 'next/image'
import Carousel3D from '../components/Carousel3D'

const page = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-muted/50 to-background text-foreground font-[family-name:DIN_Pro,Arial,sans-serif] overflow-x-hidden transition-colors duration-300">
      <div className="flex flex-col items-center justify-center min-h-screen px-5 py-5 text-center relative lg:px-20 lg:py-5">
        {/* YESCA Logo */}
        <div className="mb-5 drop-shadow-[0_0_20px_rgba(var(--foreground)/0.3)] lg:mb-5">
          <Image
            src="/images/logo.png"
            alt="YESCA Logo"
            width={50}
            height={100}
            className="w-16 h-16 md:w-12 md:h-12 lg:w-12 lg:h-12 xl:w-12 xl:h-12 object-contain dark:invert-0 invert transition-all duration-300"
            priority
          />
        </div>
        
        {/* Organization Name */}
        <div className="text-xs font-light text-muted-foreground tracking-[3px] mb-0 uppercase opacity-100 leading-relaxed md:text-sm md:tracking-[2px] md:mb-0 lg:text-base lg:mb-0">
          YOUTH EVANGELISTIC SOLDIERS OF CHRISTIAN ASSEMBLIES
        </div>
        
        {/* Main Heading */}
        <h1 className="text-4xl font-bold text-foreground my-2 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] font-[family-name:Dancing_Script,cursive] uppercase tracking-wide md:text-5xl md:my-2 lg:text-7xl lg:my-10 xl:text-7xl">
          EMPOWERING<br />
          YOUTH IN CHRIST
        </h1>
        
        {/* 3D Carousel */}
        <div className="w-full my-8 flex justify-center items-center md:my-10 lg:my-15">
          <Carousel3D />
        </div>
        
        {/* Bottom Text */}
        <div className="mt- text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] font-[family-name:DIN_Pro_Bold,DIN_Pro,Arial,sans-serif] md:text-3xl md:mb-2 lg:text-4xl lg:mb-3">
            30 YEARS OF BUILDING
          </h2>
          <h3 className="text-2xl font-bold text-foreground m-0 uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] font-[family-name:DIN_Pro_Bold,DIN_Pro,Arial,sans-serif] md:text-3xl lg:text-4xl">
            YOUTH IN FAITH AND CHRISTIANITY
          </h3>
        </div>
      </div>
    </div>
  )
}

export default page

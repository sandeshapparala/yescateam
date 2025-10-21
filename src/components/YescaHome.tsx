'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {initSmoothScroll} from "@/app/utils/smoothScroll";

const YescaHome = () => {
  // Reference for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const scriptureRef = useRef<HTMLDivElement>(null);
  const campRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize smooth scrolling
    const lenis = initSmoothScroll();
    
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero animations
    if (heroRef.current) {
      const tl = gsap.timeline();
      tl.from('.hero-title', { 
        y: 50, 
        opacity: 0, 
        duration: 1 
      })
      .from('.hero-subtitle', { 
        y: 30, 
        opacity: 0, 
        duration: 0.8 
      }, "-=0.5")
      .from('.hero-text', { 
        y: 20, 
        opacity: 0, 
        duration: 0.8 
      }, "-=0.5")
      .from('.hero-buttons', { 
        y: 20, 
        opacity: 0, 
        duration: 0.8 
      }, "-=0.5");
    }
    
    // About section animations
    if (aboutRef.current) {
      gsap.from('.mission-card', {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          toggleActions: 'play none none none'
        }
      });
    }
    
    // Scripture animations
    if (scriptureRef.current) {
      gsap.from('.scripture-card', {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        scrollTrigger: {
          trigger: scriptureRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      });
    }
    
    // Camp section animations
    if (campRef.current) {
      gsap.from('.camp-content', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: campRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      });
      
      gsap.from('.camp-stats', {
        x: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: campRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      });
    }
    
    // Cleanup on unmount
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="font-sans flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section ref={heroRef} className="bg-primary text-primary-foreground py-20 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 hero-title">YESCA Team</h1>
            <h2 className="text-2xl md:text-3xl mb-6 hero-subtitle">Youth Evangelical Soldiers of Christian Assemblies</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto hero-text">
              Raising young believers as &ldquo;soldiers of Christ&rdquo; — strong in faith, purity, and witness since 1994.
            </p>
          </div>
          <div className="text-center hero-buttons">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-3 rounded-full mr-4 transition-colors duration-200">
              Join Youth Camp 2025
            </button>
            <button className="bg-transparent border-2 border-primary-foreground hover:bg-primary-foreground hover:text-primary text-primary-foreground font-bold px-8 py-3 rounded-full transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-16 px-4 md:px-8 bg-card transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-muted rounded-lg shadow-md mission-card transition-colors duration-300">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Faith</h3>
              <p className="text-card-foreground">Building strong foundations in biblical truth and Christian doctrine for young believers.</p>
            </div>
            <div className="text-center p-6 bg-muted rounded-lg shadow-md mission-card transition-colors duration-300">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Fellowship</h3>
              <p className="text-card-foreground">Creating meaningful connections and spiritual community among Christian youth.</p>
            </div>
            <div className="text-center p-6 bg-muted rounded-lg shadow-md mission-card transition-colors duration-300">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Witness</h3>
              <p className="text-card-foreground">Equipping young believers to share their faith and make a difference in their communities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scripture Section */}
      <section ref={scriptureRef} className="py-16 px-4 md:px-8 bg-muted transition-colors duration-300">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-primary">Our Scriptural Foundation</h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="p-8 bg-card rounded-lg shadow-md scripture-card transition-colors duration-300">
              <p className="text-xl mb-4 italic text-card-foreground">
                &ldquo;Let no one despise your youth, but be an example... in word, in conduct, in love, in spirit, in faith, in purity.&rdquo;
              </p>
              <p className="font-bold text-primary">1 Timothy 4:12</p>
            </div>
            <div className="p-8 bg-card rounded-lg shadow-md scripture-card transition-colors duration-300">
              <p className="text-xl mb-4 italic text-card-foreground">
                &ldquo;Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.&rdquo;
              </p>
              <p className="font-bold text-primary">Matthew 28:19-20</p>
            </div>
          </div>
        </div>
      </section>

      {/* Youth Camp Section */}
      <section ref={campRef} className="py-16 px-4 md:px-8 bg-primary text-primary-foreground transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">YESCA Youth Camp 2025</h2>
            <h3 className="text-xl md:text-2xl font-bold mb-2">30th Anniversary Celebration</h3>
            <p className="text-lg">Theme: Excellence (శ్రేష్ఠత)</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="camp-content">
              <h3 className="text-2xl font-bold mb-4">Join us this January!</h3>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                <li>Bible teaching and worship</li>
                <li>Fellowship with hundreds of young believers</li>
                <li>Leadership development workshops</li>
                <li>Cultural and skill activities</li>
                <li>Life-changing spiritual experiences</li>
              </ul>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-3 rounded-full transition-colors duration-200">
                Register Now
              </button>
            </div>
            <div className="bg-card text-card-foreground p-6 rounded-lg camp-stats transition-colors duration-300">
              <h4 className="text-xl font-bold mb-4">YESCA Impact</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4">
                  <p className="text-4xl font-bold text-primary">30+</p>
                  <p>Years of Ministry</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-4xl font-bold text-primary">1000+</p>
                  <p>Lives Transformed</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-4xl font-bold text-primary">800+</p>
                  <p>2024 Camp Participants</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-4xl font-bold text-primary">1994</p>
                  <p>Year Founded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">YESCA Team</h2>
            <p className="mb-6 text-muted-foreground">Youth Evangelical Soldiers of Christian Assemblies</p>
            <div className="flex justify-center space-x-4 mb-8">
              <a href="#" className="hover:text-primary text-muted-foreground transition-colors duration-200">About</a>
              <a href="#" className="hover:text-primary text-muted-foreground transition-colors duration-200">Events</a>
              <a href="#" className="hover:text-primary text-muted-foreground transition-colors duration-200">Gallery</a>
              <a href="#" className="hover:text-primary text-muted-foreground transition-colors duration-200">Resources</a>
              <a href="#" className="hover:text-primary text-muted-foreground transition-colors duration-200">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} YESCA Team. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default YescaHome;
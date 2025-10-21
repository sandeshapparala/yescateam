"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import UnicornBackground from "../home/unicorn/UnicornBackground";

const images = [
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80",
  "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80",
  "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=800&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
  "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=800&q=80",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80",
  "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80",
];

const About = () => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="w-full bg-background text-foreground relative">
                <div className="z-0">
                <UnicornBackground/>

                </div>


      <div className="font-geist flex h-screen items-center justify-center gap-2 px-8 z-100">

        <div className="absolute left-1/2 top-[5%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center max-w-4xl z-100">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">About YESCA</h2>
          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-4">
            Since 1994, Youth Evangelistic Soldiers of Christian Assemblies (YESCA) has been empowering young people to live out their faith boldly. Through annual camps, discipleship programs, and community building, we&apos;ve shaped thousands of youth into strong Christian leaders.
          </p>
          <p className="text-lg md:text-xl text-foreground leading-relaxed">
            For 30 years, we&apos;ve created a space where youth can grow spiritually, build lasting friendships, and discover their purpose in Christ. Our mission is to equip the next generation with biblical truth, authentic faith, and a passion for serving God.
          </p>
          <span className="relative mt-8 max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-foreground/20 after:to-foreground after:content-['']">
            scroll to explore
          </span>
        </div>
      </div>

      <div
        ref={gallery}
        className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-foreground p-[2vw] z-100"
      >
        <Column images={[images[0], images[1], images[2]]} y={y} />
        <Column images={[images[3], images[4], images[5]]} y={y2} />
        <Column images={[images[6], images[7], images[8]]} y={y3} />
        <Column images={[images[6], images[7], images[8]]} y={y4} />
      </div>
      <div className="font-geist relative flex h-screen items-center justify-center gap-2 px-8 z-100 bg-accent">
        <div className="absolute left-1/2 top-[20%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center max-w-3xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Join Us at YC26</h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Experience the next chapter of our journey at Youth Camp 2026. Be part of a transformative experience that has impacted generations of young believers. Register now and discover what God has in store for you.
          </p>
        </div>
      </div>
    </section>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[250px] flex-col gap-[0.5vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden ">
          <img
            src={`${src}`}
            alt="image"
            className="pointer-events-none object-cover w-full h-full"
          />
        </div>
      ))}
    </motion.div>
  );
};

export { About };

/**
 * Skiper 30 Parallax_002 — React + framer motion + lenis
 * Inspired by and adapted from https://www.siena.film/films/my-project-x
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the siena.film . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */

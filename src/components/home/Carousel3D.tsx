'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import styles from './Carousel3D.module.css';

interface CarouselImage {
  src: string;
  alt: string;
}

interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

interface SanityCard {
  image1?: SanityImage;
  text?: string;
}

interface SanityCarousel3D {
  card1?: SanityCard;
  card2?: SanityCard;
  card3?: SanityCard;
  card4?: SanityCard;
  card5?: SanityCard;
  card6?: SanityCard;
  card7?: SanityCard;
  card8?: SanityCard;
  card9?: SanityCard;
  card10?: SanityCard;
  card11?: SanityCard;
  card12?: SanityCard;
  card13?: SanityCard;
  card14?: SanityCard;
}

interface Carousel3DProps {
  images?: CarouselImage[];
  className?: string;
}

const defaultImages: CarouselImage[] = [
  {
    src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80",
    alt: "Nature Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1748382018115-cdcecf7b4b43?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Travel Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBob3RvZ3JhcGh5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
    alt: "Architecture Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1587502536575-6dfba0a6e017?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8b2NlYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80",
    alt: "Ocean Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1610128114197-485d933885c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGFuaW1hbHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80",
    alt: "Wildlife Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1756089882368-4060f412bd06?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Cityscape Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1509549649946-f1b6276d4f35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGZsb3dlcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80",
    alt: "Flower Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1543039625-14cbd3802e7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXVyb3JhJTIwYm9yZWFsaXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80",
    alt: "Aurora Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1vdW50YWluc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80",
    alt: "Mountain Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1559666126-84f389727b9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VucmlzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80",
    alt: "Sunrise Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmF0dXJlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
    alt: "Nature Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhpc3RvcmljYWwlMjBhcmNoaXRlY3R1cmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80",
    alt: "Historical Architecture"
  },
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFuZHNjYXBlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80",
    alt: "Landscape Photography"
  },
  {
    src: "https://images.unsplash.com/photo-1682687982134-2ac563b2228b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8bmlnaHQlMjBza3l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=80",
    alt: "Night Sky Photography"
  }
];

const Carousel3D: React.FC<Carousel3DProps> = ({ 
  images, 
  className = '' 
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const armsRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [sanityImages, setSanityImages] = useState<CarouselImage[]>(defaultImages);
  const [loading, setLoading] = useState(true);

  const angleStep = 30; // 30 degrees per step (360 / 12 arms)
  const totalArms = 7; // Number of arms in the carousel

  // Fetch Sanity data
  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const query = `*[_type == "carousel3d"][0] {
          card1 { image1, text },
          card2 { image1, text },
          card3 { image1, text },
          card4 { image1, text },
          card5 { image1, text },
          card6 { image1, text },
          card7 { image1, text },
          card8 { image1, text },
          card9 { image1, text },
          card10 { image1, text },
          card11 { image1, text },
          card12 { image1, text },
          card13 { image1, text },
          card14 { image1, text }
        }`;
        
        const data: SanityCarousel3D = await client.fetch(query);
        
        if (data) {
          const processedImages: CarouselImage[] = [];
          
          // Process all 14 cards
          for (let i = 1; i <= 14; i++) {
            const cardKey = `card${i}` as keyof SanityCarousel3D;
            const card = data[cardKey];
            
            if (card?.image1?.asset) {
              processedImages.push({
                src: urlFor(card.image1).width(800).height(600).url(),
                alt: card.image1.alt || card.text || `Card ${i} Image`
              });
            }
          }
          
          // If we have Sanity images, use them; otherwise keep defaults
          if (processedImages.length > 0) {
            setSanityImages(processedImages);
          }
        }
      } catch (error) {
        console.error('Error fetching carousel data:', error);
        // Keep using default images on error
      } finally {
        setLoading(false);
      }
    };

    // Use passed images prop if available, otherwise fetch from Sanity
    if (images) {
      setSanityImages(images);
      setLoading(false);
    } else {
      fetchCarouselData();
    }
  }, [images]);

  // Create arms data with perfect 1:1 image distribution (7 arms × 2 images = 14 images)
  const createArmsData = () => {
    const arms = [];
    const rotations = [90, 120, 150, 180, 0, 30, 60];
    
    for (let i = 0; i < totalArms; i++) {
      const leftImageIndex = (i * 2) % sanityImages.length;
      const rightImageIndex = (i * 2 + 1) % sanityImages.length;
      
      arms.push({
        rotation: rotations[i],
        leftImage: sanityImages[leftImageIndex],
        rightImage: sanityImages[rightImageIndex]
      });
    }
    
    return arms;
  };

  const armsData = createArmsData();

  const goToIndex = (index: number, animated = true) => {
    setCurrentIndex(index);
    const targetRotation = -index * angleStep;
    
    if (animated) {
      setCurrentRotation(targetRotation);
    }
    
    if (armsRef.current) {
      armsRef.current.style.transform = `rotateY(${targetRotation}deg)`;
    }
  };

  const handleDotClick = (index: number) => {
    goToIndex(index, true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
    
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPosition({ 
      x: e.touches[0].clientX, 
      y: e.touches[0].clientY 
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !armsRef.current) return;

      const deltaX = e.clientX - startPosition.x;
      const newRotation = currentRotation + deltaX * 0.5;
      
      setCurrentRotation(newRotation);
      armsRef.current.style.transform = `rotateY(${newRotation}deg)`;
      setStartPosition({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !armsRef.current) return;
      
      e.preventDefault();
      const deltaX = e.touches[0].clientX - startPosition.x;
      const newRotation = currentRotation + deltaX * 0.5;
      
      setCurrentRotation(newRotation);
      armsRef.current.style.transform = `rotateY(${newRotation}deg)`;
      setStartPosition({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      
      setIsDragging(false);
      
      if (carouselRef.current) {
        carouselRef.current.style.cursor = 'grab';
      }

      // Update active dot based on closest position
      let normalizedAngle = currentRotation % 360;
      if (normalizedAngle < 0) normalizedAngle += 360;

      const closestIndex = Math.round(normalizedAngle / angleStep) % totalArms;
      setCurrentIndex(closestIndex >= 0 ? closestIndex : 0);
    };

    const handleTouchEnd = () => {
      handleMouseUp();
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, startPosition, currentRotation, angleStep, totalArms]);

  useEffect(() => {
    // Initialize carousel
    goToIndex(0, false);
  }, []);

  if (loading) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.carouselContainer}>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading carousel...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className} `}>
      <div className={styles.carouselContainer}>
        <div className={styles.preserve3d}>
          <div
            ref={carouselRef}
            className={styles.carousel}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div ref={armsRef} className={styles.arms}>
              {armsData.map((arm, index) => (
                <div
                  key={index}
                  className={styles.arm}
                  style={{ transform: `rotateY(${arm.rotation}deg)` }}
                >
                  <div 
                    className={styles.videoContainer} 
                    style={{ transform: 'rotateY(90deg)' }}
                  >
                    <Image
                      src={arm.leftImage.src}
                      alt={arm.leftImage.alt}
                      width={260}
                      height={370}
                      style={{ objectFit: 'cover' }}
                      priority={index < 2}
                    />
                  </div>
                  <div 
                    className={styles.videoContainer} 
                    style={{ transform: 'rotateY(-90deg)' }}
                  >
                    <Image
                      src={arm.rightImage.src}
                      alt={arm.rightImage.alt}
                      width={260}
                      height={370}
                      style={{ objectFit: 'cover' }}
                      priority={index < 2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className={styles.navigation}>
          {Array.from({ length: totalArms }, (_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel3D;
import React, { forwardRef, useState, useCallback, useRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface PageProps {
  image?: string;
  children?: React.ReactNode;
  className?: string;
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div 
      className={`bg-white flex flex-col items-center justify-center h-full overflow-hidden will-change-transform ${props.className}`} 
      ref={ref} 
      data-density={props.image ? "soft" : "hard"}
    >
      {props.image ? (
        <img 
          src={props.image} 
          alt="Book Page" 
          className="w-full h-full object-contain block select-none pointer-events-none"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      ) : (
        props.children
      )}
    </div>
  );
});

const IMAGES = [
  "https://static.wixstatic.com/media/7fa905_374d915c0f7740b697f2fefe4a8a5647~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_9fad1efae63949cc814afde41383dc78~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_dd2d4e288c9c44d9a7f196953596ae1f~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_ae482edea3af4f839b0b7b297d9db1a9~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_858984b251bf4a6f9e1f75b417898f58~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_7cc073bf55f64b818a517a3396ac2ef0~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_4f129b58c4254906996bb5d9c21d04d2~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_f0e80a0a57c44cbb987d385f22023bb8~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_c48d19b86bd34d52bab04034e7239044~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_2a39e49c7e8647ddbf76f7c5c30feec4~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_885bbcfc843f419c80fc405b6ae9d790~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_975f105a9fcb4e9dbda9a0dfd6741ca3~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_1b78b3c434ad46d0a46b7dec9184945f~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_8bed343be7a94402a7a203ca3e0c9bd1~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_bcd8d2b723524c4381c8d96b9e195d9d~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_25ad49cbc3c1496cb7e03c0bc6017ab7~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_51122564fdd34f3b804b62581994d3ea~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_05514f00ff2a4b76b376df075dbbc339~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_6e8313f3eda14bc4968b833335b81654~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_4ec78a0c10624f65916452a86bdf9d5f~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_12af007381834c9789021242fb6d209c~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_e475413cd6594e8dac3ce7b7ef5ae622~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_645ed5c02eb84fdb8254bfd2bc1ae2a7~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_52bff60ebcaa4d0c86c6a32a26975975~mv2.jpg",
  "https://static.wixstatic.com/media/7fa905_4c34f0508c484a5891e69951cabd83a0~mv2.jpg",
];

export default function Flipbook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const bookRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  // Preload priority images first, then the rest
  useEffect(() => {
    let mounted = true;
    const preloadImages = async () => {
      const loadPromises = IMAGES.map((src, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            if (mounted) {
              setImagesLoaded((prev) => prev + 1);
            }
            resolve(true);
          };
          img.onerror = () => resolve(false);
        });
      });

      // Show the book after the first 6 pages are loaded for a quick feel
      // or after 3 seconds whichever comes first
      const criticalCount = Math.min(6, IMAGES.length);
      
      let loadedCount = 0;
      for (let i = 0; i < IMAGES.length; i++) {
        await loadPromises[i];
        loadedCount++;
        if (loadedCount >= criticalCount && !isReady) {
          setIsReady(true);
        }
      }
    };

    preloadImages();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // Preload the sound
    audioRef.current = new Audio("https://static.wixstatic.com/mp3/7fa905_0b51df9b10ec489ea68f40eb6c68d581.wav");
    audioRef.current.load();
  }, []);

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.debug("Audio play blocked", e));
    }
  }, []);

  const onPage = useCallback((e: any) => {
    setCurrentPage(e.data);
    playSound();
  }, [playSound]);

  const next = () => bookRef.current?.pageFlip().flipNext();
  const prev = () => bookRef.current?.pageFlip().flipPrev();

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 overflow-hidden py-4">
      <div className={`relative group max-w-[1300px] w-full flex justify-center perspective-[3000px] transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        {width > 0 && (
          /* @ts-ignore */
          <HTMLFlipBook
            width={isMobile ? Math.floor(width - 32) : 600}
            height={isMobile ? Math.floor((width - 32) * 1.5) : 820}
            size={isMobile ? "fixed" : "stretch"}
            minWidth={280}
            maxWidth={isMobile ? Math.floor(width) : 1400}
            minHeight={400}
            maxHeight={1800}
            drawShadow={true}
            maxShadowOpacity={0.15}
            flippingTime={1000}
            usePortrait={isMobile}
            startPage={0}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPage}
            swipeDistance={30}
            showPageCorners={false}
            disableFlipByClick={false}
            className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] mx-auto"
            ref={bookRef}
            style={{ cursor: "grab" }}
            grabbingStyle={{ cursor: "grabbing" }}
          >
            {IMAGES.map((img, i) => (
              <Page key={i} image={img} className={i === 0 || i === IMAGES.length - 1 ? "!bg-[#fafdff]" : ""} />
            ))}
          </HTMLFlipBook>
        )}

        {/* Navigation Buttons */}
        <button
          onClick={prev}
          disabled={currentPage === 0}
          className="absolute left-1 md:left-[-60px] lg:left-[-120px] top-1/2 -translate-y-1/2 p-2.5 md:p-5 rounded-full bg-black/10 md:bg-black/5 backdrop-blur-xl border border-black/5 md:border-black/10 text-slate-400 hover:text-slate-900 hover:bg-black/10 hover:scale-110 transition-all z-50 flex shadow-sm disabled:opacity-0"
        >
          <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
        </button>
        <button
          onClick={next}
          disabled={currentPage === IMAGES.length - 1}
          className="absolute right-1 md:right-[-60px] lg:right-[-120px] top-1/2 -translate-y-1/2 p-2.5 md:p-5 rounded-full bg-black/10 md:bg-black/5 backdrop-blur-xl border border-black/5 md:border-black/10 text-slate-400 hover:text-slate-900 hover:bg-black/10 hover:scale-110 transition-all z-50 flex shadow-sm disabled:opacity-0"
        >
          <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
        </button>
      </div>

    </div>
  );
}


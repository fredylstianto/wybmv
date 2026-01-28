import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarBackground from '../components/StarBackground';
import bgm from '../assets/bgm.mp3';

const ValentinePage = () => {
  // Scene control
  const [scene, setScene] = useState(0); // 0: Intro, 1: Poem, 2: Heart
  const [started, setStarted] = useState(false);

  // Background music
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Init audio
  useEffect(() => {
    audioRef.current = new Audio(bgm);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Auto-advance scenes (only after start)
  useEffect(() => {
    if (!started) return;

    if (scene === 0) {
      const timer = setTimeout(() => setScene(1), 4000);
      return () => clearTimeout(timer);
    }

    if (scene === 1) {
      const timer = setTimeout(() => setScene(2), 8000);
      return () => clearTimeout(timer);
    }
  }, [scene, started]);

  // Start button handler
  const handleStart = () => {
    audioRef.current?.play(); // allowed because user interaction
    setStarted(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-white font-['Cinzel']">
      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: started ? 1 : 0 }}
  transition={{
    duration: 1,
    ease: 'easeOut',
    delay: started ? 0.2 : 0, // sedikit jeda setelah START
  }}
  className="absolute inset-0"
>
  <StarBackground formHeart={scene === 2} />
</motion.div>


      {/* START SCREEN */}
      {!started && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <motion.button
            onClick={handleStart}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="px-10 py-4 text-lg md:text-xl tracking-widest
                       rounded-full bg-white text-black
                       hover:scale-105 transition"
          >
            START
          </motion.button>
        </div>
      )}

      {/* SCENES */}
      {started && (
        <AnimatePresence mode="wait">
          {scene === 0 && (
            <motion.section
              key="intro"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center px-4 tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                WRITTEN IN THE STARS
              </h1>
            </motion.section>
          )}

          {scene === 1 && (
            <motion.section
              key="poem"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <div className="max-w-2xl px-6 text-center space-y-4">
                <p className="text-xl md:text-2xl leading-relaxed italic text-gray-200 drop-shadow-md">
                  "Di balik malam yang sunyi dan luas,<br />
                  Melalui galaksi cahaya yang tak terbatas,<br />
                  Setiap pijar dan kilau di angkasa,<br />
                  Membimbingku pulang ke tempatmu berada."
                </p>
              </div>
            </motion.section>
          )}

          {scene === 2 && (
            <motion.section
              key="heart"
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.h2
                className="mt-8 text-3xl md:text-5xl font-bold text-center tracking-widest
                           text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2, duration: 0.8, type: 'spring' }}
              >
                WILL YOU BE MY VALENTINE, Ryy?
              </motion.h2>
            </motion.section>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ValentinePage;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarBackground from '../components/StarBackground';
import bgm from '../assets/bgm.mp3';

const ValentinePage = () => {
  const [scene, setScene] = useState(0); // 0: Intro, 1: Poem, 2: Heart
  const [started, setStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(bgm);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      audioRef.current?.pause();
    };
  }, []);

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

  const handleStart = () => {
    audioRef.current?.play();
    setStarted(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-white font-['Cinzel']">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 1 : 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: started ? 0.2 : 0 }}
        className="absolute inset-0"
      >
        <StarBackground formHeart={scene === 2} />
      </motion.div>

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

      {started && (
        <AnimatePresence mode="wait">
          {scene === 0 && (
            <motion.section
              key="intro"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.5 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center px-4 tracking-wider">
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
              <p className="text-xl md:text-2xl italic text-center px-6 leading-relaxed">
                "Di balik malam yang sunyi dan luas,<br />
                Melalui galaksi cahaya yang tak terbatas,<br />
                Setiap pijar dan kilau di angkasa,<br />
                Membimbingku pulang ke tempatmu berada."
              </p>
            </motion.section>
          )}

          {scene === 2 && (
            <motion.section
              key="heart"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.h2
                className="text-3xl md:text-5xl text-center font-bold tracking-widest px-4"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2, type: 'spring' }}
              >
                WILL YOU BE MY VALENTINE, Naya?
              </motion.h2>
            </motion.section>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ValentinePage;

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  targetX?: number;
  targetY?: number;
}

interface Props {
  formHeart: boolean;
}

const StarBackground = ({ formHeart }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);
  const formHeartRef = useRef(formHeart);

  const updateHeartTargets = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const min = Math.min(canvas.width, canvas.height);
    const isPortrait = canvas.height > canvas.width;
    const scale = (min * (isPortrait ? 0.75 : 0.9)) / 32;

    starsRef.current.forEach((star, i) => {
      const t = (i / starsRef.current.length) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y =
        -(13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t));

      star.targetX = cx + x * scale;
      star.targetY = cy + y * scale;
    });
  };

  useEffect(() => {
    formHeartRef.current = formHeart;
    if (formHeart) updateHeartTargets();
    else {
      starsRef.current.forEach(s => {
        s.targetX = undefined;
        s.targetY = undefined;
      });
    }
  }, [formHeart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initStars = (force = false) => {
      if (starsRef.current.length && !force) return;

      const area = canvas.width * canvas.height;
      const count = Math.floor(area / 8000);
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random()
      }));
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars(true);
      if (formHeartRef.current) updateHeartTargets();
    };

    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();

        if (formHeartRef.current && star.targetX) {
          star.x += (star.targetX - star.x) * 0.02;
          star.y += (star.targetY! - star.y) * 0.02;
        } else {
          star.x += star.vx;
          star.y += star.vy;
          if (star.x < 0) star.x = canvas.width;
          if (star.x > canvas.width) star.x = 0;
          if (star.y < 0) star.y = canvas.height;
          if (star.y > canvas.height) star.y = 0;
        }

        star.alpha += (Math.random() - 0.5) * 0.02;
        star.alpha = Math.min(1, Math.max(0.1, star.alpha));
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};

export default StarBackground;

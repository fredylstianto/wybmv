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

interface StarBackgroundProps {
  formHeart: boolean;
}

const StarBackground = ({ formHeart }: StarBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>(0);
  const formHeartRef = useRef(formHeart);

  useEffect(() => {
    formHeartRef.current = formHeart;
    
    if (formHeart && canvasRef.current) {
      const canvas = canvasRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const screenMin = Math.min(canvas.width, canvas.height);
      const scale = (screenMin * 0.85) / 32;
      
      starsRef.current.forEach((star, i) => {
        const t = (i / starsRef.current.length) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

        star.targetX = centerX + x * scale;
        star.targetY = centerY + y * scale;
      });
    } else {
      starsRef.current.forEach(star => {
        star.targetX = undefined;
        star.targetY = undefined;
      });
    }
  }, [formHeart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      if (starsRef.current.length > 0) return;

      const numStars = Math.max(150, Math.floor((canvas.width * canvas.height) / 5000));
      
      const newStars: Star[] = [];
      for (let i = 0; i < numStars; i++) {
        newStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          alpha: Math.random()
        });
      }
      starsRef.current = newStars;
    };

    const draw = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const isFormingHeart = formHeartRef.current;

      if (isFormingHeart) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        
        const stars = starsRef.current;
        const len = stars.length;

        for (let i = 0; i < len; i++) {
          const star = stars[i];
          
          // 1. Perimeter connections (neighbors)
          const next = stars[(i + 1) % len];
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(next.x, next.y);

          // 2. Interior "Tangled" connections
          // Reduced density: Connect to fewer points
          // Only connect every 2nd star to one other point
          if (i % 2 === 0) {
             const otherIdx = (i + Math.floor(len * 0.5)) % len;
             const other = stars[otherIdx];
             ctx.moveTo(star.x, star.y);
             ctx.lineTo(other.x, other.y);
          }
          
          // Add a few random extra lines for "chaos" but very sparse
          if (i % 10 === 0) {
             const otherIdx = (i + Math.floor(len * 0.33)) % len;
             const other = stars[otherIdx];
             ctx.moveTo(star.x, star.y);
             ctx.lineTo(other.x, other.y);
          }
        }
        ctx.stroke();
      }

      starsRef.current.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        if (isFormingHeart && star.targetX !== undefined && star.targetY !== undefined) {
          const dx = star.targetX - star.x;
          const dy = star.targetY - star.y;
          
          star.x += dx * 0.02; 
          star.y += dy * 0.02;
          
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
             star.x += (Math.random() - 0.5) * 0.5;
             star.y += (Math.random() - 0.5) * 0.5;
          }
        } else {
          star.x += star.vx;
          star.y += star.vy;

          if (star.x < 0) star.x = canvas.width;
          if (star.x > canvas.width) star.x = 0;
          if (star.y < 0) star.y = canvas.height;
          if (star.y > canvas.height) star.y = 0;
        }

        star.alpha += (Math.random() - 0.5) * 0.02;
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 1) star.alpha = 1;
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 transition-colors duration-1000"
      id="StarCanvas"
    />
  );
};

export default StarBackground;

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxScrollProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
  speed?: number; // Positive for faster, negative for slower/reverse
}

export default function ParallaxScroll({ 
  children, 
  offset = 50, 
  className = '', 
  speed = 0.5 
}: ParallaxScrollProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 300, damping: 30, restDelta: 0.001 };
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [-offset * speed, offset * speed]),
    springConfig
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

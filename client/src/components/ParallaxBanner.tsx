import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBannerProps {
  image: string;
  title: string;
  subtitle?: string;
  height?: string;
}

export default function ParallaxBanner({ image, title, subtitle, height = "h-[600px]" }: ParallaxBannerProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={containerRef} className={`relative ${height} overflow-hidden flex items-center justify-center my-24`}>
      {/* Parallax Background */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={image} 
          alt={title} 
          className="w-full h-[140%] object-cover"
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 text-center px-6"
      >
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[#FDF3DC] font-black text-[12px] uppercase tracking-[0.5em] mb-6"
        >
          {subtitle || "Exquisite Experience"}
        </motion.p>
        <h2 className="text-6xl md:text-8xl font-display font-black text-white leading-none tracking-tighter mb-8">
          {title}
        </h2>
        <div className="w-24 h-1 bg-[#B8892A] mx-auto rounded-full" />
      </motion.div>

      {/* Decorative Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#FDFAF5] via-transparent to-[#FDFAF5]" />
    </div>
  );
}

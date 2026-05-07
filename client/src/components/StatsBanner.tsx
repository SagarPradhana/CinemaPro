import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const stats = [
  { label: 'Premier Titles', value: 2500, emoji: '🎬' },
  { label: 'Studio Artists', value: 850, emoji: '🎭' },
  { label: 'Global Viewers', value: 450000, emoji: '🌍' },
  { label: 'Awards Won', value: 120, emoji: '🏆' },
];

function CountUp({ end }: { end: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const timer = setInterval(() => {
        start += Math.ceil(end / 100);
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function StatsBanner() {
  return (
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, borderColor: '#B8892A' } as any}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative bg-white border border-[#E8DDD0] rounded-[24px] p-10 flex flex-col items-center justify-center text-center group overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <span className="text-3xl mb-6 grayscale group-hover:grayscale-0 transition-all">{stat.emoji}</span>
            <div className="text-5xl font-display font-black text-[#1A1510] mb-4">
              <CountUp end={stat.value} />{stat.value > 100000 ? '+' : ''}
            </div>
            <span className="text-[#8A7A65] text-[11px] font-black uppercase tracking-[0.3em] opacity-60">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

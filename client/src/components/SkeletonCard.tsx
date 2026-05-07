import { motion } from 'framer-motion';

export default function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-white/5">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      </div>
      <div className="h-4 w-3/4 rounded bg-white/5" />
      <div className="h-3 w-1/2 rounded bg-white/5" />
    </div>
  );
}

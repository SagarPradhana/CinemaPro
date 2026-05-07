import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionRowProps {
  title: string;
  genre?: string;
  items: any[];
  viewAllLink: string;
  children: React.ReactNode;
}

export default function SectionRow({ title, genre, items, viewAllLink, children }: SectionRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-16">
          <div className="relative">
            <div className="absolute left-[-48px] top-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-[#B8892A] to-transparent" />
            {genre && (
              <span className="text-[#B8892A] text-[10px] font-black tracking-[0.4em] uppercase mb-4 block">
                {genre}
              </span>
            )}
            <h2 className="text-5xl lg:text-6xl font-display font-black text-[#1A1510] leading-none tracking-tighter">
              {title}
            </h2>
          </div>
          <Link
            to={viewAllLink}
            className="flex items-center gap-3 text-[#8A7A65] font-black text-[11px] uppercase tracking-[0.25em] hover:text-[#B8892A] transition-all group border-b-2 border-transparent hover:border-[#B8892A] pb-2"
          >
            Explore Masterpieces
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
}

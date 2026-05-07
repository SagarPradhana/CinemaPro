import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Film, Music, Tv, BookOpen, Home, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/movies', label: 'Movies', icon: Film },
  { path: '/music', label: 'Music', icon: Music },
  { path: '/music-videos', label: 'Videos', icon: Tv },
  { path: '/series', label: 'Series', icon: Tv },
  { path: '/dramas', label: 'Dramas', icon: Tv },
  { path: '/comics', label: 'Comics', icon: BookOpen },
  { path: '/studio', label: 'Studio', icon: Heart },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFAF5]/85 backdrop-blur-[20px] border-b border-[#E8DDD0] transition-all duration-500">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-16">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.span 
              whileHover={{ scale: 1.05, rotate: [-1, 1, -1] }}
              transition={{ duration: 0.3 }}
              className="text-[26px] font-display font-bold tracking-tighter"
            >
              <span className="text-[#1A1510]">Cinema</span>
              <span className="text-[#B8892A]">Pro</span>
            </motion.span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  whileHover={{ y: -4, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'relative px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 block',
                      isActive
                        ? 'bg-[#1A1510] text-white shadow-xl'
                        : 'text-[#8A7A65] hover:bg-[#F5F0E8] hover:text-[#1A1510]'
                    )}
                  >
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <form onSubmit={handleSearch} className="relative hidden xl:block">
            <div className="relative group">
              <Input
                type="search"
                placeholder="Search masterpieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-[260px] bg-[#F5F0E8] border-[#EDE6D8] rounded-full pl-10 focus:w-[300px] focus:bg-white focus:border-[#B8892A] transition-all duration-500 text-[#1A1510] font-medium placeholder:text-[#8A7A65]/60"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A7A65] group-focus-within:text-[#B8892A] transition-colors" />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <Link to="/admin" className="hidden sm:block">
              <Button className="h-11 px-8 rounded-full bg-gradient-to-r from-[#B8892A] to-[#D4A845] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#B8892A]/20 hover:scale-105 active:scale-95 transition-all">
                Studio Login
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden w-11 h-11 rounded-full bg-[#F5F0E8] text-[#1A1510]"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-[#FDFAF5] border-b border-[#E8DDD0] lg:hidden overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-2xl px-8 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all',
                    location.pathname === item.path
                      ? 'bg-[#1A1510] text-white'
                      : 'text-[#8A7A65] hover:bg-[#F5F0E8]'
                  )}
                >
                  {item.label}
                  <item.icon className="h-4 w-4 opacity-40" />
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
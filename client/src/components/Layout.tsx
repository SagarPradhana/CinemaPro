import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import LiveBackground from './LiveBackground';
import ScrollToTop from './ScrollToTop';
import MediaPlayer from './MediaPlayer';

export default function Layout() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFAF5] text-[#1A1510] selection:bg-[#B8892A]/10 selection:text-[#B8892A] mesh-gradient relative">
      <LiveBackground />
      <ScrollToTop />
      <Navbar />
      <main className="relative z-10 pt-10">
        <Outlet />
      </main>
      <MediaPlayer />
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1A1510] pt-32 pb-20 overflow-hidden relative border-t border-[#3D3020]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[32px] font-display font-bold mb-8 tracking-tighter">
              <span className="text-white">Cinema</span>
              <span className="text-[#B8892A]">Pro</span>
            </h3>
            <p className="text-white/40 max-w-md leading-[1.8] text-lg font-medium italic">
              "Crafting the future of digital entertainment through cinematic excellence and immersive audio-visual storytelling."
            </p>
          </div>
          <div>
            <h4 className="font-black mb-8 uppercase text-[11px] tracking-[0.25em] text-[#B8892A]">Explore</h4>
            <div className="flex flex-col gap-4">
              {['Movies', 'Music', 'Series', 'Dramas'].map((item) => (
                <a key={item} href="#" className="text-sm font-bold text-white/30 hover:text-[#F2C96A] transition-all hover:translate-x-1 inline-block">
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-black mb-8 uppercase text-[11px] tracking-[0.25em] text-[#B8892A]">Company</h4>
            <div className="flex flex-col gap-4">
              {['Privacy', 'Legal', 'Contact', 'Careers'].map((item) => (
                <a key={item} href="#" className="text-sm font-bold text-white/30 hover:text-[#F2C96A] transition-all hover:translate-x-1 inline-block">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          <p>© 2024 Cinema Pro Architecture. All rights reserved.</p>
          <div className="flex gap-10">
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-white cursor-pointer transition-colors">Dribbble</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
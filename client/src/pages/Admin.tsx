import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Music2, Tv, BookOpen, Settings, Plus, Edit, Trash2, LogOut, ChevronRight, LayoutDashboard, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toaster';
import { getAdminHeaders } from '@/lib/api';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { seedDemoData } from '@/lib/seedData';
import { Sparkles } from 'lucide-react';

type Category = 'movies' | 'music' | 'music-videos' | 'series' | 'comics';

const adminCategories = [
  { key: 'movies', label: 'Movies', icon: Film, color: '#B8892A' },
  { key: 'music', label: 'Music', icon: Music2, color: '#C94070' },
  { key: 'music-videos', label: 'Music Videos', icon: Tv, color: '#C94070' },
  { key: 'series', label: 'Series & Anime', icon: Tv, color: '#5B3FD4' },
  { key: 'comics', label: 'Comics & Scripts', icon: BookOpen, color: '#3D3020' },
];

export default function Admin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminPassword'));
  const [activeCategory, setActiveCategory] = useState<Category>('movies');
  const [items, setItems] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<unknown | null>(null);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('adminPassword', password);
      setIsAuthenticated(true);
      toast('Welcome back, Curator', 'success');
    } else {
      toast('Access Denied', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminPassword');
    setIsAuthenticated(false);
    navigate('/');
  };

  const fetchItems = async (category: Category) => {
    setLoading(true);
    try {
      const endpoint = category === 'series' ? '/api/v1/series' : category === 'comics' ? '/api/v1/comics' : category === 'music-videos' ? '/api/v1/music-videos' : `/api/v1/${category}`;
      const response = await axios.get(endpoint, { params: { limit: 50 } });
      setItems(response.data.data || []);
    } catch {
      toast('Collection sync failed', 'error');
    }
    setLoading(false);
  };

  const handleImageUpload = async (file: File, fieldName: string) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      toast('Uploading masterpiece...', 'warning');
      const response = await axios.post('/api/v1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = response.data.url;
      // Update the input field directly
      const input = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
      if (input) input.value = url;
      toast('Upload successful', 'success');
    } catch {
      toast('Upload failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanent deletion. Proceed?')) return;
    try {
      const endpoint = activeCategory === 'series' ? `/api/v1/series/${id}` : activeCategory === 'comics' ? `/api/v1/comics/${id}` : `/api/v1/${activeCategory}/${id}`;
      await axios.delete(endpoint, { headers: getAdminHeaders() });
      toast('Removed from gallery', 'success');
      fetchItems(activeCategory);
    } catch {
      toast('Removal failed', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-[#B8892A]/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-[#C94070]/5 blur-[100px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/80 backdrop-blur-2xl p-12 rounded-[40px] shadow-2xl border border-white">
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-[#1A1510] rounded-2xl flex items-center justify-center shadow-xl mb-6">
                <Settings className="text-[#B8892A] h-8 w-8" />
              </div>
              <h1 className="text-3xl font-display font-black text-[#1A1510] uppercase tracking-tighter">Vault Access</h1>
              <p className="text-[#8A7A65] text-[10px] font-black uppercase tracking-[0.2em] mt-2">Curators Only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Encryption Key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 bg-[#F5F0E8] border-none rounded-2xl px-6 focus:ring-2 ring-[#B8892A]/20"
                />
              </div>
              <Button type="submit" className="w-full h-14 bg-[#1A1510] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                Authenticate
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {
      title: formData.get('title'),
      artist: formData.get('artist'),
      genre: (formData.get('genre') as string).split(',').map(g => g.trim()),
      description: formData.get('description'),
      posterImage: formData.get('posterImage'),
      backdropImage: formData.get('backdropImage'),
      movieLink: formData.get('movieLink'),
      videoLink: formData.get('videoLink'),
      musicLink: formData.get('musicLink'),
      mangaDexId: formData.get('mangaDexId'),
      type: formData.get('type'),
      author: formData.get('author'),
      releaseYear: formData.get('releaseYear'),
      status: formData.get('status'),
      views: formData.get('views'),
      isLatest: formData.get('isLatest') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
    };

    // Mapping for Comics
    if (activeCategory === 'comics') {
      data.coverImage = data.posterImage;
    }

    try {
      const endpoint = activeCategory === 'series' ? '/api/v1/series' : activeCategory === 'comics' ? '/api/v1/comics' : activeCategory === 'music-videos' ? '/api/v1/music-videos' : `/api/v1/${activeCategory}`;
      if (editingItem) {
        await axios.put(`${endpoint}/${(editingItem as any)._id}`, data, { headers: getAdminHeaders() });
        toast('Masterpiece Updated', 'success');
      } else {
        await axios.post(endpoint, data, { headers: getAdminHeaders() });
        toast('Creation Success', 'success');
      }
      setShowForm(false);
      setEditingItem(null);
      fetchItems(activeCategory);
    } catch (error) {
      toast('Operation failed', 'error');
      console.error(error);
    }
  };

  const handleSeedData = async () => {
    if (!window.confirm('This will seed the library with high-quality demo data. Proceed?')) return;
    setLoading(true);
    try {
      await seedDemoData();
      toast('Library Synchronized with Demo Data', 'success');
      fetchItems(activeCategory);
    } catch {
      toast('Synchronization failed', 'error');
    }
    setLoading(false);
  };

  const handleExternalSync = async () => {
    let endpoint = '';
    let label = '';
    let needsQuery = false;

    if (activeCategory === 'comics') {
      endpoint = '/api/v1/comics/sync/mangadex';
      label = 'MangaDex';
    } else if (activeCategory === 'movies') {
      const choice = window.prompt('Sync from: 1. TVMaze (Key-less / Search), 2. TMDB (Needs Key)', '1');
      if (choice === '1') {
        endpoint = '/api/v1/movies/sync/tvmaze';
        label = 'TVMaze Movies';
        needsQuery = true;
      } else if (choice === '2') {
        endpoint = '/api/v1/movies/sync/tmdb';
        label = 'TMDB Movies';
      } else return;
    } else if (activeCategory === 'series') {
      // Allow choosing between TMDB and TVMaze/Jikan
      const choice = window.prompt('Sync from: 1. TMDB (Trending), 2. TVMaze (Search), 3. Jikan/MAL (Anime Search)', '1');
      if (choice === '1') {
        endpoint = '/api/v1/series/sync/tmdb';
        label = 'TMDB Series';
      } else if (choice === '2') {
        endpoint = '/api/v1/series/sync/tvmaze';
        label = 'TVMaze';
        needsQuery = true;
      } else if (choice === '3') {
        endpoint = '/api/v1/series/sync/jikan';
        label = 'Jikan Anime';
        needsQuery = true;
      } else return;
    } else if (activeCategory === 'music') {
      const choice = window.prompt('Sync from: 1. iTunes (Trending), 2. Deezer (Search)', '1');
      if (choice === '1') {
        endpoint = '/api/v1/music/sync/itunes';
        label = 'iTunes Music';
      } else if (choice === '2') {
        endpoint = '/api/v1/music/sync/deezer';
        label = 'Deezer';
        needsQuery = true;
      } else return;
    } else if (activeCategory === 'music-videos') {
      const choice = window.prompt('Sync from: 1. iTunes (Trending), 2. Piped/YouTube (Search)', '1');
      if (choice === '1') {
        endpoint = '/api/v1/music-videos/sync/itunes';
        label = 'iTunes Music Videos';
      } else if (choice === '2') {
        endpoint = '/api/v1/music-videos/sync/piped';
        label = 'Piped Video';
        needsQuery = true;
      } else return;
    }

    let q = '';
    if (needsQuery) {
      q = window.prompt(`Enter search query for ${label}:`, '') || '';
      if (!q) return;
    }

    if (!window.confirm(`Sync content from ${label}? This will auto-fetch and populate your database.`)) return;
    
    setLoading(true);
    try {
      const response = await axios.post(endpoint, {}, { 
        params: { q, term: q }, // Handle both 'q' and 'term' params
        headers: getAdminHeaders() 
      });
      const syncedCount = response.data.count || 0;
      const sampleItems = response.data.syncedItems?.join(', ') || '';
      
      toast(
        `${label} Sync Complete: ${syncedCount} items ${sampleItems ? `(${sampleItems}...)` : ''}`, 
        'success'
      );
      fetchItems(activeCategory);
    } catch {
      toast(`${label} Sync Failed`, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      {/* Header Section - Reduced Space */}
      <div className="bg-white border-b border-[#E8DDD0] pt-20 pb-8 relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#B8892A]/10 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-[#B8892A]" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-black text-[#1A1510] uppercase tracking-tighter">Curator Suite</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65]">Active Session</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F0E8] border border-[#E8DDD0]">
                <span className="w-2 h-2 rounded-full bg-[#B8892A]" />
                <span className="text-[10px] font-bold text-[#1A1510] uppercase tracking-widest">Admin Access</span>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="rounded-full h-12 px-6 text-[#C94070] font-black uppercase text-[10px] tracking-widest hover:bg-[#FDE8EF]">
                <LogOut className="h-4 w-4 mr-2" />Secure Exit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Nav */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8A7A65] mb-6 px-4">Galleries</p>
            {adminCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key as Category); setShowForm(false); fetchItems(cat.key as Category); }}
                className={cn(
                  "w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 border group",
                  activeCategory === cat.key
                    ? "bg-[#1A1510] border-[#1A1510] text-white shadow-xl"
                    : "bg-white border-[#E8DDD0] text-[#8A7A65] hover:border-[#B8892A] hover:bg-[#FDF3DC]/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    activeCategory === cat.key ? "bg-white/10" : "bg-[#F5F0E8]"
                  )}>
                    <cat.icon className={cn("h-4 w-4", activeCategory === cat.key ? "text-white" : "text-[#B8892A]")} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">{cat.label}</span>
                </div>
                <ChevronRight className={cn("h-4 w-4 transition-transform", activeCategory === cat.key ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0")} />
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div>
            <div className="mb-12 flex items-end justify-between border-b border-[#E8DDD0] pb-8">
              <div>
                <h2 className="text-4xl font-display font-black text-[#1A1510] capitalize tracking-tighter mb-2">{activeCategory} Inventory</h2>
                <p className="text-[#8A7A65] text-xs font-medium uppercase tracking-[0.1em]">Manage and curate your exhibition</p>
              </div>
              <div className="flex items-center gap-4">
                  <Button 
                    onClick={handleExternalSync}
                    variant="outline"
                    className="h-14 px-8 rounded-2xl border-2 border-violet-200 text-violet-600 font-black uppercase text-[10px] tracking-widest hover:bg-violet-600 hover:text-white transition-all gap-3"
                  >
                    <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
                    Auto-Sync Platform
                  </Button>
              <Button 
                onClick={handleSeedData}
                variant="outline"
                className="h-14 px-8 rounded-2xl border-2 border-[#B8892A]/30 text-[#B8892A] font-black uppercase text-[10px] tracking-widest hover:bg-[#B8892A] hover:text-white transition-all gap-3"
              >
                <Sparkles className="h-4 w-4" />
                Seed Demo Library
              </Button>
              <Button onClick={() => { setShowForm(true); setEditingItem(null); }} className="h-14 px-10 rounded-2xl bg-[#1A1510] text-white font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all gap-4">
                <Plus className="h-5 w-5" />Register Asset
              </Button>
            </div>
            </div>

            {loading ? (
              <div className="py-40 flex flex-col items-center justify-center opacity-30">
                <div className="w-12 h-12 border-4 border-[#B8892A] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1A1510]">Scanning Archive...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="py-40 text-center bg-white/40 border-2 border-dashed border-[#E8DDD0] rounded-[40px]">
                <LayoutDashboard className="mx-auto h-16 w-16 text-[#E8DDD0] mb-6" />
                <h3 className="text-2xl font-display font-black text-[#1A1510]">Gallery Vacant</h3>
                <p className="text-[#8A7A65] text-xs font-black uppercase tracking-widest mt-2">Initialize your first masterpiece</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item: any) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={item._id}
                    className="group bg-white rounded-3xl border border-[#E8DDD0] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-[#B8892A]/30"
                  >
                    <div className="aspect-video relative overflow-hidden bg-[#F5F0E8]">
                      {(item.posterImage || item.coverImage) ? (
                        <img src={item.posterImage || item.coverImage} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center"><Film className="h-10 w-10 text-[#B8892A]/10" /></div>
                      )}
                      <div className="absolute top-4 right-4 flex gap-2">
                        {item.isFeatured && <Badge className="bg-[#B8892A] text-white border-none text-[8px] font-black uppercase px-2 py-1">Top</Badge>}
                        {item.isLatest && <Badge className="bg-[#5B3FD4] text-white border-none text-[8px] font-black uppercase px-2 py-1">New</Badge>}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-sm font-black text-[#1A1510] truncate uppercase tracking-tight">{item.title}</h3>
                      <p className="text-[10px] font-bold text-[#8A7A65] mt-1 uppercase tracking-widest">{item.genre?.[0] || 'Uncategorized'}</p>

                      <div className="mt-6 flex gap-2">
                        <button
                          onClick={() => { setEditingItem(item); setShowForm(true); }}
                          className="flex-1 h-11 bg-[#F5F0E8] text-[#1A1510] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B8892A] hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Edit className="h-3 w-3" />Modify
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="w-11 h-11 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Dialog Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#1A1510]/60 backdrop-blur-xl" onClick={() => setShowForm(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-[#FDFAF5] rounded-[40px] shadow-3xl relative z-10 overflow-hidden"
          >
            <div className="bg-[#1A1510] p-8 text-white flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display font-black uppercase tracking-tighter">{editingItem ? 'Edit' : 'Register'} {activeCategory}</h3>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mt-1">Archive Entry Form</p>
              </div>
              <Settings className="text-[#B8892A] h-8 w-8 opacity-20" />
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-10 space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Display Title</label>
                  <Input name="title" placeholder="Manifesto Title" defaultValue={(editingItem as any)?.title || ''} required className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4" />
                </div>
                {(activeCategory === 'music' || activeCategory === 'music-videos') ? (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Artist</label>
                    <Input name="artist" placeholder="Artist Name" defaultValue={(editingItem as any)?.artist || ''} required className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Genre Classification</label>
                    <Input name="genre" placeholder="Action, Drama, Noir" defaultValue={(editingItem as any)?.genre?.join(', ') || ''} className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4" />
                  </div>
                )}
              </div>

              {(activeCategory === 'series' || activeCategory === 'comics') && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Classification Type</label>
                  <select 
                    name="type" 
                    defaultValue={(editingItem as any)?.type || (activeCategory === 'series' ? 'series' : 'comic')} 
                    className="w-full h-12 bg-white border border-[#E8DDD0] rounded-xl px-4 text-sm focus:ring-1 ring-[#B8892A]"
                  >
                    {activeCategory === 'series' ? (
                      <>
                        <option value="series">Western Series</option>
                        <option value="drama">Asian Drama</option>
                        <option value="anime">Anime Mastery</option>
                      </>
                    ) : (
                      <>
                        <option value="comic">Graphic Novel</option>
                        <option value="manga">Manga</option>
                        <option value="manhwa">Manhwa</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              {activeCategory === 'comics' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Author</label>
                    <Input name="author" placeholder="Author Name" defaultValue={(editingItem as any)?.author || ''} className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Release Year</label>
                    <Input name="releaseYear" placeholder="2024" defaultValue={(editingItem as any)?.releaseYear || ''} className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Status</label>
                    <Input name="status" placeholder="Ongoing/Completed" defaultValue={(editingItem as any)?.status || ''} className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Views</label>
                    <Input name="views" placeholder="1.2M" defaultValue={(editingItem as any)?.views || ''} className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4" />
                  </div>
                </div>
              )}

              {(activeCategory === 'music' || activeCategory === 'music-videos') && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Genre Classification</label>
                  <Input name="genre" placeholder="Pop, Rock, Jazz" defaultValue={(editingItem as any)?.genre?.join(', ') || ''} className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4" />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">
                    {activeCategory === 'music' ? 'Audio Link' : activeCategory === 'music-videos' ? 'Video Link' : 'Stream Link'}
                  </label>
                  <Input 
                    name={activeCategory === 'music' ? 'musicLink' : activeCategory === 'music-videos' ? 'videoLink' : 'movieLink'} 
                    placeholder="URL" 
                    defaultValue={(editingItem as any)?.musicLink || (editingItem as any)?.videoLink || (editingItem as any)?.movieLink || ''} 
                    className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">MangaDex ID (Optional)</label>
                  <Input name="mangaDexId" placeholder="e.g. f9e2945a-..." defaultValue={(editingItem as any)?.mangaDexId || ''} className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Editorial Synopsis</label>
                <textarea name="description" placeholder="A brief artistic summary..." defaultValue={(editingItem as any)?.description || ''} className="w-full h-32 bg-white border-[#E8DDD0] rounded-2xl p-4 text-sm focus:ring-1 ring-[#B8892A]" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Poster Visual (URL)</label>
                  <div className="flex gap-2">
                    <Input name="posterImage" placeholder="https://..." defaultValue={(editingItem as any)?.posterImage || ''} className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4 flex-1" />
                    <label className="h-12 w-12 bg-[#B8892A]/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#B8892A]/20 transition-all">
                      <Plus className="h-5 w-5 text-[#B8892A]" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'posterImage')} />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A65] ml-2">Backdrop Visual (URL)</label>
                  <div className="flex gap-2">
                    <Input name="backdropImage" placeholder="https://..." defaultValue={(editingItem as any)?.backdropImage || ''} className="h-12 bg-white border-[#E8DDD0] rounded-xl px-4 flex-1" />
                    <label className="h-12 w-12 bg-[#B8892A]/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#B8892A]/20 transition-all">
                      <Plus className="h-5 w-5 text-[#B8892A]" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'backdropImage')} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 py-4 bg-white/50 rounded-2xl px-6 border border-white">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-md border-[#E8DDD0] text-[#B8892A] focus:ring-[#B8892A]" name="isLatest" defaultChecked={(editingItem as any)?.isLatest || false} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1510] group-hover:text-[#B8892A] transition-colors">Latest Edition</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-md border-[#E8DDD0] text-[#B8892A] focus:ring-[#B8892A]" name="isFeatured" defaultChecked={(editingItem as any)?.isFeatured || false} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1510] group-hover:text-[#B8892A] transition-colors">Curator's Choice</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 h-14 bg-[#1A1510] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] transition-all">
                  {editingItem ? 'Finalize Changes' : 'Initialize Registry'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="h-14 px-8 rounded-2xl border border-[#E8DDD0] text-[#8A7A65] font-black uppercase text-[10px] tracking-widest">
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  MessageCircle, 
  Gift, 
  Shirt, 
  Footprints, 
  Sparkles, 
  Palette, 
  User, 
  Settings,
  ChevronRight,
  Clock,
  Music,
  Image as ImageIcon,
  Send,
  Trash2,
  Check,
  Plus,
  Play,
  CheckCircle2,
  Book,
  Heart
} from 'lucide-react';
import { AppConfig, Message, GalleryItem, MusicSuggestion } from './types';

// --- Components ---

const MessageWall = ({ messages, onSendMessage }: { messages: Message[], onSendMessage: (name: string, content: string) => void }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && content) {
      onSendMessage(name, content);
      setName('');
      setContent('');
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-[#450a0a]/60 p-6 rounded-2xl gold-border space-y-4">
        <h3 className="font-display text-xl gold-text flex items-center gap-2">
          <MessageCircle size={20} /> Deixe sua mensagem
        </h3>
        <input 
          type="text" 
          placeholder="Seu nome" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none"
        />
        <textarea 
          placeholder="Sua mensagem de feliz aniversário..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-[#D4AF37] outline-none h-24"
        />
        <button type="submit" className="w-full hollywood-btn flex items-center justify-center gap-2">
          <Send size={18} /> Enviar Mensagem
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={msg.id} 
            className="bg-[#450a0a]/40 p-5 rounded-xl border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />
            <p className="font-bold text-[#D4AF37] mb-1">{msg.name}</p>
            <p className="text-white/80 text-sm italic">"{msg.content}"</p>
            <p className="text-[10px] text-white/30 mt-3 uppercase tracking-widest">
              {new Date(msg.created_at).toLocaleDateString('pt-BR')}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Gallery = ({ items }: { items: GalleryItem[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <motion.div 
          layout
          key={item.id} 
          className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-[#450a0a]"
        >
          {item.type === 'image' ? (
            <img src={item.url} alt={item.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full relative">
              <video className="w-full h-full object-cover">
                <source src={item.url} type="video/mp4" />
              </video>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Play className="text-[#D4AF37]" size={48} />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-sm font-medium">{item.caption}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const MusicSection = ({ suggestions, onSuggest }: { suggestions: MusicSuggestion[], onSuggest: (song: string, artist: string, name: string) => void }) => {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (song && artist && name) {
      onSuggest(song, artist, name);
      setSong('');
      setArtist('');
      setName('');
    }
  };

  const approvedSongs = suggestions.filter(s => s.approved === 1);

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-[#450a0a]/60 p-6 rounded-2xl gold-border space-y-4">
        <h3 className="font-display text-xl gold-text flex items-center gap-2">
          <Music size={20} /> Sugerir Música
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nome da música" value={song} onChange={(e) => setSong(e.target.value)} className="bg-black border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-[#D4AF37]" />
          <input type="text" placeholder="Artista" value={artist} onChange={(e) => setArtist(e.target.value)} className="bg-black border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-[#D4AF37]" />
        </div>
        <input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-[#D4AF37]" />
        <button type="submit" className="w-full hollywood-btn">Sugerir</button>
      </form>

      <div className="space-y-4">
        <h4 className="text-sm uppercase tracking-[0.3em] text-white/40 text-center">Playlist Sugerida</h4>
        <div className="grid grid-cols-1 gap-2">
          {approvedSongs.map((s) => (
            <div key={s.id} className="bg-[#450a0a]/40 p-4 rounded-xl flex items-center gap-4 border border-white/5">
              <div className="bg-[#D4AF37]/20 p-2 rounded-lg text-[#D4AF37]">
                <Music size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold">{s.song_name}</p>
                <p className="text-xs text-white/50">{s.artist}</p>
              </div>
              <p className="text-[10px] uppercase text-white/30">Por: {s.suggested_by}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DeviceWrapper = ({ children, isAdmin = false }: { children: React.ReactNode, isAdmin?: boolean }) => {
  if (isAdmin) return <div className="min-h-screen bg-zinc-950">{children}</div>;

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 md:p-8">
      {/* Desktop Mockup */}
      <div className="hidden md:block iphone-mockup">
        <div className="dynamic-island" />
        <div className="iphone-screen no-scrollbar">
          {children}
        </div>
      </div>
      
      {/* Mobile View (Full Screen) */}
      <div className="md:hidden w-full h-screen overflow-y-auto no-scrollbar bg-transparent">
        {children}
      </div>
    </div>
  );
};

const SplashImage = ({ config, onEnter }: { config: AppConfig, onEnter: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden"
    >
      <div 
        className="absolute inset-0 bg-[length:100%_100%] bg-top z-0"
        style={{ backgroundImage: `url(${config.splash_image})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center px-6 mt-auto pb-20"
      >
        <button 
          onClick={onEnter}
          className="hollywood-btn"
        >
          Entrar
        </button>
      </motion.div>
    </motion.div>
  );
};

const VideoIntro = ({ config, onEnded }: { config: AppConfig, onEnded: () => void }) => {
  const [started, setStarted] = useState(false);
  
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^?&]+)/);
    if (match) videoId = match[1];

    if (videoId) {
      const origin = window.location.origin;
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}&playlist=${videoId}&playsinline=1`;
    }
    
    return url;
  };

  const videoUrl = getEmbedUrl(config.video_url);
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (started && isYouTube) {
      const initPlayer = () => {
        // Wait a bit for the iframe to be fully ready in the DOM
        setTimeout(() => {
          if (playerRef.current) return;
          try {
            playerRef.current = new (window as any).YT.Player('youtube-player', {
              events: {
                'onReady': (event: any) => {
                  event.target.playVideo();
                  // Force play after another short delay if it hasn't started
                  setTimeout(() => {
                    if (event.target && typeof event.target.getPlayerState === 'function') {
                      if (event.target.getPlayerState() !== 1) {
                        event.target.mute(); // Try muting then playing as a last resort
                        event.target.playVideo();
                        setTimeout(() => event.target.unMute(), 500);
                      }
                    }
                  }, 2000);
                },
                'onStateChange': (event: any) => {
                  if (event.data === (window as any).YT.PlayerState.ENDED) {
                    onEnded();
                  }
                },
                'onError': (event: any) => {
                  console.error('YouTube Player Error:', event.data);
                  setTimeout(onEnded, 2000);
                }
              }
            });
          } catch (e) {
            console.error('Error initializing YouTube player:', e);
            // Fallback: if API fails, at least the iframe might autoplay on its own
          }
        }, 500);
      };

      if (!(window as any).YT || !(window as any).YT.Player) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        (window as any).onYouTubeIframeAPIReady = initPlayer;
      } else {
        initPlayer();
      }
    }
  }, [started, isYouTube, onEnded]);

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black z-50 flex items-center justify-center overflow-hidden"
    >
      {!started ? (
        <div className="absolute inset-0 z-60 flex flex-col items-center justify-center overflow-hidden">
           {/* Background with Hollywood Sky */}
           <div 
             className="absolute inset-0 bg-[length:100%_100%] bg-top z-0"
             style={{ backgroundImage: `url(${config.hollywood_bg})` }}
           >
             <div className="absolute inset-0 bg-[#450a0a]/60 backdrop-blur-xs" />
           </div>

           {/* Ornate Border for the whole screen */}
           <div className="absolute inset-0 pointer-events-none z-10 border-[12px] border-transparent">
             <div className="absolute inset-0 border border-[#D4AF37]/30" />
             <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#D4AF37]/60" />
             <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#D4AF37]/60" />
             <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#D4AF37]/60" />
             <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#D4AF37]/60" />
           </div>

           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="relative z-20 flex flex-col items-center"
           >
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={handleStart}
               className="group relative flex flex-col items-center"
             >
               {/* Red Invitation Card */}
               <div className="bg-[#450a0a] p-12 rounded-lg gold-border shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-6 border-2 border-[#D4AF37]/50">
                 <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
                   <Play size={32} fill="currentColor" className="ml-1" />
                 </div>
                 <div className="text-center space-y-2">
                   <h1 className="gold-text font-display text-3xl uppercase tracking-[0.2em]">Convite</h1>
                   <p className="text-[#D4AF37] uppercase tracking-[0.4em] text-xs font-bold">Abrir Convite</p>
                 </div>
               </div>
               
               {/* Decorative elements below */}
               <div className="mt-8 flex items-center gap-4">
                 <div className="h-px w-12 bg-[#D4AF37]/30" />
                 <Sparkles className="text-[#D4AF37]/50" size={20} />
                 <div className="h-px w-12 bg-[#D4AF37]/30" />
               </div>
             </motion.button>
           </motion.div>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {isYouTube ? (
            <div className="w-full h-full scale-[1.15]">
              <iframe 
                id="youtube-player"
                src={videoUrl}
                title="YouTube video player"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <video 
              autoPlay
              playsInline
              onEnded={onEnded}
              className="w-full h-full object-cover"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}
          
          <button 
            onClick={onEnded}
            className="absolute bottom-10 right-1/2 translate-x-1/2 bg-[#D4AF37]/20 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all z-70"
          >
            Pular Vídeo
          </button>
        </div>
      )}
    </motion.div>
  );
};

const Local = ({ config }: { config: AppConfig }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full w-full flex flex-col overflow-hidden"
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-[length:100%_100%] bg-top z-0"
        style={{ backgroundImage: `url(${config.hollywood_bg})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Ornate Screen Border */}
      <div className="absolute inset-0 pointer-events-none z-20 border-[8px] border-transparent">
        <div className="absolute inset-0 border border-[#D4AF37]/20" />
        {/* Corner Ornaments */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 flex items-center border-b border-[#D4AF37]/20 bg-[#450a0a]/40 backdrop-blur-md">
          <button onClick={() => navigate('/')} className="text-[#D4AF37] flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
            <ChevronRight className="rotate-180" size={18} /> Voltar
          </button>
          <h2 className="flex-1 text-center gold-text font-display text-lg mr-10 uppercase tracking-widest">Localização</h2>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          {/* Address Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#450a0a]/60 p-6 rounded-2xl gold-border text-center space-y-3 shadow-2xl"
          >
            <div className="bg-[#D4AF37] w-12 h-12 rounded-full flex items-center justify-center mx-auto text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold gold-text uppercase tracking-tight">{config.location_name}</h3>
              <p className="text-sm text-white/80 mt-1 leading-relaxed">{config.location_address}</p>
            </div>
          </motion.div>

          {/* Map Container */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex-1 min-h-[350px] rounded-2xl overflow-hidden gold-border bg-[#450a0a]/60 shadow-2xl relative"
          >
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(config.location_address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              className="grayscale-[0.2] contrast-[1.1]"
            />
          </motion.div>
          
          <motion.a 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            href={config.location_map_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full hollywood-btn flex items-center justify-center gap-2 py-4"
          >
            <MapPin size={18} /> Abrir no Google Maps
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

const DressCode = ({ config }: { config: AppConfig }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-full w-full flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-[length:100%_100%] bg-top z-0" style={{ backgroundImage: `url(${config.hollywood_bg})` }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Ornate Screen Border */}
      <div className="absolute inset-0 pointer-events-none z-20 border-[8px] border-transparent">
        <div className="absolute inset-0 border border-[#D4AF37]/20" />
        {/* Corner Ornaments */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/50" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="p-4 flex items-center border-b border-[#D4AF37]/20 bg-[#450a0a]/40 backdrop-blur-md">
          <button onClick={() => navigate('/')} className="text-[#D4AF37] flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
            <ChevronRight className="rotate-180" size={18} /> Voltar
          </button>
          <h2 className="flex-1 text-center gold-text font-display text-lg mr-10 uppercase tracking-widest">Dress Code</h2>
        </div>
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          <div className="bg-[#450a0a]/60 p-8 rounded-2xl gold-border space-y-8">
             <div className="text-center space-y-2">
               <Shirt className="mx-auto text-[#D4AF37]" size={40} />
               <h3 className="text-2xl font-display gold-text uppercase tracking-widest">Traje Sugerido</h3>
             </div>
             <div className="space-y-6">
               <div className="space-y-2">
                 <p className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs">Homens</p>
                 <p className="text-white/90 text-lg">{config.dress_code_men}</p>
               </div>
               <div className="w-full h-px bg-[#D4AF37]/20" />
               <div className="space-y-2">
                 <p className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs">Mulheres</p>
                 <p className="text-white/90 text-lg">{config.dress_code_women}</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Gifts = ({ config }: { config: AppConfig }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-full w-full flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-[length:100%_100%] bg-top z-0" style={{ backgroundImage: `url(${config.hollywood_bg})` }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Ornate Screen Border */}
      <div className="absolute inset-0 pointer-events-none z-20 border-[8px] border-transparent">
        <div className="absolute inset-0 border border-[#D4AF37]/20" />
        {/* Corner Ornaments */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/50" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="p-4 flex items-center border-b border-[#D4AF37]/20 bg-[#450a0a]/40 backdrop-blur-md">
          <button onClick={() => navigate('/')} className="text-[#D4AF37] flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
            <ChevronRight className="rotate-180" size={18} /> Voltar
          </button>
          <h2 className="flex-1 text-center gold-text font-display text-lg mr-10 uppercase tracking-widest">Presentes</h2>
        </div>
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
          <div className="bg-[#450a0a]/60 p-8 rounded-2xl gold-border space-y-8">
             <div className="text-center space-y-2">
               <Gift className="mx-auto text-[#D4AF37]" size={40} />
               <h3 className="text-2xl font-display gold-text uppercase tracking-widest">Sugestões</h3>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center text-center p-4 bg-[#450a0a]/40 rounded-xl border border-[#D4AF37]/10">
                  <Shirt className="text-[#D4AF37] mb-2" size={24} />
                  <p className="text-[10px] uppercase text-white/40 mb-1">Roupa</p>
                  <p className="font-bold">{config.gift_clothing_size}</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-[#450a0a]/40 rounded-xl border border-[#D4AF37]/10">
                  <Footprints className="text-[#D4AF37] mb-2" size={24} />
                  <p className="text-[10px] uppercase text-white/40 mb-1">Sapato</p>
                  <p className="font-bold">{config.gift_shoe_size}</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-[#450a0a]/40 rounded-xl border border-[#D4AF37]/10">
                  <Sparkles className="text-[#D4AF37] mb-2" size={24} />
                  <p className="text-[10px] uppercase text-white/40 mb-1">Perfume</p>
                  <p className="font-bold text-sm">{config.gift_perfume}</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-[#450a0a]/40 rounded-xl border border-[#D4AF37]/10">
                  <Palette className="text-[#D4AF37] mb-2" size={24} />
                  <p className="text-[10px] uppercase text-white/40 mb-1">Maquiagem</p>
                  <p className="font-bold text-sm">{config.gift_makeup}</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-[#450a0a]/40 rounded-xl border border-[#D4AF37]/10">
                  <Book className="text-[#D4AF37] mb-2" size={24} />
                  <p className="text-[10px] uppercase text-white/40 mb-1">Papelaria</p>
                  <p className="font-bold text-sm">{config.gift_stationery}</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-[#450a0a]/40 rounded-xl border border-[#D4AF37]/10">
                  <Heart className="text-[#D4AF37] mb-2" size={24} />
                  <p className="text-[10px] uppercase text-white/40 mb-1">Cosméticos</p>
                  <p className="font-bold text-sm">{config.gift_cosmetics}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Home = ({ config }: { config: AppConfig }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'messages' | 'gallery' | 'music' | 'home'>('home');
  const [messages, setMessages] = useState<Message[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [music, setMusic] = useState<MusicSuggestion[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [mRes, gRes, muRes] = await Promise.all([
      fetch('/api/messages'),
      fetch('/api/gallery'),
      fetch('/api/music')
    ]);
    setMessages(await mRes.json());
    setGallery(await gRes.json());
    setMusic(await muRes.json());
  };

  const handleSendMessage = async (name: string, content: string) => {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content })
    });
    fetchData();
  };

  const handleSuggestMusic = async (song_name: string, artist: string, suggested_by: string) => {
    await fetch('/api/music', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ song_name, artist, suggested_by })
    });
    fetchData();
    alert('Sugestão enviada! Aguarde aprovação.');
  };

  const OrnateButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full max-w-[280px] h-[48px] flex items-center justify-center group"
    >
      {/* Main Background - Dark Red/Brown Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-[#3D0C0C] to-[#1A0505] border border-[#D4AF37]/50 shadow-lg" />
      
      {/* Ornate Frame (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 48" fill="none" preserveAspectRatio="none">
        {/* Corner Ornaments */}
        <path d="M0 8 L8 0 M272 0 L280 8 M280 40 L272 48 M8 48 L0 40" stroke="#D4AF37" strokeWidth="1" />
        
        {/* Decorative Lines */}
        <path d="M12 4 H268 M12 44 H268" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.5" />
        
        {/* Ornate corners */}
        <circle cx="4" cy="4" r="1.2" fill="#D4AF37" />
        <circle cx="276" cy="4" r="1.2" fill="#D4AF37" />
        <circle cx="4" cy="44" r="1.2" fill="#D4AF37" />
        <circle cx="276" cy="44" r="1.2" fill="#D4AF37" />
      </svg>
      
      {/* Content */}
      <div className="relative z-10 flex items-center w-full px-4">
        <div className="flex-shrink-0 text-[#D4AF37]">
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <span className="flex-1 text-center font-serif text-[#D4AF37] text-sm tracking-wide">
          {label}
        </span>
        <div className="w-[18px]" /> {/* Balance the icon */}
      </div>
    </motion.button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-transparent"
    >
      <AnimatePresence mode="wait">
        {activeTab === 'home' ? (
          <motion.div 
            key="home-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-full w-full flex flex-col items-center overflow-hidden"
          >
            {/* Full Screen Background Image */}
            <div 
              className="absolute inset-0 bg-[length:100%_100%] bg-top z-0"
              style={{ backgroundImage: `url(${config.hollywood_bg})` }}
            >
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Ornate Screen Border */}
            <div className="absolute inset-0 pointer-events-none z-20 border-[8px] border-transparent">
              <div className="absolute inset-0 border border-[#D4AF37]/20" />
              {/* Corner Ornaments */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/50" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/50" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/50" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/50" />
            </div>

            {/* Interactive Buttons Overlay */}
            <div className="relative z-10 mt-auto mb-8 w-full flex flex-col items-center gap-2 px-6">
              <OrnateButton 
                icon={MapPin} 
                label="Local" 
                onClick={() => navigate('/local')} 
              />
              <OrnateButton 
                icon={Gift} 
                label="Sugestão de Presentes" 
                onClick={() => navigate('/presentes')} 
              />
              <OrnateButton 
                icon={Shirt} 
                label="Dress Code" 
                onClick={() => navigate('/dresscode')} 
              />
              <OrnateButton 
                icon={CheckCircle2} 
                label="Confirmar Presença" 
                onClick={() => window.open(config.whatsapp_link, '_blank')} 
              />
              
              <div className="mt-4 flex gap-6">
                <button onClick={() => setActiveTab('gallery')} className="text-[#D4AF37]/80 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-[#D4AF37] transition-colors">Galeria</button>
                <button onClick={() => setActiveTab('messages')} className="text-[#D4AF37]/80 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-[#D4AF37] transition-colors">Mural</button>
                <button onClick={() => setActiveTab('music')} className="text-[#D4AF37]/80 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-[#D4AF37] transition-colors">Músicas</button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="content-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-full pb-32"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-[length:100%_100%] bg-top z-0"
              style={{ backgroundImage: `url(${config.hollywood_bg})` }}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            </div>

            {/* Ornate Screen Border */}
            <div className="absolute inset-0 pointer-events-none z-20 border-[8px] border-transparent">
              <div className="absolute inset-0 border border-[#D4AF37]/20" />
              {/* Corner Ornaments */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/50" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/50" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/50" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/50" />
            </div>

            <div className="relative z-10">
              {/* Header for sub-pages */}
              <div className="sticky top-0 z-50 bg-[#450a0a]/40 backdrop-blur-md border-b border-[#D4AF37]/20 p-4 flex items-center justify-between">
                <button onClick={() => setActiveTab('home')} className="text-[#D4AF37] flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
                  <ChevronRight className="rotate-180" size={18} /> Voltar
                </button>
                <h2 className="gold-text font-display text-lg uppercase tracking-widest">Maitê & Maysa</h2>
                <div className="w-10" />
              </div>

              {/* Tabs Navigation */}
              <div className="bg-[#450a0a]/40 backdrop-blur-md border-b border-[#D4AF37]/10 mb-8">
                <div className="max-w-4xl mx-auto flex overflow-x-auto no-scrollbar">
                  {[
                    { id: 'gallery', label: 'Galeria', icon: ImageIcon },
                    { id: 'messages', label: 'Mural', icon: MessageCircle },
                    { id: 'music', label: 'Músicas', icon: Music },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 min-w-[100px] py-4 px-2 flex flex-col items-center gap-1 transition-all ${
                        activeTab === tab.id ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-white/40'
                      }`}
                    >
                      <tab.icon size={18} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-w-4xl mx-auto px-6">
                {activeTab === 'gallery' && <Gallery items={gallery} />}
                {activeTab === 'messages' && <MessageWall messages={messages} onSendMessage={handleSendMessage} />}
                {activeTab === 'music' && <MusicSection suggestions={music} onSuggest={handleSuggestMusic} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Admin = ({ config, onUpdate }: { config: AppConfig, onUpdate: (newConfig: Partial<AppConfig>) => void }) => {
  const [formData, setFormData] = useState(config);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [music, setMusic] = useState<MusicSuggestion[]>([]);
  
  const [newGalleryItem, setNewGalleryItem] = useState({ url: '', type: 'image' as const, caption: '' });
  const [adminTab, setAdminTab] = useState<'config' | 'messages' | 'gallery' | 'music'>('config');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const [mRes, gRes, muRes] = await Promise.all([
      fetch('/api/messages'),
      fetch('/api/gallery'),
      fetch('/api/music')
    ]);
    setMessages(await mRes.json());
    setGallery(await gRes.json());
    setMusic(await muRes.json());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onUpdate(formData);
    setSaving(false);
    alert('Configurações salvas!');
  };

  const handleDeleteMessage = async (id: number) => {
    if (confirm('Excluir mensagem?')) {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      fetchAdminData();
    }
  };

  const handleAddGallery = async () => {
    if (newGalleryItem.url) {
      await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGalleryItem)
      });
      setNewGalleryItem({ url: '', type: 'image', caption: '' });
      fetchAdminData();
    }
  };

  const handleDeleteGallery = async (id: number) => {
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    fetchAdminData();
  };

  const handleApproveMusic = async (id: number) => {
    await fetch(`/api/music/${id}/approve`, { method: 'PATCH' });
    fetchAdminData();
  };

  const handleDeleteMusic = async (id: number) => {
    await fetch(`/api/music/${id}`, { method: 'DELETE' });
    fetchAdminData();
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Settings className="text-[#D4AF37]" size={32} />
            <h1 className="text-3xl font-display gold-text">Painel Administrativo</h1>
          </div>
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
            {[
              { id: 'config', label: 'Config', icon: Settings },
              { id: 'gallery', label: 'Galeria', icon: ImageIcon },
              { id: 'messages', label: 'Mural', icon: MessageCircle },
              { id: 'music', label: 'Música', icon: Music },
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setAdminTab(t.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                  adminTab === t.id ? 'bg-[#D4AF37] text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {adminTab === 'config' && (
            <motion.form key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-8 bg-zinc-900 p-8 rounded-2xl border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase text-white/50">Texto de Boas-vindas</label>
                  <textarea name="welcome_text" value={formData.welcome_text} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm h-24" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-white/50">Data do Evento</label>
                  <input type="text" name="event_date" value={formData.event_date} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-white/50">Link WhatsApp</label>
                  <input type="text" name="whatsapp_link" value={formData.whatsapp_link} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-white/50">Nome do Local</label>
                  <input type="text" name="location_name" value={formData.location_name} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-white/50">Sugestão: Papelaria</label>
                  <input type="text" name="gift_stationery" value={formData.gift_stationery} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-white/50">Sugestão: Cosméticos</label>
                  <input type="text" name="gift_cosmetics" value={formData.gift_cosmetics} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm" />
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full hollywood-btn">{saving ? 'Salvando...' : 'Salvar Configurações'}</button>
            </motion.form>
          )}

          {adminTab === 'gallery' && (
            <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="bg-zinc-900 p-8 rounded-2xl border border-white/10 space-y-4">
                <h3 className="gold-text font-display text-xl mb-4">Adicionar à Galeria</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="URL da Imagem/Vídeo" value={newGalleryItem.url} onChange={e => setNewGalleryItem({...newGalleryItem, url: e.target.value})} className="bg-black border border-white/10 rounded-lg p-3 text-sm" />
                  <select value={newGalleryItem.type} onChange={e => setNewGalleryItem({...newGalleryItem, type: e.target.value as any})} className="bg-black border border-white/10 rounded-lg p-3 text-sm">
                    <option value="image">Imagem</option>
                    <option value="video">Vídeo</option>
                  </select>
                  <input type="text" placeholder="Legenda" value={newGalleryItem.caption} onChange={e => setNewGalleryItem({...newGalleryItem, caption: e.target.value})} className="bg-black border border-white/10 rounded-lg p-3 text-sm" />
                </div>
                <button onClick={handleAddGallery} className="w-full hollywood-btn flex items-center justify-center gap-2"><Plus size={18} /> Adicionar</button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map(item => (
                  <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                    <img src={item.url} className="w-full h-full object-cover" />
                    <button onClick={() => handleDeleteGallery(item.id)} className="absolute top-2 right-2 p-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {adminTab === 'messages' && (
            <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.map(msg => (
                <div key={msg.id} className="bg-zinc-900 p-6 rounded-2xl border border-white/10 flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[#D4AF37]">{msg.name}</p>
                    <p className="text-sm text-white/70 italic">"{msg.content}"</p>
                  </div>
                  <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
                </div>
              ))}
            </motion.div>
          )}

          {adminTab === 'music' && (
            <motion.div key="music" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {music.map(s => (
                <div key={s.id} className={`bg-zinc-900 p-4 rounded-2xl border flex items-center justify-between ${s.approved ? 'border-green-500/30' : 'border-white/10'}`}>
                  <div>
                    <p className="font-bold">{s.song_name} - <span className="text-white/50">{s.artist}</span></p>
                    <p className="text-[10px] uppercase text-white/30">Sugerido por: {s.suggested_by}</p>
                  </div>
                  <div className="flex gap-2">
                    {!s.approved && (
                      <button onClick={() => handleApproveMusic(s.id)} className="p-2 bg-green-600 rounded-lg hover:bg-green-500"><Check size={18} /></button>
                    )}
                    <button onClick={() => handleDeleteMusic(s.id)} className="p-2 bg-red-600 rounded-lg hover:bg-red-500"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [step, setStep] = useState<'video' | 'image' | 'home'>('video');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const res = await fetch('/api/config');
    const data = await res.json();
    setConfig(data);
  };

  const updateConfig = async (newConfig: Partial<AppConfig>) => {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig),
    });
    await fetchConfig();
  };

  if (!config) return <div className="h-screen flex items-center justify-center text-gold">Carregando...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <DeviceWrapper>
            <AnimatePresence mode="wait">
              {step === 'video' && (
                <VideoIntro key="video" config={config} onEnded={() => setStep('home')} />
              )}
              {step === 'home' && (
                <Home key="home" config={config} />
              )}
            </AnimatePresence>
          </DeviceWrapper>
        } />
        <Route path="/local" element={
          <DeviceWrapper>
            <Local config={config} />
          </DeviceWrapper>
        } />
        <Route path="/presentes" element={
          <DeviceWrapper>
            <Gifts config={config} />
          </DeviceWrapper>
        } />
        <Route path="/dresscode" element={
          <DeviceWrapper>
            <DressCode config={config} />
          </DeviceWrapper>
        } />
        <Route path="/admin" element={
          <DeviceWrapper isAdmin>
            <Admin config={config} onUpdate={updateConfig} />
          </DeviceWrapper>
        } />
      </Routes>
    </Router>
  );
}

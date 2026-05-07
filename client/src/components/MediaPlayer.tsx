import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Maximize2, Minimize2, Music2,
  Play, Pause, ChevronLeft, ChevronRight,
  Volume2, VolumeX, RotateCcw, Loader2
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { closePlayer, nextTrack, prevTrack } from '@/store/playerSlice';
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react';

type SourceKind = 'audio' | 'video' | 'youtube' | 'unsupported';

const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.aac', '.wav', '.ogg', '.oga', '.flac'];
const VIDEO_EXTENSIONS = ['.mp4', '.m4v', '.webm', '.mov', '.ogv', '.m3u8'];

function getFileExtension(rawUrl: string) {
  try {
    const pathname = new URL(rawUrl).pathname.toLowerCase();
    return pathname.slice(pathname.lastIndexOf('.'));
  } catch {
    return '';
  }
}

function getYouTubeEmbedUrl(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.replace(/^www\./, '');
    let videoId = '';

    if (host === 'youtu.be') {
      videoId = parsed.pathname.slice(1);
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v') || '';
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/')[2] || '';
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/')[2] || '';
      }
    }

    if (!videoId) {
      return null;
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  } catch {
    return null;
  }
}

function detectSource(rawUrl: string | null, type: 'video' | 'audio' | 'comic' | null): { kind: SourceKind; src: string } {
  if (!rawUrl) {
    return { kind: 'unsupported', src: '' };
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(rawUrl);
  if (youtubeEmbedUrl) {
    return { kind: 'youtube', src: youtubeEmbedUrl };
  }

  const extension = getFileExtension(rawUrl);

  if (AUDIO_EXTENSIONS.includes(extension)) {
    return { kind: 'audio', src: rawUrl };
  }

  if (VIDEO_EXTENSIONS.includes(extension)) {
    return { kind: 'video', src: rawUrl };
  }

  if (type === 'audio') {
    return { kind: 'audio', src: rawUrl };
  }

  return { kind: 'unsupported', src: rawUrl };
}

export default function MediaPlayer() {
  const dispatch = useAppDispatch();
  const { isOpen, url, title, type, playlist, currentIndex } = useAppSelector((state) => state.player);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const source = detectSource(url, type);
  const usesEmbeddedControls = source.kind === 'youtube';
  const canUseNativeMedia = source.kind === 'audio' || source.kind === 'video';
  const media = source.kind === 'audio' ? audioRef.current : source.kind === 'video' ? videoRef.current : null;

  useEffect(() => {
    if (isOpen && url) {
      setIsLoading(true);
      setIsPlaying(true);
      setPlayed(0);
      setPlayedSeconds(0);
      setDuration(0);
    } else {
      setIsPlaying(false);
    }
  }, [isOpen, url]);

  useEffect(() => {
    if (source.kind === 'youtube' || source.kind === 'unsupported') {
      setIsLoading(false);
    }
  }, [source.kind, source.src]);

  useEffect(() => {
    if (!media) {
      return;
    }

    media.volume = volume;
    media.muted = isMuted;
    media.playbackRate = playbackRate;
  }, [volume, isMuted, playbackRate, source.src, media]);

  useEffect(() => {
    if (!media) {
      return;
    }

    if (isPlaying) {
      const playPromise = media.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.error('Media playback failed:', error);
          setIsPlaying(false);
          setIsLoading(false);
        });
      }
    } else {
      media.pause();
    }
  }, [isPlaying, source.src, canUseNativeMedia, media]);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return '0:00';
    }

    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const handleSeekChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextPlayed = parseFloat(e.target.value);
    setPlayed(nextPlayed);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: MouseEvent<HTMLInputElement>) => {
    const nextPlayed = parseFloat(e.currentTarget.value);

    setSeeking(false);

    if (media && duration > 0) {
      media.currentTime = nextPlayed * duration;
      setPlayedSeconds(media.currentTime);
    }
  };

  const handleTimeUpdate = () => {
    if (!media || seeking) {
      return;
    }

    const nextDuration = Number.isFinite(media.duration) ? media.duration : 0;
    const nextPlayedSeconds = media.currentTime;

    setDuration(nextDuration);
    setPlayedSeconds(nextPlayedSeconds);
    setPlayed(nextDuration > 0 ? nextPlayedSeconds / nextDuration : 0);
  };

  const handleLoadedMetadata = () => {
    if (!media) {
      return;
    }

    setDuration(Number.isFinite(media.duration) ? media.duration : 0);
    setIsLoading(false);
  };

  const handleMediaReady = () => {
    setIsLoading(false);
  };

  const handleEnded = () => {
    if (playlist.length > 0 && currentIndex < playlist.length - 1) {
      dispatch(nextTrack());
      return;
    }

    setIsPlaying(false);
  };

  const rewindToStart = () => {
    if (!media) {
      return;
    }

    media.currentTime = 0;
    setPlayed(0);
    setPlayedSeconds(0);
  };

  const renderVideoSurface = () => {
    if (source.kind === 'youtube') {
      return (
        <iframe
          src={source.src}
          title={title || 'Embedded video'}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      );
    }

    if (source.kind === 'video') {
      return (
        <video
          key={source.src}
          ref={videoRef}
          src={source.src}
          className="absolute inset-0 h-full w-full bg-black object-contain"
          playsInline
          controls
          controlsList="nodownload"
          preload="metadata"
          crossOrigin="anonymous"
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleMediaReady}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleEnded}
          onError={() => {
            console.error('Video playback error:', source.src);
            setIsLoading(false);
          }}
        />
      );
    }

    return (
      <div className="absolute inset-0 flex items-center justify-center p-10 text-center text-white/70">
        <div className="max-w-lg space-y-3">
          <p className="text-lg font-semibold text-white">This video source cannot be played inline.</p>
          <p className="text-sm text-white/50 break-all">{url}</p>
        </div>
      </div>
    );
  };

  const renderAudioEngine = () => {
    if (source.kind !== 'audio') {
      return null;
    }

    return (
      <audio
        key={source.src}
        ref={audioRef}
        src={source.src}
        preload="metadata"
        crossOrigin="anonymous"
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleMediaReady}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onError={() => {
          console.error('Audio playback error:', source.src);
          setIsLoading(false);
        }}
      />
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => dispatch(closePlayer())}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-6xl ${type === 'audio' ? 'max-w-4xl' : ''} aspect-video bg-[#1A1510] rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(184,137,42,0.15)] border border-white/10 ${isFullscreen ? 'h-full max-w-none rounded-none border-none' : ''}`}
            >
              {type === 'video' && (
                <>
                  {renderVideoSurface()}
                  {isLoading && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
                      <Loader2 className="h-12 w-12 animate-spin text-[#B8892A]" />
                    </div>
                  )}
                </>
              )}

              <div className="absolute top-0 inset-x-0 p-8 flex items-center justify-between z-50 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#B8892A] animate-pulse" />
                    <p className="text-[#B8892A] text-[10px] font-black uppercase tracking-[0.4em]">{type === 'audio' ? 'High-Fidelity Audio' : 'Streaming Video'}</p>
                  </div>
                  <h3 className="text-white font-display font-black text-2xl truncate max-w-md tracking-tight">{title}</h3>
                </div>

                <div className="flex items-center gap-4 pointer-events-auto">
                  {type === 'video' && (
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-4 rounded-2xl bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md border border-white/5"
                    >
                      {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                  )}
                  <button
                    onClick={() => dispatch(closePlayer())}
                    className="p-4 rounded-2xl bg-[#B8892A] text-[#1A1510] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(184,137,42,0.3)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {type === 'audio' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#1A1510] via-[#2A2015] to-[#1A1510] overflow-hidden">
                  {renderAudioEngine()}

                  <div className="absolute inset-0">
                    <motion.div
                      animate={{
                        scale: isPlaying ? [1, 1.2, 1] : 1,
                        opacity: isPlaying ? [0.1, 0.2, 0.1] : 0.1
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#B8892A] rounded-full blur-[160px]"
                    />
                  </div>

                  {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <Loader2 className="w-12 h-12 text-[#B8892A] animate-spin" />
                    </div>
                  )}

                  <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
                    {usesEmbeddedControls ? (
                      <>
                        <div className="w-full aspect-video rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border-4 border-white/10 mb-8">
                          <iframe
                            src={source.src}
                            title={title || 'Embedded audio'}
                            className="h-full w-full"
                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        </div>
                        <p className="text-sm text-[#FDF3DC]/70 text-center">
                          This source uses embedded YouTube controls instead of the custom audio transport.
                        </p>
                      </>
                    ) : source.kind === 'unsupported' ? (
                      <div className="rounded-[40px] border border-white/10 bg-black/30 p-10 text-center text-white/70">
                        <p className="text-lg font-semibold text-white">This audio source cannot be played inline.</p>
                        <p className="mt-2 break-all text-sm text-white/50">{url}</p>
                      </div>
                    ) : (
                      <>
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative w-64 h-64 md:w-80 md:h-80 rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border-4 border-white/10 mb-12"
                        >
                          <div className="w-full h-full bg-[#1A1510] flex items-center justify-center relative">
                            <Music2 className="w-24 h-24 text-[#B8892A]/10" />

                            <div className="absolute bottom-12 inset-x-0 flex justify-center gap-2 h-20 items-end px-12">
                              {[...Array(15)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ height: isPlaying ? [10, 60, 20, 80, 15] : 4 }}
                                  transition={{ repeat: Infinity, duration: 0.5 + i * 0.05, ease: 'easeInOut' }}
                                  className="flex-1 bg-gradient-to-t from-[#B8892A] to-[#FDF3DC] rounded-full"
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>

                        <div className="w-full space-y-8">
                          <div className="space-y-3">
                            <div className="relative h-2 group">
                              <input
                                type="range"
                                min={0}
                                max={0.999999}
                                step="any"
                                value={played}
                                onMouseDown={handleSeekMouseDown}
                                onChange={handleSeekChange}
                                onMouseUp={handleSeekMouseUp}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                              />
                              <div className="absolute inset-0 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  style={{ width: `${played * 100}%` }}
                                  className="h-full bg-[#B8892A] relative"
                                >
                                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl scale-0 group-hover:scale-100 transition-transform" />
                                </motion.div>
                              </div>
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-[#B8892A] tracking-widest opacity-60">
                              <span>{formatTime(playedSeconds)}</span>
                              <span>{formatTime(duration)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="text-[#B8892A]/40 hover:text-[#B8892A] transition-colors"
                              >
                                {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                              </button>
                              <div className="w-24 group relative h-1 bg-white/5 rounded-full overflow-hidden hidden md:block">
                                <input
                                  type="range"
                                  min={0}
                                  max={1}
                                  step="any"
                                  value={volume}
                                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                <div style={{ width: `${volume * 100}%` }} className="h-full bg-[#B8892A]/40 group-hover:bg-[#B8892A] transition-colors" />
                              </div>
                            </div>

                            <div className="flex items-center gap-8">
                              <button
                                onClick={() => dispatch(prevTrack())}
                                disabled={currentIndex <= 0}
                                className="p-4 rounded-full text-[#B8892A]/40 hover:text-[#B8892A] hover:bg-white/5 disabled:opacity-10 transition-all"
                              >
                                <ChevronLeft className="w-10 h-10" />
                              </button>

                              <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-24 h-24 rounded-[32px] bg-[#B8892A] text-[#1A1510] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_20px_50px_rgba(184,137,42,0.4)]"
                              >
                                {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                              </button>

                              <button
                                onClick={() => dispatch(nextTrack())}
                                disabled={currentIndex >= playlist.length - 1}
                                className="p-4 rounded-full text-[#B8892A]/40 hover:text-[#B8892A] hover:bg-white/5 disabled:opacity-10 transition-all"
                              >
                                <ChevronRight className="w-10 h-10" />
                              </button>
                            </div>

                            <div className="flex items-center gap-6">
                              <button
                                onClick={() => setPlaybackRate(playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1)}
                                className="text-[10px] font-black text-[#B8892A] bg-[#B8892A]/10 px-3 py-1.5 rounded-lg"
                              >
                                {playbackRate}x
                              </button>
                              <button
                                onClick={rewindToStart}
                                className="text-[#B8892A]/40 hover:text-[#B8892A] transition-colors"
                              >
                                <RotateCcw className="w-6 h-6" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

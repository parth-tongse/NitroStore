import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('ns_music_muted');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  // A reliable, smooth electronic ambient/lofi track perfect for NitroStore's theme
  const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3';

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = 0.08; // 8% low volume as requested
    audioRef.current = audio;

    // Handle initial autoplay workarounds
    const startAudio = () => {
      if (!isMuted && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            removeInteractionListeners();
          })
          .catch((err) => {
            console.log("Autoplay blocked or failed, waiting for user click", err);
          });
      }
    };

    const handleUserInteraction = () => {
      startAudio();
    };

    const addInteractionListeners = () => {
      window.addEventListener('click', handleUserInteraction);
      window.addEventListener('keydown', handleUserInteraction);
      window.addEventListener('touchstart', handleUserInteraction);
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    // If not muted, try to play immediately or add listeners
    if (!isMuted) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Playback blocked, add interaction listeners
          addInteractionListeners();
        });
    }

    return () => {
      removeInteractionListeners();
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Sync mute state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log("Failed to play on un-mute:", err);
          });
      }
      try {
        localStorage.setItem('ns_music_muted', JSON.stringify(isMuted));
      } catch (e) {
        console.warn("localStorage.setItem failed in BackgroundMusic:", e);
      }
    }
  }, [isMuted]);

  const toggleMusic = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div 
      id="bg-music-widget" 
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-slate-950/90 hover:bg-slate-950 border border-slate-800/80 hover:border-indigo-500/30 pl-3.5 pr-4 py-2 rounded-2xl shadow-xl shadow-indigo-950/20 backdrop-blur-md transition-all duration-300 group hover:scale-[1.02]"
    >
      {/* Equalizer Wave / Disk Icon */}
      <div className="flex items-center gap-0.5 h-3.5 w-4 justify-center">
        {isPlaying ? (
          <>
            <span className="w-0.5 bg-indigo-500 rounded-full animate-[bounce_1.2s_infinite_100ms]" style={{ height: '100%', minHeight: '4px' }}></span>
            <span className="w-0.5 bg-purple-500 rounded-full animate-[bounce_1.2s_infinite_300ms]" style={{ height: '70%', minHeight: '4px' }}></span>
            <span className="w-0.5 bg-cyan-500 rounded-full animate-[bounce_1.2s_infinite_500ms]" style={{ height: '85%', minHeight: '4px' }}></span>
            <span className="w-0.5 bg-pink-500 rounded-full animate-[bounce_1.2s_infinite_200ms]" style={{ height: '50%', minHeight: '4px' }}></span>
          </>
        ) : (
          <>
            <span className="w-0.5 h-1.5 bg-slate-600 rounded-full"></span>
            <span className="w-0.5 h-3 bg-slate-600 rounded-full"></span>
            <span className="w-0.5 h-2 bg-slate-600 rounded-full"></span>
            <span className="w-0.5 h-1 bg-slate-600 rounded-full"></span>
          </>
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest leading-none">Ambient Loop</span>
        <span className="text-[10px] font-bold text-slate-200 mt-0.5 flex items-center gap-1 leading-none">
          <Music size={10} className="text-indigo-400" /> Nitro Lofi
        </span>
      </div>

      {/* Toggle Button */}
      <button
        id="bg-music-toggle-btn"
        onClick={toggleMusic}
        title={isMuted ? "Play Background Music" : "Mute Background Music"}
        className={`ml-2 p-2 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
          isMuted 
            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850' 
            : 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/20'
        }`}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
      </button>
    </div>
  );
};

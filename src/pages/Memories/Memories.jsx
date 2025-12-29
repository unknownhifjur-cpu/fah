import { useState, useRef, useEffect } from "react";
import { Heart, X, Play, Pause, Music, SkipBack, SkipForward, Plus, ImagePlus } from "lucide-react";

// Default memories
const defaultMemories = [
  { id: 1, label: "The first time I saw you", img: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&auto=format&fit=crop" },
  { id: 2, label: "Moments that felt magical", img: "https://images.unsplash.com/photo-1529254479751-fbacb4c7a587?w-800&auto=format&fit=crop" },
  { id: 3, label: "Unforgettable memories", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop" },
  { id: 4, label: "Your smile, my peace", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop" },
  { id: 5, label: "Love growing stronger", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop" },
  { id: 6, label: "Forever starts here", img: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&auto=format&fit=crop" },
];

// Default playlist
const defaultPlaylist = [
  { title: "Aasan Nahi Yahan", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Kal Jo Na Tujhse", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Uska Hi Banana", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

const Memories = () => {
  const [selected, setSelected] = useState(null);
  const [liked, setLiked] = useState({});
  const [playing, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [playlist, setPlaylist] = useState([]);
  const [memories, setMemories] = useState([]);
  const [audioError, setAudioError] = useState(null);
  const audioRef = useRef(null);

  // Load playlist and memories
  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem("playlist")) || defaultPlaylist;
    setPlaylist(savedPlaylist);

    const savedMemories = JSON.parse(localStorage.getItem("memories")) || defaultMemories;
    setMemories(savedMemories);
  }, []);

  // Save playlist and memories
  useEffect(() => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
  }, [playlist]);
  
  useEffect(() => {
    localStorage.setItem("memories", JSON.stringify(memories));
  }, [memories]);

  // Audio volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Audio progress and auto-next
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    const handleEnded = () => nextSong();
    const handleError = (e) => {
      console.error("Audio error:", e.target.error);
      setAudioError(`Failed to load: ${playlist[currentSong]?.title || 'current song'}`);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [currentSong, playlist]);

  // Pause when lightbox opens
  useEffect(() => {
    if (selected && playing && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, [selected]);

  // Switch song
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || playlist.length === 0) return;

    // Reset if currentSong is out of bounds
    if (currentSong >= playlist.length) {
      setCurrentSong(0);
      return;
    }

    const currentTrack = playlist[currentSong];
    if (!currentTrack || !currentTrack.src) {
      console.error("Invalid track at index:", currentSong);
      return;
    }

    setAudioError(null);
    audio.src = currentTrack.src;
    audio.load();
    
    if (playing) {
      audio.play().catch(err => {
        console.log("Play error:", err);
        setAudioError(`Cannot play: ${currentTrack.title}`);
        setPlaying(false);
      });
    }
  }, [currentSong, playlist, playing]);

  const togglePlay = async () => {
    if (!audioRef.current || playlist.length === 0) return;
    
    try {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        // If we have an error, try reloading the track
        if (audioError) {
          audioRef.current.load();
        }
        await audioRef.current.play();
        setPlaying(true);
        setAudioError(null);
      }
    } catch (err) {
      console.error("Audio play failed:", err);
      setAudioError("Failed to play audio");
    }
  };

  const nextSong = () => {
    if (playlist.length === 0) return;
    setCurrentSong(prev => (prev + 1) % playlist.length);
  };
  
  const prevSong = () => {
    if (playlist.length === 0) return;
    setCurrentSong(prev => (prev - 1 + playlist.length) % playlist.length);
  };

  const addSongFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    // Clean up the filename - remove extension and special characters
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[-_]/g, " ")    // Replace underscores and dashes with spaces
      .replace(/\s+/g, " ")     // Replace multiple spaces with single space
      .trim();
    
    const newSong = { 
      title: cleanFileName || "New Song", 
      src: url 
    };

    setPlaylist(prev => {
      const updated = [...prev, newSong];
      setCurrentSong(updated.length - 1); // play the new song
      return updated;
    });
    setPlaying(true);
    
    // Reset file input
    e.target.value = "";
  };

  const addMemoryPicture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newMemory = { 
      id: Date.now(), 
      label: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      img: url, 
      userAdded: true 
    };
    setMemories(prev => [...prev, newMemory]);
    
    // Reset file input
    e.target.value = "";
  };

  const deleteMemory = (id) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const truncateText = (text, maxLength = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="pt-20 min-h-screen w-full px-4 sm:px-6 lg:px-8 relative">
      {/* Header */}
      <section className="text-center max-w-4xl mx-auto">
        <p className="text-xs tracking-widest text-rose-500 uppercase">Our journey</p>
        <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900">Memories We Made</h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base">Little moments that quietly became forever.</p>
      </section>

      {/* Memories Grid - Full width layout */}
      <section className="mt-14 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {memories.map(item => (
            <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300">
              <img
                src={item.img}
                alt={item.label}
                onClick={() => setSelected(item)}
                className="h-full w-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
              <p className="absolute bottom-4 left-4 right-4 text-sm text-white opacity-0 group-hover:opacity-100 transition duration-300 text-center font-medium">
                {item.label}
              </p>
              <button
                onClick={() => setLiked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:scale-110 transition hover:bg-white"
              >
                <Heart size={18} className={liked[item.id] ? "fill-rose-500 text-rose-500" : "text-gray-600"} />
              </button>
              {item.userAdded && (
                <button
                  onClick={() => deleteMemory(item.id)}
                  className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-full hover:scale-110 transition hover:bg-red-600"
                  title="Delete Memory"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}

          {/* Add new memory */}
          <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition-colors duration-300">
            <div className="p-6 rounded-full bg-rose-100 mb-4">
              <ImagePlus size={32} className="text-rose-500" />
            </div>
            <span className="text-gray-600 font-medium">Add New Memory</span>
            <span className="text-gray-400 text-sm mt-1">Click to upload</span>
            <input type="file" accept="image/*" className="hidden" onChange={addMemoryPicture} />
          </label>
        </div>
      </section>

      {/* Quote Section */}
      <section className="mt-20 mb-16 text-center max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-rose-500 opacity-20">
            <Heart size={48} className="fill-current" />
          </div>
          <p className="text-gray-600 text-lg italic relative z-10">
            "Every photo holds a story — and every story holds my heart."
          </p>
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
        </div>
      </section>

      {/* Music Player - Fixed at bottom */}
      <div className="fixed bottom-6 left-4 right-4 md:left-8 md:right-8 lg:left-12 lg:right-12 xl:left-16 xl:right-16 z-40 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl p-4 md:p-5">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* Left side - Song info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 bg-gradient-to-br from-rose-500 to-pink-500 text-white p-3 md:p-4 rounded-xl">
              <Music size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                  Now Playing
                </span>
                <span className="text-xs text-gray-500">
                  {currentSong + 1}/{playlist.length}
                </span>
              </div>
              <div className="relative">
                <p 
                  className="text-base md:text-lg font-semibold text-gray-900 truncate pr-8"
                  title={playlist[currentSong]?.title || "No song selected"}
                >
                  {playlist[currentSong]?.title || "No song selected"}
                </p>
                {playlist[currentSong]?.title && playlist[currentSong].title.length > 30 && (
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                )}
              </div>
              {audioError && (
                <p className="text-xs text-red-500 mt-1 truncate">{audioError}</p>
              )}
            </div>
          </div>

          {/* Middle - Progress bar */}
          <div className="flex-1 min-w-0 w-full md:w-auto">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={prevSong}
              className="p-2.5 md:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition hover:scale-105"
              disabled={playlist.length === 0}
            >
              <SkipBack size={20} />
            </button>
            
            <button 
              onClick={togglePlay} 
              className="bg-gradient-to-br from-rose-500 to-pink-500 text-white p-3.5 md:p-4 rounded-full hover:scale-110 transition-transform shadow-lg hover:shadow-xl"
              disabled={playlist.length === 0}
            >
              {playing ? <Pause size={22} /> : <Play size={22} />}
            </button>
            
            <button 
              onClick={nextSong}
              className="p-2.5 md:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition hover:scale-105"
              disabled={playlist.length === 0}
            >
              <SkipForward size={20} />
            </button>

            {/* Volume control */}
            <div className="hidden md:flex items-center gap-2 ml-2">
              <div className="w-24">
                <input
                  type="range"
                  min={0} max={1} step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full accent-rose-500"
                />
              </div>
            </div>

            {/* Add song button */}
            <label className="ml-2 p-2.5 md:p-3 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 cursor-pointer transition hover:scale-105">
              <Plus size={20} />
              <input type="file" accept="audio/*" className="hidden" onChange={addSongFile} />
            </label>
          </div>
        </div>

        {/* Mobile volume control */}
        <div className="md:hidden mt-4">
          <input
            type="range"
            min={0} max={1} step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1.5 rounded-full accent-rose-500"
          />
        </div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} preload="auto" />

      {/* Lightbox */}
      {selected && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div 
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelected(null)} 
              className="absolute -top-12 right-0 text-white hover:text-rose-300 transition p-2"
            >
              <X size={32} />
            </button>
            <div className="rounded-2xl overflow-hidden">
              <img 
                src={selected.img} 
                alt={selected.label} 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
            <p className="mt-4 text-center text-white text-lg font-medium">{selected.label}</p>
          </div>
        </div>
      )}

      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-rose-50/20 via-white to-pink-50/20" />
    </div>
  );
};

export default Memories;
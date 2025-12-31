"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Lock, Sparkles, Gift, Play, Pause, SkipBack, SkipForward, Volume2, Music, Calendar, Target, Clock, LockOpen, CheckCircle, Star } from "lucide-react";

/* ================= CONFIG ================= */

const ANNIVERSARY_DATE = "2025-04-09";
const DATING_DATE = "2025-06-24";
const ENGAGEMENT_DATE = "2030-04-09";
const MARRIAGE_DATE = "2030-04-09";
const PRIVATE_PASSWORD = "fahif";

const loveNotes = [
  "You are my safest place 🤍",
  "Every future I imagine has you in it 💫",
  "Loving you feels like home 🏡",
  "You're my favorite hello and hardest goodbye 💕",
  "My heart is yours, now and forever 🌸",
];

const loveSongs = [
  {
    title: "Asan Nahi Yahan",
    artist: "Ariyan & Ariya",
    src: "/music/asan.mp3",
    duration: "3:35"
  },
  {
    title: "Batoon Ko Teri",
    artist: "Hifjur & Fahamida",
    src: "/music/baton.m4a",
    duration: "4:29"
  },
  {
    title: "Tu Hi Haqeqat",
    artist: "Josim & Tanaj",
    src: "/music/haq.mp3",
    duration: "4:41"
  },
  {
    title: "Dill Mang Raha Hai",
    artist: "Hifjur",
    src: "/music/mang.wav",
    duration: "4:45"
  },
  {
    title: "Uska Hi Banana",
    artist: "Fahamida",
    src: "/music/uska.mp3",
    duration: "6:15"
  },
  {
    title: "A Dill Hai Mushkil",
    artist: "Fahamida",
    src: "/music/dill.mp3",
    duration: "5:15"
  },
  {
    title: "Kal Jo Na Tujhse",
    artist: "Fahamida",
    src: "/music/kal.mp3",
    duration: "6:19"
  },
  {
    title: "Agar Tum Sath Ho",
    artist: "Fahamida",
    src: "/music/agartum.mp3",
    duration: "5:42"
  },
  {
    title: "Chamma Chamma",
    artist: "Fahamida",
    src: "/music/chammachamma.mp3",
    duration: "2:54"
  },
  {
    title: "Chhod Diya Wo Rasta",
    artist: "Fahamida",
    src: "/music/chhodDiya.mp3",
    duration: "5:59"
  },
  {
    title: "Hasi",
    artist: "Fahamida",
    src: "/music/hasi.mp3",
    duration: "4:18"
  },
  {
    title: "Choliya Ke Hukk",
    artist: "Fahamida",
    src: "/music/choliyaK.mp3",
    duration: "7:06"
  },
  {
    title: "Hua Hai Aaj",
    artist: "Fahamida",
    src: "/music/huaHaiAaj.mp3",
    duration: "6:23"
  },
  {
    title: "Kabhi Jo Badal",
    artist: "Fahamida",
    src: "/music/kabhiJo.mp3",
    duration: "5:22"
  },
  {
    title: "Kal Jo Na Tujhse",
    artist: "Fahamida",
    src: "/music/kal.mp3",
    duration: "6:21"
  },
  {
    title: "Komariya Dole Gole",
    artist: "Fahamida",
    src: "/music/kamariyaDole.mp3",
    duration: "3:44"
  },
  {
    title: "Mareez-e-Ishq",
    artist: "Fahamida",
    src: "/music/mareezIshq.mp3",
    duration: "5:07"
  },
  {
    title: "Pyar Karte Ho Na",
    artist: "Fahamida",
    src: "/music/pyarKarte.mp3",
    duration: "3:23"
  },
  {
    title: "Teri Sansoon Mein",
    artist: "Fahamida",
    src: "/music/teriSanson.mp3",
    duration: "6:03"
  },
];

/* ================= MUSIC PLAYER ================= */

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(new Audio());

  const currentSong = loveSongs[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    
    // Set initial volume
    audio.volume = volume;
    audio.src = currentSong.src;
    
    // If was playing before song change, continue playing
    if (isPlaying) {
      audio.play().catch(e => console.log("Autoplay prevented:", e));
    }

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => playNext();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [currentSongIndex]);

  useEffect(() => {
    // Update src when song changes
    audioRef.current.src = currentSong.src;
    
    // If was playing, start new song
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log("Play error:", e));
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play().catch(e => {
        console.log("Play error:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  };

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    audioRef.current.currentTime = value;
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    audioRef.current.volume = value;
  };

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playNext = () => {
    const nextIndex = (currentSongIndex + 1) % loveSongs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
  };

  const playPrev = () => {
    const prevIndex = (currentSongIndex - 1 + loveSongs.length) % loveSongs.length;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(true);
  };

  return (
    <div className="bg-gradient-to-r from-rose-100 to-pink-100 p-6 rounded-3xl shadow-xl border border-rose-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl">
            <Music className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Our Love Songs</h3>
            <p className="text-sm text-gray-600">Songs that tell our story</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loveSongs.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${index === currentSongIndex ? 'bg-rose-500' : 'bg-rose-300'}`}
            />
          ))}
        </div>
      </div>

      {/* Song Info */}
      <div className="mb-6 bg-white/80 rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl flex items-center justify-center">
            <Music className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg">{currentSong.title}</h4>
            <p className="text-gray-600">{currentSong.artist}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="text-xs text-rose-500 font-medium px-2 py-1 bg-rose-100 rounded-full">
                {currentSong.duration}
              </div>
              <div className="text-xs text-gray-500">Song {currentSongIndex + 1} of {loveSongs.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500"
        />
      </div>

      {/* Controls */}
      {/* Controls - Centered */}
<div className="flex flex-col items-center mb-6">
  <div className="flex items-center gap-6 mb-4">
    <button onClick={playPrev} className="p-2 hover:bg-white/50 rounded-full transition-colors">
      <SkipBack className="text-rose-500" size={24} />
    </button>
    <button
      onClick={togglePlay}
      className="p-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all hover:scale-105"
    >
      {isPlaying ? <Pause size={28} /> : <Play size={28} />}
    </button>
    <button onClick={playNext} className="p-2 hover:bg-white/50 rounded-full transition-colors">
      <SkipForward className="text-rose-500" size={24} />
    </button>
  </div>
  
  <div className="flex items-center gap-2 w-full max-w-xs">
    <Volume2 size={20} className="text-gray-600" />
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={volume}
      onChange={handleVolumeChange}
      className="flex-1 h-1.5 bg-rose-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500"
    />
  </div>
</div>

      {/* Song List */}
      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
        {loveSongs.map((song, index) => (
          <div
            key={index}
            onClick={() => {
              setCurrentSongIndex(index);
              setIsPlaying(true);
            }}
            className={`p-3 rounded-xl cursor-pointer transition-all ${index === currentSongIndex ? 'bg-white shadow-md border border-rose-200' : 'hover:bg-white/50'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === currentSongIndex ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-500'}`}>
                  <Music size={16} />
                </div>
                <div>
                  <div className={`font-medium ${index === currentSongIndex ? 'text-rose-600' : 'text-gray-700'}`}>
                    {song.title}
                  </div>
                  <div className="text-xs text-gray-500">{song.artist}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{song.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= MEMORY GAME ================= */

const symbols = ["💖", "💍", "💌", "🌸", "✨", "🎀", "💕", "🥂"];

const MemoryGame = ({ onWin }) => {
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const shuffled = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol, flipped: false }));
    setCards(shuffled);
    setOpen([]);
    setMatched([]);
    setMoves(0);
    setGameStarted(true);
  };

  const handleCardClick = (id) => {
    if (open.length === 2 || open.includes(id) || matched.includes(id) || !gameStarted) return;
    
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(updatedCards);
    
    const newOpen = [...open, id];
    setOpen(newOpen);
    setMoves(moves + 1);

    if (newOpen.length === 2) {
      const [firstId, secondId] = newOpen;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard.symbol === secondCard.symbol) {
        setMatched(prev => [...prev, firstId, secondId]);
        setTimeout(() => setOpen([]), 500);
      } else {
        setTimeout(() => {
          const resetCards = updatedCards.map(card =>
            card.id === firstId || card.id === secondId ? { ...card, flipped: false } : card
          );
          setCards(resetCards);
          setOpen([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setTimeout(() => onWin(), 500);
    }
  }, [matched]);

  return (
    <div className="bg-gradient-to-br from-white to-rose-50 p-6 rounded-3xl shadow-xl border border-rose-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Couple Memory Game</h3>
            <p className="text-sm text-gray-600">Match all pairs to win!</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-500">Moves</div>
            <div className="font-bold text-rose-600">{moves}</div>
          </div>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all duration-300 transform ${
              card.flipped || matched.includes(card.id)
                ? 'bg-gradient-to-br from-rose-100 to-pink-100 rotate-0 scale-100'
                : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:scale-105'
            } ${
              matched.includes(card.id) ? 'ring-2 ring-rose-400 ring-opacity-50' : ''
            }`}
          >
            {card.flipped || matched.includes(card.id) ? card.symbol : "?"}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
          <span className="text-gray-600">Matched: {matched.length / 2} / {symbols.length}</span>
        </div>
        <div className="text-gray-500">
          {matched.length === cards.length ? "All matched! 🎉" : "Keep going!"}
        </div>
      </div>
    </div>
  );
};

/* ================= TIMELINE ================= */

const Timeline = () => {
  const now = new Date();

  const stages = [
    { 
      label: "First Meeting", 
      date: "2024-02-05",
      icon: "👁️",
      color: "bg-gradient-to-r from-blue-100 to-cyan-100",
      borderColor: "border-blue-200"
    },
    { 
      label: "Dating", 
      date: DATING_DATE,
      icon: "💖",
      color: "bg-gradient-to-r from-pink-100 to-rose-100",
      borderColor: "border-pink-200"
    },
    { 
      label: "Engaged", 
      date: ENGAGEMENT_DATE,
      icon: "💍",
      color: "bg-gradient-to-r from-purple-100 to-pink-100",
      borderColor: "border-purple-200"
    },
    { 
      label: "Married", 
      date: MARRIAGE_DATE,
      icon: "🏡",
      color: "bg-gradient-to-r from-emerald-100 to-teal-100",
      borderColor: "border-emerald-200"
    },
  ];

  const calculateProgress = () => {
    const firstDate = new Date(stages[0].date);
    const lastDate = new Date(stages[stages.length - 1].date);
    const nowTime = now.getTime();
    const totalDuration = lastDate.getTime() - firstDate.getTime();
    const elapsed = nowTime - firstDate.getTime();
    
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  const activeStages = stages.filter(s => now >= new Date(s.date)).length;
  const progress = calculateProgress();

  return (
    <div className="bg-gradient-to-br from-white to-rose-50 p-6 rounded-3xl shadow-xl border border-rose-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl">
            <Target className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Our Journey Timeline</h3>
            <p className="text-sm text-gray-600">From first look to forever</p>
          </div>
        </div>
        <div className="text-rose-600 font-bold">
          {activeStages} / {stages.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full mb-10 overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
      </div>

      {/* Stages */}
      <div className="relative">
        <div className="flex justify-between">
          {stages.map((stage, i) => {
            const isActive = now >= new Date(stage.date);
            const isFuture = i > activeStages - 1;
            
            return (
              <div key={i} className="relative flex-1 text-center">
                {/* Connection Line */}
                {i < stages.length - 1 && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-300 -z-10" />
                )}
                
                {/* Stage Circle */}
                <div className="relative">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-all duration-500
                    ${isActive 
                      ? `${stage.color} border-2 ${stage.borderColor} shadow-lg scale-110` 
                      : 'bg-gray-100 border-2 border-gray-300'
                    } ${isFuture ? 'opacity-60' : ''}`}
                  >
                    <span className="text-xl">{stage.icon}</span>
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-white" size={12} />
                      </div>
                    )}
                  </div>
                  
                  {/* Date */}
                  <div className={`text-xs font-medium mb-1 ${isActive ? 'text-rose-600' : 'text-gray-500'}`}>
                    {stage.date.split('-')[0]}
                  </div>
                  
                  {/* Label */}
                  <div className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {stage.label}
                  </div>
                  
                  {/* Status */}
                  <div className="text-xs mt-1">
                    {isActive ? (
                      <span className="text-green-600 font-medium">✓ Completed</span>
                    ) : isFuture ? (
                      <span className="text-gray-400">Upcoming</span>
                    ) : (
                      <span className="text-blue-600 font-medium">In progress</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ================= COUNTDOWN ================= */

const MarriageCountdown = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const target = new Date(MARRIAGE_DATE);
      const diff = target - now;

      if (diff > 0) {
        setTime({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-white to-rose-50 border border-rose-200 rounded-xl p-4 min-w-[80px] shadow-sm">
        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          {value.toString().padStart(2, '0')}
        </div>
      </div>
      <div className="text-xs text-gray-600 mt-2 font-medium">{label}</div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-white to-rose-50 p-6 rounded-3xl shadow-xl border border-rose-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl">
            <Clock className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Marriage Countdown</h3>
            <p className="text-sm text-gray-600">The day we become one</p>
          </div>
        </div>
        <div className="text-rose-500 animate-pulse">
          ❤️
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <TimeBox value={time.days} label="DAYS" />
        <TimeBox value={time.hours} label="HOURS" />
        <TimeBox value={time.minutes} label="MINUTES" />
        <TimeBox value={time.seconds} label="SECONDS" />
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-600 mb-2">Until our wedding day</div>
        <div className="text-lg font-bold text-gray-900">{MARRIAGE_DATE}</div>
        <div className="w-full h-2 bg-rose-100 rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-1000"
            style={{ 
              width: `${Math.max(0, Math.min(100, (1825 - time.days) / 1825 * 100))}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* ================= SPECIAL MESSAGE CARD ================= */

const SpecialMessageCard = () => {
  return (
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-3xl shadow-xl border border-rose-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl">
            <Heart className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Special Message</h3>
            <p className="text-sm text-gray-600">From my heart to yours</p>
          </div>
        </div>
        <div className="text-xs text-rose-600 font-medium px-3 py-1 bg-rose-100 rounded-full">
          💌 Personal
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-rose-200">
        <div className="text-center mb-4">
          <div className="text-4xl mb-3">💕</div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">My Dearest Love</h4>
          <p className="text-gray-600">
            This space is reserved for all the words my heart wants to say to you.
            Every moment with you feels like a beautiful dream come true.
          </p>
        </div>

        <div className="space-y-3 mt-6">
          <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl">
            <div className="text-rose-500 mt-0.5">✨</div>
            <div>
              <p className="font-medium text-gray-900">You are my everything</p>
              <p className="text-sm text-gray-600">My safe place, my happiness, my home</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-xl">
            <div className="text-pink-500 mt-0.5">💫</div>
            <div>
              <p className="font-medium text-gray-900">Forever and always</p>
              <p className="text-sm text-gray-600">No matter what, I'll always choose you</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-rose-100 text-center">
          <p className="text-sm text-gray-600 italic">
            "You are the missing piece I never knew I needed, 
            and now I can't imagine my life without you."
          </p>
        </div>
      </div>
    </div>
  );
};

/* ================= FUTURE GOALS ================= */

const FutureGoals = () => {
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem("goals")) || [];
    }
    return [];
  });

  const addGoal = () => {
    if (!goal.trim()) return;
    const newGoals = [...goals, { 
      id: Date.now(), 
      text: goal.trim(), 
      date: new Date().toLocaleDateString(),
      completed: false 
    }];
    setGoals(newGoals);
    localStorage.setItem("goals", JSON.stringify(newGoals));
    setGoal("");
  };

  const toggleGoal = (id) => {
    const newGoals = goals.map(g =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    setGoals(newGoals);
    localStorage.setItem("goals", JSON.stringify(newGoals));
  };

  const deleteGoal = (id) => {
    const newGoals = goals.filter(g => g.id !== id);
    setGoals(newGoals);
    localStorage.setItem("goals", JSON.stringify(newGoals));
  };

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;

  return (
    <div className="bg-gradient-to-br from-white to-rose-50 p-6 rounded-3xl shadow-xl border border-rose-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl">
            <Star className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Our Dream Goals</h3>
            <p className="text-sm text-gray-600">Building our future together</p>
          </div>
        </div>
        <div className="text-xs font-medium text-rose-600">
          {completedGoals} / {totalGoals} Completed
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-700">Progress</span>
          <span className="text-rose-600 font-medium">
            {totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0}%
          </span>
        </div>
        <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500"
            style={{ width: `${totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Add Goal */}
      <div className="flex gap-2 mb-6">
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addGoal()}
          className="flex-1 border border-rose-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          placeholder="Add a new dream goal..."
        />
        <button
          onClick={addGoal}
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium"
        >
          Add
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star className="mx-auto mb-2 text-gray-400" size={24} />
            <p>No goals yet. Add your first dream!</p>
          </div>
        ) : (
          goals.map((g) => (
            <div
              key={g.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                g.completed 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                  : 'bg-white border border-rose-100'
              }`}
            >
              <button
                onClick={() => toggleGoal(g.id)}
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  g.completed 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'border-2 border-rose-300'
                }`}
              >
                {g.completed && <CheckCircle className="text-white" size={14} />}
              </button>
              
              <div className="flex-1">
                <div className={`font-medium ${g.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {g.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">{g.date}</div>
              </div>
              
              <button
                onClick={() => deleteGoal(g.id)}
                className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ================= PRIVATE SECTION ================= */

const PrivateSection = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("privateUnlocked") === "true";
    }
    return false;
  });

  const checkPassword = () => {
    if (input === PRIVATE_PASSWORD) {
      localStorage.setItem("privateUnlocked", "true");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  if (unlocked) {
    return (
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-3xl shadow-xl border border-rose-200 text-center">
        <div className="relative inline-block mb-6">
          <div className="absolute -inset-4 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-lg opacity-50"></div>
          <div className="relative p-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl">
            <LockOpen className="text-white" size={32} />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">For Your Eyes Only</h3>
        
        <div className="space-y-4 mb-8">
          {loveNotes.map((note, i) => (
            <div 
              key={i}
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-rose-200 animate-fade-in"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <p className="text-gray-800 text-lg">{note}</p>
            </div>
          ))}
        </div>
        
        <div className="text-sm text-gray-600">
          This message is meant only for you. I love you more than words can express. 💕
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl shadow-xl border border-gray-200 text-center">
      <div className="relative inline-block mb-6">
        <div className="absolute -inset-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full blur-lg opacity-30"></div>
        <div className="relative p-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl">
          <Lock className="text-white" size={32} />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Private Section</h3>
      <p className="text-gray-600 mb-6">Enter our special password to unlock</p>
      
      <div className={`mb-4 transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkPassword()}
          placeholder="💕 Type our secret password..."
          className={`w-full px-4 py-3 rounded-xl border text-center font-medium focus:outline-none focus:ring-2 transition-all ${
            error 
              ? 'border-red-300 bg-red-50 focus:ring-red-300' 
              : 'border-rose-200 focus:ring-rose-300'
          }`}
        />
      </div>
      
      <button
        onClick={checkPassword}
        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        Unlock Private Message
      </button>
      
      {error && (
        <div className="mt-4 text-sm text-red-500 animate-fade-in">
          Wrong password. Try again with love 💖
        </div>
      )}
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const Future = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [wonGame, setWonGame] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (today === ANNIVERSARY_DATE) {
      setUnlocked(true);
    }
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="pt-16 md:pt-20 min-h-screen px-4 md:px-6 lg:px-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center mb-10 md:mb-12 mt-5">
        <div className="relative inline-block mb-6">
          <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-xl opacity-30"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-3xl shadow-lg border border-rose-100">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-3 mt-2">
              Our Beautiful Future
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              A journey of love, dreams, and memories we'll create together. 
              Every moment with you is a treasure I cherish.
            </p>
            <div className="flex justify-center items-center gap-2 mt-4">
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-rose-300 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="space-y-6 md:space-y-8">
          <Timeline />
          <MarriageCountdown />
          <SpecialMessageCard />
        </div>

        {/* Right Column */}
        <div className="space-y-6 md:space-y-8">
          <MusicPlayer />
          
          {unlocked ? (
            <>
              <MemoryGame onWin={() => setWonGame(true)} />

              {wonGame && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-3xl shadow-xl border border-green-200 text-center animate-fade-in">
                  <div className="relative inline-block mb-4">
                    <div className="absolute -inset-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full blur-lg opacity-30"></div>
                    <div className="relative p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                      <Gift className="text-white" size={32} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">You Did It! 🎉</h3>
                  <p className="text-gray-700 mb-4">
                    You completed the memory game! Here's your special reward...
                  </p>
                  <div className="bg-white/80 p-4 rounded-xl border border-green-200">
                    <p className="text-lg font-medium text-gray-900">
                      I love you more than yesterday, less than tomorrow. 💕
                    </p>
                  </div>
                </div>
              )}

              {wonGame && (
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-3xl shadow-xl border border-rose-200">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 text-center">Love Notes</h3>
                  <div className="space-y-3">
                    {loveNotes.map((note, i) => (
                      <div 
                        key={i}
                        className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-rose-200 animate-fade-in"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        <p className="text-gray-800 text-center">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <FutureGoals />
              <PrivateSection />
            </>
          ) : (
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-3xl shadow-xl border border-pink-200 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Special Features Locked</h3>
                  <p className="text-gray-600">
                    Games and surprises unlock on our anniversary day! 💫
                  </p>
                  <div className="mt-4 text-sm text-rose-600 font-medium">
                    {ANNIVERSARY_DATE} is the magic date!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Hearts */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {[...Array(isMobile ? 3 : 5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-200/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
              fontSize: `${isMobile ? 20 : 24 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #fdf2f8;
        }
        
        ::-webkit-slider-thumb {
          background: linear-gradient(to bottom, #f472b6, #fb7185);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default Future;

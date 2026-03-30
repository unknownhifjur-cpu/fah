import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios';
import { Cake, Send, Upload, Trash2, Heart, Calendar } from 'lucide-react';

// ================== CONFIG ==================
const BIRTHDAY_DATE = '2025-04-09'; // Change to actual birthday
const PERSON_NAME = 'Ariya'; // Change if needed

// ================== COUNTDOWN TIMER ==================
const BirthdayCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(BIRTHDAY_DATE);
    const timer = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 min-w-[70px] shadow-lg border border-rose-200">
        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          {value.toString().padStart(2, '0')}
        </div>
      </div>
      <div className="text-xs text-gray-600 mt-2 uppercase font-medium">{label}</div>
    </div>
  );

  const isToday = new Date().toDateString() === target.toDateString();

  if (isToday) {
    return (
      <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-6 text-center">
        <div className="text-2xl font-bold text-rose-600 animate-bounce">🎉 HAPPY BIRTHDAY! 🎉</div>
        <p className="text-gray-700 mt-2">Today is your special day!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-rose-50 p-6 rounded-3xl shadow-xl border border-rose-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl">
            <Cake className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Countdown to Your Birthday</h3>
            <p className="text-sm text-gray-600">The most special day of the year!</p>
          </div>
        </div>
        <div className="text-rose-500 animate-pulse">🎂</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <TimeBox value={timeLeft.days} label="Days" />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <TimeBox value={timeLeft.minutes} label="Minutes" />
        <TimeBox value={timeLeft.seconds} label="Seconds" />
      </div>
      <div className="text-center text-gray-600 text-sm">
        Until {new Date(BIRTHDAY_DATE).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  );
};

// ================== WISH WALL ==================
const BirthdayWishes = () => {
  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchWishes = useCallback(async () => {
    try {
      // Try API first
      const { data } = await axios.get('/wishes');
      setWishes(data);
    } catch (err) {
      // Fallback to localStorage
      const saved = localStorage.getItem('birthdayWishes');
      if (saved) setWishes(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const addWish = async () => {
    if (!newWish.trim()) return;
    const wishObj = { text: newWish.trim() };
    try {
      const { data } = await axios.post('/wishes', wishObj);
      setWishes([data, ...wishes]);
    } catch (err) {
      // Fallback to localStorage
      const newWishWithId = { ...wishObj, _id: Date.now(), createdAt: new Date().toISOString() };
      const updated = [newWishWithId, ...wishes];
      setWishes(updated);
      localStorage.setItem('birthdayWishes', JSON.stringify(updated));
    }
    setNewWish('');
  };

  useEffect(() => {
    fetchWishes();
  }, [fetchWishes]);

  return (
    <div className="bg-gradient-to-br from-white to-rose-50 p-6 rounded-3xl shadow-xl border border-rose-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl">
          <Heart className="text-white" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Birthday Wishes</h3>
          <p className="text-sm text-gray-600">Leave a sweet message for {PERSON_NAME}</p>
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
          placeholder="Write your wish..."
          className="flex-1 px-4 py-3 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white/70"
          onKeyPress={(e) => e.key === 'Enter' && addWish()}
        />
        <button
          onClick={addWish}
          disabled={!newWish.trim()}
          className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl disabled:opacity-50 hover:opacity-90 transition"
        >
          <Send size={20} />
        </button>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading wishes...</div>
        ) : wishes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="mx-auto mb-2 text-rose-300" size={32} />
            <p>No wishes yet. Be the first to wish her!</p>
          </div>
        ) : (
          wishes.map((wish) => (
            <div key={wish._id} className="bg-white/80 p-4 rounded-xl border border-rose-100">
              <p className="text-gray-700">{wish.text}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(wish.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ================== PHOTO GALLERY ==================
const BirthdayGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchPhotos = async () => {
    try {
      const { data } = await axios.get('/photos');
      setPhotos(data);
    } catch (err) {
      const saved = localStorage.getItem('birthdayPhotos');
      if (saved) setPhotos(JSON.parse(saved));
    }
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await axios.post('/upload', formData);
      await axios.post('/photos', { url: data.url, caption: 'Birthday memory' });
      await fetchPhotos();
    } catch (err) {
      // Fallback: store in localStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = { _id: Date.now(), url: e.target.result, caption: 'Memory', createdAt: new Date().toISOString() };
        const updated = [newPhoto, ...photos];
        setPhotos(updated);
        localStorage.setItem('birthdayPhotos', JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    }
    setUploading(false);
  };

  const deletePhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await axios.delete(`/photos/${id}`);
      setPhotos(photos.filter(p => p._id !== id));
    } catch (err) {
      const updated = photos.filter(p => p._id !== id);
      setPhotos(updated);
      localStorage.setItem('birthdayPhotos', JSON.stringify(updated));
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="bg-gradient-to-br from-white to-rose-50 p-6 rounded-3xl shadow-xl border border-rose-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl">
            <Calendar className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Birthday Memories</h3>
            <p className="text-sm text-gray-600">Beautiful moments together</p>
          </div>
        </div>
        <label className="cursor-pointer bg-rose-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-rose-600 transition">
          <Upload size={16} /> Upload
          <input type="file" accept="image/*" hidden onChange={(e) => e.target.files && uploadPhoto(e.target.files[0])} />
        </label>
      </div>
      {uploading && <p className="text-center text-gray-500 mb-4">Uploading...</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map(photo => (
          <div
            key={photo._id}
            className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            <button
              onClick={(e) => { e.stopPropagation(); deletePhoto(photo._id); }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {photos.length === 0 && !uploading && (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p>No photos yet. Upload your memories!</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-4xl w-full">
            <img src={selectedPhoto.url} alt="" className="w-full h-auto max-h-[90vh] object-contain rounded-lg" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ================== MAIN COMPONENT ==================
const Birthday = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 py-12 px-4 overflow-hidden">
      {/* Floating hearts */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-200/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s infinite ease-in-out`,
              fontSize: `${12 + Math.random() * 30}px`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            {['🎂', '🎈', '🎁', '💖', '✨'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-6 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-2xl opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-rose-100">
              <Cake className="mx-auto text-rose-500 mb-4 animate-bounce" size={48} />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Happy Birthday {PERSON_NAME}!
              </h1>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                Celebrating the most wonderful person in my life.
              </p>
              <div className="mt-6 flex justify-center gap-2">
                <Heart className="text-rose-400 animate-pulse" size={20} />
                <Heart className="text-pink-400 animate-pulse" style={{ animationDelay: "0.2s" }} size={20} />
                <Heart className="text-rose-300 animate-pulse" style={{ animationDelay: "0.4s" }} size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Personal Message */}
        <div className="mb-12 text-center bg-gradient-to-r from-rose-100 to-pink-100 rounded-3xl p-8 shadow-lg">
          <Heart className="mx-auto text-rose-500 mb-4" size={32} fill="currentColor" />
          <p className="text-xl text-gray-800 italic leading-relaxed">
            To my dearest {PERSON_NAME}, <br />
            Every day with you is a celebration, but today is extra special. 
            You make my world brighter, my heart fuller, and my life complete. 
            Happy Birthday, my love. 💕
          </p>
          <p className="mt-4 text-gray-700 font-semibold">— Hifjur</p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <BirthdayCountdown />
          <BirthdayWishes />
        </div>

        {/* Photo Gallery */}
        <BirthdayGallery />
      </div>

      {/* Floating Heart */}
      <div className="fixed bottom-8 right-8 animate-pulse z-20">
        <Heart className="text-rose-500" size={32} fill="currentColor" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
};

export default Birthday;

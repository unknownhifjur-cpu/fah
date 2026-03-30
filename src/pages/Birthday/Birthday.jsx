import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios'; // adjust path if needed
import { Cake, Send, Heart } from 'lucide-react';

const BIRTHDAY_DATE = '2025-04-09';
const PERSON_NAME = 'Ariya';

const BirthdayCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(BIRTHDAY_DATE);
    const timer = setInterval(() => {
      const diff = target - new Date();
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
      <div className="bg-white/80 rounded-2xl p-4 min-w-[70px] shadow-lg border border-rose-200">
        <div className="text-3xl font-bold text-rose-600">{value.toString().padStart(2, '0')}</div>
      </div>
      <div className="text-xs text-gray-600 mt-2 uppercase">{label}</div>
    </div>
  );

  const isToday = new Date().toDateString() === target.toDateString();

  if (isToday) {
    return (
      <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-6 text-center">
        <div className="text-2xl font-bold text-rose-600 animate-bounce">🎉 HAPPY BIRTHDAY! 🎉</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-rose-200">
      <h3 className="font-bold text-gray-900 text-lg mb-4">Countdown to Your Birthday</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <TimeBox value={timeLeft.days} label="Days" />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <TimeBox value={timeLeft.minutes} label="Minutes" />
        <TimeBox value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

const BirthdayWishes = () => {
  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchWishes = async () => {
    try {
      const { data } = await axios.get('/wishes');
      setWishes(data);
    } catch (err) {
      // fallback to localStorage if no backend
      const saved = localStorage.getItem('birthdayWishes');
      if (saved) setWishes(JSON.parse(saved));
    }
    setLoading(false);
  };

  const addWish = async () => {
    if (!newWish.trim()) return;
    try {
      const { data } = await axios.post('/wishes', { text: newWish });
      setWishes([data, ...wishes]);
    } catch (err) {
      const newWishObj = { _id: Date.now(), text: newWish, createdAt: new Date().toISOString() };
      const updated = [newWishObj, ...wishes];
      setWishes(updated);
      localStorage.setItem('birthdayWishes', JSON.stringify(updated));
    }
    setNewWish('');
  };

  useEffect(() => { fetchWishes(); }, []);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-rose-200">
      <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
        <Heart className="text-rose-500" /> Birthday Wishes
      </h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
          placeholder="Write a wish..."
          className="flex-1 px-4 py-2 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300"
          onKeyPress={(e) => e.key === 'Enter' && addWish()}
        />
        <button onClick={addWish} className="bg-rose-500 text-white px-4 py-2 rounded-xl disabled:opacity-50">
          <Send size={20} />
        </button>
      </div>
      <div className="space-y-3 max-h-60 overflow-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading wishes...</p>
        ) : wishes.length === 0 ? (
          <p className="text-center text-gray-500">No wishes yet. Be the first!</p>
        ) : (
          wishes.map(wish => (
            <div key={wish._id} className="bg-rose-50 p-3 rounded-xl">
              <p>{wish.text}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(wish.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Birthday = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Cake className="mx-auto text-rose-500 w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Happy Birthday, {PERSON_NAME}!</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <BirthdayCountdown />
          <BirthdayWishes />
        </div>
        <div className="mt-8 text-center bg-white/80 rounded-2xl p-6">
          <Heart className="mx-auto text-rose-400 mb-2" size={32} fill="currentColor" />
          <p className="text-gray-600">You make every day special. Love you always!</p>
        </div>
      </div>
    </div>
  );
};

export default Birthday;

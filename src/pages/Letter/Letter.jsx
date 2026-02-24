import { useEffect, useState } from "react";
import {
  Heart,
  Lock,
  Unlock,
  Trash,
  Image,
  Calendar,
  Tag,
  Share2,
  MessageCircle,
  Instagram,
  Download,
  Copy,
  Check,
  Sparkles,
  Flame,
  Clock,
  Pen,
} from "lucide-react";

/* ================= CONFIG ================= */
const DIARY_PASSWORD = "fahif"; // 🔐 change this

const THEMES = {
  romantic: { bg: "bg-rose-50", text: "text-rose-700", card: "bg-white" },
  soft: { bg: "bg-amber-50", text: "text-amber-800", card: "bg-white" },
  night: {
    bg: "bg-gray-900",
    text: "text-rose-300",
    card: "bg-gray-800/90 backdrop-blur-sm border border-gray-700",
  },
};

const MOODS = ["Happy", "Missing", "Grateful", "Thinking of you"];

const REACTIONS = ["❤️", "🥺", "😘", "🌸"];

// Handwriting font
const HANDWRITING_FONT = "Dancing Script";

export default function Letter() {
  // ========== AUTHENTICATION ==========
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // ========== ENTRY FORM ==========
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [mood, setMood] = useState("Happy");
  const [privateNote, setPrivateNote] = useState(false);
  const [unlockDate, setUnlockDate] = useState(""); // for scheduled letters

  // ========== ENTRIES STORAGE ==========
  const [entries, setEntries] = useState([]);

  // ========== UI STATE ==========
  const [theme, setTheme] = useState("romantic");
  const [showShareMenu, setShowShareMenu] = useState(null);
  const [copied, setCopied] = useState(false);

  // ========== NEW FEATURES ==========
  const [streak, setStreak] = useState(0);
  const [unlockedPrivateEntries, setUnlockedPrivateEntries] = useState(new Set());
  const [reactions, setReactions] = useState({}); // { entryId: { "❤️": count, ... } }
  const [handwriting, setHandwriting] = useState(false);

  // ========== LOAD FROM LOCALSTORAGE ==========
  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("loveDiary"));
    const savedAuth = localStorage.getItem("diaryUnlocked");
    const savedTheme = localStorage.getItem("diaryTheme");
    const savedReactions = JSON.parse(localStorage.getItem("diaryReactions"));
    const savedHandwriting = localStorage.getItem("diaryHandwriting") === "true";

    if (savedEntries) setEntries(savedEntries);
    if (savedAuth === "true") setAuthenticated(true);
    if (savedTheme) setTheme(savedTheme);
    if (savedReactions) setReactions(savedReactions);
    if (savedHandwriting) setHandwriting(true);
  }, []);

  // ========== PERSIST TO LOCALSTORAGE ==========
  useEffect(() => {
    localStorage.setItem("loveDiary", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("diaryTheme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("diaryReactions", JSON.stringify(reactions));
  }, [reactions]);

  useEffect(() => {
    localStorage.setItem("diaryHandwriting", handwriting.toString());
  }, [handwriting]);

  // ========== STREAK CALCULATION ==========
  useEffect(() => {
    if (entries.length === 0) {
      setStreak(0);
      return;
    }

    // Get unique dates (date part only) and sort descending
    const dates = entries
      .map(e => new Date(e.date).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 1;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // If most recent entry is not today or yesterday, streak is 0
    if (dates[0] !== today && dates[0] !== yesterday) {
      setStreak(0);
      return;
    }

    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const prev = new Date(dates[i + 1]);
      const diff = (current - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  }, [entries]);

  // ========== PASSWORD UNLOCK ==========
  const unlockDiary = () => {
    if (password === DIARY_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("diaryUnlocked", "true");
    }
  };

  // ========== ADD NEW ENTRY ==========
  const addEntry = () => {
    if (!text.trim() && !photo) return;

    const newEntry = {
      id: Date.now(),
      text,
      mood,
      date: new Date().toLocaleDateString(), // e.g., "MM/DD/YYYY"
      private: privateNote,
      image: photo,
      unlockDate: unlockDate || null,
    };

    setEntries([newEntry, ...entries]);
    setText("");
    setPhoto(null);
    setPrivateNote(false);
    setUnlockDate("");

    // Initialize reactions for this entry
    setReactions(prev => ({
      ...prev,
      [newEntry.id]: { "❤️": 0, "🥺": 0, "😘": 0, "🌸": 0 },
    }));

    if (newEntry.image) alert("✅ Your image has been added!");
  };

  // ========== DELETE ENTRY ==========
  const deleteEntry = (id) => {
    if (!confirm("Delete this letter?")) return;
    setEntries(entries.filter(e => e.id !== id));
    setReactions(prev => {
      const newReactions = { ...prev };
      delete newReactions[id];
      return newReactions;
    });
    setUnlockedPrivateEntries(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  // ========== REACTION HANDLER ==========
  const handleReaction = (entryId, emoji) => {
    setReactions(prev => ({
      ...prev,
      [entryId]: {
        ...prev[entryId],
        [emoji]: (prev[entryId]?.[emoji] || 0) + 1,
      },
    }));
  };

  // ========== UNLOCK PRIVATE ENTRY ==========
  const unlockPrivateEntry = (entryId) => {
    const pwd = prompt("This is a private note. Enter the diary password to view:");
    if (pwd === DIARY_PASSWORD) {
      setUnlockedPrivateEntries(prev => new Set([...prev, entryId]));
    } else {
      alert("Incorrect password.");
    }
  };

  // ========== SHARE FUNCTIONS ==========
  const shareToWhatsApp = (entry) => {
    let message = `💌 Love Diary Entry\n`;
    message += `📅 Date: ${entry.date}\n`;
    message += `Mood: ${entry.mood}\n`;
    message += entry.private ? "🔐 Private Note\n" : "";
    message += entry.text ? `\n"${entry.text}"\n` : "";
    message += entry.image ? `\n📸 Image attached` : "";
    message += `\n\nShared from Love Diary 💝`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareToInstagram = async (entry) => {
    if (entry.image) {
      const link = document.createElement('a');
      link.href = entry.image;
      link.download = `love-diary-${entry.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("Image downloaded! You can now upload it to Instagram. Opening Instagram...");
      setTimeout(() => window.open("https://www.instagram.com/", "_blank"), 1000);
    } else {
      let message = `💌 Love Diary\n📅 ${entry.date}\n🎯 ${entry.mood}\n\n`;
      message += entry.text ? `${entry.text}\n` : "";
      message += `\n#LoveDiary #SpecialMoments`;
      window.open(`https://www.instagram.com/direct/new/?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  const copyToClipboard = (entry) => {
    let message = `💌 Love Diary Entry\n`;
    message += `📅 Date: ${entry.date}\n`;
    message += `Mood: ${entry.mood}\n`;
    message += entry.private ? "🔐 Private Note\n" : "";
    message += entry.text ? `\n"${entry.text}"\n` : "";
    message += entry.image ? `\n📸 Image attached` : "";

    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareAllEntries = () => {
    if (!entries.length) return alert("No notes to share!");
    let message = "💌 All my love diary entries:\n\n";
    entries.forEach((e, index) => {
      message += `Entry #${index + 1}\n`;
      message += `📅 ${e.date} | 🎯 ${e.mood}\n`;
      message += e.private ? "🔐 Private Note\n" : "";
      message += e.text ? `${e.text}\n` : "";
      message += e.image ? "📸 [Image attached]\n" : "";
      message += "―".repeat(30) + "\n\n";
    });

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
  };

  const downloadImage = (imageUrl, entryId) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `love-diary-memory-${entryId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ========== "ON THIS DAY" MEMORY ==========
  const getOnThisDayMemory = () => {
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    return entries.find(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === todayMonth && entryDate.getDate() === todayDay;
    });
  };
  const onThisDayMemory = getOnThisDayMemory();

  // ========== DYNAMIC FONT IMPORT ==========
  useEffect(() => {
    if (handwriting) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${HANDWRITING_FONT.replace(' ', '+')}:wght@400;700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      return () => document.head.removeChild(link);
    }
  }, [handwriting]);

  /* ================= PASSWORD SCREEN ================= */
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
        <div className="bg-white p-6 rounded-2xl shadow max-w-sm w-full text-center">
          <Lock className="mx-auto text-rose-500 mb-4" size={32} />
          <h2 className="text-xl font-semibold mb-2">Private Love Diary</h2>
          <p className="text-sm text-gray-500 mb-4">Enter the secret to open 🤍</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Our secret..."
            className="w-full border rounded-xl px-4 py-2 mb-4"
          />

          <button
            onClick={unlockDiary}
            className="bg-rose-500 hover:bg-rose-600 text-white w-full py-2 rounded-xl"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  /* ================= DIARY PAGE ================= */
  return (
    <div className={`min-h-screen pt-20 transition-all relative ${THEMES[theme].bg}`}>
      {/* Night mode animated stars */}
      {theme === 'night' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="stars absolute inset-0"></div>
          <style>{`
            @keyframes star-move {
              from { transform: translateY(0); }
              to { transform: translateY(-2000px); }
            }
            .stars {
              background: transparent;
              width: 3px;
              height: 3px;
              box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
              animation: star-move 200s linear infinite;
            }
            .stars::after {
              content: " ";
              position: absolute;
              top: 2000px;
              width: 3px;
              height: 3px;
              box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
            }
          `}</style>
        </div>
      )}

      {/* Header */}
      <section className="text-center px-4 relative z-10">
        <Heart className="mx-auto text-rose-500" size={36} />
        <h1 className="mt-4 text-3xl font-semibold flex items-center justify-center gap-2">
          Letters From My Heart
          <button
            onClick={() => setHandwriting(!handwriting)}
            className={`ml-2 p-2 rounded-full transition-colors ${
              handwriting ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600'
            }`}
            title={handwriting ? "Switch to classic font" : "Switch to handwritten font"}
          >
            <Pen size={18} />
          </button>
        </h1>
        <p className="text-sm text-gray-500 mt-2">Some words are meant to stay safe forever</p>

        {/* Streak display */}
        {streak > 0 && (
          <div className="mt-3 flex items-center justify-center gap-2 text-rose-600 bg-rose-100 px-4 py-2 rounded-full w-fit mx-auto">
            <Flame size={20} className="fill-rose-500" />
            <span className="font-medium">{streak} day{streak !== 1 ? 's' : ''} streak! 🔥</span>
          </div>
        )}

        <button
          onClick={shareAllEntries}
          className="mt-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 mx-auto"
        >
          <Share2 size={18} />
          Share All Diary 💌
        </button>
      </section>

      {/* On This Day Memory */}
      {onThisDayMemory && (
        <section className="max-w-3xl mx-auto mt-8 px-4 relative z-10">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-500 rounded-xl p-5 shadow-md">
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <Sparkles size={20} />
              <h3 className="font-semibold">On this day...</h3>
            </div>
            <p className="text-gray-700 italic">
              {onThisDayMemory.text || "A memory from the past"}
            </p>
            <p className="text-sm text-gray-500 mt-2">📅 {onThisDayMemory.date}</p>
          </div>
        </section>
      )}

      {/* Writing Card */}
      <section className="max-w-3xl mx-auto mt-14 px-4 relative z-10">
        <div className={`${THEMES[theme].card} rounded-2xl shadow-lg p-6`}>
          {/* Theme & Private Toggle */}
          <div className="flex flex-wrap justify-between gap-2 mb-4">
            <div className="flex gap-2">
              {Object.keys(THEMES).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all ${
                    theme === t
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent"
                      : theme === 'night'
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 hover:border-rose-300"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPrivateNote(!privateNote)}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full transition-colors ${
                privateNote
                  ? "bg-rose-100 text-rose-700"
                  : theme === 'night'
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {privateNote ? <Lock size={16} /> : <Unlock size={16} />}
              {privateNote ? "Private" : "Public"}
            </button>
          </div>

          {/* Textarea */}
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Oi, ekhane kichu likho…"
            className={`w-full rounded-xl p-4 outline-none font-serif text-lg resize-none ${
              THEMES[theme].text
            } ${
              theme === 'night' ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-50 border-gray-200'
            } border focus:border-rose-300 ${handwriting ? 'font-dancing' : ''}`}
            style={handwriting ? { fontFamily: HANDWRITING_FONT, fontSize: '1.2rem' } : {}}
          />

          {/* Image Preview */}
          {photo && (
            <div className="mt-4 relative group">
              <img src={photo} alt="Preview" className="rounded-xl max-h-64 object-cover w-full" />
              <button
                onClick={() => setPhoto(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash size={14} />
              </button>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-wrap justify-between items-center gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Tag size={16} className="text-rose-500" />
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className={`border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 ${
                  theme === 'night' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300'
                }`}
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-rose-600 transition-colors">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Image size={18} className="text-rose-500" />
              </div>
              Add Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setPhoto(ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>

            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-rose-500" />
              <input
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`border rounded-lg px-3 py-2 ${
                  theme === 'night' ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300'
                }`}
              />
            </div>

            <button
              onClick={addEntry}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6  py-2.5 rounded-xl font-medium transition-all hover:scale-105"
            >
              Save Diary
            </button>
          </div>
        </div>
      </section>

      {/* Entries List */}
      <section className="max-w-3xl mx-auto mt-16 px-4 pb-20 space-y-6 relative z-10">
        {entries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
              <Heart className="text-rose-400" size={32} />
            </div>
            <p className="text-gray-400 italic">No letters yet…</p>
            <p className="text-sm text-gray-500 mt-2">Write your first love letter above</p>
          </div>
        )}

        {entries.map((e) => {
          const isLockedScheduled = e.unlockDate && new Date(e.unlockDate) > new Date();
          const isPrivateLocked = e.private && !unlockedPrivateEntries.has(e.id);
          const showContent = !isLockedScheduled && !isPrivateLocked;

          return (
            <div
              key={e.id}
              className={`${THEMES[theme].card} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow ${
                theme === 'night' ? 'border border-gray-700' : ''
              }`}
            >
              {/* Entry Header */}
              <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span className="font-medium">{e.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  {e.private && (
                    <span className="flex items-center gap-1 text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full">
                      <Lock size={10} /> Private
                    </span>
                  )}
                  {isLockedScheduled && (
                    <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      <Clock size={10} /> Scheduled
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                    <Tag size={12} />
                    {e.mood}
                  </span>
                </div>
              </div>

              {/* Entry Content */}
              {showContent ? (
                <>
                  {e.text && (
                    <p
                      className={`font-serif text-lg leading-relaxed ${
                        theme === 'night' ? 'text-gray-100' : 'text-gray-800'
                      } ${handwriting ? 'font-dancing' : ''}`}
                      style={handwriting ? { fontFamily: HANDWRITING_FONT, fontSize: '1.2rem' } : {}}
                    >
                      {e.text}
                    </p>
                  )}

                  {e.image && (
                    <div className="mt-4 relative group">
                      <img src={e.image} alt="Memory" className="rounded-xl w-full max-h-80 object-cover" />
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => downloadImage(e.image, e.id)}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white"
                          title="Download image"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : isLockedScheduled ? (
                <div className="text-center py-6 bg-gray-100 rounded-xl">
                  <Clock size={32} className="mx-auto text-amber-500 mb-2" />
                  <p className="text-gray-600">
                    This letter will unlock on {new Date(e.unlockDate).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 bg-rose-50 rounded-xl">
                  <Lock size={32} className="mx-auto text-rose-500 mb-2" />
                  <p className="text-gray-600 mb-3">This is a private note</p>
                  <button
                    onClick={() => unlockPrivateEntry(e.id)}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Enter password to view
                  </button>
                </div>
              )}

              {/* Reactions */}
              {showContent && (
                <div className="flex gap-2 mt-4">
                  {REACTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(e.id, emoji)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-all hover:scale-110"
                    >
                      <span>{emoji}</span>
                      <span className="text-sm">{reactions[e.id]?.[emoji] || 0}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Entry Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-4">
                <button
                  onClick={() => deleteEntry(e.id)}
                  className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash size={14} />
                  Delete
                </button>

                {showContent && (
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(showShareMenu === e.id ? null : e.id)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-colors"
                    >
                      <Share2 size={14} />
                      Share
                    </button>

                    {showShareMenu === e.id && (
                      <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-[180px] z-50">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => { shareToWhatsApp(e); setShowShareMenu(null); }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors"
                          >
                            <MessageCircle size={16} className="text-green-500" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={() => { shareToInstagram(e); setShowShareMenu(null); }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-700 transition-colors"
                          >
                            <Instagram size={16} className="text-pink-500" />
                            <span>Instagram</span>
                          </button>

                          <button
                            onClick={() => { copyToClipboard(e); setShowShareMenu(null); }}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors"
                          >
                            {copied ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} className="text-blue-500" />
                            )}
                            <span>{copied ? "Copied!" : "Copy Text"}</span>
                          </button>

                          {e.image && (
                            <button
                              onClick={() => { downloadImage(e.image, e.id); setShowShareMenu(null); }}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors"
                            >
                              <Download size={16} className="text-purple-500" />
                              <span>Download Image</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(null)} />
      )}

      <footer className="mt-16 mb-10 text-center text-gray-400 text-sm italic px-4">
        Some letters are written for the heart, not the world.
      </footer>
    </div>
  );
}
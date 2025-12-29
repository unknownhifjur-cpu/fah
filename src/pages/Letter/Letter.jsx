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
} from "lucide-react";

/* ================= CONFIG ================= */
const DIARY_PASSWORD = "fahif"; // 🔐 change this

const THEMES = {
  romantic: { bg: "bg-rose-50", text: "text-rose-700" },
  soft: { bg: "bg-amber-50", text: "text-amber-800" },
  night: { bg: "bg-gray-900", text: "text-rose-300" },
};

const MOODS = ["Happy", "Missing", "Grateful", "Thinking of you"];

export default function Letter() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [entries, setEntries] = useState([]);

  const [theme, setTheme] = useState("romantic");
  const [mood, setMood] = useState("Happy");
  const [privateNote, setPrivateNote] = useState(false);
  
  // Sharing states
  const [showShareMenu, setShowShareMenu] = useState(null);
  const [copied, setCopied] = useState(false);

  /* ---------- LOAD ---------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loveDiary"));
    const savedAuth = localStorage.getItem("diaryUnlocked");
    const savedTheme = localStorage.getItem("diaryTheme");

    if (saved) setEntries(saved);
    if (savedAuth === "true") setAuthenticated(true);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  /* ---------- SAVE ---------- */
  useEffect(() => {
    localStorage.setItem("loveDiary", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("diaryTheme", theme);
  }, [theme]);

  /* ---------- PASSWORD ---------- */
  const unlockDiary = () => {
    if (password === DIARY_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("diaryUnlocked", "true");
    }
  };

  /* ---------- ADD ENTRY ---------- */
  const addEntry = () => {
    if (!text.trim() && !photo) return;

    const newEntry = {
      id: Date.now(),
      text,
      mood,
      date: new Date().toLocaleDateString(),
      private: privateNote,
      image: photo,
    };

    setEntries([newEntry, ...entries]);
    setText("");
    setPhoto(null);
    setPrivateNote(false);

    if (newEntry.image) alert("✅ Your image has been added!");
  };

  /* ---------- DELETE ---------- */
  const deleteEntry = (id) => {
    if (!confirm("Delete this letter?")) return;
    setEntries(entries.filter((e) => e.id !== id));
  };

  /* ---------- SHARE TO WHATSAPP ---------- */
  const shareToWhatsApp = (entry) => {
    let message = `💌 Love Diary Entry\n`;
    message += `📅 Date: ${entry.date}\n`;
    message += `Mood: ${entry.mood}\n`;
    message += entry.private ? "🔐 Private Note\n" : "";
    message += entry.text ? `\n"${entry.text}"\n` : "";
    message += entry.image ? `\n📸 Image attached` : "";
    message += `\n\nShared from Love Diary 💝`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  /* ---------- SHARE TO INSTAGRAM ---------- */
  const shareToInstagram = async (entry) => {
    if (entry.image) {
      // Download image first
      const link = document.createElement('a');
      link.href = entry.image;
      link.download = `love-diary-${entry.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert("Image downloaded! You can now upload it to Instagram. Opening Instagram...");
      
      // Open Instagram
      setTimeout(() => {
        window.open("https://www.instagram.com/", "_blank");
      }, 1000);
    } else {
      // For text-only entries, share via Instagram Direct
      let message = `💌 Love Diary\n📅 ${entry.date}\n🎯 ${entry.mood}\n\n`;
      message += entry.text ? `${entry.text}\n` : "";
      message += `\n#LoveDiary #SpecialMoments`;
      
      const encoded = encodeURIComponent(message);
      window.open(`https://www.instagram.com/direct/new/?text=${encoded}`, "_blank");
    }
  };

  /* ---------- COPY TO CLIPBOARD ---------- */
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

  /* ---------- SHARE ALL ENTRIES ---------- */
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

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  /* ---------- DOWNLOAD IMAGE ---------- */
  const downloadImage = (imageUrl, entryId) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `love-diary-memory-${entryId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ================= PASSWORD SCREEN ================= */
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
        <div className="bg-white p-6 rounded-2xl shadow max-w-sm w-full text-center">
          <Lock className="mx-auto text-rose-500 mb-4" size={32} />
          <h2 className="text-xl font-semibold mb-2">Private Love Diary</h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter the secret to open 🤍
          </p>

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
    <div className={`min-h-screen pt-20 transition-all ${THEMES[theme].bg}`}>
      {/* Header */}
      <section className="text-center px-4">
        <Heart className="mx-auto text-rose-500" size={36} />
        <h1 className="mt-4 text-3xl font-semibold">Letters From My Heart</h1>
        <p className="text-sm text-gray-500 mt-2">
          Some words are meant to stay safe forever
        </p>

        {/* Share All Button */}
        <button
          onClick={shareAllEntries}
          className="mt-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 mx-auto"
        >
          <Share2 size={18} />
          Share All Notes 💌
        </button>
      </section>

      {/* Writing Card */}
      <section className="max-w-3xl mx-auto mt-14 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap justify-between gap-2 mb-4">
            {/* Theme */}
            <div className="flex gap-2">
              {Object.keys(THEMES).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all ${
                    theme === t 
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent" 
                      : "bg-white border-gray-300 hover:border-rose-300"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Private */}
            <button
              onClick={() => setPrivateNote(!privateNote)}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full transition-colors ${
                privateNote 
                  ? "bg-rose-100 text-rose-700" 
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {privateNote ? <Lock size={16} /> : <Unlock size={16} />}
              {privateNote ? "Private" : "Public"}
            </button>
          </div>

          {/* Text */}
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something you feel deeply…"
            className={`w-full rounded-xl p-4 outline-none font-serif text-lg resize-none ${
              THEMES[theme].text
            } bg-${theme === 'night' ? 'gray-800' : 'gray-50'} border border-gray-200 focus:border-rose-300`}
          />

          {/* Preview Image */}
          {photo && (
            <div className="mt-4 relative group">
              <img
                src={photo}
                alt="Preview"
                className="rounded-xl max-h-64 object-cover w-full"
              />
              <button
                onClick={() => setPhoto(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash size={14} />
              </button>
            </div>
          )}

          {/* Bottom */}
          <div className="flex flex-wrap justify-between items-center gap-3 mt-4">
            {/* Mood */}
            <div className="flex items-center gap-2 text-sm">
              <Tag size={16} className="text-rose-500" />
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
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
                    reader.onload = (ev) => {
                      setPhoto(ev.target.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>

            <button
              onClick={addEntry}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all hover:scale-105"
            >
              Save Letter
            </button>
          </div>
        </div>
      </section>

      {/* Entries */}
      <section className="max-w-3xl mx-auto mt-16 px-4 pb-20 space-y-6">
        {entries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
              <Heart className="text-rose-400" size={32} />
            </div>
            <p className="text-gray-400 italic">No letters yet…</p>
            <p className="text-sm text-gray-500 mt-2">Write your first love letter above</p>
          </div>
        )}

        {entries.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow">
            {/* Header */}
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
                <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  <Tag size={12} />
                  {e.mood}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              {e.text && (
                <p className="font-serif text-gray-800 text-lg leading-relaxed">
                  {e.text}
                </p>
              )}
              
              {e.image && (
                <div className="mt-4 relative group">
                  <img
                    src={e.image}
                    alt="Memory"
                    className="rounded-xl w-full max-h-80 object-cover"
                  />
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
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={() => deleteEntry(e.id)}
                  className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash size={14} />
                  Delete
                </button>
              </div>
              
              {/* Share Menu */}
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
                        onClick={() => {
                          shareToWhatsApp(e);
                          setShowShareMenu(null);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors"
                      >
                        <MessageCircle size={16} className="text-green-500" />
                        <span>WhatsApp</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          shareToInstagram(e);
                          setShowShareMenu(null);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-700 transition-colors"
                      >
                        <Instagram size={16} className="text-pink-500" />
                        <span>Instagram</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          copyToClipboard(e);
                          setShowShareMenu(null);
                        }}
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
                          onClick={() => {
                            downloadImage(e.image, e.id);
                            setShowShareMenu(null);
                          }}
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
            </div>
          </div>
        ))}
      </section>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(null)}
        />
      )}

      <footer className="mt-16 mb-10 text-center text-gray-400 text-sm italic px-4">
        Some letters are written for the heart, not the world.
      </footer>
    </div>
  );
}
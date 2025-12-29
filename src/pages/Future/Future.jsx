import { useState, useEffect } from "react";
import { Heart, Lock, Sparkles, Gift } from "lucide-react";

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
];

/* ================= MEMORY GAME ================= */

const symbols = ["💖", "💍", "💌", "🌸", "✨", "🎀"];

const MemoryGame = ({ onWin }) => {
  const shuffled = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
  const [cards] = useState(shuffled);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);

  const click = (i) => {
    if (open.length === 2 || open.includes(i) || matched.includes(i)) return;
    setOpen([...open, i]);
  };

  useEffect(() => {
    if (open.length === 2) {
      const [a, b] = open;
      if (cards[a] === cards[b]) {
        setMatched((p) => [...p, a, b]);
      }
      setTimeout(() => setOpen([]), 600);
    }
  }, [open]);

  useEffect(() => {
    if (matched.length === cards.length) onWin();
  }, [matched]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow">
      <h3 className="text-center font-medium mb-4">
        Couple Memory Game 💕
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <button
            key={i}
            onClick={() => click(i)}
            className={`h-16 rounded-xl text-2xl flex items-center justify-center
            ${
              open.includes(i) || matched.includes(i)
                ? "bg-rose-100"
                : "bg-gray-200"
            }`}
          >
            {open.includes(i) || matched.includes(i) ? c : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ================= TIMELINE ================= */

const Timeline = () => {
  const now = new Date();

  const stages = [
    { label: "Dating", date: DATING_DATE },
    { label: "Engaged", date: ENGAGEMENT_DATE },
    { label: "Married", date: MARRIAGE_DATE },
  ];

  const active = stages.filter(
    (s) => now >= new Date(s.date)
  ).length - 1;

  return (
    <div className="bg-white p-6 rounded-3xl shadow">
      <h3 className="text-center font-medium mb-6">
        Our Journey 💍
      </h3>
      <div className="flex justify-between">
        {stages.map((s, i) => (
          <div key={i} className="text-center flex-1">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2
              ${i <= active ? "bg-rose-500 text-white" : "bg-gray-300"}`}
            >
              {i + 1}
            </div>
            <p className="text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= COUNTDOWN ================= */

const MarriageCountdown = () => {
  const [time, setTime] = useState({});

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      const target = new Date(MARRIAGE_DATE);
      const diff = target - now;

      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
      });
    }, 1000);

    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl shadow text-center">
      <h3 className="font-medium mb-2">Until We Marry 💍</h3>
      <p className="text-rose-500 font-semibold">
        {time.days} days · {time.hours} hrs · {time.mins} mins
      </p>
    </div>
  );
};

/* ================= VIDEO ================= */

const LoveVideo = () => (
  <div className="bg-white p-6 rounded-3xl shadow">
    <h3 className="text-center font-medium mb-3">
      A Message for You 🎥
    </h3>
    <video controls className="rounded-xl w-full">
      <source src="/public/video/msgV.mp4" type="video/mp4" />
    </video>
  </div>
);

/* ================= FUTURE GOALS ================= */

const FutureGoals = () => {
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState(
    JSON.parse(localStorage.getItem("goals")) || []
  );

  const add = () => {
    if (!goal) return;
    const g = [...goals, goal];
    setGoals(g);
    localStorage.setItem("goals", JSON.stringify(g));
    setGoal("");
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow">
      <h3 className="text-center font-medium mb-4">
        Our Dreams 💌
      </h3>
      <div className="flex gap-2 mb-4">
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full"
          placeholder="Add a dream..."
        />
        <button
          onClick={add}
          className="bg-rose-500 text-white px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      {goals.map((g, i) => (
        <p key={i} className="bg-rose-50 p-2 rounded-lg text-sm mb-2">
          💖 {g}
        </p>
      ))}
    </div>
  );
};

/* ================= PRIVATE ================= */

const PrivateSection = () => {
  const [input, setInput] = useState("");
  const unlocked = localStorage.getItem("privateUnlocked");

  const check = () => {
    if (input === PRIVATE_PASSWORD) {
      localStorage.setItem("privateUnlocked", "true");
      window.location.reload();
    }
  };

  if (unlocked)
    return (
      <div className="bg-rose-50 p-6 rounded-3xl text-center">
        <Heart className="mx-auto text-rose-500 mb-2" />
        <p className="text-sm text-gray-700">
          Only you can read this 🤍  
          I choose you — always.
        </p>
      </div>
    );

  return (
    <div className="bg-gray-100 p-6 rounded-3xl text-center">
      <Lock className="mx-auto mb-3" />
      <input
        type="password"
        className="border rounded-lg px-3 py-2 w-full mb-3"
        placeholder="Secret password 💕"
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={check}
        className="bg-rose-500 text-white px-4 py-2 rounded-full"
      >
        Unlock
      </button>
    </div>
  );
};

/* ================= PAGE ================= */

const Future = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (today === ANNIVERSARY_DATE) setUnlocked(true);
  }, []);

  return (
    <div className="pt-20 min-h-screen px-4 max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl text-center font-semibold">
        Our Future 💖
      </h1>

      <Timeline />
      <MarriageCountdown />
      <LoveVideo />

      {unlocked && (
        <>
          <MemoryGame onWin={() => setWon(true)} />

          {won && (
            <div className="bg-rose-100 p-6 rounded-3xl text-center">
              <Gift className="mx-auto mb-2 text-rose-500" />
              <p className="font-medium text-rose-700">
                You completed everything 🎁  
                I love you endlessly 💕
              </p>
            </div>
          )}

          {won && (
            <div className="bg-white p-6 rounded-3xl shadow">
              {loveNotes.map((n, i) => (
                <p key={i} className="text-sm text-center mb-2">
                  {n}
                </p>
              ))}
            </div>
          )}

          <FutureGoals />
          <PrivateSection />
        </>
      )}

      {!unlocked && (
        <div className="bg-pink-50 p-6 rounded-3xl text-center">
          <Sparkles className="mx-auto text-rose-500 mb-2" />
          <p className="text-sm">
            Games unlock on our anniversary 💫
          </p>
        </div>
      )}
    </div>
  );
};

export default Future;

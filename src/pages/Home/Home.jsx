import { useState, useEffect } from 'react';
import { Heart, Sparkles, CalendarDays, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
   
  { src: "/src/assets/8.jpg",  title: "Casual Charm", description: "Simple look, endless charm" },
  { src: "/src/assets/3.jpg",  title: "That Smile", description: "A smile that stays with me" },
  { src: "/src/assets/6.jpg",  title: "Grace in Saree", description: "Elegance in every fold" },

  { src: "/src/assets/9.jpg",  title: "Ariya", description: "The calm in my chaos" },
  { src: "/src/assets/11.jpeg", title: "Golden Hour", description: "She shines without trying" },
  { src: "/src/assets/12.jpeg", title: "Soft Moments", description: "Peaceful, warm, and real" },
  { src: "/src/assets/13.jpeg", title: "Her Aura", description: "You feel it before you see it" },
  { src: "/src/assets/16.jpeg", title: "That Look", description: "A moment frozen perfectly" },
  { src: "/src/assets/17.jpg", title: "Soft Focus", description: "Gentle eyes, strong soul" },
  { src: "/src/assets/18.jpg",  title: "Eye Magic", description: "Even ordinary feels special" },
  { src: "/src/assets/19.jpg",  title: "Timeless", description: "Some moments never age" },
  { src: "/src/assets/20.jpg",  title: "Stillness", description: "Peace captured in a frame" },
  { src: "/src/assets/21.jpg",  title: "Her World", description: "A glimpse into her universe" },
  { src: "/src/assets/22.jpg",  title: "Unspoken", description: "Some feelings don’t need words" },
  { src: "/src/assets/23.jpg",  title: "Warm Light", description: "Soft glow, softer heart" },
  { src: "/src/assets/24.jpg",  title: "Natural Grace", description: "Beauty in being herself" },
  { src: "/src/assets/25.jpg",  title: "Calm Energy", description: "Silence that feels comforting" },
  { src: "/src/assets/26.jpg",  title: "Simple Joy", description: "Happiness in small moments" },
  { src: "/src/assets/27.jpg",  title: "Her Presence", description: "Changes the whole frame" },
  { src: "/src/assets/28.jpg",  title: "Soft Shame", description: "The kind you remember" },
  { src: "/src/assets/29.jpg",  title: "Subtle Glow", description: "Nothing loud, everything perfect" },
  { src: "/src/assets/30.jpg",  title: "True Moment", description: "Real, raw, and beautiful" },
  { src: "/src/assets/31.jpg",  title: "Eyes Speak", description: "Stories hidden in her eyes" },
  { src: "/src/assets/32.jpg",  title: "Light & Love", description: "Captured at the right time" },
  { src: "/src/assets/33.jpg",  title: "Gentle Mood", description: "Soft tones, soft feelings" },
  { src: "/src/assets/34.jpg",  title: "Natural Frame", description: "No filter, just her" },
  { src: "/src/assets/35.jpeg", title: "Quiet Confidence", description: "Strength wrapped in calm" },
  { src: "/src/assets/36.jpeg", title: "Lasting Impression", description: "Hard to forget, easy to admire" },
  ];

  const memories = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "First Time I Saw You",
    date: "December 2023",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "First Time You Saw Me",
    date: "February 2024",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "When Love Became Ours",
    date: "2024",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: "Still Writing Our Story",
    date: "2025 → 2026",
    color: "bg-amber-100 text-amber-600",
  },
];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 relative overflow-x-hidden">

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-rose-200/20 to-pink-200/20 -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-200/10 to-rose-200/10 rounded-full -z-10" />

      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Hero Section */}
        <section className="text-center mt-8 mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-rose-400 mr-2 animate-pulse" />
            <span className="text-rose-500 font-semibold tracking-wide">Our Love Story</span>
            <Sparkles className="w-8 h-8 text-rose-400 ml-2 animate-pulse" />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Our Journey</span>
          </h1>

          <p className="mt-6 text-gray-700 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            A sacred space where <span className="text-rose-500 font-medium">memories blossom</span>, 
            <span className="text-pink-500 font-medium"> dreams intertwine</span>, and our 
            <span className="text-rose-600 font-medium"> love story</span> unfolds across time.
          </p>

         
        </section>

        {/* Carousel */}
        <section className="mt-20 mb-16">
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-64 sm:h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImage ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img 
                    src={image.src} 
                    alt={image.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-8 left-6 sm:left-8 text-white">
                      <h3 className="text-2xl md:text-3xl font-bold">{image.title}</h3>
                      <p className="text-lg opacity-90">{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImage ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Memories Grid */}
        <section className="mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Memory Lane</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Timeless moments that define our journey together</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {memories.map((memory, index) => (
              <div 
                key={index}
                className={`${memory.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-white/50">
                    {memory.icon}
                  </div>
                  <span className="text-sm font-semibold opacity-75">{memory.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{memory.title}</h3>
                <p className="opacity-75">A beautiful chapter in our story</p>
              </div>
            ))}
          </div>
        </section>

        {/* Love Quote Section */}
        <section className="mt-20 mb-16 relative overflow-hidden rounded-3xl py-16 px-6 text-center bg-gradient-to-br from-rose-100 via-pink-50 to-purple-50">
          <Heart className="w-12 h-12 mx-auto text-rose-400 mb-6 animate-bounce" fill="#f472b6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            "In Your Arms, I Found My Home"
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed italic">
            Every sunrise with you feels like a promise, every sunset a memory cherished. 
            Our love story isn't written in grand gestures, but in the quiet moments that echo forever.
          </p>
          <div className="mt-6 text-sm text-gray-600 tracking-wider">
            • OUR LOVE STORY • CHAPTER BY CHAPTER • ALWAYS AND FOREVER •
          </div>
        </section>

       {/* Features Grid */}
<section className="mt-20 mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Card 1 */}
  <div className="group relative overflow-hidden rounded-2xl shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative p-8 text-white">
      <div className="text-5xl mb-4">💖</div>
      <h3 className="text-2xl font-bold mb-4">Timeless Memories</h3>
      <p className="text-lg opacity-95">
        Little moments that became everything — smiles, late talks, shared dreams,
        all captured in the story we continue to write together.
      </p>
      <div className="mt-6 pt-6 border-t border-white/20 flex items-center text-sm">
        <CalendarDays className="w-4 h-4 mr-2" />
        <span>From the day it all began</span>
      </div>
    </div>
  </div>

  {/* Card 2 */}
  <div className="group relative overflow-hidden rounded-2xl shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative p-8 text-white">
      <div className="text-5xl mb-4">🌙</div>
      <h3 className="text-2xl font-bold mb-4">Dreaming Forward</h3>
      <p className="text-lg opacity-95">
        A future shaped by love, trust, and endless possibilities —
        where every tomorrow feels brighter because we face it together.
      </p>
      <div className="mt-6 pt-6 border-t border-white/20 flex items-center text-sm">
        <Sparkles className="w-4 h-4 mr-2" />
        <span>A lifetime yet to unfold</span>
      </div>
    </div>
  </div>
</section>


        {/* Counters */}
        <section className="mt-20 mb-16 py-12 px-8 bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-rose-600 mb-2">785+</div>
              <div className="text-gray-600">Days Together</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">∞</div>
              <div className="text-gray-600">Shared Smiles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-rose-500 mb-2">1+</div>
              <div className="text-gray-600">Adventures</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">Always</div>
              <div className="text-gray-600">In Love</div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-20 mb-24 text-center">
          <Heart className="w-12 h-12 mx-auto text-rose-400 mb-6 animate-bounce" fill="#f472b6" />
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story Continues...</h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Each day with you is a new page in our beautiful love story. 
            Here's to the memories we've created and the infinite moments still waiting to unfold.
          </p>
        </section>
      </div>
      <footer className="mt-20 border-t border-rose-200 bg-gradient-to-t from-rose-50 via-white to-rose-50">
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        
        {/* Romantic message */}
        <p className="text-sm text-gray-500 mb-2">
          Made with <Heart className="w-4 h-4 inline text-rose-500 animate-pulse" /> 
          love, care, and honesty
        </p>

        {/* Milestone */}
        <p className="mt-2 text-lg font-semibold text-gray-800">
          Happy New Year 2026 · 2 Years Together
        </p>

        {/* Signature */}
        <p className="mt-4 text-sm text-gray-400 italic">
          Forever & Always — Hifjur ❤️
        </p>

        {/* Optional social icons or small decoration */}
        <div className="mt-6 flex justify-center gap-4 text-rose-500">
          <Heart className="w-5 h-5 animate-bounce" />
          <Heart className="w-5 h-5 animate-pulse" />
          <Heart className="w-5 h-5 animate-bounce delay-200" />
        </div>
      </div>
    </footer>
    </div>
    
  );
};

export default Home;

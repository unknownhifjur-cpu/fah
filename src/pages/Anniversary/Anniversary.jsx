import { Heart, CalendarDays, Sparkles, ChevronRight, Star, Target } from "lucide-react";
import { useEffect, useState } from "react";

const anniversaries = [
  {
    year: "First Year",
    date: "2023",
    title: "The First Sight",
    desc: "In December 2023, it was one-sided — the first time I saw her. A quiet moment that unknowingly started everything.",
    color: "bg-gradient-to-r from-rose-100 to-pink-100",
    borderColor: "border-rose-200",
    icon: "👁️"
  },
  {
    year: "Second Year",
    date: "2024",
    title: "From Moments to Love",
    desc: "In February 2024, she saw me for the first time. Later that year, feelings became mutual — our love truly began, two-sided and real.",
    color: "bg-gradient-to-r from-pink-100 to-red-100",
    borderColor: "border-pink-200",
    icon: "💖"
  },
  {
    year: "Third Year",
    date: "2025",
    title: "Deeply Us",
    desc: "By 2025, the bond grew deeper and stronger. Understanding, care, and love beyond words — stronger than ever.",
    color: "bg-gradient-to-r from-red-100 to-rose-100",
    borderColor: "border-red-200",
    icon: "🔗"
  },
  {
    year: "Next Chapter",
    date: "2026",
    title: "Still Choosing Each Other",
    desc: "Stepping into 2026 with hope, commitment, and the same hearts — ready to grow together into the future.",
    color: "bg-gradient-to-r from-rose-50 to-pink-50",
    borderColor: "border-rose-300",
    icon: "🚀"
  },
];

const Anniversary = () => {
  const [activeYear, setActiveYear] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveYear((prev) => (prev + 1) % anniversaries.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 pt-20 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Hero Section with Enhanced Design */}
      <section className="text-center mt-10 max-w-3xl mx-auto">
        <div className="relative inline-block mb-6">
          <div className="absolute -inset-4 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-lg opacity-30"></div>
          <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-rose-100">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full blur"></div>
                <Heart className="relative text-rose-500 animate-pulse" size={40} fill="currentColor" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Our Journey
            </h1>
            <p className="mt-4 text-gray-600 max-w-lg mx-auto text-base">
              A timeline of love, memories, and moments that made us stronger.
              Each year a chapter, each moment a treasure.
            </p>
            <div className="mt-6 flex justify-center items-center gap-2">
              <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-3 h-3 bg-rose-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mt-16 relative max-w-6xl mx-auto">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-3/5 bg-gradient-to-r from-transparent via-rose-50/30 to-transparent blur-3xl"></div>
        
        {/* Main Timeline Line */}
        <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-rose-300 via-pink-300 to-rose-300 hidden md:block transform -translate-x-1/2">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 animate-pulse"></div>
        </div>

        {/* Timeline Cards */}
        <div className={`space-y-24 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {anniversaries.map((item, index) => (
            <div
              key={index}
              className={`relative flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
              onMouseEnter={() => setActiveYear(index)}
            >
              {/* Year Badge */}
              <div className="absolute md:relative left-0 md:left-auto top-0 md:top-auto z-10">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${item.color} border ${item.borderColor} shadow-lg backdrop-blur-sm`}>
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-700">{item.year}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <CalendarDays size={12} className="mr-1" />
                      {item.date}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Dot with Connection */}
              <div className="hidden md:flex relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm ${
                  activeYear === index 
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 scale-110" 
                    : "bg-white border-2 border-rose-200"
                } transition-all duration-300`}>
                  {activeYear === index ? (
                    <Sparkles size={20} className="text-white animate-spin" style={{ animationDuration: "2s" }} />
                  ) : (
                    <div className="w-2 h-2 bg-rose-300 rounded-full"></div>
                  )}
                </div>
                {/* Connection Line */}
                <div className={`absolute top-1/2 ${
                  index % 2 === 0 ? "right-full mr-6" : "left-full ml-6"
                } w-12 h-1 ${
                  activeYear === index 
                    ? "bg-gradient-to-r from-rose-400 to-pink-400" 
                    : "bg-rose-200"
                } transform -translate-y-1/2 transition-all duration-300`}></div>
              </div>

              {/* Card */}
              <div className={`relative w-full max-w-lg transition-all duration-500 ${
                activeYear === index 
                  ? "transform scale-105 z-20" 
                  : "opacity-90 hover:opacity-100"
              }`}>
                <div className={`relative ${item.color} rounded-2xl shadow-xl p-8 border ${item.borderColor} hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-200 to-transparent opacity-20 rounded-tr-2xl"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${item.borderColor} border bg-white/50`}>
                        <Target size={20} className="text-rose-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed text-base">
                      {item.desc}
                    </p>
                    
                    {/* Progress Indicator */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className={`w-8 h-1 rounded-full ${
                          index === 0 ? "bg-rose-400" : "bg-rose-300"
                        }`}></div>
                        <div className={`w-8 h-1 rounded-full ${
                          index <= 1 ? "bg-pink-400" : "bg-pink-300"
                        }`}></div>
                        <div className={`w-8 h-1 rounded-full ${
                          index <= 2 ? "bg-rose-400" : "bg-rose-300"
                        }`}></div>
                        <ChevronRight size={16} className="text-rose-400" />
                      </div>
                      
                      <div className="text-xs text-rose-600 font-medium px-3 py-1 rounded-full bg-white border border-rose-100">
                        Chapter {index + 1}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestone Summary */}
      <section className="mt-24 max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-rose-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {anniversaries.map((item, index) => (
              <div 
                key={index}
                className={`text-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  activeYear === index ? "bg-gradient-to-b from-rose-50 to-pink-50 border border-rose-200" : "hover:bg-rose-50"
                }`}
                onClick={() => setActiveYear(index)}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold text-gray-900">{item.year}</div>
                <div className="text-sm text-gray-500 mt-1">{item.date}</div>
              </div>
            ))}
          </div>
          
          {/* Active Year Indicator */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-4">
              {anniversaries.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveYear(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeYear === index 
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 w-8" 
                      : "bg-rose-200 hover:bg-rose-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="mt-20 mb-12 text-center max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-rose-100 to-pink-100 rounded-3xl blur-xl opacity-50"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-rose-100">
            <div className="flex justify-center mb-4">
              <Star size={24} className="text-rose-400 animate-pulse" />
            </div>
            <p className="text-lg text-gray-700 italic leading-relaxed">
              "Every anniversary is a reminder that love grows when hearts stay true. 
              Each year we choose each other, our story becomes more beautiful."
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
              <div>Celebrating {anniversaries.length} beautiful chapters</div>
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Hearts */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-200/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out`,
              fontSize: `${20 + Math.random() * 30}px`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            ❤️
          </div>
        ))}
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

export default Anniversary;
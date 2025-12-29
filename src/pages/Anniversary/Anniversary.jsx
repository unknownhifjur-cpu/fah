import { Heart, CalendarDays, Sparkles } from "lucide-react";

const anniversaries = [
 
  {
    year: "First Year",
    date: "2023",
    title: "The First Sight",
    desc: "In December 2023, it was one-sided — the first time I saw her. A quiet moment that unknowingly started everything.",
  },
  {
    year: "Second Year",
    date: "2024",
    title: "From Moments to Love",
    desc: "In February 2024, she saw me for the first time. Later that year, feelings became mutual — our love truly began, two-sided and real.",
  },
  {
    year: "Third Year",
    date: "2025",
    title: "Deeply Us",
    desc: "By 2025, the bond grew deeper and stronger. Understanding, care, and love beyond words — stronger than ever.",
  },
  {
    year: "Next Chapter",
    date: "2026",
    title: "Still Choosing Each Other",
    desc: "Stepping into 2026 with hope, commitment, and the same hearts — ready to grow together into the future.",
  },


];

const Anniversary = () => {
  return (
    <div className="pt-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Hero */}
      <section className="text-center mt-10">
        <div className="flex justify-center mb-4">
          <Heart className="text-rose-500" size={36} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
          Our Anniversary
        </h1>
        <p className="mt-4 text-gray-600 max-w-md mx-auto text-sm">
          A timeline of love, memories, and moments that made us stronger.
        </p>
      </section>

      {/* Timeline */}
      <section className="mt-16 relative">
        <div className="absolute left-1/2 top-0 h-full w-px bg-rose-200 hidden md:block" />

        <div className="space-y-14">
          {anniversaries.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-6 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Card */}
              <div className="bg-white rounded-2xl shadow-md p-6 max-w-md w-full hover:shadow-xl transition">
                <div className="flex items-center gap-2 text-rose-500 mb-2">
                  <CalendarDays size={18} />
                  <span className="text-sm font-medium">{item.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.year}
                </h3>
                <p className="mt-2 text-gray-600 text-sm">
                  <span className="font-medium text-gray-800">
                    {item.title}
                  </span>{" "}
                  — {item.desc}
                </p>
              </div>

              {/* Timeline Dot */}
              <div className="hidden md:flex w-10 h-10 rounded-full bg-rose-500 items-center justify-center text-white shadow-lg">
                <Sparkles size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Quote */}
      <section className="mt-20 mb-12 text-center">
        <p className="text-gray-500 text-sm max-w-md mx-auto italic">
          Every anniversary is a reminder that love grows when hearts stay true.
        </p>
      </section>
    </div>
  );
};

export default Anniversary;

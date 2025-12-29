import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-rose-200 bg-linear-to-t from-rose-50 via-white to-rose-50">
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
  );
};

export default Footer;

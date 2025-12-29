import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Anniversary", path: "/anniversary" },
    { name: "Memories", path: "/memories" },
    { name: "Letter", path: "/letter" },
    { name: "Future", path: "/future" },
  ];

  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-[#0f0f14] via-[#151522] to-[#1c0f18] backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <img
              src="/src/assets/c2bg.png"
              alt="Logo"
              className="h-9 w-9 rounded-full"
            />
            <span className="text-white font-semibold tracking-wide">
              Story of FAHIF
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    isActive
                      ? "bg-rose-500/20 text-rose-400"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-white text-2xl"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/60"
            onClick={() => setOpen(false)}
          />

          <div className="w-72 h-full bg-[#12121a] backdrop-blur-xl border-l border-white/10">
            <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
              <span className="text-white font-semibold">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg text-lg transition ${
                      isActive
                        ? "bg-rose-500/20 text-rose-400"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

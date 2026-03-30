import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle body overflow when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Our Journey", path: "/anniversary" },
    { name: "BirthDay", path: "/birthday" }, // <-- changed from /memories to /birthday
    { name: "Diary", path: "/letter" },
    { name: "Special", path: "/future" },
    { name: "Photos", path: "/photos" },
  ];

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#0f0f14]/95 backdrop-blur-xl border-b border-white/10 shadow-lg"
            : "bg-gradient-to-r from-[#0f0f14] via-[#151522] to-[#1c0f18] border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto h-16 lg:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setOpen(false)}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-600 rounded-full blur group-hover:blur-md transition-all duration-300 opacity-70 group-hover:opacity-100"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <img
                src="/image/c2bg.png"
                alt="Logo"
                className="relative h-10 w-10 lg:h-12 lg:w-12 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-tight text-lg lg:text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                FAHIF
              </span>
              <span className="text-xs text-gray-400">Created for Ariya</span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 group ${
                      isActive
                        ? "text-white"
                        : "text-gray-300 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{link.name}</span>
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-purple-600/20 border border-rose-500/30 rounded-full"
                          layoutId="activeTab"
                          transition={{ type: "spring", duration: 0.6 }}
                        />
                      )}
                      {!isActive && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/5 rounded-full transition-opacity duration-300" />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setOpen(true)}
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
            whileTap={{ scale: 0.95 }}
          >
            <span className="sr-only">Open menu</span>
            <div className="flex flex-col gap-1.5">
              <span className="w-6 h-0.5 bg-white transition-all duration-300 group-hover:bg-rose-400" />
              <span className="w-6 h-0.5 bg-white transition-all duration-300 group-hover:bg-rose-400" />
              <span className="w-6 h-0.5 bg-white transition-all duration-300 group-hover:bg-rose-400" />
            </div>
          </motion.button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Side Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs"
            >
              <div className="h-full bg-gradient-to-b from-[#0f0f14] to-[#151522] border-l border-white/10 shadow-2xl">
                {/* Menu Header */}
                <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <img
                      src="/image/c2bg.png"
                      alt="Logo"
                      className="h-10 w-10 rounded-full border-2 border-white/20"
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-bold">FAHIF</span>
                      <span className="text-xs text-gray-400">Menu</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setOpen(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all duration-300"
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-2xl text-white">×</span>
                  </motion.button>
                </div>

                {/* Menu Links */}
                <div className="px-4 py-8 space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={link.path}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 group ${
                            isActive
                              ? "bg-gradient-to-r from-rose-500/20 to-purple-600/20 text-rose-400 border border-rose-500/30"
                              : "text-gray-300 hover:text-white hover:bg-white/10"
                          }`
                        }
                      >
                        <div className="w-2 h-2 rounded-full bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-lg font-medium">{link.name}</span>
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </div>
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
                  <p className="text-center text-sm text-gray-400">
                    Forever in our hearts
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

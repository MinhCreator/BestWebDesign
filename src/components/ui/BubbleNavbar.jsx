import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { AppConfig } from "../../config/app.config";
import { ClassN } from "../../utility/utils";

const BubbleNavbar = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-700"
      : "text-slate-900 hover:text-blue-700";

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] hidden lg:block"
        >
          <div className="flex items-center gap-1 px-5 py-2 bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-white/20">
            <Link to="/" className="mr-3">
              <img src="/brand-logo.svg" alt="logo" className="w-8 h-8" />
            </Link>
            {AppConfig.Routes.map((router, index) => {
              if (router.NavbarComp === false) return null;
              return (
                <Link
                  key={index}
                  to={router.path}
                  className={ClassN(
                    isActive(router.path),
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  )}
                >
                  {router.name}
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default BubbleNavbar;

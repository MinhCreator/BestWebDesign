import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "@css/Navbar.css";
import { ClassN } from "@utils/utils";
import { Bell } from "lucide-react";
import { AppConfig } from "@config/app.config";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-700 transition-transform hover:scale-105"
      : "text-slate-900";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center justify-between gap-4 w-full">
        {/* Desktop Logo */}
        <Link to="/" className="max-sm:hidden">
          <img src="/icon/logo_large.svg" alt="logo" className="w-50" />
        </Link>
        {/* Mobile Logo */}
        <Link to="/" className="sm:hidden md:hidden lg:hidden max-sm:block">
          <img src="/icon/logo-lite.svg" alt="logo" className="w-20" />
        </Link>

        <div
          id="collapseMenu"
          className={`${
            isMenuOpen ? "block" : "max-lg:hidden"
          } lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50`}
        >
          <button
            onClick={toggleMenu}
            className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border border-gray-200 cursor-pointer"
          >
            <img src="/icon/cross.svg" alt="close" />
          </button>

          <ul className="lg:flex gap-x-2 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
            <li className="mb-6 md:hidden lg:hidden max-lg:block">
              <Link to="/">
                <img src="/icon/logo_large.svg" alt="logo" className="w-40" />
              </Link>
            </li>
            {AppConfig.Routes.map((router, index) => {
              if (router.NavbarComp === false) {
                return null;
              }

              return (
                <li
                  className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3 "
                  key={index}
                >
                  <Link
                    to={router.route}
                    className={ClassN(
                      isActive(router.route),
                      "hover:text-blue-700 block font-medium text-[15px]",
                    )}
                  >
                    {router.name}
                  </Link>
                </li>
              );
            })}

            {/* <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3 ">
              <Link
                to="/"
                className={ClassN(
                  isActive("/"),
                  "hover:text-blue-700 block font-medium text-[15px]",
                )}
              >
                Home
              </Link>
            </li>

            <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3 ">
              <Link
                to="/News"
                className={ClassN(
                  isActive("/new"),
                  "hover:text-blue-700 block font-medium text-[15px]",
                )}
              >
                News
              </Link>
            </li>

            <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3 ">
              <Link
                to="/Event"
                className={ClassN(
                  isActive("/event"),
                  "hover:text-blue-700 block font-medium text-[15px]",
                )}
              >
                Events
              </Link>
            </li>

            <li className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3 ">
              <Link
                to="/Leaderboard"
                className={ClassN(
                  isActive("/rank"),
                  "hover:text-blue-700 block font-medium text-[15px]",
                )}
              >
                Leaderboard
              </Link>
            </li> */}
          </ul>
        </div>

        <div className="flex max-lg:ml-auto space-x-4">
          <button onClick={toggleMenu} className="lg:hidden cursor-pointer">
            <svg
              className="w-7 h-7"
              fill="#000"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <button className="material-symbols-outlined text-primary p-2 hover:bg-emerald-50 rounded-full transition-all">
            <Bell />
          </button>
          <button className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all">
            Join Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

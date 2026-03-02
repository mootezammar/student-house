import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/FinalLogo.png";
import Navbar from "./Navbar";
import { assets } from "../assets/data";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const BookingIcon = () => (
  <img
    src={assets.booking}
    alt="bookings"
    width={16}
    height={16}
    style={{ objectFit: "contain" }}
  />
);

const Header = () => {
  const [active, setActive]       = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const location     = useLocation();
  
  const { openSignIn } = useClerk();
  const { navigate,user } = useAppContext();

  const toggleMenu = () => setMenuOpened((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setActive(location.pathname !== "/" || scrolled);
      if (scrolled) setMenuOpened(false);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const isLight = !menuOpened && !active;

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        active ? "bg-white shadow-md py-3" : "py-4"
      }`}
    >
      <div className="max-padd-container">
        <div className="flexBetween gap-4">

          {/* Logo */}
          <div className="flex-1">
            <Link to="/" onClick={() => scrollTo(0, 0)}>
              <img
                src={logo}
                alt="StudentNest logo"
                className={`h-14 transition-all duration-300 ${!active && "invert"}`}
              />
            </Link>
          </div>

          {/* Navbar */}
          <Navbar
            setMenuOpened={setMenuOpened}
            containerStyles={`${
              menuOpened
                ? "flex flex-col items-start gap-y-6 fixed top-16 right-6 p-6 bg-white shadow-lg w-56 ring-1 ring-slate-900/5 rounded-2xl z-50"
                : "hidden lg:flex gap-x-5 xl:gap-x-8 medium-15 p-1"
            } ${isLight ? "text-white" : ""}`}
          />

          {/* Right Side Actions */}
          <div className="flex flex-1 items-center justify-end gap-x-4 sm:gap-x-6">

            {/* Search Bar */}
            <div className="relative hidden xl:flex items-center">
              <div
                className={`transition-all duration-300 ease-in-out ring-1 ring-slate-900/10 rounded-full overflow-hidden ${
                  active ? "bg-secondary/10" : "bg-white/10"
                } ${
                  showSearch ? "w-64 opacity-100 px-4 py-2" : "w-10 opacity-0 px-0 py-0"
                }`}
              >
                <input
                  type="text"
                  placeholder="Search student housing..."
                  className="w-full regular-13 outline-none pr-10 placeholder:text-gray-400 bg-transparent"
                />
              </div>
              <button
                onClick={() => setShowSearch((prev) => !prev)}
                className={`absolute right-0 ring-1 ring-slate-900/10 p-2 rounded-full cursor-pointer z-10 transition-colors duration-200 ${
                  active ? "bg-secondary/10 hover:bg-secondary/20" : "bg-white/20 hover:bg-white/30"
                }`}
              >
                <img src={assets.search} alt="search" width={18} />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              <img
                src={menuOpened ? assets.close : assets.menu}
                alt={menuOpened ? "close menu" : "open menu"}
                width={22}
                className={`${!active && "invert"} transition-all duration-200`}
              />
            </button>

            {/* User Profile */}
            {user ? (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: { width: "40px", height: "40px" },
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="My Bookings"
                    labelIcon={<BookingIcon />}
                    onClick={() => navigate("/my-bookings")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <button
                onClick={openSignIn}
                className="btn-secondary flexCenter gap-2 medium-13 rounded-full"
              >
                Login
                <img src={assets.user} alt="user" width={16} />
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useUser } from "@clerk/clerk-react";

const navLinks = [
  { path: "/", title: "Home" },
  { path: "/listing", title: "Listing" },
  { path: "/binome", title: "Find Binome" },
  { path: "/contact", title: "Contact" },
];

const Navbar = ({ setMenuOpened, containerStyles }) => {
  const { isOwner, setShowAgencyReg, navigate } = useAppContext();
  const { isSignedIn } = useUser();

  const handleClick = () => {
    setMenuOpened(false);
    scrollTo(0, 0);
  };

  return (
    <nav className={containerStyles}>
      {navLinks.map(({ path, title }) => (
        <NavLink
          key={title}
          to={path}
          onClick={handleClick}
          className={({ isActive }) =>
            `medium-14 px-3 py-2 rounded-full uppercase transition-colors duration-200 ${
              isActive ? "active-link text-secondary" : "hover:text-secondary"
            }`
          }
        >
          {title}
        </NavLink>
      ))}

      {/* Dashboard button — owner */}
      {isSignedIn && isOwner && (
        <button
          onClick={() => {
            navigate("/owner");
            handleClick();
          }}
          className="flexCenter gap-1.5 medium-14 px-4 py-2 rounded-full uppercase transition-all duration-200 bg-secondary text-white hover:bg-secondary/85 shadow-sm hover:shadow-md cursor-pointer"
        >
          <span className="text-base leading-none">⚙️</span>
          Dashboard
        </button>
      )}

      {/* List House button — non-owner */}
      {isSignedIn && !isOwner && (
        <button
          onClick={() => {
            setShowAgencyReg(true);
            handleClick();
          }}
          className="flexCenter cursor-pointer gap-1.5 medium-14 px-4 py-2 rounded-full uppercase transition-all duration-200 bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary hover:text-white hover:border-secondary shadow-sm"
        >
          <span className="text-base leading-none">🏠</span>
          List House
        </button>
      )}
    </nav>
  );
};

export default Navbar;

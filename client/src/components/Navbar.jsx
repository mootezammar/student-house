import React from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { path: "/",        title: "Home"    },
  { path: "/listing", title: "Listing" },
  { path: "/binome",    title: "Find Binome"    },
  { path: "/contact", title: "Contact" },
];

const Navbar = ({ setMenuOpened, containerStyles }) => {
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
              isActive
                ? "active-link text-secondary"
                : "hover:text-secondary"
            }`
          }
        >
          {title}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
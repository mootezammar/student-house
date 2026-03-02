import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/data";
import { Link, NavLink, Outlet } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import logo from "../../assets/FinalLogo.png";

const Sidebar = () => {
  const { navigate, isOwner, user } = useAppContext();

  const navItems = [
    { path: "/owner", label: "Dashboard", icon: assets.dashboard },
    { path: "/owner/add-house", label: "Add House", icon: assets.housePlus },
    { path: "/owner/list-house", label: "List House", icon: assets.list },
  ];

  useEffect(() => {
    if (!isOwner) navigate("/");
  }, [isOwner]);

  return (
    <div className="bg-linear-to-r from-[#eefbff] to-white min-h-screen">
      <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="max-md:flex max-md:items-center max-md:justify-between flex-col justify-between bg-white sm:m-3 md:min-w-[220px] md:min-h-[97vh] rounded-xl shadow-sm ring-1 ring-slate-900/5">
          <div className="flex flex-col gap-y-6 max-md:items-center md:flex-col md:pt-5 w-full">
            {/* Logo & Mobile profile */}
            <div className="w-full flex justify-between md:flex-col">
              <div className="flex flex-1 p-3 lg:pl-8">
                <Link to="/owner">
                  <img src={logo} alt="logo" className="h-19" />
                </Link>
              </div>

              {/* Mobile user */}
              <div className="md:hidden flex items-center gap-3 p-3 pr-4">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: { width: "38px", height: "38px" },
                    },
                  }}
                />
                <span className="text-sm font-semibold text-gray-800 capitalize">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>

            {/* Nav label */}
            <div className="hidden md:block px-8 mb-[-16px]">
              <p className="regular-12 text-gray-400 uppercase tracking-widest">
                Menu
              </p>
            </div>

            {/* Nav items */}
            <nav className="flex md:flex-col md:gap-1 gap-x-1 w-full px-3">
              {navItems.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={link.path === "/owner"}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3 px-5 py-2.5 bold-13 cursor-pointer rounded-xl bg-secondary/10 text-secondary max-md:border-b-4 md:border-l-4 border-secondary"
                      : "flex items-center gap-x-3 px-5 py-2.5 bold-13 cursor-pointer rounded-xl text-gray-500 hover:bg-secondary/5 hover:text-secondary transition-all"
                  }
                >
                  <img
                    src={link.icon}
                    alt={link.label}
                    className="hidden md:block shrink-0"
                    width={18}
                  />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Desktop user */}
          <div className="hidden md:flex items-center gap-3 bg-primary border-t border-slate-900/10 rounded-b-xl p-4 mt-76 pl-6 lg:pl-8">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: { width: "42px", height: "42px" },
                },
              }}
            />
            <div>
              <p className="text-sm font-semibold text-gray-800 capitalize leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="regular-12 text-gray-400">Agency Owner</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

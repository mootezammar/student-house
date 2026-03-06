import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/data";
import { Link, NavLink, Outlet } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import logo from "../../assets/finalLogo.png";

const Sidebar = () => {
  const { navigate, isOwner, user, loading } = useAppContext();

  const navItems = [
    { path: "/owner", label: "Dashboard", icon: assets.dashboard, emoji: "📊" },
    { path: "/owner/add-house", label: "Add House", icon: assets.housePlus, emoji: "➕" },
    { path: "/owner/list-house", label: "List House", icon: assets.list, emoji: "🏠" },
  ];

  useEffect(() => {
    if (!loading && !isOwner) navigate("/");
  }, [isOwner, loading]);

  if (loading) return (
    <div className="flexCenter min-h-screen">
      <p className="regular-14 text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="bg-linear-to-r from-[#eefbff] to-white min-h-screen">
      <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row">

        {/* Sidebar */}
        <div className="max-md:flex max-md:items-center max-md:justify-between flex-col justify-between bg-white sm:m-3 md:min-w-[240px] md:min-h-[97vh] rounded-2xl shadow-sm ring-1 ring-slate-900/5">
          <div className="flex flex-col gap-y-5 max-md:items-center md:flex-col md:pt-6 w-full">

            {/* Logo */}
            <div className="w-full flex justify-between md:flex-col">
              <div className="flex flex-1 p-3 lg:pl-7">
                <Link to="/owner">
                  <img src={logo} alt="logo" className="h-19" />
                </Link>
              </div>
              {/* Mobile user */}
              <div className="md:hidden flex items-center gap-3 p-3 pr-4">
                <UserButton appearance={{ elements: { userButtonAvatarBox: { width: "36px", height: "36px" } } }} />
                <span className="text-sm font-semibold text-gray-800 capitalize">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>

            {/* Agency badge */}
            <div className="hidden md:flex items-center gap-2 mx-4 px-4 py-2.5 bg-secondary/5 rounded-xl ring-1 ring-secondary/10">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flexCenter shrink-0">
                <span className="text-base">🏢</span>
              </div>
              <div>
                <p className="regular-11 text-gray-400 uppercase tracking-widest">Agency Panel</p>
                <p className="medium-13 text-secondary capitalize">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>

            {/* Menu label */}
            <div className="hidden md:block px-7 mb-[-10px]">
              <p className="regular-11 text-gray-400 uppercase tracking-widest">Navigation</p>
            </div>

            {/* Nav items */}
            <nav className="flex md:flex-col md:gap-1.5 gap-x-1 w-full px-3">
              {navItems.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={link.path === "/owner"}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3 px-4 py-3 medium-13 cursor-pointer rounded-xl bg-secondary text-white shadow-sm max-md:border-b-4 md:border-l-0 border-secondary"
                      : "flex items-center gap-x-3 px-4 py-3 medium-13 cursor-pointer rounded-xl text-gray-500 hover:bg-secondary/5 hover:text-secondary transition-all duration-200"
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-8 h-8 rounded-lg flexCenter shrink-0 transition-all ${
                        isActive ? "bg-white/20" : "bg-secondary/8"
                      }`}>
                        <img src={link.icon} alt={link.label} width={16}
                          className={`hidden md:block ${isActive ? "brightness-0 invert" : ""}`} />
                        <span className="md:hidden text-sm">{link.emoji}</span>
                      </div>
                      <span>{link.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Bottom section */}
          <div className="hidden md:flex flex-col gap-2 px-3 pb-4 mt-4">

            {/* Back to Home */}
            <Link
              to="/"
              className="flex items-center gap-x-3 px-4 py-3 medium-13 cursor-pointer rounded-xl text-gray-400 hover:bg-orange-50 hover:text-orange-400 transition-all duration-200 border border-dashed border-slate-900/10 hover:border-orange-200"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flexCenter shrink-0 group-hover:bg-orange-100">
                <span className="text-sm">🏡</span>
              </div>
              <span>Back to Home</span>
            </Link>

            {/* User info */}
            <div className="flex items-center gap-3 bg-secondary/5 ring-1 ring-slate-900/5 rounded-xl p-3 mt-1">
              <UserButton appearance={{ elements: { userButtonAvatarBox: { width: "40px", height: "40px" } } }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 capitalize leading-tight truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="regular-11 text-secondary">Agency Owner</p>
              </div>
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
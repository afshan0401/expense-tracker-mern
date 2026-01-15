import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuMoon, LuSun } from "react-icons/lu";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const toggleDarkMode = () => {
  const html = document.documentElement;
  html.classList.toggle("dark");
  console.log("Dark mode:", html.classList.contains("dark"));
};



  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-lg ">
        Expense Tracker
      </h2>

      {/* Dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="ml-auto text-black"
        title="Toggle dark mode"
      >
        <LuMoon className="text-xl hidden dark:block" />
        <LuSun className="text-xl dark:hidden" />
      </button>

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;

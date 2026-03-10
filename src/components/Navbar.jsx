import React from "react";
import { IoMdMoon } from "react-icons/io";
import { IoSunny } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <nav className="nav">

      {/* Logo */}
      <div className="logo">
        <h2>WebBuilder</h2>
      </div>

      {/* Right Icons */}
      <div className="nav-right">

        {/* Theme Toggle */}
        <div
          className="icon"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <IoSunny /> : <IoMdMoon />}
        </div>

        {/* User */}
        <div className="icon">
          <FaUser />
        </div>

      </div>

    </nav>
  );
};

export default Navbar;
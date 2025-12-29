import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import NotificationPanel from "./NotificationPanel";
import { FiBell, FiMoon, FiSun, FiSearch } from "react-icons/fi";
import logo from "../assets/logo.png";
import "./Navbar.css";

export default function Navbar({
  search = "",
  setSearch = () => {},
}) {
  const { user, logout, dark, toggleDark } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const bellRef = useRef(null);
  const prevCount = useRef(0);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  /* 🔔 Animate bell */
  useEffect(() => {
    if (unreadCount > prevCount.current) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 600);
    }
    prevCount.current = unreadCount;
  }, [unreadCount]);

  /* 🔍 Handle search */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/opportunities?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearch(value); // For dashboard filtering
  };

  return (
    <nav className={`navbar ${dark ? "dark" : ""}`}>
      {/* LOGO */}
      <div className="nav-left" onClick={() => navigate("/dashboard")}>
        <div className="nav-logo-container">
          <div className="logo-icon">
            <div className="logo-heart">🤝</div>
            <div className="logo-sparkle">✨</div>
          </div>
          <div className="logo-text">
            <span className="logo-main">VolunteerMatch</span>
            <span className="logo-tagline">Connect • Impact • Grow</span>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      {!isAuthPage && user && (
        <form className="navbar-search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              className="navbar-search"
              placeholder="Search opportunities..."
              value={searchValue}
              onChange={handleSearchChange}
            />
            {searchValue && (
              <button 
                type="button" 
                className="clear-search"
                onClick={() => {
                  setSearchValue("");
                  setSearch("");
                }}
              >
                ×
              </button>
            )}
          </div>
        </form>
      )}

      {/* ACTIONS */}
      <div className="nav-right">
        {user && (
          <>
            <button className="nav-btn" onClick={() => navigate("/opportunities")}>
              Opportunities
            </button>
            <button className="nav-btn" onClick={() => navigate("/messages")}>
              Messages
            </button>
            <button className="nav-btn" onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
            <button className="nav-btn" onClick={() => navigate("/profile")}>
              Profile
            </button>
          </>
        )}

        {/* NOTIFICATIONS */}
        {user && (
          <div ref={bellRef} className="bell-wrapper">
            <FiBell
              className={animate ? "bell-animate" : ""}
              onClick={() => setOpen(o => !o)}
            />
            {unreadCount > 0 && (
              <span className="bell-badge">
                {unreadCount}
              </span>
            )}
          </div>
        )}

        {/* ADMIN / ORG */}
        {user?.role === "org" && (
          <>
            <button className="nav-btn" onClick={() => navigate("/admin-dashboard")}>
              Admin
            </button>

            <button
              className="nav-btn"
              onClick={() => navigate("/create-opportunity")}
            >
              Create
            </button>

            <button
              className="nav-btn"
              onClick={() => navigate("/applicants")}
            >
              Applicants
            </button>
          </>
        )}

        {/* DARK MODE */}
        <button onClick={toggleDark} className="icon-btn">
          {dark ? <FiSun /> : <FiMoon />}
        </button>

        {/* LOGOUT */}
        {user && (
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        )}
      </div>

      {/* 🔔 NOTIFICATION PANEL */}
      <NotificationPanel 
        isOpen={open} 
        onClose={() => setOpen(false)} 
      />
    </nav>
  );
}

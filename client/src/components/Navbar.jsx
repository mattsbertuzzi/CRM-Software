import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmailModal from "./EmailModal";
import CalendarModal from "./CalendarModal";
import "../styles/navbar.css";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { UserContext } from "../context/userContext";

const Navbar = () => {
    const [isEmailOpen, setEmailOpen] = useState(false);
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();
    const { handleLogout } = useContext(UserContext);

    // Close profile dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleProfileClick = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleUserLogout = () => {
        handleLogout();
        navigate("/login");
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/" className="navbar-logo">CRM</Link>
                </div>

                <div className={`navbar-links ${isMobileMenuOpen ? "open" : ""}`}>
                    <Link to="/contacts" className="navbar-link">Contacts</Link>
                    <Link to="/customers" className="navbar-link">Customers</Link>
                    <Link to="/deals" className="navbar-link">Deals</Link>
                    <button className="navbar-btn" onClick={() => setEmailOpen(true)}>+ Email</button>
                    <button className="navbar-btn" onClick={() => setCalendarOpen(true)}>+ Event</button>
                </div>

                <div className="navbar-right">
                    <div className="navbar-profile" ref={dropdownRef}>
                        <FaUserCircle
                            className="profile-icon"
                            size={32}
                            onClick={handleProfileClick}
                        />
                        {isDropdownOpen && (
                            <div className="profile-dropdown">
                                <button onClick={() => { navigate("/profile"); setDropdownOpen(false); }}>
                                    Profile
                                </button>
                                <button onClick={handleUserLogout}>Logout</button>
                            </div>
                        )}
                    </div>

                    {/* Hamburger menu for mobile */}
                    <div className="hamburger" onClick={() => setMobileMenuOpen(prev => !prev)}>
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </div>
                </div>
            </nav>

            {isEmailOpen && <EmailModal onClose={() => setEmailOpen(false)} />}
            {isCalendarOpen && <CalendarModal onClose={() => setCalendarOpen(false)} />}
        </>
    );
};

export default Navbar;

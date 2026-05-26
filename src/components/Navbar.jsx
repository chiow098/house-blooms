import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  Flower2,
  LogOut,
  LayoutDashboard,
  Package,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { cartCount, user, isAdmin, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: "Beranda" },
    { path: "/catalog", label: "Katalog" },
  ];

  // Tambah link "Pesanan Saya" untuk user biasa yang sudah login
  if (user && !isAdmin) {
    navLinks.push({ path: "/orders", label: "Pesanan Saya" });
  }

  return (
    <nav
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--pink-100)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="page-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 70,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--pink-300), var(--pink-500))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Flower2 size={20} color="white" />
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              fontWeight: 600,
              color: "var(--dark)",
              letterSpacing: 0.5,
            }}
          >
            House <span style={{ color: "var(--pink-500)" }}>Blooms</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{ display: "flex", gap: 32, alignItems: "center" }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: "none",
                fontFamily: "'Jost', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: isActive(link.path) ? "var(--pink-500)" : "var(--gray)",
                borderBottom: isActive(link.path)
                  ? "2px solid var(--pink-400)"
                  : "2px solid transparent",
                paddingBottom: 2,
                transition: "var(--transition)",
              }}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              style={{
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                color: isActive("/admin") ? "var(--pink-500)" : "var(--gray)",
                borderBottom: isActive("/admin")
                  ? "2px solid var(--pink-400)"
                  : "2px solid transparent",
                paddingBottom: 2,
              }}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Cart - Sembunyikan untuk admin */}
          {!isAdmin && (
            <Link
              to="/cart"
              style={{ textDecoration: "none", position: "relative" }}
            >
              <button
                style={{
                  background: "var(--blush)",
                  border: "none",
                  borderRadius: "50%",
                  width: 42,
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
              >
                <ShoppingBag size={18} color="var(--pink-500)" />
                {cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "var(--pink-500)",
                      color: "white",
                      borderRadius: "50%",
                      width: 18,
                      height: 18,
                      fontSize: 10,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          )}

          {/* User */}
          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  background:
                    "linear-gradient(135deg, var(--pink-300), var(--pink-500))",
                  border: "none",
                  borderRadius: "50%",
                  width: 42,
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 50,
                    background: "white",
                    borderRadius: "var(--radius-sm)",
                    boxShadow: "var(--shadow-lg)",
                    minWidth: 180,
                    border: "1px solid var(--pink-100)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--pink-100)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--dark)",
                      }}
                    >
                      {user.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--gray)" }}>
                      {user.email}
                    </div>
                  </div>

                  {/* Link Pesanan Saya untuk user biasa */}
                  {!isAdmin && (
                    <button
                      onClick={() => {
                        navigate("/orders");
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: "var(--dark)",
                        fontFamily: "'Jost', sans-serif",
                      }}
                    >
                      <Package size={14} /> Pesanan Saya
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: "var(--dark)",
                        fontFamily: "'Jost', sans-serif",
                      }}
                    >
                      <LayoutDashboard size={14} /> Dashboard Admin
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      border: "none",
                      background: "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--pink-500)",
                      fontFamily: "'Jost', sans-serif",
                    }}
                  >
                    <LogOut size={14} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button
                style={{
                  background: "var(--blush)",
                  border: "none",
                  borderRadius: "50%",
                  width: 42,
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <User size={18} color="var(--pink-500)" />
              </button>
            </Link>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            className="mobile-menu-btn"
          >
            {menuOpen ? (
              <X size={22} color="var(--dark)" />
            ) : (
              <Menu size={22} color="var(--dark)" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          style={{
            background: "white",
            borderTop: "1px solid var(--pink-100)",
            padding: "16px 24px 24px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                textDecoration: "none",
                fontSize: 16,
                color: isActive(link.path) ? "var(--pink-500)" : "var(--dark)",
                borderBottom: "1px solid var(--pink-50)",
                fontFamily: "'Jost', sans-serif",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

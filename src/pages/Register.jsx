import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Flower2, User } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Register() {
  const { register, user } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Password tidak cocok");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = register(name, email, password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 800);
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px 12px 40px",
    borderRadius: 10,
    border: "1.5px solid var(--pink-200)",
    fontSize: 14,
    fontFamily: "'Jost', sans-serif",
    outline: "none",
    color: "var(--dark)",
    background: "white",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, var(--pink-50) 0%, var(--blush) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "10%",
          right: "5%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(240,98,146,0.06)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          left: "5%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "rgba(240,98,146,0.04)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          background: "white",
          borderRadius: "var(--radius)",
          padding: "48px 40px",
          width: "100%",
          maxWidth: 440,
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--pink-100)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--pink-300), var(--pink-500))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <Flower2 size={26} color="white" />
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 300,
              color: "var(--dark)",
              marginBottom: 4,
            }}
          >
            Buat{" "}
            <em style={{ color: "var(--pink-500)", fontStyle: "italic" }}>
              Akun
            </em>
          </h1>
          <p style={{ fontSize: 13, color: "var(--gray)" }}>
            Bergabung dengan House Blooms hari ini
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nama */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--dark)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Nama Lengkap
            </label>
            <div style={{ position: "relative" }}>
              <User
                size={15}
                color="var(--gray)"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                required
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--pink-500)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--pink-200)")}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--dark)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={15}
                color="var(--gray)"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--pink-500)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--pink-200)")}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--dark)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={15}
                color="var(--gray)"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                required
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--pink-500)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--pink-200)")}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPass ? (
                  <EyeOff size={15} color="var(--gray)" />
                ) : (
                  <Eye size={15} color="var(--gray)" />
                )}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--dark)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Konfirmasi Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={15}
                color="var(--gray)"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type={showPass ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Ulangi password"
                required
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--pink-500)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--pink-200)")}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fce4ec",
                border: "1px solid #f48fb1",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 13,
                color: "#c2185b",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: 15 }}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 13,
            color: "var(--gray)",
          }}
        >
          Sudah punya akun?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--pink-500)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}

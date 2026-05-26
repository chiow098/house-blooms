import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Cart = () => {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #fff5f7 0%, #ffe4ec 50%, #fff0f3 100%)",
        }}
      >
        <div style={{ textAlign: "center", padding: 40 }}>
          <span style={{ fontSize: 80, display: "block", marginBottom: 20 }}>
            🛒
          </span>
          <h2 style={{ color: "#d63384", margin: "0 0 10px" }}>
            Keranjang Kosong
          </h2>
          <p style={{ color: "#888", margin: "0 0 25px" }}>
            Tambahkan produk favoritmu
          </p>
          <button
            onClick={() => navigate("/catalog")}
            style={{
              padding: "14px 35px",
              background: "linear-gradient(135deg, #ff6b9d, #d63384)",
              color: "white",
              border: "none",
              borderRadius: 25,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(255,107,157,0.4)",
            }}
          >
            🌸 Lihat Katalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff5f7 0%, #ffe4ec 50%, #fff0f3 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ color: "#d63384", fontSize: 28, margin: "0 0 30px" }}>
          🛒 Keranjang Belanja
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
            marginBottom: 30,
          }}
        >
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: "white",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "2px solid #ffc2d1",
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 5px", color: "#333", fontSize: 16 }}>
                  {item.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "#d63384",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Rp {item.price.toLocaleString()}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "2px solid #ffc2d1",
                    background: "white",
                    color: "#d63384",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  -
                </button>
                <span
                  style={{ minWidth: 30, textAlign: "center", fontWeight: 600 }}
                >
                  {item.qty}
                </span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "2px solid #ffc2d1",
                    background: "white",
                    color: "#d63384",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  +
                </button>
              </div>

              <span
                style={{
                  color: "#d63384",
                  fontWeight: 700,
                  minWidth: 100,
                  textAlign: "right",
                }}
              >
                Rp {(item.price * item.qty).toLocaleString()}
              </span>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "#ffebee",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                  color: "#f44336",
                  fontSize: 16,
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: 30,
            boxShadow: "0 10px 40px rgba(255,107,157,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 15,
              color: "#555",
              fontSize: 16,
            }}
          >
            <span>Subtotal</span>
            <span>Rp {cartTotal.toLocaleString()}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 20,
              borderTop: "2px solid #ffc2d1",
            }}
          >
            <span style={{ color: "#333", fontWeight: 600, fontSize: 18 }}>
              Total
            </span>
            <span style={{ color: "#d63384", fontWeight: 700, fontSize: 24 }}>
              Rp {cartTotal.toLocaleString()}
            </span>
          </div>

          <div style={{ display: "flex", gap: 15, marginTop: 25 }}>
            <button
              onClick={clearCart}
              style={{
                padding: "14px 25px",
                background: "white",
                color: "#f44336",
                border: "2px solid #ffc2d1",
                borderRadius: 25,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Kosongkan
            </button>
            <button
              onClick={() => navigate("/checkout")}
              style={{
                flex: 1,
                padding: "14px 0",
                background: "linear-gradient(135deg, #ff6b9d, #d63384)",
                color: "white",
                border: "none",
                borderRadius: 25,
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                boxShadow: "0 4px 15px rgba(255,107,157,0.4)",
              }}
            >
              Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts, useApp } from "../context/AppContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useProducts();
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
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
        <div
          style={{
            textAlign: "center",
            padding: 40,
            background: "white",
            borderRadius: 24,
            boxShadow: "0 20px 60px rgba(255,107,157,0.2)",
          }}
        >
          <h2 style={{ color: "#d63384" }}>Produk tidak ditemukan 🌸</h2>
          <button
            onClick={() => navigate("/catalog")}
            style={{
              padding: "12px 30px",
              background: "linear-gradient(135deg, #ff6b9d, #d63384)",
              color: "white",
              border: "none",
              borderRadius: 25,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (qty > product.stock) {
      alert(`Stok hanya tersedia ${product.stock} pcs!`);
      return;
    }
    addToCart(product, qty);
    alert(`${product.name} (x${qty}) ditambahkan ke keranjang! 🌸`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff5f7 0%, #ffe4ec 50%, #fff0f3 100%)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          background: "white",
          borderRadius: 24,
          padding: 40,
          boxShadow: "0 20px 60px rgba(255,107,157,0.15)",
        }}
      >
        <div style={{ borderRadius: 20, overflow: "hidden", height: 400 }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div>
          <span
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #ffc2d1, #ff8fab)",
              color: "white",
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 15,
            }}
          >
            {product.category}
          </span>
          <h1 style={{ color: "#333", fontSize: 32, margin: "0 0 15px" }}>
            {product.name}
          </h1>
          <p
            style={{
              color: "#888",
              fontSize: 16,
              lineHeight: 1.6,
              margin: "0 0 25px",
            }}
          >
            {product.description}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 25,
            }}
          >
            <span style={{ color: "#d63384", fontSize: 28, fontWeight: 700 }}>
              Rp {product.price.toLocaleString()}
            </span>
            <span
              style={{
                color: product.stock < 10 ? "#f44336" : "#4caf50",
                fontSize: 14,
                fontWeight: 600,
                padding: "5px 12px",
                background: product.stock < 10 ? "#ffebee" : "#e8f5e9",
                borderRadius: 15,
              }}
            >
              Stok: {product.stock}
            </span>
          </div>

          {product.stock > 0 ? (
            <div style={{ marginBottom: 25 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 10,
                  color: "#555",
                  fontWeight: 500,
                }}
              >
                Jumlah:
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "2px solid #ffc2d1",
                    background: "white",
                    color: "#d63384",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    minWidth: 30,
                    textAlign: "center",
                  }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "2px solid #ffc2d1",
                    background: "white",
                    color: "#d63384",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <p
              style={{
                color: "#f44336",
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 25,
              }}
            >
              ⚠️ Stok habis
            </p>
          )}

          <div style={{ display: "flex", gap: 15 }}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                flex: 1,
                padding: "14px 0",
                background:
                  product.stock === 0
                    ? "#e0e0e0"
                    : "linear-gradient(135deg, #ff6b9d, #d63384)",
                color: "white",
                border: "none",
                borderRadius: 25,
                fontSize: 16,
                fontWeight: 600,
                cursor: product.stock === 0 ? "not-allowed" : "pointer",
                boxShadow:
                  product.stock === 0
                    ? "none"
                    : "0 4px 15px rgba(255,107,157,0.4)",
              }}
            >
              🛒 Tambah ke Keranjang
            </button>
            <button
              onClick={() => navigate("/catalog")}
              style={{
                padding: "14px 25px",
                background: "white",
                color: "#ff6b9d",
                border: "2px solid #ffc2d1",
                borderRadius: 25,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ← Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

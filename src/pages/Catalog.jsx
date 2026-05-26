import React from "react";
import { Link } from "react-router-dom";
import { useProducts, useApp } from "../context/AppContext";

const Catalog = () => {
  const products = useProducts();
  const { addToCart } = useApp();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} ditambahkan ke keranjang! 🌸`);
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
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ color: "#d63384", fontSize: 32, margin: "0 0 10px" }}>
            🌸 Katalog Bunga
          </h1>
          <p style={{ color: "#888", fontSize: 16, margin: 0 }}>
            Temukan bunga terbaik untuk momen spesialmu
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 25,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                background: "white",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(255,107,157,0.1)",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div
                style={{
                  position: "relative",
                  height: 220,
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {product.stock < 10 && product.stock > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "#ff9800",
                      color: "white",
                      padding: "5px 12px",
                      borderRadius: 15,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Stok Menipis
                  </span>
                )}
                {product.stock === 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "#f44336",
                      color: "white",
                      padding: "5px 12px",
                      borderRadius: 15,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Habis
                  </span>
                )}
              </div>

              <div style={{ padding: 20 }}>
                <h3 style={{ margin: "0 0 8px", color: "#333", fontSize: 18 }}>
                  {product.name}
                </h3>
                <p
                  style={{
                    margin: "0 0 10px",
                    color: "#888",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {product.description}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #ffc2d1, #ff8fab)",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: 15,
                    fontSize: 12,
                    fontWeight: 500,
                    marginBottom: 15,
                  }}
                >
                  {product.category}
                </span>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 15,
                  }}
                >
                  <span
                    style={{ color: "#d63384", fontSize: 20, fontWeight: 700 }}
                  >
                    Rp {product.price.toLocaleString()}
                  </span>
                  <span style={{ color: "#888", fontSize: 13 }}>
                    Stok: {product.stock}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <Link
                    to={`/product/${product.id}`}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "10px 0",
                      background: "#fff5f7",
                      color: "#d63384",
                      textDecoration: "none",
                      borderRadius: 25,
                      fontSize: 14,
                      fontWeight: 500,
                      border: "2px solid #ffc2d1",
                    }}
                  >
                    Lihat Detail
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      background:
                        product.stock === 0
                          ? "#e0e0e0"
                          : "linear-gradient(135deg, #ff6b9d, #d63384)",
                      color: "white",
                      border: "none",
                      borderRadius: 25,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: product.stock === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    🛒 Tambah
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              background: "white",
              borderRadius: 20,
              boxShadow: "0 10px 40px rgba(255,107,157,0.1)",
            }}
          >
            <span style={{ fontSize: 60, display: "block", marginBottom: 15 }}>
              🌸
            </span>
            <h2 style={{ color: "#d63384", margin: "0 0 10px" }}>
              Belum Ada Produk
            </h2>
            <p style={{ color: "#888", margin: 0 }}>
              Admin akan segera menambahkan produk baru
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;

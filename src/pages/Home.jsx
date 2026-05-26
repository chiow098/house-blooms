import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/AppContext";

const Home = () => {
  const products = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #ff6b9d 0%, #ff8fab 50%, #ffc2d1 100%)",
          padding: "100px 20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: 48, margin: "0 0 20px", fontWeight: 700 }}>
            House Blooms 🌸
          </h1>
          <p style={{ fontSize: 20, margin: "0 0 30px", opacity: 0.9 }}>
            Buket bunga segar untuk setiap momen berhargamu
          </p>
          <Link
            to="/catalog"
            style={{
              display: "inline-block",
              padding: "15px 40px",
              background: "white",
              color: "#d63384",
              textDecoration: "none",
              borderRadius: 30,
              fontSize: 16,
              fontWeight: 600,
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            Lihat Katalog
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: "60px 20px", background: "#fff5f7" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              color: "#d63384",
              fontSize: 28,
              margin: "0 0 40px",
            }}
          >
            Produk Unggulan
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 25,
            }}
          >
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "white",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 10px 40px rgba(255,107,157,0.1)",
                }}
              >
                <div style={{ height: 200, overflow: "hidden" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ padding: 20 }}>
                  <h3
                    style={{ margin: "0 0 8px", color: "#333", fontSize: 18 }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      color: "#d63384",
                      fontSize: 18,
                      fontWeight: 700,
                      margin: "0 0 15px",
                    }}
                  >
                    Rp {product.price.toLocaleString()}
                  </p>
                  <Link
                    to={`/product/${product.id}`}
                    style={{
                      color: "#ff6b9d",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Lihat Detail →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {featuredProducts.length === 0 && (
            <p style={{ textAlign: "center", color: "#888", fontSize: 16 }}>
              Produk akan segera tersedia 🌸
            </p>
          )}

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              to="/catalog"
              style={{
                display: "inline-block",
                padding: "14px 35px",
                background: "linear-gradient(135deg, #ff6b9d, #d63384)",
                color: "white",
                textDecoration: "none",
                borderRadius: 25,
                fontSize: 16,
                fontWeight: 600,
                boxShadow: "0 4px 15px rgba(255,107,157,0.4)",
              }}
            >
              Lihat Semua Produk →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

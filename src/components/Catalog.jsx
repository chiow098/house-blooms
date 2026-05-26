import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Star, ShoppingBag, X } from "lucide-react";
import { products, categories } from "../data/products";
import { useApp } from "../context/AppContext";

export default function Catalog() {
  const { addToCart } = useApp();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [addedId, setAddedId] = useState(null);

  const handleAdd = (product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filtered = products
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--pink-50), var(--blush))",
          padding: "48px 24px 40px",
          borderBottom: "1px solid var(--pink-100)",
        }}
      >
        <div className="page-container">
          <div
            style={{
              fontSize: 12,
              color: "var(--pink-500)",
              fontWeight: 600,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            KATALOG PRODUK
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 300,
              color: "var(--dark)",
              marginBottom: 24,
            }}
          >
            Koleksi{" "}
            <em style={{ color: "var(--pink-500)", fontStyle: "italic" }}>
              Bunga Kami
            </em>
          </h1>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 480 }}>
            <Search
              size={16}
              color="var(--gray)"
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari bunga favoritmu..."
              style={{
                width: "100%",
                padding: "13px 16px 13px 44px",
                borderRadius: 50,
                border: "1.5px solid var(--pink-200)",
                background: "white",
                fontSize: 14,
                color: "var(--dark)",
                outline: "none",
                boxShadow: "var(--shadow-sm)",
                fontFamily: "'Jost', sans-serif",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
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
                <X size={14} color="var(--gray)" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="page-container" style={{ padding: "32px 24px" }}>
        {/* Filter Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {/* Categories */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "'Jost', sans-serif",
                  cursor: "pointer",
                  transition: "var(--transition)",
                  border: "1.5px solid",
                  borderColor:
                    activeCategory === cat
                      ? "var(--pink-500)"
                      : "var(--pink-200)",
                  background:
                    activeCategory === cat ? "var(--pink-500)" : "white",
                  color: activeCategory === cat ? "white" : "var(--gray)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SlidersHorizontal size={15} color="var(--gray)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 16px",
                borderRadius: 50,
                border: "1.5px solid var(--pink-200)",
                background: "white",
                fontSize: 13,
                color: "var(--dark)",
                fontFamily: "'Jost', sans-serif",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="default">Urutkan</option>
              <option value="price-asc">Harga: Terendah</option>
              <option value="price-desc">Harga: Tertinggi</option>
              <option value="rating">Rating Terbaik</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: "var(--gray)", marginBottom: 24 }}>
          Menampilkan{" "}
          <strong style={{ color: "var(--dark)" }}>{filtered.length}</strong>{" "}
          produk
          {search && (
            <>
              {" "}
              untuk "
              <strong style={{ color: "var(--pink-500)" }}>{search}</strong>"
            </>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
            <div style={{ fontSize: 18, color: "var(--gray)" }}>
              Produk tidak ditemukan
            </div>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="btn-primary"
              style={{ marginTop: 20 }}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {filtered.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "white",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid var(--pink-100)",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                {/* Image */}
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
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                  {product.badge && (
                    <span
                      className={`badge badge-${product.badge.toLowerCase()}`}
                      style={{ position: "absolute", top: 12, left: 12 }}
                    >
                      {product.badge}
                    </span>
                  )}
                  {product.stock <= 8 && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        background: "rgba(0,0,0,0.6)",
                        color: "white",
                        fontSize: 10,
                        padding: "3px 8px",
                        borderRadius: 50,
                      }}
                    >
                      Sisa {product.stock}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "16px 20px 20px" }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--gray)",
                      letterSpacing: 1,
                      marginBottom: 4,
                    }}
                  >
                    {product.category}
                  </div>
                  <Link
                    to={`/product/${product.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 400,
                        color: "var(--dark)",
                        marginBottom: 8,
                        lineHeight: 1.3,
                      }}
                    >
                      {product.name}
                    </h3>
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 14,
                    }}
                  >
                    <Star
                      size={12}
                      fill="var(--pink-400)"
                      color="var(--pink-400)"
                    />
                    <span style={{ fontSize: 12, color: "var(--gray)" }}>
                      {product.rating} ({product.reviews} ulasan)
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          color: "var(--pink-500)",
                        }}
                      >
                        Rp{product.price.toLocaleString("id-ID")}
                      </div>
                      {product.originalPrice && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--gray)",
                            textDecoration: "line-through",
                          }}
                        >
                          Rp{product.originalPrice.toLocaleString("id-ID")}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAdd(product)}
                      style={{
                        background:
                          addedId === product.id
                            ? "linear-gradient(135deg, #4caf50, #388e3c)"
                            : "linear-gradient(135deg, var(--pink-500), var(--pink-600))",
                        color: "white",
                        border: "none",
                        borderRadius: 50,
                        padding: "9px 16px",
                        fontSize: 12,
                        fontWeight: 500,
                        fontFamily: "'Jost', sans-serif",
                        cursor: "pointer",
                        transition: "var(--transition)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <ShoppingBag size={13} />
                      {addedId === product.id ? "Ditambahkan!" : "Tambah"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, cartTotal, user, addOrder, clearCart } = useApp();
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState("diantar");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const shipping = deliveryMethod === "diantar" ? 15000 : 0;
  const total = cartTotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    const newOrderId = "HB-" + Math.floor(Math.random() * 1000000);
    const order = {
      id: newOrderId,
      customer: user?.name || "Guest",
      email: user?.email || "",
      items: cart.reduce((sum, i) => sum + i.qty, 0),
      total: total,
      status: "Pending",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      deliveryMethod,
      details: {
        address: deliveryMethod === "diantar" ? address : "Ambil di toko",
        phone,
        notes,
        subtotal: cartTotal,
        shipping,
        cartItems: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
        })),
      },
    };

    addOrder(order);
    clearCart();
    setOrderId(newOrderId);
    setOrderSuccess(true);
    setLoading(false);
  };

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #fff5f7 0%, #ffe4ec 50%, #fff0f3 100%)" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <span style={{ fontSize: 80, display: "block", marginBottom: 20 }}>🛒</span>
          <h2 style={{ color: "#d63384", margin: "0 0 10px" }}>Keranjang Belanja Kosong</h2>
          <p style={{ color: "#888", margin: "0 0 25px" }}>Tambahkan produk favoritmu ke keranjang terlebih dahulu</p>
          <button onClick={() => navigate("/catalog")} style={{ padding: "14px 35px", background: "linear-gradient(135deg, #ff6b9d, #d63384)", color: "white", border: "none", borderRadius: 25, fontSize: 16, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 15px rgba(255,107,157,0.4)" }}>
            🌸 Lihat Katalog
          </button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #fff5f7 0%, #ffe4ec 50%, #fff0f3 100%)", padding: 20 }}>
        <div style={{ textAlign: "center", background: "white", padding: "50px 40px", borderRadius: 24, boxShadow: "0 20px 60px rgba(255,107,157,0.2)", maxWidth: 500, width: "100%" }}>
          <span style={{ fontSize: 80, display: "block", marginBottom: 20 }}>🎉</span>
          <h2 style={{ color: "#d63384", margin: "0 0 10px", fontSize: 28 }}>Pesanan Berhasil!</h2>
          <p style={{ color: "#888", margin: "0 0 25px", fontSize: 16 }}>Terima kasih telah berbelanja di House Blooms</p>
          <div style={{ background: "#fff5f7", borderRadius: 16, padding: 20, marginBottom: 25, textAlign: "left", border: "2px solid #ffc2d1" }}>
            <p style={{ margin: "8px 0", color: "#555", fontSize: 14 }}><strong style={{ color: "#d63384" }}>Nomor Pesanan:</strong> #{orderId}</p>
            <p style={{ margin: "8px 0", color: "#555", fontSize: 14 }}><strong style={{ color: "#d63384" }}>Total Pembayaran:</strong> Rp {total.toLocaleString()}</p>
            <p style={{ margin: "8px 0", color: "#555", fontSize: 14 }}><strong style={{ color: "#d63384" }}>Metode:</strong> {deliveryMethod === "diantar" ? "Diantar ke Alamat" : "Ambil di Toko"}</p>
          </div>
          <div style={{ display: "flex", gap: 15, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/")} style={{ padding: "14px 25px", borderRadius: 25, fontSize: 14, fontWeight: 600, cursor: "pointer", background: "white", border: "2px solid #ff6b9d", color: "#ff6b9d" }}>🏠 Kembali ke Beranda</button>
            <button onClick={() => navigate("/catalog")} style={{ padding: "14px 25px", borderRadius: 25, fontSize: 14, fontWeight: 600, cursor: "pointer", background: "linear-gradient(135deg, #ff6b9d, #d63384)", color: "white", border: "none", boxShadow: "0 4px 15px rgba(255,107,157,0.4)" }}>🌸 Lihat Produk Lain</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fff5f7 0%, #ffe4ec 50%, #fff0f3 100%)", padding: "20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header Mobile */}
        <h2 style={{ color: "#d63384", fontSize: 24, margin: "0 0 20px", fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
          <span>🛒</span> Detail Pesanan
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>

          {/* Left Column - Form */}
          <div style={{ background: "white", borderRadius: 20, padding: "25px", boxShadow: "0 10px 40px rgba(255,107,157,0.1)" }}>
            {/* Metode Pengambilan */}
            <div style={{ marginBottom: 25 }}>
              <label style={{ display: "block", marginBottom: 12, color: "#555", fontWeight: 600, fontSize: 15 }}>
                📦 Metode Pengambilan
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { value: "diantar", icon: "🚚", label: "Diantar ke Alamat", desc: "Ongkir Rp 15.000" },
                  { value: "ambil", icon: "🏪", label: "Ambil Sendiri di Toko", desc: "Gratis, siap ambil dalam 1 jam" },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setDeliveryMethod(opt.value)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "16px",
                      border: deliveryMethod === opt.value ? "2px solid #ff6b9d" : "2px solid #f0f0f0",
                      borderRadius: 14,
                      cursor: "pointer",
                      background: deliveryMethod === opt.value ? "linear-gradient(135deg, #fff5f7, #ffe4ec)" : "white",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{
                      width: 20,
                      height: 20,
                      border: deliveryMethod === opt.value ? "2px solid #ff6b9d" : "2px solid #ddd",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}>
                      {deliveryMethod === opt.value && (
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "linear-gradient(135deg, #ff6b9d, #d63384)" }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 16 }}>{opt.icon}</span>
                        <strong style={{ color: "#333", fontSize: 14 }}>{opt.label}</strong>
                      </div>
                      <p style={{ margin: 0, color: "#888", fontSize: 12, lineHeight: 1.4 }}>{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Alamat - hanya kalau diantar */}
              {deliveryMethod === "diantar" && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", marginBottom: 8, color: "#555", fontWeight: 500, fontSize: 14 }}>📍 Alamat Pengiriman</label>
                  <textarea
                    placeholder="Alamat lengkap (Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required={deliveryMethod === "diantar"}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "2px solid #f0f0f0",
                      borderRadius: 12,
                      fontSize: 14,
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              )}

              {/* Nomor Telepon */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 8, color: "#555", fontWeight: 500, fontSize: 14 }}>📱 Nomor Telepon</label>
                <input
                  type="tel"
                  placeholder="0812xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "2px solid #f0f0f0",
                    borderRadius: 12,
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Catatan Pesanan */}
              <div style={{ marginBottom: 25 }}>
                <label style={{ display: "block", marginBottom: 8, color: "#555", fontWeight: 500, fontSize: 14 }}>📝 Catatan Pesanan (Opsional)</label>
                <textarea
                  placeholder="Contoh: Bungkus kado, tulis ucapan selamat, dll."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "2px solid #f0f0f0",
                    borderRadius: 12,
                    fontSize: 14,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: loading ? "#ccc" : "linear-gradient(135deg, #ff6b9d, #d63384)",
                  color: "white",
                  border: "none",
                  borderRadius: 25,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: 16,
                  boxShadow: loading ? "none" : "0 4px 15px rgba(255,107,157,0.4)",
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? "⏳ Memproses..." : "🛒 Buat Pesanan"}
              </button>
            </form>
          </div>

          {/* Right Column - Summary */}
          <div style={{ position: "sticky", top: 20, alignSelf: "start" }}>
            <div style={{ background: "white", borderRadius: 20, padding: 25, boxShadow: "0 10px 40px rgba(255,107,157,0.1)", marginBottom: 15 }}>
              <h3 style={{ margin: "0 0 20px", color: "#d63384", fontSize: 18, fontWeight: 600 }}>
                📋 Ringkasan Pesanan
              </h3>

              {/* Cart Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
                {cart.map((item, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 10, border: "2px solid #ffc2d1", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: "0 0 2px", color: "#333", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.name}
                      </p>
                      <p style={{ margin: 0, color: "#888", fontSize: 12 }}>x{item.qty}</p>
                    </div>
                    <span style={{ color: "#d63384", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>
                      Rp {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "#f0f0f0", margin: "16px 0" }} />

              {/* Pricing */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, color: "#555", fontSize: 14 }}>
                <span>Subtotal</span>
                <span>Rp {cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, color: "#555", fontSize: 14 }}>
                <span>Ongkir</span>
                <span style={{ color: shipping === 0 ? "#4caf50" : "inherit", fontWeight: shipping === 0 ? 700 : "inherit" }}>
                  {shipping === 0 ? "GRATIS 🎉" : `Rp ${shipping.toLocaleString()}`}
                </span>
              </div>

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "2px solid #ffc2d1" }}>
                <span style={{ color: "#333", fontWeight: 600, fontSize: 16 }}>Total</span>
                <span style={{ color: "#d63384", fontWeight: 700, fontSize: 22 }}>Rp {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Security Badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 15px", background: "white", borderRadius: 12, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <p style={{ margin: 0, color: "#888", fontSize: 12 }}>Pembayaran aman & terenkripsi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
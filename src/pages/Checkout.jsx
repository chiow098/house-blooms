import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Checkout = () => {
  const { cart, clearCart, cartTotal, addOrder } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "transfer",
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cartTotal;
  const shipping = subtotal > 100000 ? 0 : 15000;
  const total = subtotal + shipping;

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    const orderId = "HB-" + String(Date.now()).slice(-6);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    const order = {
      id: orderId,
      customer: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      total: total,
      status: "Pending",
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      items: totalItems,
      details: {
        address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        paymentMethod: formData.paymentMethod,
        subtotal: subtotal,
        shipping: shipping,
        cartItems: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
        })),
      },
    };

    // Debug log
    console.log("=== CHECKOUT DEBUG ===");
    console.log("Order to add:", order);
    console.log("======================");

    addOrder(order);

    const existingOrders = JSON.parse(
      localStorage.getItem("hb_orders") || "[]",
    );
    existingOrders.push(order);
    localStorage.setItem("hb_orders", JSON.stringify(existingOrders));

    // Kurangi stok produk
    const savedProducts = JSON.parse(
      localStorage.getItem("hb_products") || "[]",
    );
    const updatedProducts = savedProducts.map((p) => {
      const cartItem = cart.find((c) => c.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
      }
      return p;
    });
    localStorage.setItem("hb_products", JSON.stringify(updatedProducts));

    setOrderId(orderId);
    setOrderSuccess(true);
    clearCart();
  };

  const paymentMethods = [
    {
      id: "transfer",
      name: "Transfer Bank",
      icon: "🏦",
      desc: "BCA, BNI, Mandiri, BRI",
    },
    {
      id: "ewallet",
      name: "E-Wallet",
      icon: "📱",
      desc: "OVO, DANA, GoPay, ShopeePay",
    },
    {
      id: "cod",
      name: "COD (Bayar di Tempat)",
      icon: "💵",
      desc: "Bayar saat barang diterima",
    },
  ];

  if (cart.length === 0 && !orderSuccess) {
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
            Keranjang Belanja Kosong
          </h2>
          <p style={{ color: "#888", margin: "0 0 25px" }}>
            Tambahkan produk favoritmu ke keranjang terlebih dahulu
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

  if (orderSuccess) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #fff5f7 0%, #ffe4ec 50%, #fff0f3 100%)",
          padding: 20,
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: "white",
            padding: "50px 40px",
            borderRadius: 24,
            boxShadow: "0 20px 60px rgba(255,107,157,0.2)",
            maxWidth: 500,
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 80,
              display: "block",
              marginBottom: 20,
              animation: "bounce 1s ease infinite",
            }}
          >
            🎉
          </div>
          <h2 style={{ color: "#d63384", margin: "0 0 10px", fontSize: 28 }}>
            Pesanan Berhasil!
          </h2>
          <p style={{ color: "#888", margin: "0 0 25px", fontSize: 16 }}>
            Terima kasih telah berbelanja di House Blooms
          </p>
          <div
            style={{
              background: "#fff5f7",
              borderRadius: 16,
              padding: 20,
              marginBottom: 25,
              textAlign: "left",
              border: "2px solid #ffc2d1",
            }}
          >
            <p style={{ margin: "8px 0", color: "#555", fontSize: 14 }}>
              <strong style={{ color: "#d63384" }}>Nomor Pesanan:</strong> #
              {orderId}
            </p>
            <p style={{ margin: "8px 0", color: "#555", fontSize: 14 }}>
              <strong style={{ color: "#d63384" }}>Total Pembayaran:</strong> Rp{" "}
              {total.toLocaleString()}
            </p>
            <p style={{ margin: "8px 0", color: "#555", fontSize: 14 }}>
              <strong style={{ color: "#d63384" }}>Metode:</strong>{" "}
              {
                paymentMethods.find((m) => m.id === formData.paymentMethod)
                  ?.name
              }
            </p>
          </div>
          <div style={{ display: "flex", gap: 15, justifyContent: "center" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "14px 25px",
                borderRadius: 25,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                background: "white",
                border: "2px solid #ff6b9d",
                color: "#ff6b9d",
              }}
            >
              🏠 Kembali ke Beranda
            </button>
            <button
              onClick={() => navigate("/catalog")}
              style={{
                padding: "14px 25px",
                borderRadius: 25,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                background: "linear-gradient(135deg, #ff6b9d, #d63384)",
                color: "white",
                border: "none",
                boxShadow: "0 4px 15px rgba(255,107,157,0.4)",
              }}
            >
              🌸 Lihat Produk Lain
            </button>
          </div>
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
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Progress Steps */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
            gap: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background:
                  step >= 1
                    ? "linear-gradient(135deg, #ff6b9d, #d63384)"
                    : "#f0f0f0",
                color: step >= 1 ? "white" : "#999",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 16,
                boxShadow:
                  step >= 1 ? "0 4px 15px rgba(255,107,157,0.4)" : "none",
              }}
            >
              1
            </div>
            <span
              style={{
                fontSize: 13,
                color: step >= 1 ? "#d63384" : "#999",
                fontWeight: 500,
              }}
            >
              Keranjang
            </span>
          </div>
          <div
            style={{
              width: 80,
              height: 3,
              background:
                step > 1
                  ? "linear-gradient(90deg, #ff6b9d, #d63384)"
                  : "#f0f0f0",
              margin: "0 15px",
              marginBottom: 25,
            }}
          ></div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background:
                  step >= 2
                    ? "linear-gradient(135deg, #ff6b9d, #d63384)"
                    : "#f0f0f0",
                color: step >= 2 ? "white" : "#999",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 16,
                boxShadow:
                  step >= 2 ? "0 4px 15px rgba(255,107,157,0.4)" : "none",
              }}
            >
              2
            </div>
            <span
              style={{
                fontSize: 13,
                color: step >= 2 ? "#d63384" : "#999",
                fontWeight: 500,
              }}
            >
              Pengiriman
            </span>
          </div>
          <div
            style={{
              width: 80,
              height: 3,
              background:
                step > 2
                  ? "linear-gradient(90deg, #ff6b9d, #d63384)"
                  : "#f0f0f0",
              margin: "0 15px",
              marginBottom: 25,
            }}
          ></div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background:
                  step >= 3
                    ? "linear-gradient(135deg, #ff6b9d, #d63384)"
                    : "#f0f0f0",
                color: step >= 3 ? "white" : "#999",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 16,
                boxShadow:
                  step >= 3 ? "0 4px 15px rgba(255,107,157,0.4)" : "none",
              }}
            >
              3
            </div>
            <span
              style={{
                fontSize: 13,
                color: step >= 3 ? "#d63384" : "#999",
                fontWeight: 500,
              }}
            >
              Pembayaran
            </span>
          </div>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 30 }}
        >
          {/* Left Column - Form */}
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 30,
              boxShadow: "0 10px 40px rgba(255,107,157,0.1)",
            }}
          >
            {step === 1 && (
              <div>
                <h3
                  style={{
                    margin: "0 0 25px",
                    color: "#d63384",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  🛒 Review Keranjang
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 15,
                    marginBottom: 25,
                  }}
                >
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: 15,
                        padding: 15,
                        background: "#fff5f7",
                        borderRadius: 12,
                        border: "2px solid #ffc2d1",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            margin: "0 0 5px",
                            color: "#333",
                            fontSize: 16,
                          }}
                        >
                          {item.name}
                        </h4>
                        <p
                          style={{
                            margin: "0 0 10px",
                            color: "#888",
                            fontSize: 13,
                          }}
                        >
                          {item.description}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              background:
                                "linear-gradient(135deg, #ffc2d1, #ff8fab)",
                              color: "white",
                              padding: "4px 12px",
                              borderRadius: 15,
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            Qty: {item.qty}
                          </span>
                          <span
                            style={{
                              color: "#d63384",
                              fontWeight: 700,
                              fontSize: 16,
                            }}
                          >
                            Rp {(item.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    width: "100%",
                    padding: "14px 25px",
                    background: "linear-gradient(135deg, #ff6b9d, #d63384)",
                    color: "white",
                    border: "none",
                    borderRadius: 25,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 14,
                    boxShadow: "0 4px 15px rgba(255,107,157,0.4)",
                  }}
                >
                  Lanjut ke Pengiriman →
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3
                  style={{
                    margin: "0 0 25px",
                    color: "#d63384",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  📍 Data Pengiriman
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(3);
                  }}
                >
                  <div style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 8,
                        color: "#555",
                        fontWeight: 500,
                        fontSize: 14,
                      }}
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap"
                      required
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        border: "2px solid #f0f0f0",
                        borderRadius: 12,
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 15,
                    }}
                  >
                    <div style={{ marginBottom: 20 }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          color: "#555",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                        required
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          border: "2px solid #f0f0f0",
                          borderRadius: 12,
                          fontSize: 14,
                          outline: "none",
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          color: "#555",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="08xxxxxxxxxx"
                        required
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          border: "2px solid #f0f0f0",
                          borderRadius: 12,
                          fontSize: 14,
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 8,
                        color: "#555",
                        fontWeight: 500,
                        fontSize: 14,
                      }}
                    >
                      Alamat Lengkap
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Nama jalan, nomor rumah, RT/RW"
                      rows="3"
                      required
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        border: "2px solid #f0f0f0",
                        borderRadius: 12,
                        fontSize: 14,
                        outline: "none",
                        resize: "vertical",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 15,
                    }}
                  >
                    <div style={{ marginBottom: 20 }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          color: "#555",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Kota
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Kota/Kabupaten"
                        required
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          border: "2px solid #f0f0f0",
                          borderRadius: 12,
                          fontSize: 14,
                          outline: "none",
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: 8,
                          color: "#555",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="12345"
                        required
                        style={{
                          width: "100%",
                          padding: "14px 16px",
                          border: "2px solid #f0f0f0",
                          borderRadius: 12,
                          fontSize: 14,
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 15, marginTop: 25 }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        padding: "14px 25px",
                        border: "2px solid #ffc2d1",
                        background: "white",
                        color: "#ff6b9d",
                        borderRadius: 25,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      ← Kembali
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: "14px 25px",
                        background: "linear-gradient(135deg, #ff6b9d, #d63384)",
                        color: "white",
                        border: "none",
                        borderRadius: 25,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 14,
                        boxShadow: "0 4px 15px rgba(255,107,157,0.4)",
                      }}
                    >
                      Lanjut ke Pembayaran →
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3
                  style={{
                    margin: "0 0 25px",
                    color: "#d63384",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  💳 Metode Pembayaran
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 25,
                  }}
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: method.id,
                        }))
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                        padding: "18px 20px",
                        border:
                          formData.paymentMethod === method.id
                            ? "2px solid #ff6b9d"
                            : "2px solid #f0f0f0",
                        borderRadius: 14,
                        cursor: "pointer",
                        background:
                          formData.paymentMethod === method.id
                            ? "linear-gradient(135deg, #fff5f7, #ffe4ec)"
                            : "white",
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          border: "2px solid #ddd",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {formData.paymentMethod === method.id && (
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #ff6b9d, #d63384)",
                            }}
                          ></div>
                        )}
                      </div>
                      <div
                        style={{ fontSize: 28, width: 50, textAlign: "center" }}
                      >
                        {method.icon}
                      </div>
                      <div>
                        <h4
                          style={{
                            margin: "0 0 3px",
                            color: "#333",
                            fontSize: 15,
                          }}
                        >
                          {method.name}
                        </h4>
                        <p style={{ margin: 0, color: "#888", fontSize: 13 }}>
                          {method.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.paymentMethod === "transfer" && (
                  <div
                    style={{
                      background: "#fff5f7",
                      borderRadius: 12,
                      padding: 20,
                      marginBottom: 25,
                      border: "2px solid #ffc2d1",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 15px",
                        color: "#d63384",
                        fontSize: 15,
                      }}
                    >
                      Detail Rekening:
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 15px",
                          background: "white",
                          borderRadius: 8,
                          fontSize: 14,
                        }}
                      >
                        <strong style={{ color: "#d63384", minWidth: 60 }}>
                          BCA
                        </strong>
                        <span style={{ color: "#555" }}>1234 5678 9012</span>
                        <span style={{ color: "#555" }}>a.n House Blooms</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 15px",
                          background: "white",
                          borderRadius: 8,
                          fontSize: 14,
                        }}
                      >
                        <strong style={{ color: "#d63384", minWidth: 60 }}>
                          BNI
                        </strong>
                        <span style={{ color: "#555" }}>0987 6543 2109</span>
                        <span style={{ color: "#555" }}>a.n House Blooms</span>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 15 }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      padding: "14px 25px",
                      border: "2px solid #ffc2d1",
                      background: "white",
                      color: "#ff6b9d",
                      borderRadius: 25,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    ← Kembali
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    style={{
                      flex: 1,
                      padding: "14px 25px",
                      background: "linear-gradient(135deg, #ff6b9d, #d63384)",
                      color: "white",
                      border: "none",
                      borderRadius: 25,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 14,
                      boxShadow: "0 4px 15px rgba(255,107,157,0.4)",
                    }}
                  >
                    🌸 Bayar Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div style={{ position: "sticky", top: 20 }}>
            <div
              style={{
                background: "white",
                borderRadius: 20,
                padding: 25,
                boxShadow: "0 10px 40px rgba(255,107,157,0.1)",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  margin: "0 0 20px",
                  color: "#d63384",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Ringkasan Pesanan
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                {cart.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flex: 1,
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 45,
                          height: 45,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "2px solid #ffc2d1",
                        }}
                      />
                      <div>
                        <p
                          style={{
                            margin: 0,
                            color: "#333",
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {item.name}
                        </p>
                        <p
                          style={{
                            margin: "3px 0 0",
                            color: "#888",
                            fontSize: 12,
                          }}
                        >
                          x{item.qty}
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        color: "#d63384",
                        fontWeight: 600,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Rp {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, #ffc2d1, transparent)",
                  margin: "15px 0",
                }}
              ></div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  color: "#555",
                  fontSize: 14,
                }}
              >
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  color: "#555",
                  fontSize: 14,
                }}
              >
                <span>Ongkir</span>
                <span
                  style={{
                    color: shipping === 0 ? "#4caf50" : "inherit",
                    fontWeight: shipping === 0 ? 700 : "inherit",
                  }}
                >
                  {shipping === 0
                    ? "GRATIS 🎉"
                    : `Rp ${shipping.toLocaleString()}`}
                </span>
              </div>
              {shipping === 0 && (
                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#ff6b9d",
                    fontSize: 12,
                    fontStyle: "italic",
                  }}
                >
                  ✨ Gratis ongkir untuk pembelian di atas Rp 100.000
                </p>
              )}
              <div
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, #ffc2d1, transparent)",
                  margin: "15px 0",
                }}
              ></div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 15,
                  borderTop: "2px solid #ffc2d1",
                }}
              >
                <span style={{ color: "#333", fontWeight: 600, fontSize: 16 }}>
                  Total
                </span>
                <span
                  style={{ color: "#d63384", fontWeight: 700, fontSize: 22 }}
                >
                  Rp {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: 15,
                background: "white",
                borderRadius: 12,
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              }}
            >
              <span style={{ fontSize: 20 }}>🔒</span>
              <p style={{ margin: 0, color: "#888", fontSize: 13 }}>
                Pembayaran aman & terenkripsi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

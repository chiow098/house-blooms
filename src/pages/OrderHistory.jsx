import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./OrderHistory.css";

const OrderHistory = () => {
  const { orders, user } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const myOrders = orders.filter((o) => o.customer === user?.name);

  const filteredOrders =
    filter === "all" ? myOrders : myOrders.filter((o) => o.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#ff9800";
      case "Diproses":
        return "#2196f3";
      case "Dikirim":
        return "#9c27b0";
      case "Selesai":
        return "#4caf50";
      case "Dibatalkan":
        return "#f44336";
      default:
        return "#999";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Diproses":
        return "🔧";
      case "Dikirim":
        return "🚚";
      case "Selesai":
        return "✅";
      case "Dibatalkan":
        return "❌";
      default:
        return "📦";
    }
  };

  if (!user) {
    return (
      <div className="order-history-empty">
        <div className="empty-content">
          <span className="empty-icon">🔒</span>
          <h2>Silakan Login Terlebih Dahulu</h2>
          <p>Login untuk melihat riwayat pesananmu</p>
          <button className="btn-login" onClick={() => navigate("/login")}>
            🔑 Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        <div className="page-header">
          <h2>🌸 Pesanan Saya</h2>
          <p>Hai {user.name}, berikut riwayat pesananmu</p>
        </div>

        <div className="filter-tabs">
          {["all", "Pending", "Diproses", "Dikirim", "Selesai"].map(
            (status) => (
              <button
                key={status}
                className={filter === status ? "active" : ""}
                onClick={() => setFilter(status)}
              >
                {status === "all" ? "Semua" : status}
                {status !== "all" && (
                  <span className="count">
                    {myOrders.filter((o) => o.status === status).length}
                  </span>
                )}
              </button>
            ),
          )}
        </div>

        <div className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <span className="label">No. Pesanan</span>
                    <strong>#{order.id}</strong>
                  </div>
                  <div className="order-date">
                    <span className="label">Tanggal</span>
                    <span>{order.date}</span>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-items">
                    <span className="items-count">{order.items} item</span>
                    {order.details?.cartItems?.map((item, idx) => (
                      <div key={idx} className="mini-item">
                        <img src={item.image} alt={item.name} />
                        <span>
                          {item.name} (x{item.qty})
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <span className="label">Total Pembayaran</span>
                    <strong>Rp {order.total.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="tracking-timeline">
                  {["Pending", "Diproses", "Dikirim", "Selesai"].map(
                    (step, idx) => {
                      const stepIndex = [
                        "Pending",
                        "Diproses",
                        "Dikirim",
                        "Selesai",
                      ].indexOf(order.status);
                      const isActive = idx <= stepIndex;
                      const isCurrent = idx === stepIndex;

                      return (
                        <div
                          key={step}
                          className={`timeline-step ${isActive ? "active" : ""} ${isCurrent ? "current" : ""}`}
                        >
                          <div className="timeline-dot"></div>
                          <span className="timeline-label">{step}</span>
                          {idx < 3 && <div className="timeline-line"></div>}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">
              <span className="no-icon">📭</span>
              <h3>Belum Ada Pesanan</h3>
              <p>Belanja sekarang untuk melihat pesananmu di sini</p>
              <button className="btn-shop" onClick={() => navigate("/catalog")}>
                🌸 Lihat Katalog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;

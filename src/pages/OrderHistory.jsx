import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import "./OrderHistory.css";

export default function OrderHistory() {
  const { orders, user } = useApp();
  const [filter, setFilter] = useState("Semua");

  const userOrders = orders.filter((o) => 
    o.email?.toLowerCase() === user?.email?.toLowerCase() || 
    o.customer === user?.name
  );

  const filteredOrders = filter === "Semua" 
    ? userOrders 
    : userOrders.filter((o) => o.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#ff9800";
      case "Diproses": return "#2196f3";
      case "Dikirim": return "#9c27b0";
      case "Selesai": return "#4caf50";
      case "Dibatalkan": return "#f44336";
      default: return "#999";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Pending": return "⏳ Menunggu Konfirmasi";
      case "Diproses": return "🔄 Diproses";
      case "Dikirim": return "🚚 Dikirim";
      case "Selesai": return "✅ Selesai";
      case "Dibatalkan": return "❌ Dibatalkan";
      default: return status;
    }
  };

  const statusCounts = {
    Semua: userOrders.length,
    Pending: userOrders.filter((o) => o.status === "Pending").length,
    Diproses: userOrders.filter((o) => o.status === "Diproses").length,
    Dikirim: userOrders.filter((o) => o.status === "Dikirim").length,
    Selesai: userOrders.filter((o) => o.status === "Selesai").length,
  };

  return (
    <div className="order-history">
      <div className="order-header">
        <h1>🌸 Pesanan Saya</h1>
        <p>Hai {user?.name || "User"}, berikut riwayat pesananmu</p>
      </div>

      <div className="status-filters">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            className={filter === status ? "active" : ""}
            onClick={() => setFilter(status)}
          >
            {status} <span className="count">{count}</span>
          </button>
        ))}
      </div>

      {filteredOrders.length > 0 ? (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.firebaseKey || order.id} className="order-card">
              <div className="order-header-card">
                <div>
                  <span className="order-id">#{order.id}</span>
                  <span className="order-date">{order.date}</span>
                </div>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="order-items">
                {order.itemsList?.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.qty} x Rp {item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <strong>Total: Rp {(order.total || 0).toLocaleString()}</strong>
              </div>

              {/* METODE PENGAMBILAN */}
              <div className={`delivery-method ${order.deliveryMethod}`}>
                {order.deliveryMethod === "diantar" ? (
                  <div>
                    <h4>🚚 Diantar ke Alamat</h4>
                    <p><strong>Alamat:</strong> {order.details?.address}</p>
                    <p><strong>Telp:</strong> {order.details?.phone}</p>
                  </div>
                ) : (
                  <div>
                    <h4>🏪 Ambil Sendiri di Toko</h4>
                    <p>Alamat Toko: Jl. Manekroo, No. 453, Meulaboh</p>
                    <p><strong>Telp:</strong> {order.details?.phone}</p>
                    <p style={{ color: "#ff6b9d", fontWeight: 600 }}>
                      ⏰ Siap ambil dalam 1 jam setelah pesanan dikonfirmasi
                    </p>
                  </div>
                )}
              </div>

              {/* INFO PENGANTARAN */}
              {order.delivery && (
                <div className="delivery-info">
                  <h4>🚚 Info Pengantaran</h4>
                  <p><strong>Kurir:</strong> {order.delivery.kurir || "-"}</p>
                  <p><strong>No. Resi:</strong> {order.delivery.resi || "-"}</p>
                  <p><strong>Estimasi:</strong> {order.delivery.estimasi || "-"}</p>
                </div>
              )}

              {/* CATATAN ADMIN */}
              {order.adminNote && (
                <div className="admin-note">
                  <h4>📝 Catatan dari Admin</h4>
                  <p>{order.adminNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-orders">
          <span className="mailbox">📭</span>
          <h3>Belum Ada Pesanan</h3>
          <p>Belanja sekarang untuk melihat pesananmu di sini</p>
          <button className="btn-shop" onClick={() => window.location.href = "/catalog"}>
            🌸 Lihat Katalog
          </button>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import "./AdminDashboard.css";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const AdminDashboard = () => {
  const { orders, updateOrderStatus, updateOrderDelivery, updateOrderNote, users } = useApp();
  const [loginLogs, setLoginLogs] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [deliveryInput, setDeliveryInput] = useState({ kurir: "", resi: "", estimasi: "" });
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    const logsRef = ref(db, "loginLogs");
    const unsubscribe = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const logsList = Object.entries(data).map(([key, value]) => ({
          ...value,
          key,
        }));
        setLoginLogs(logsList.reverse());
      } else {
        setLoginLogs([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedProducts = localStorage.getItem("hb_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const defaultProducts = [
        { id: 1, name: "Elinor", price: 85000, category: "Buket", stock: 15, image: "/images/Elinor.jpeg", description: "Buket bunga Elinor elegan" },
        { id: 2, name: "Faelyn", price: 95000, category: "Buket", stock: 12, image: "/images/Faelyn.jpeg", description: "Buket bunga Faelyn cantik" },
        { id: 3, name: "Jaccy", price: 75000, category: "Buket", stock: 20, image: "/images/Jaccy.jpeg", description: "Buket bunga Jaccy segar" },
        { id: 4, name: "Lexxa", price: 120000, category: "Buket", stock: 8, image: "/images/Lexxa.jpeg", description: "Buket bunga Lexxa mewah" },
        { id: 5, name: "Marie", price: 65000, category: "Buket", stock: 25, image: "/images/Marie.jpeg", description: "Buket bunga Marie manis" },
        { id: 6, name: "Than", price: 55000, category: "Buket", stock: 18, image: "/images/Than.jpeg", description: "Buket bunga Than ceria" },
        { id: 7, name: "Wuan", price: 70000, category: "Buket", stock: 14, image: "/images/Wuan.jpeg", description: "Buket bunga Wuan unik" },
      ];
      setProducts(defaultProducts);
      localStorage.setItem("hb_products", JSON.stringify(defaultProducts));
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("hb_products", JSON.stringify(products));
    }
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...formData, id: editingProduct.id, price: Number(formData.price), stock: Number(formData.stock) }
            : p
        )
      );
    } else {
      const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      setProducts((prev) => [...prev, { ...formData, id: newId, price: Number(formData.price), stock: Number(formData.stock) }]);
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id, name: product.name, price: product.price,
      category: product.category, stock: product.stock,
      image: product.image, description: product.description,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ id: "", name: "", price: "", category: "", stock: "", image: "", description: "" });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleOrderStatusChange = (order, newStatus) => {
    updateOrderStatus(order.firebaseKey, newStatus);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStock = products.filter((p) => p.stock < 10).length;

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

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="logo-icon">🌸</span>
          <h2>House Blooms</h2>
          <p>Admin Panel</p>
        </div>
        <nav className="admin-nav">
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            <span>📊</span> Dashboard
          </button>
          <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
            <span>🌷</span> Produk
          </button>
          <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
            <span>📦</span> Pesanan
          </button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            <span>👥</span> Pengguna
          </button>
          <button className={activeTab === "logs" ? "active" : ""} onClick={() => setActiveTab("logs")}>
            <span>📋</span> Riwayat Login
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "products" && "Manajemen Produk"}
            {activeTab === "orders" && "Daftar Pesanan"}
            {activeTab === "users" && "Daftar Pengguna"}
            {activeTab === "logs" && "Riwayat Login"}
          </h1>
          <div className="admin-user">
            <span>👤 Admin</span>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card pink">
                <div className="stat-icon">🌸</div>
                <div className="stat-info"><h3>{totalProducts}</h3><p>Total Produk</p></div>
              </div>
              <div className="stat-card rose">
                <div className="stat-icon">📦</div>
                <div className="stat-info"><h3>{totalStock}</h3><p>Total Stok</p></div>
              </div>
              <div className="stat-card blush">
                <div className="stat-icon">🛒</div>
                <div className="stat-info"><h3>{totalOrders}</h3><p>Total Pesanan</p></div>
              </div>
              <div className="stat-card magenta">
                <div className="stat-icon">💰</div>
                <div className="stat-info"><h3>Rp {totalRevenue.toLocaleString()}</h3><p>Pendapatan</p></div>
              </div>
            </div>
            {lowStock > 0 && (
              <div className="alert-box">
                <span>⚠️</span> {lowStock} produk stok menipis (di bawah 10)
              </div>
            )}
            <div className="recent-section">
              <h3>Produk Stok Menipis</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Produk</th><th>Kategori</th><th>Stok</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {products.filter((p) => p.stock < 10).map((product) => (
                      <tr key={product.id}>
                        <td><div className="product-cell"><img src={product.image} alt={product.name} /><span>{product.name}</span></div></td>
                        <td>{product.category}</td>
                        <td className={product.stock < 5 ? "urgent" : ""}>{product.stock}</td>
                        <td><span className={`badge ${product.stock < 5 ? "danger" : "warning"}`}>{product.stock < 5 ? "Kritis" : "Menipis"}</span></td>
                      </tr>
                    ))}
                    {products.filter((p) => p.stock < 10).length === 0 && (
                      <tr><td colSpan="4" className="empty">Semua stok aman 🌸</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="products-content">
            <div className="toolbar">
              <div className="search-box">
                <input type="text" placeholder="Cari produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <span>🔍</span>
              </div>
              <button className="btn-add" onClick={() => setShowForm(true)}><span>+</span> Tambah Produk</button>
            </div>
            {showForm && (
              <div className="form-overlay">
                <div className="form-modal">
                  <h3>{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Nama Produk</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Harga (Rp)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                      </div>
                      <div className="form-group">
                        <label>Stok</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Kategori</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} required>
                          <option value="">Pilih Kategori</option>
                          <option value="Buket">Buket</option>
                          <option value="Tanaman">Tanaman</option>
                          <option value="Kering">Bunga Kering</option>
                          <option value="Aksesoris">Aksesoris</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Nama File Gambar</label>
                        <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="/images/namafile.jpeg" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Deskripsi</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" required />
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn-cancel" onClick={resetForm}>Batal</button>
                      <button type="submit" className="btn-save">{editingProduct ? "Simpan Perubahan" : "Tambah Produk"}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            <div className="table-container">
              <table className="products-table">
                <thead>
                  <tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell">
                          <img src={product.image} alt={product.name} />
                          <div><strong>{product.name}</strong><small>{product.description}</small></div>
                        </div>
                      </td>
                      <td><span className="category-badge">{product.category}</span></td>
                      <td>Rp {product.price.toLocaleString()}</td>
                      <td className={product.stock < 10 ? "low-stock" : ""}>{product.stock}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit" onClick={() => handleEdit(product)} title="Edit">✏️</button>
                          <button className="btn-delete" onClick={() => handleDelete(product.id)} title="Hapus">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan="5" className="empty">Tidak ada produk ditemukan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-content">
            {selectedOrder && (
              <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>📦 Detail Pesanan #{selectedOrder.id}</h3>
                  
                  <div className="modal-section">
                    <h4>👤 Info Pelanggan</h4>
                    <p><strong>Nama:</strong> {selectedOrder.customer}</p>
                    <p><strong>Email:</strong> {selectedOrder.email}</p>
                  </div>

                  <div className="modal-section">
                    <h4>📦 Metode Pengambilan</h4>
                    <p>
                      {selectedOrder.deliveryMethod === "diantar" 
                        ? "🚚 Diantar ke Alamat" 
                        : "🏪 Ambil Sendiri di Toko"
                      }
                    </p>
                    {selectedOrder.deliveryMethod === "diantar" && (
                      <p><strong>Alamat:</strong> {selectedOrder.details?.address}</p>
                    )}
                    <p><strong>Telp:</strong> {selectedOrder.details?.phone}</p>
                  </div>

                  {selectedOrder.delivery && (
                    <div className="modal-section delivery-info">
                      <h4>🚚 Info Pengantaran</h4>
                      <p><strong>Kurir:</strong> {selectedOrder.delivery.kurir || "-"}</p>
                      <p><strong>No. Resi:</strong> {selectedOrder.delivery.resi || "-"}</p>
                      <p><strong>Estimasi:</strong> {selectedOrder.delivery.estimasi || "-"}</p>
                    </div>
                  )}

                  {selectedOrder.adminNote && (
                    <div className="modal-section admin-note">
                      <h4>📝 Catatan Admin</h4>
                      <p>{selectedOrder.adminNote}</p>
                    </div>
                  )}

                  <hr style={{ margin: "15px 0", borderColor: "#ffc2d1" }} />

                  <h4 style={{ color: "#d63384", marginBottom: 10 }}>🚚 Update Pengantaran</h4>
                  <div className="form-group">
                    <select
                      value={deliveryInput.kurir}
                      onChange={(e) => setDeliveryInput(prev => ({ ...prev, kurir: e.target.value }))}
                      style={{ padding: "10px 14px", border: "2px solid #ffc2d1", borderRadius: 10, fontSize: 14 }}
                    >
                      <option value="">Pilih Kurir</option>
                      <option value="J&T Express">J&T Express</option>
                      <option value="JNE">JNE</option>
                      <option value="Grab Express">Grab Express</option>
                      <option value="Maxim">Maxim</option>
                      <option value="GoSend">GoSend</option>
                    </select>
                    <input type="text" placeholder="Nomor Resi" value={deliveryInput.resi} onChange={(e) => setDeliveryInput(prev => ({ ...prev, resi: e.target.value }))} />
                    <input type="text" placeholder="Estimasi Tiba (contoh: 2-3 hari)" value={deliveryInput.estimasi} onChange={(e) => setDeliveryInput(prev => ({ ...prev, estimasi: e.target.value }))} />
                  </div>

                  <h4 style={{ color: "#d63384", marginBottom: 10 }}>📝 Catatan untuk Pelanggan</h4>
                  <textarea placeholder="Tulis catatan untuk pelanggan..." value={noteInput} onChange={(e) => setNoteInput(e.target.value)} rows={3} />

                  <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setSelectedOrder(null)}>Batal</button>
                    <button className="btn-save" onClick={() => { updateOrderDelivery(selectedOrder.firebaseKey, deliveryInput); updateOrderNote(selectedOrder.firebaseKey, noteInput); setSelectedOrder(null); }}>💾 Simpan</button>
                  </div>
                </div>
              </div>
            )}
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>ID</th><th>Pelanggan</th><th>Item</th><th>Total</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.firebaseKey || order.id}>
                        <td>#{order.id}</td>
                        <td>
                          <div>
                            <strong>{order.customer}</strong>
                            {order.email && <div style={{ fontSize: 12, color: "#888" }}>{order.email}</div>}
                          </div>
                        </td>
                        <td>{order.items} item</td>
                        <td>Rp {(order.total || 0).toLocaleString()}</td>
                        <td><span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>{order.status}</span></td>
                        <td>{order.date}</td>
                        <td>
                          <select value={order.status} onChange={(e) => handleOrderStatusChange(order, e.target.value)} className="status-select">
                            <option value="Pending">Pending</option>
                            <option value="Diproses">Diproses</option>
                            <option value="Dikirim">Dikirim</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Dibatalkan">Dibatalkan</option>
                          </select>
                          <button
                            onClick={() => { setSelectedOrder(order); setNoteInput(order.adminNote || ""); setDeliveryInput(order.delivery || { kurir: "", resi: "", estimasi: "" }); }}
                            style={{ marginTop: 8, padding: "6px 12px", background: "linear-gradient(135deg, #ff6b9d, #d63384)", color: "white", border: "none", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "block", width: "100%" }}
                          >
                            📝 Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="empty">Belum ada pesanan 🌸</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-content">
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>ID</th><th>Nama</th><th>Email</th><th>Role</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td><div className="user-cell"><span className="user-avatar">{u.name.charAt(0)}</span><span>{u.name}</span></div></td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge ${u.isAdmin ? "admin" : "user"}`}>{u.isAdmin ? "👑 Admin" : "👤 User"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="orders-content">
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Nama</th><th>Email</th><th>Tanggal</th><th>Waktu</th></tr>
                </thead>
                <tbody>
                  {loginLogs.length > 0 ? (
                    loginLogs.map((log, index) => (
                      <tr key={index}>
                        <td><strong>{log.name}</strong></td>
                        <td>{log.email}</td>
                        <td>{log.date}</td>
                        <td>{log.time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="empty">Belum ada riwayat login 🌸</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
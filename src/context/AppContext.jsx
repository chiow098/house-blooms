import { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

// Hook untuk mengakses produk dari localStorage (sama dengan Admin Dashboard)
export function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = () => {
      const saved = localStorage.getItem("hb_products");
      if (saved) {
        setProducts(JSON.parse(saved));
      }
    };

    loadProducts();

    window.addEventListener("storage", loadProducts);

    const interval = setInterval(loadProducts, 1000);

    return () => {
      window.removeEventListener("storage", loadProducts);
      clearInterval(interval);
    };
  }, []);

  return products;
}

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin House Blooms",
      email: "admin@houseblooms.com",
      password: "admin123",
      isAdmin: true,
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      email: "siti@email.com",
      password: "user123",
      isAdmin: false,
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: "HB-001",
      customer: "Siti Nurhaliza",
      total: 395000,
      status: "Selesai",
      date: "2024-01-15",
      items: 2,
    },
    {
      id: "HB-002",
      customer: "Budi Santoso",
      total: 225000,
      status: "Diproses",
      date: "2024-01-16",
      items: 1,
    },
    {
      id: "HB-003",
      customer: "Rina Marlina",
      total: 640000,
      status: "Dikirim",
      date: "2024-01-17",
      items: 3,
    },
  ]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      if (exist) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const login = (email, password) => {
    const found = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (found) {
      setUser(found);
      setIsAdmin(found.isAdmin);
      return { success: true };
    }
    return { success: false, message: "Email atau password salah" };
  };

  const register = (name, email, password) => {
    const exist = users.find((u) => u.email === email);
    if (exist) return { success: false, message: "Email sudah terdaftar" };

    // ⬇️ FIX: Gunakan Math.max untuk ID unik
    const newId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    const newUser = {
      id: newId,
      name,
      email,
      password,
      isAdmin: false,
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setIsAdmin(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  const addOrder = (order) => setOrders((prev) => [order, ...prev]);

  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
        user,
        isAdmin,
        login,
        register,
        logout,
        orders,
        addOrder,
        updateOrderStatus,
        users,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

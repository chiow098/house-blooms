import { createContext, useState, useContext, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, onValue, push, update } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

const AppContext = createContext();

export function useProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const loadProducts = () => {
      const saved = localStorage.getItem("hb_products");
      if (saved) setProducts(JSON.parse(saved));
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
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const ADMIN_EMAIL = "admin@houseblooms.com";

  // Listen auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const adminStatus = firebaseUser.email === ADMIN_EMAIL;
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          isAdmin: adminStatus,
        });
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load orders dari Firebase
  useEffect(() => {
    const ordersRef = ref(db, "orders");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.entries(data).map(([key, value]) => ({
          ...value,
          firebaseKey: key,
        }));
        setOrders(ordersList.reverse());
      } else {
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      if (exist) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: "Email atau password salah" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      return { success: true };
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        return { success: false, message: "Email sudah terdaftar" };
      }
      return { success: false, message: "Gagal mendaftar, coba lagi" };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  const addOrder = (order) => {
    const ordersRef = ref(db, "orders");
    push(ordersRef, order);
  };

  const updateOrderStatus = (firebaseKey, status) => {
    const orderRef = ref(db, `orders/${firebaseKey}`);
    update(orderRef, { status });
  };

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      cartCount, cartTotal, user, isAdmin, login, register, logout,
      orders, addOrder, updateOrderStatus, users,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
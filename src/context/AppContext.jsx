import { createContext, useState, useContext, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, onValue, push, update, set } from "firebase/database";
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
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsList = Object.entries(data).map(([key, value]) => ({
          ...value,
          id: key,
        }));
        setProducts(productsList);
      } else {
        setProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return products;
}

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const ADMIN_EMAIL = "admin@houseblooms.com";

  // Listen auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const adminStatus = firebaseUser.email === ADMIN_EMAIL;
        const userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          isAdmin: adminStatus,
        };
        setUser(userData);
        setIsAdmin(adminStatus);

        const now = new Date();
        const logRef = ref(db, "loginLogs");
        push(logRef, {
          name: userData.name,
          email: userData.email,
          date: now.toLocaleDateString("id-ID"),
          time: now.toLocaleTimeString("id-ID"),
          timestamp: now.getTime(),
        });
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load products dari Firebase
  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsList = Object.entries(data).map(([key, value]) => ({
          ...value,
          id: key,
        }));
        setProducts(productsList);
      } else {
        setProducts([]);
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

  // Load users dari Firebase
  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.entries(data).map(([key, value]) => ({
          ...value,
          id: key,
        }));
        setUsers(usersList);
      } else {
        setUsers([]);
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

      const userRef = ref(db, `users/${result.user.uid}`);
      await update(userRef, {
        id: result.user.uid,
        name: name,
        email: email,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      });

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

  const updateOrderDelivery = (firebaseKey, deliveryData) => {
    const orderRef = ref(db, `orders/${firebaseKey}`);
    update(orderRef, { delivery: deliveryData });
  };

  const updateOrderNote = (firebaseKey, note) => {
    const orderRef = ref(db, `orders/${firebaseKey}`);
    update(orderRef, { adminNote: note });
  };

  const addProduct = (product) => {
    const productsRef = ref(db, "products");
    push(productsRef, product);
  };

  const updateProduct = (id, updates) => {
    const productRef = ref(db, `products/${id}`);
    update(productRef, updates);
  };

  const deleteProduct = (id) => {
    const productRef = ref(db, `products/${id}`);
    set(productRef, null);
  };

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      cartCount, cartTotal, user, isAdmin, login, register, logout,
      orders, addOrder, updateOrderStatus, updateOrderDelivery, updateOrderNote,
      users, products, addProduct, updateProduct, deleteProduct,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
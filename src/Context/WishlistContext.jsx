import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// 🔹 Create Wishlist Context
export const WishlistContext = createContext();

// 🔹 Provider Component
export function WishlistProvider({ children }) {
  const [numWishItemList, setNumWishItemList] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  // ✅ Centralized Axios instance (optional improvement)
  const api = axios.create({
    baseURL: "https://ecommerce.routemisr.com/api/v1/wishlist",
    headers: { token },
  });

  // 🔹 Fetch wishlist
  const getWishlist = async () => {
    if (!token) return; // لو المستخدم مش مسجل دخول
    try {
      setLoading(true);
      const { data } = await api.get("/");
      setNumWishItemList(data.count || data.data?.length || 0);
      setWishlist(data.data || []);
    } catch (error) {
      console.error("❌ Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add to wishlist
  const addToWishlist = async (productId) => {
    if (!token) return;
    try {
      const { data } = await api.post("/", { productId });
      setWishlist((prev) => [...prev, data.data]);
      setNumWishItemList((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
    }
  };

  // 🔹 Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!token) return;
    try {
      await api.delete(`/${productId}`);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      setNumWishItemList((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("❌ Error removing from wishlist:", error);
    }
  };

  // 🔹 Fetch wishlist once on mount (if logged in)
  useEffect(() => {
    if (token) getWishlist();
  }, [token]);

  return (
    <WishlistContext.Provider
      value={{
        numWishItemList,
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        getWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// 🔹 Custom Hook
export const useWishlist = () => useContext(WishlistContext);

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// 🔹 إنشاء الـ Context
export const WishlistContext = createContext();

// 🔹 المزوّد (Provider)
export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  // 🔹 جلب قائمة المفضلة من API
  const getWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { headers: { token } }
      );
      setWishlist(data.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 إضافة منتج للمفضلة
  const addToWishlist = async (productId) => {
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { productId },
        { headers: { token } }
      );
      setWishlist(data.data);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  // 🔹 حذف منتج من المفضلة
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        { headers: { token } }
      );
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  // 🔹 تحميل البيانات أول مرة
  useEffect(() => {
    getWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
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

// 🔹 Hook مختصر للاستخدام في أي مكوّن
export const useWishlist = () => useContext(WishlistContext);

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// 🔹 Create Wishlist Context
export const WishlistContext = createContext();

// 🔹 Provider Component (wraps the app to share wishlist data globally)
export function WishlistProvider({ children }) {
  const [numWishItemList, setNumWishItemList] = useState(0); // total number of wishlist items
  const [wishlist, setWishlist] = useState([]); // full wishlist data
  const [loading, setLoading] = useState(false); // loading state
  const [wishListItemId, setWishListItemId] = useState([]); // only store product IDs

  const token = localStorage.getItem("userToken"); // get user token from localStorage

  // 🔹 Extract product IDs from wishlist data
  function getWishItemId(data) {
    let ids = data.map((item) => item.id);
    setWishListItemId(ids);
  }

  // ✅ Centralized Axios instance for API calls
  const api = axios.create({
    baseURL: "https://ecommerce.routemisr.com/api/v1/wishlist",
    headers: { token },
  });

  // 🔹 Fetch all wishlist items
  const getWishlist = async () => {
    if (!token) return; // stop if user not logged in
    try {
      setLoading(true);
      const { data } = await api.get("/"); // get wishlist from API
      setNumWishItemList(data.count || data.data?.length || 0); // update total count
      setWishlist(data.data || []); // update wishlist items
      getWishItemId(data.data); // store IDs separately
    } catch (error) {
      console.error("❌ Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add product to wishlist
  const addToWishlist = async (productId) => {
    if (!token) return;
    try {
      const { data } = await api.post("/", { productId }); // send POST request to add
      setWishlist((prev) => [...prev, data.data]); // add new item to list
      setNumWishItemList((prev) => prev + 1); // increase counter
      setWishListItemId((prev) => [...prev, productId]); // store new product ID
    } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
    }
  };

  // 🔹 Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!token) return;
    try {
      await api.delete(`/${productId}`); // delete from API
      setWishlist((prev) => prev.filter((item) => item._id !== productId)); // remove locally
      setNumWishItemList((prev) => Math.max(prev - 1, 0)); // decrease count safely
      getWishlist(); // refresh wishlist from server
    } catch (error) {
      console.error("❌ Error removing from wishlist:", error);
    }
  };

  // 🔹 Fetch wishlist once on mount or when token changes
  useEffect(() => {
    if (token) getWishlist();
  }, [token]);

  // 🔹 Provide all states and functions to children components
  return (
    <WishlistContext.Provider
      value={{
        wishListItemId,
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

// 🔹 Custom Hook for easy access to WishlistContext
export const useWishlist = () => useContext(WishlistContext);

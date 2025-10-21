import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// 🔹 Create the Wishlist Context
export const WishlistContext = createContext();

// 🔹 Provider component to wrap around the app
export function WishlistProvider({ children }) {
  // 🔹 State for wishlist items
  const [wishlist, setWishlist] = useState([]);
  // 🔹 State for loading indicator
  const [loading, setLoading] = useState(false);
  // 🔹 Get user token from localStorage
  const token = localStorage.getItem("userToken");

  // 🔹 Fetch wishlist from the API
  const getWishlist = async () => {
    try {
      setLoading(true); // start loading
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { headers: { token } }
      );
      setWishlist(data.data); // update state with fetched data
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  // 🔹 Add a product to the wishlist
  const addToWishlist = async (productId) => {
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { productId },
        { headers: { token } }
      );
      setWishlist(data.data); // update wishlist with new data
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  // 🔹 Remove a product from the wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        { headers: { token } }
      );
      // update local state after deletion
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  // 🔹 Fetch wishlist when the component mounts
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

// 🔹 Custom hook to use the Wishlist Context easily in any component
export const useWishlist = () => useContext(WishlistContext);

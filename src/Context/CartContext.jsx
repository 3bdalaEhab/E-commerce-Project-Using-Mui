import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const token = localStorage.getItem("userToken");
  const [numOfCartItems, setNumOfCartItems] = useState(0);

  const getCart = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { headers: { token } }
      );
      setNumOfCartItems(data.numOfCartItems ?? 0);
      return data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  }, [token]);

  const addToCart = useCallback(async (productId) => {
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { productId },
        { headers: { token } }
      );
      setNumOfCartItems(data.numOfCartItems ?? 0);
      return data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }, [token]);

  const updateItem = useCallback(async ({ id, count }) => {
    try {
      const { data } = await axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${id}`,
        { count },
        { headers: { token } }
      );
      setNumOfCartItems(data.numOfCartItems ?? 0);
      return data;
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  }, [token]);

  const removeSpecificItem = useCallback(async (productId) => {
    try {
      const { data } = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { headers: { token } }
      );
      setNumOfCartItems(data.numOfCartItems ?? 0);
      return data;
    } catch (error) {
      console.error("Error removing item:", error);
      throw error;
    }
  }, [token]);

  const removeAllItems = useCallback(async () => {
    try {
      const { data } = await axios.delete(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { headers: { token } }
      );
      setNumOfCartItems(0);
      return data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }, [token]);

  useEffect(() => {
    if (token) getCart();
  }, [token, getCart]);

  return (
    <CartContext.Provider
      value={{
        numOfCartItems,
        addToCart,
        updateItem,
        removeSpecificItem,
        removeAllItems,
        getCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

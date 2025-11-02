import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const token = localStorage.getItem("userToken");
  const [numOfCartItems, setNumOfCartItems] = useState(0);

  async function addToCart(productId) {
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
    }
  }

  async function updateItem({ id, count }) {
    try {
      const { data } = await axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${id}`,
        { count },
        { headers: { token } }
      );
      return data;
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  async function removeSpecificItem(productId) {
    try {
      const { data } = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { headers: { token } }
      );
      setNumOfCartItems(data.numOfCartItems ?? 0);
      return data;
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }

  async function removeAllItems() {
    try {
      const { data } = await axios.delete(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { headers: { token } }
      );
      setNumOfCartItems(0);
      return data;
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }

  async function getCart() {
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { headers: { token } }
      );
      setNumOfCartItems(data.numOfCartItems ?? 0);
      return data;
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }

  useEffect(() => {
    if (token) getCart();
  }, [token]);

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

import React, { createContext } from "react";
import axios from "axios";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const token = localStorage.getItem("userToken");

  async function addToCart(productId) {
    const { data } = await axios.post(
      "https://ecommerce.routemisr.com/api/v1/cart",
      {
        productId,
      },
      {
        headers: {
          token,
        },
      }
    );

    return data;
  }

  async function updateItem({id,count}) {
    console.log(id, count);
    
    const { data } = await axios.put(
      `https://ecommerce.routemisr.com/api/v1/cart/${id}`,
      {
        count
      },

      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      }
    );
    return data;
  }

  async function removeSpecificItem(productId) {
    const { data } = await axios.delete(
      `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,

      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      }
    );
    return data;
  }

  async function removeAllItems() {
    const { data } = await axios.delete(
      `https://ecommerce.routemisr.com/api/v1/cart`,

      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      }
    );
    return data;
  }

  async function getCart() {
    const { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/cart",
      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      }
    );
    return data;
  }

  return (
    <CartContext.Provider
      value={{
        addToCart,
        getCart,
        removeSpecificItem,
        removeAllItems,
        updateItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

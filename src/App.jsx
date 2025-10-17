import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LayOut from "./components/LayOut/LayOut";
import Products from "./pages/Products/Products";
import Categories from "./pages/Categories/Categories";
import Home from "./pages/Home/Home";
import Wishlist from "./pages/Wishlist/Wishlist";
import Cart from "./pages/Cart/Cart";
import Details from "./pages/Details/Details";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import AllOrders from "./pages/AllOrders/AllOrders";
import { useContext, useEffect } from "react";
import { tokenContext } from "./Context/tokenContext";
import UnProtectedRoutes from "./components/DirectingUsers/UnProtectedRoutes";
import ProtectedRoutes from "./components/DirectingUsers/protectedRoutes";


function App() {
  const { setUserToken } = useContext(tokenContext);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      setUserToken(localStorage.getItem("userToken"));
    }
  }, []);

  const routers = createBrowserRouter([
    {
      path: "/",
      element: <LayOut />,
      children: [
        { index: true, element: <ProtectedRoutes><Home /></ProtectedRoutes> },
        { path: "/products", element: <ProtectedRoutes><Products /></ProtectedRoutes> },
        { path: "/cart", element: <ProtectedRoutes><Cart /></ProtectedRoutes> },
        { path: "/categories", element: <ProtectedRoutes><Categories /></ProtectedRoutes> },
        { path: "/wishlist", element: <ProtectedRoutes><Wishlist /></ProtectedRoutes> },
        { path: "/details", element: <ProtectedRoutes><Details /></ProtectedRoutes> },
        { path: "/allOrders", element: <ProtectedRoutes><AllOrders /></ProtectedRoutes> },
        { path: "/register", element: <UnProtectedRoutes><Register /></UnProtectedRoutes> },
{ path: "/login", element: <UnProtectedRoutes><Login /></UnProtectedRoutes> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={routers} />;
}

export default App;

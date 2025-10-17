import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import LayOut from './components/LayOut/LayOut'
import Products from './pages/Products/Products'
import Categories from './pages/Categories/Categories'
import Home from './pages/Home/Home'
import Wishlist from './pages/Wishlist/Wishlist'
import Cart from './pages/Cart/Cart'
import Details from './pages/Details/Details'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import NotFound from './pages/NotFound/NotFound'
import AllOrders from './pages/AllOrders/AllOrders'

function App() {
  let routers = createBrowserRouter([
    {
      path: '/',
      element: <LayOut />,
      children: [
        { index: true, element: <Home /> },
        { path: '/products', element: <Products /> },
        { path: '/cart', element: <Cart /> },
        { path: '/categories', element: <Categories /> },
        { path: '/wishlist', element: <Wishlist /> },
        { path: '/details', element: <Details /> },
        { path: '/register', element: <Register /> },
        { path: '/allOrders', element: <AllOrders /> },
        { path: '/login', element: <Login /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ])

  return <RouterProvider router={routers} />
}

export default App

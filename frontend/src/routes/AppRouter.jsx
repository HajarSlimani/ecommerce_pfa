import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ProtectedRoute from '../components/common/ProtectedRoute'
import AdminRoute from '../components/common/AdminRoute'

import HomePage from '../pages/HomePage'
import ShopPage from '../pages/ShopPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import CartPage from '../pages/CartPage'
import OrderConfirmationPage from '../pages/OrderConfirmationPage'
import OrderHistoryPage from '../pages/OrderHistoryPage'
import ProfilePage from '../pages/ProfilePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

import AdminLayout from '../pages/admin/AdminLayout'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminProductsPage from '../pages/admin/AdminProductsPage'
import AdminPricingHistoryPage from '../pages/admin/AdminPricingHistoryPage'

// React Router ne fait pas défiler la page vers une ancre (#hash) tout seul
// lors d'une navigation côté client — contrairement à un lien HTML classique.
// Sans ça, un lien comme "/#categories" change bien l'URL mais laisse
// l'utilisateur en haut de la page.
function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      // Léger délai : le contenu de la page cible vient de monter, on laisse
      // le DOM se poser avant de mesurer sa position.
      const id = location.hash.slice(1)
      const timeout = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
      return () => clearTimeout(timeout)
    }
    window.scrollTo({ top: 0 })
  }, [location.pathname, location.hash])

  return null
}

export default function AppRouter() {
  const location = useLocation()
  // Le hero de la home passe sous la navbar transparente ; les autres pages
  // (fond clair dès le haut) ont besoin d'un padding pour ne pas passer dessous.
  const needsTopPadding = location.pathname !== '/'

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />
      <Navbar />
      <div className={`flex-1 ${needsTopPadding ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/boutique" element={<ShopPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/orders/confirmation/:id" element={<OrderConfirmationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="pricing" element={<AdminPricingHistoryPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl">Page introuvable</h1>
      <p className="mt-2 text-sm text-ink-soft">L’URL demandée n’existe pas.</p>
    </div>
  )
}

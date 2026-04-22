import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import Index from "./pages/Index.tsx";
import ShopPage from "./pages/ShopPage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.tsx";
import MysteryCollectionPage from "./pages/MysteryCollectionPage.tsx";
import SurpriseMysteryPage from "./pages/SurpriseMysteryPage.tsx";
import BuildYourBoxPage from "./pages/BuildYourBoxPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminProductsList from "./pages/admin/AdminProductsList.tsx";
import AdminProductEdit from "./pages/admin/AdminProductEdit.tsx";
import AdminBulkPrices from "./pages/admin/AdminBulkPrices.tsx";
import AdminChangePassword from "./pages/admin/AdminChangePassword.tsx";
import AdminGuard from "./components/admin/AdminGuard.tsx";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/mystery-collection" element={<MysteryCollectionPage />} />
            <Route path="/mystery-collection/surprise" element={<SurpriseMysteryPage />} />
            <Route path="/mystery-collection/build" element={<BuildYourBoxPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard><AdminProductsList /></AdminGuard>} />
            <Route path="/admin/bulk-prices" element={<AdminGuard><AdminBulkPrices /></AdminGuard>} />
            <Route path="/admin/products/new" element={<AdminGuard><AdminProductEdit /></AdminGuard>} />
            <Route path="/admin/products/:id" element={<AdminGuard><AdminProductEdit /></AdminGuard>} />
            <Route path="/admin/change-password" element={<AdminGuard><AdminChangePassword /></AdminGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

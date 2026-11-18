import { Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./components/Notifications.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import { CartProvider } from "./components/CartContext.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import RutaAdmin from "./components/RutaAdmin.jsx";
import HomePage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CartPage from "./pages/CartPage.jsx";

function App() {
    return (
        <NotificationProvider>
            <AuthProvider>
                <CartProvider>
                    <Header />
                    <main id="contenido-principal">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/catalogo" element={<CatalogPage />} />
                            <Route path="/carrito" element={<CartPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/registro" element={<RegisterPage />} />
                            <Route
                                path="/admin"
                                element={
                                    <RutaAdmin>
                                        <AdminPage />
                                    </RutaAdmin>
                                }
                            />
                            <Route
                                path="*"
                                element={
                                    <section className="seccion seccion--centrada">
                                        <h1>Página no encontrada</h1>
                                        <p>La página que buscás no existe.</p>
                                    </section>
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                </CartProvider>
            </AuthProvider>
        </NotificationProvider>
    );
}

export default App;

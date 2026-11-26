import { NavLink } from "react-router-dom";

// Sub-navegación de las pantallas de administración
function AdminNav() {
    return (
        <nav className="adminnav" aria-label="Secciones de administración">
            <NavLink to="/admin" className="adminnav__link" end>
                Productos
            </NavLink>
            <NavLink to="/admin/pedidos" className="adminnav__link">
                Pedidos
            </NavLink>
            <NavLink to="/admin/cupones" className="adminnav__link">
                Cupones
            </NavLink>
        </nav>
    );
}

export default AdminNav;

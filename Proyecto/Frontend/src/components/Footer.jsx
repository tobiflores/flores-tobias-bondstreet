function Footer() {
    return (
        <footer className="footer">
            <div className="footer__columna">
                <h2 className="footer__titulo">Ubicación</h2>
                <p>Av. Santa Fe 1670</p>
                <p>Ciudad de Buenos Aires</p>
            </div>
            <div className="footer__columna">
                <h2 className="footer__titulo">Mail de consultas</h2>
                <p>
                    <a href="mailto:consultas@bondstreet.com.ar">consultas@bondstreet.com.ar</a>
                </p>
            </div>
            <div className="footer__columna">
                <h2 className="footer__titulo">Contacto telefónico</h2>
                <p>
                    <a href="tel:+541148120000">(011) 4812-0000</a>
                </p>
            </div>
            <div className="footer__columna">
                <h2 className="footer__titulo">Redes sociales</h2>
                <ul className="footer__redes">
                    <li>
                        <a href="https://www.instagram.com/bondstreetarg/" target="_blank" rel="noreferrer">
                            Instagram
                        </a>
                    </li>
                    <li>
                        <a href="https://www.facebook.com/GaleriaBondStreet/" target="_blank" rel="noreferrer">
                            Facebook
                        </a>
                    </li>
                    <li>
                        <a href="https://www.tiktok.com/discover/galeria-bond-street" target="_blank" rel="noreferrer">
                            TikTok
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;

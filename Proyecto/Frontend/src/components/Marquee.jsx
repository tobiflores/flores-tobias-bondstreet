function Marquee({ items }) {
    const contenido = `${items.join(" ★ ")} ★ `;

    return (
        <div className="marquee" aria-hidden="true">
            <div className="marquee__pista">
                <span>{contenido}</span>
                <span>{contenido}</span>
            </div>
        </div>
    );
}

export default Marquee;

const CLAVE = 'carrito';

function leerCarrito() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE)) || [];
    } catch {
        return [];
    }
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CLAVE, JSON.stringify(carrito));
    } catch {}
}

function actualizarContador() {
    const contador = document.getElementById('cart-count');
    if (contador) contador.textContent = leerCarrito().length;
}

document.querySelectorAll('.card button').forEach((boton) => {
    boton.addEventListener('click', () => {
        const card = boton.closest('.card');
        const carrito = leerCarrito();
        carrito.push({
            nombre: card.querySelector('h3').textContent,
            precio: Number(card.dataset.precio),
        });
        guardarCarrito(carrito);
        actualizarContador();
        boton.textContent = '¡Agregado!';
        setTimeout(() => (boton.textContent = 'Agregar al carrito'), 1000);
    });
});

actualizarContador();

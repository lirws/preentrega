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

// Página del carrito
const lista = document.getElementById('lista-carrito');
if (lista) {
    const formato = (n) => '$' + n.toLocaleString('es-AR');

    const agrupar = (carrito) => {
        const grupos = new Map();
        carrito.forEach(({ nombre, precio }) => {
            const g = grupos.get(nombre) || { nombre, precio, cantidad: 0 };
            g.cantidad++;
            grupos.set(nombre, g);
        });
        return [...grupos.values()];
    };

    const celda = (texto) => {
        const td = document.createElement('td');
        td.textContent = texto;
        return td;
    };

    const dibujar = () => {
        const carrito = leerCarrito();
        const items = agrupar(carrito);
        document.getElementById('carrito-vacio').hidden = items.length > 0;
        document.getElementById('carrito-contenido').hidden = items.length === 0;
        lista.replaceChildren();
        let total = 0;
        items.forEach((item) => {
            total += item.precio * item.cantidad;
            const tr = document.createElement('tr');
            tr.append(celda(item.nombre), celda(formato(item.precio)), celda(item.cantidad), celda(formato(item.precio * item.cantidad)));
            const td = document.createElement('td');
            const quitar = document.createElement('button');
            quitar.type = 'button';
            quitar.textContent = 'Quitar';
            quitar.addEventListener('click', () => {
                const actual = leerCarrito();
                const i = actual.findIndex((p) => p.nombre === item.nombre);
                if (i !== -1) actual.splice(i, 1);
                guardarCarrito(actual);
                dibujar();
            });
            td.append(quitar);
            tr.append(td);
            lista.append(tr);
        });
        document.getElementById('total-carrito').textContent = formato(total);
        actualizarContador();
    };

    document.getElementById('vaciar-carrito').addEventListener('click', () => {
        guardarCarrito([]);
        dibujar();
    });
    dibujar();
}

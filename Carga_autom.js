// app.js - Integración con la base de datos de cercia.co
const PRODUCT_API_URL = 'https://maxiservicios.cercia.co/api/productos_api.php';

async function cargarProductos() {
    const listaContenedor = document.getElementById('product-list');
    
    try {
        const respuesta = await fetch(PRODUCT_API_URL);
        const productos = await respuesta.json();

        listaContenedor.innerHTML = ''; // Limpiar catálogo actual

        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${producto.imagen_url}" alt="${producto.nombre}" style="width:100%">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p class="price">${producto.precio_pi} Pi</p>
                <button onclick="createPayment('${producto.nombre}', ${producto.precio_pi})">
                    Comprar en Colombia
                </button>
            `;
            listaContenedor.appendChild(card);
        });
    } catch (error) {
        console.error("Error cargando el catálogo de Maxiservicios:", error);
        listaContenedor.innerHTML = '<p>Error al conectar con el servidor de productos.</p>';
    }
}

// Llamar a la función al iniciar la app
document.addEventListener('DOMContentLoaded', cargarProductos);
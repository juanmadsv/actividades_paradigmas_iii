// Seleccionamos los elementos del HTML con querySelector.
const contenedorProductos = document.querySelector("#contenedor-productos");
const estadoCarga = document.querySelector("#estado-carga");
const contadorProductos = document.querySelector("#contador-productos");

// El evento load se ejecuta cuando la página y sus recursos terminaron de cargar.
window.addEventListener("load", () => {
  cargarProductos();
});

// La función async permite esperar la respuesta de fetch sin bloquear la página.
async function cargarProductos() {
  try {
    const respuesta = await fetch("productos.json");

    // fetch solo rechaza errores de red; por eso también comprobamos response.ok.
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const productos = await respuesta.json();
    mostrarProductos(productos);
  } catch (error) {
    mostrarError(error);
  } finally {
    estadoCarga.style.display = "none";
  }
}

function mostrarProductos(productos) {
  contadorProductos.textContent = `${productos.length} productos`;

  productos.forEach((producto) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");

    tarjeta.innerHTML = `
      <div class="tarjeta__visual" aria-hidden="true">
        <span class="tarjeta__icono">${producto.icono}</span>
      </div>
      <div class="tarjeta__contenido">
        <span class="tarjeta__categoria">${producto.categoria}</span>
        <h3>${producto.nombre}</h3>
        <p class="tarjeta__descripcion">${producto.descripcion}</p>
        <div class="tarjeta__pie">
          <span class="tarjeta__precio">${formatearPrecio(producto.precio)}</span>
          <span class="tarjeta__stock">Stock: ${producto.stock}</span>
        </div>
      </div>
    `;

    contenedorProductos.appendChild(tarjeta);
  });
}

function formatearPrecio(precio) {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
}

function mostrarError(error) {
  console.error("No se pudieron cargar los productos:", error);
  contadorProductos.textContent = "";
  contenedorProductos.innerHTML = `
    <div class="mensaje-error" role="alert">
      <p>No se pudieron cargar los productos.<br>Ejecutá el proyecto desde XAMPP o Live Server.</p>
    </div>
  `;
}

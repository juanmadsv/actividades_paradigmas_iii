# Actividad: productos con Fetch y JSON

Proyecto realizado con HTML, CSS y JavaScript Vanilla para cargar un catálogo de 14 palos de golf de forma asíncrona desde un archivo JSON.

## Requisitos aplicados

1. `querySelector` para seleccionar elementos del DOM.
2. `addEventListener` con el evento `load` para iniciar la carga.
3. Archivo local `productos.json` con un arreglo de objetos.
4. Función `async` y `await fetch()` para obtener el JSON en segundo plano.
5. Tarjetas creadas dinámicamente con JavaScript y estilizadas con CSS.
6. Manejo de errores mediante `try`, `catch` y validación de `respuesta.ok`.

## Cómo ejecutar

`fetch` necesita que el proyecto se ejecute mediante un servidor HTTP. No se debe abrir `index.html` directamente como archivo.

### Con XAMPP

1. Copiar la carpeta `actividad_productos` dentro de `htdocs`.
2. Iniciar Apache desde el panel de XAMPP.
3. Abrir `http://localhost/actividad_productos/` en el navegador.

### Con Live Server

1. Abrir la carpeta en Visual Studio Code.
2. Hacer clic derecho sobre `index.html`.
3. Elegir **Open with Live Server**.

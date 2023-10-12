// Cliente WebSocket
const socket = io();

// Manejar el envío del formulario cuando se agrega un producto
const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;

  // Enviar los datos del producto al servidor a través de WebSocket
  socket.emit('addProduct', { title, description, price });

  // Limpiar el formulario o realizar otras acciones según tus necesidades
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('price').value = '';
});

// Escuchar la actualización de productos desde el servidor
socket.on('updateProducts', () => {
  // Realizar acciones para actualizar la lista de productos en la vista
  // Puedes hacer una solicitud HTTP para obtener la lista actualizada o
  // actualizar la lista en tiempo real usando JavaScript
});

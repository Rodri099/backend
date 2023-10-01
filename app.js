const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const ProductManager = require('./ProductManager'); // Ajusta la ruta al archivo ProductManager
const productsRouter = require('./productsRouter');
const cartsRouter = require('./cartsRouter');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const productManager = new ProductManager('productos.json');

// Configuración de Handlebars
app.engine('.handlebars', exphbs({ extname: '.handlebars' }));
app.set('view engine', '.handlebars');

// Middleware para permitir el análisis de JSON en las solicitudes
app.use(express.json());

// Directorio de archivos estáticos
app.use(express.static('public'));

// Directorio de vistas Handlebars
app.set('views', __dirname + '/views');

// Rutas para productos (usando HTTP)
app.use('/api/products', productsRouter);

// Rutas para carritos (usando HTTP)
app.use('/api/carts', cartsRouter);

// Ruta para la vista principal
app.get('/', (req, res) => {
  // Obtener la lista de productos y renderizar la vista
  const products = productManager.getProducts();
  res.render('index', { products });
});

// WebSocket para actualizaciones en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  
  // Escuchar eventos personalizados (ejemplo: cuando se agrega un producto)
  socket.on('productAdded', () => {
    // Enviar una señal a todos los clientes conectados para actualizar la lista de productos
    io.emit('updateProducts');
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});



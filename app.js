const express = require('express');
const ProductManager = require('./ProductManager'); // Asegúrate de ajustar la ruta al archivo ProductManager

const app = express();
const productsRouter = require('./productsRouter');
const cartsRouter = require('./cartsRouter');
const port = process.env.PORT || 8080;

const productManager = new ProductManager('productos.json');

// Middleware para permitir el análisis de JSON en las solicitudes
app.use(express.json());

// Endpoint para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    const { limit } = req.query;

    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto por ID' });
  }
});

// Rutas para productos
app.use('/api/products', productsRouter);

// Rutas para carritos
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});


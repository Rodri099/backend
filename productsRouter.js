const express = require('express');
const router = express.Router();
const fs = require('fs/promises');

// Ruta raíz GET /api/products/
router.get('/', async (req, res) => {
  try {
    // Leer los productos desde el archivo productos.json y enviarlos como respuesta
    const productsData = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(productsData);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Ruta GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    // Leer los productos desde el archivo productos.json
    const productsData = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(productsData);

    // Buscar el producto por ID
    const product = products.find((p) => p.id === productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto por ID' });
  }
});

// Ruta POST /api/products/
router.post('/', async (req, res) => {
  try {
    // Leer los productos desde el archivo productos.json
    const productsData = await fs.readFile('productos.json', 'utf-8');
    let products = JSON.parse(productsData);

    // Crear un nuevo producto con los datos proporcionados en el cuerpo de la solicitud
    const newProduct = {
      id: generateProductId(), // Función para generar un nuevo ID único
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      price: req.body.price,
      status: req.body.status,
      stock: req.body.stock,
      category: req.body.category,
      thumbnails: req.body.thumbnails,
    };

    // Agregar el nuevo producto al arreglo de productos
    products.push(newProduct);

    // Guardar los productos actualizados en el archivo productos.json
    await fs.writeFile('productos.json', JSON.stringify(products, null, 2));

    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar un nuevo producto' });
  }
});

// Ruta PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    // Leer los productos desde el archivo productos.json
    const productsData = await fs.readFile('productos.json', 'utf-8');
    let products = JSON.parse(productsData);

    // Buscar el producto por ID
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      // Actualizar los campos del producto con los datos proporcionados en el cuerpo de la solicitud
      products[productIndex] = {
        ...products[productIndex],
        title: req.body.title || products[productIndex].title,
        description: req.body.description || products[productIndex].description,
        code: req.body.code || products[productIndex].code,
        price: req.body.price || products[productIndex].price,
        status: req.body.status || products[productIndex].status,
        stock: req.body.stock || products[productIndex].stock,
        category: req.body.category || products[productIndex].category,
        thumbnails: req.body.thumbnails || products[productIndex].thumbnails,
      };

      // Guardar los productos actualizados en el archivo productos.json
      await fs.writeFile('productos.json', JSON.stringify(products, null, 2));

      res.json(products[productIndex]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    // Leer los productos desde el archivo productos.json
    const productsData = await fs.readFile('productos.json', 'utf-8');
    let products = JSON.parse(productsData);

    // Filtrar los productos para eliminar el producto con el ID proporcionado
    products = products.filter((p) => p.id !== productId);

    // Guardar los productos actualizados en el archivo productos.json
    await fs.writeFile('productos.json', JSON.stringify(products, null, 2));

    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Función para generar un nuevo ID único (puedes implementar tu propia lógica aquí)
function generateProductId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

module.exports = router;

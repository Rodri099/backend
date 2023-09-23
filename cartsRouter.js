const express = require('express');
const router = express.Router();
const fs = require('fs/promises');

// Ruta raíz POST /api/carts/
router.post('/', async (req, res) => {
  try {
    // Leer los carritos desde el archivo carrito.json
    const cartsData = await fs.readFile('carrito.json', 'utf-8');
    let carts = JSON.parse(cartsData);

    // Crear un nuevo carrito con los datos proporcionados en el cuerpo de la solicitud
    const newCart = {
      id: generateCartId(), // Función para generar un nuevo ID único
      products: [],
    };

    // Agregar el nuevo carrito al arreglo de carritos
    carts.push(newCart);

    // Guardar los carritos actualizados en el archivo carrito.json
    await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));

    res.json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear un nuevo carrito' });
  }
});

// Ruta GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
    // Leer los carritos desde el archivo carrito.json
    const cartsData = await fs.readFile('carrito.json', 'utf-8');
    const carts = JSON.parse(cartsData);

    // Buscar el carrito por ID
    const cart = carts.find((c) => c.id === cartId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito por ID' });
  }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    // Leer los carritos desde el archivo carrito.json
    const cartsData = await fs.readFile('carrito.json', 'utf-8');
    let carts = JSON.parse(cartsData);

    // Buscar el carrito por ID
    const cartIndex = carts.findIndex((c) => c.id === cartId);

    if (cartIndex !== -1) {
      // Buscar el producto por ID (puedes implementar esta función)
      const product = await findProductById(productId);

      if (product) {
        // Verificar si el producto ya existe en el carrito
        const existingProductIndex = carts[cartIndex].products.findIndex(
          (p) => p.product === productId
        );

        if (existingProductIndex !== -1) {
          // Si el producto ya existe, incrementar la cantidad
          carts[cartIndex].products[existingProductIndex].quantity += 1;
        } else {
          // Si el producto no existe, agregarlo al carrito con cantidad 1
          carts[cartIndex].products.push({
            product: productId,
            quantity: 1,
          });
        }

        // Guardar los carritos actualizados en el archivo carrito.json
        await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2));

        res.json(carts[cartIndex]);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar un producto al carrito' });
  }
});

// Función para generar un nuevo ID único para carritos (puedes implementar tu propia lógica aquí)
function generateCartId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Función para buscar un producto por ID (puedes implementar tu propia lógica aquí)
async function findProductById(productId) {
  try {
    // Leer los productos desde el archivo productos.json
    const productsData = await fs.readFile('productos.json', 'utf-8');
    const products = JSON.parse(productsData);

    // Buscar el producto por ID
    const product = products.find((p) => p.id === productId);
    return product;
  } catch (error) {
    return null;
  }
}

module.exports = router;

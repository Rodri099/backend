const fs = require('fs/promises');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async addProduct(productData) {
    try {
      // Leer el archivo existente
      const products = await this.readProductsFile();

      // Generar un nuevo ID
      const newId = products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;

      // Asignar el nuevo ID al producto
      const newProduct = { id: newId, ...productData };

      // Agregar el nuevo producto al arreglo
      products.push(newProduct);

      // Guardar el arreglo actualizado en el archivo
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));

      return newProduct;
    } catch (error) {
      throw new Error('Error al agregar el producto: ' + error.message);
    }
  }

  async getProducts() {
    try {
      const products = await this.readProductsFile();
      return products;
    } catch (error) {
      throw new Error('Error al obtener los productos: ' + error.message);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.readProductsFile();
      const product = products.find(product => product.id === id);
      return product;
    } catch (error) {
      throw new Error('Error al obtener el producto por ID: ' + error.message);
    }
  }

  async updateProduct(id, updatedProductData) {
    try {
      const products = await this.readProductsFile();
      const index = products.findIndex(product => product.id === id);

      if (index !== -1) {
        // Actualizar el producto en el arreglo
        products[index] = { ...products[index], ...updatedProductData };

        // Guardar el arreglo actualizado en el archivo
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));

        return products[index];
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      throw new Error('Error al actualizar el producto: ' + error.message);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.readProductsFile();
      const index = products.findIndex(product => product.id === id);

      if (index !== -1) {
        // Eliminar el producto del arreglo
        const deletedProduct = products.splice(index, 1)[0];

        // Guardar el arreglo actualizado en el archivo
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));

        return deletedProduct;
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (error) {
      throw new Error('Error al eliminar el producto: ' + error.message);
    }
  }

  async readProductsFile() {
    try {
      // Leer el archivo y parsearlo como JSON
      const fileData = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(fileData);
    } catch (error) {
      // Si el archivo no existe o está vacío, devuelve un arreglo vacío
      return [];
    }
  }
}

module.exports = ProductManager;
// Uso de la clase ProductManager
const productManager = new ProductManager('productos.json');




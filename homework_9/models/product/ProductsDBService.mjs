import Product from './Product.mjs';
import MongooseCRUDManager from '../MongooseCRUDManager.mjs';

class ProductsDBService extends MongooseCRUDManager {
  async getList(filters = {}, sortOrder = 1) {
    try {
      // Використовуємо модель Product для виконання сортування
      const products = await Product.find(filters).sort({ price: sortOrder });
      return products;
    } catch (error) {
      console.error("Error fetching product list:", error);
      return [];
    }
  }
}

export default new ProductsDBService(Product);

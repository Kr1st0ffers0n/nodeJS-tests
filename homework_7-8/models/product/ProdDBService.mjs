import Product from './Product.mjs'
import mongoose from 'mongoose'

class ProdDBService {
    static async getList(filters) {
        try {
            
            // Виконуємо пошук з умовою і заповненням поля owner
            const data = await Product.find(filters).populate('owner').exec();
            return data;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }
    static async create(data) {
        const product = new Product(data)
        console.log('Дані перед створенням користувача:', data);
        return await product.save()
    }
    static async getById(id) {
        return await Product.findById(id)
    }
    static async update(id, data) {
        return await Product.findByIdAndUpdate(
            id,
            data,
            {
            new: true,
            runValidators: true,
        })
    }
    static async deleteById(id) {
        return await Product.findByIdAndDelete(id)
    }
}

export default ProdDBService
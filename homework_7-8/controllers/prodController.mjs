import ProdDBService from '../models/product/ProdDBService.mjs'
import { validationResult } from 'express-validator'
import fs from 'fs';
import ownerDBService from '../models/owner/ownerDBService.mjs';
import OwnerDBService from '../models/owner/ownerDBService.mjs';

class ProductController {
    static async ProductsList(req, res) {
        try {
            const filters = {}
            for (const key in req.query) {
                if (req.query[key]) {
                    filters[key] = req.query[key]
                }
            }
            console.log("Filters applied:", filters);
            const dataList = await ProdDBService.getList(filters)
            const owners = await OwnerDBService.getList();
            console.log('=========dataList')
            console.log(dataList)
            res.render('products', {
                products: dataList,
                owners,
            })
        } catch (err) {
            res.status(500).json({
                error: err.message
            })
        }
    }
    static async ProductForm(req, res) {
        try {
            const id = req.params.id
            let product = null
            const owners = await OwnerDBService.getList();
            if (id) {
                //отримати об"єкт за id 
                product = await ProdDBService.getById(id)
            }
            //відредерити сторінку з формою 
            res.render('addProductPage', {
                errors: [],
                data: product,
                owners,
            })
        } catch (err) {
            res.status(500).json({
                error: err.message
            })
        }
    }
    static async addProduct(req, res) {
        // Перевіряємо на наявність помилок валідації
        const errors = validationResult(req);
        const data = req.body;
        const owners = await OwnerDBService.getList();

        // Якщо є помилки валідації, видаляємо файл, якщо він є
        if (!errors.isEmpty()) {
            // Перевіряємо, чи є файл, і видаляємо його
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Помилка при видаленні файлу:', err);
                    } else {
                        console.log('Завантажений файл видалено через помилки валідації');
                    }
                });
            }
    
            // Відправляємо назад форму з помилками валідації
            return res.status(400).render('products', {
                errors: errors.array(),
                data,
                owners,
            });
        }
    
        // Якщо валідація пройшла, обробляємо файл та інші дані
        try {
            const { owner, description, price, name } = req.body;
            let prodImagePath = req.file ? `/uploads/products/${req.file.filename}` : null;
    
            if (req.params.id) {
                const updatedData = { owner, description, price, name  };
                if (prodImagePath) updatedData.prodImage = prodImagePath;
                await ProdDBService.update(req.params.id, updatedData);
            } else {
                const productData = { owner, description, price, name, prodImage: prodImagePath };
                await ProdDBService.create(productData);
            }
    
            // Перенаправляємо на список користувачів після успішної реєстрації
            res.redirect('/products');
        } catch (err) {
            // Якщо виникає помилка при обробці даних, видаляємо файл і повертаємо помилку
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Помилка при видаленні файлу:', err);
                    } else {
                        console.log('Завантажений файл видалено через помилки в обробці');
                    }
                });
            }
    
            res.status(500).render('addProductPage', {
                errors: [{ msg: err.message }],
                data,
                owners,
            });
        }
    }
    static async deleteProduct(req, res) {
        try {
            await ProdDBService.deleteById(req.body.id)
            res.json({ success: true })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to delete user' })
        }
    }
}

export default ProductController
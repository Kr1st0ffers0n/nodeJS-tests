import UsersDBService from '../models/user/UsersDBService.mjs'
import { validationResult } from 'express-validator'
import fs from 'fs';

class UserController {
    static async usersList(req, res) {
        try {
            const dataList = await UsersDBService.getList()
            console.log('=========dataList')
            console.log(dataList)
            res.render('usersList', {
                users: dataList,
            })
        } catch (err) {
            res.status(500).json({
                error: err.message
            })
        }
    }
    static async registerForm(req, res) {
        try {
            const id = req.params.id
            let user = null
            if (id) {
                //отримати об"єкт за id 
                user = await UsersDBService.getById(id)
            }
            //відредерити сторінку з формою 
            res.render('register', {
                errors: [],
                data: user,
            })
        } catch (err) {
            res.status(500).json({
                error: err.message
            })
        }
    }
    static async registerUser(req, res) {
        // Перевіряємо на наявність помилок валідації
        const errors = validationResult(req);
        const data = req.body;
    
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
            return res.status(400).render('register', {
                errors: errors.array(),
                data,
            });
        }
    
        // Якщо валідація пройшла, обробляємо файл та інші дані
        try {
            const { email, password, name } = req.body;
            let avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;
    
            if (req.params.id) {
                const updatedData = { email, password, name };
                if (avatarPath) updatedData.avatar = avatarPath;
                await UsersDBService.update(req.params.id, updatedData);
            } else {
                const userData = { email, password, name, avatar: avatarPath };
                await UsersDBService.create(userData);
            }
    
            // Перенаправляємо на список користувачів після успішної реєстрації
            res.redirect('/users');
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
    
            res.status(500).render('register', {
                errors: [{ msg: err.message }],
                data,
            });
        }
    }
    static async deleteUser(req, res) {
        try {
            await UsersDBService.deleteById(req.body.id)
            res.json({ success: true })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to delete user' })
        }
    }
}

export default UserController
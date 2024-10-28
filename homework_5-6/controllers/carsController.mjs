import CarModel from "../models/carModel.mjs";
import { validationResult } from "express-validator";
import infoSchema from "../models/infoSchema.mjs";  // Імпорт схеми


class CarsController {
    static infoSchema = infoSchema; // Призначення схеми для доступу з роутера
    
    static getHomePage(req, res) {
        try {
            // Викликаємо список усіх елментів
            const cars = CarModel.loadCarsList();
            // response - рендеримо список на сторінці home 
            res.render('home', {
            cars
        });
        } catch (error) {
           throw new Error('Error in Cars.getHomePage:', error);
        }
    }
    static getAboutPage(req, res) {
        try {
            // рендеримо сторінку adout
            res.render('about')
        } catch (error) {
            throw new Error('Error in Cars.getAboutPage:', error);
        }
    }
    static createAddingForm(req, res) {
        try {
            // рендеримо сторінку з формою додавання, передаємо порожній об'єкт car для того щоб використовувати ту саму форму і для редагування в майбутньому.
            res.render('addCarForm', { car: {}, errors: [] });
        } catch (error) {
            throw new Error('Error in Cars.createAddingForm:', error);
        }
    }
    static addNewCarToList(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            return res.render('addCarForm', { car: req.body, errors: errorMessages });
        }
        
        try {
            const errors = []
            // Ловимо у змінну файл (зображення - через multer) та решту даних (взяті із полів форми - req.body) про авто через спред оператор
            const car = {
                imageSrc: req.file.filename, ...req.body
            }
            // Якщо помилок немає то ...
            if (errors.length === 0) {
                // Додаємо нове авто в файл (БД)
                CarModel.addCar(car)
                // Після додавання перенаправляємо користувача на сторінку home де вже має з'явитися новий доданий елемент
                res.redirect('/cars/home');
            } else { 
                // Якщо помилки є то рендеримо внесені дані в поля форми а також помилки
                res.render('addCarForm', { car: {}, errors: [] });
            }
            
        } catch (error) {
            console.error('Error in Cars.addNewCarToList:', error);
        }
    }
    static getEditCarForm(req, res) {
        try {
            // Ловимо картку авто за її id - запитуючи (request) її параметр id (req.params.id) - отримуємо від користувача при натисненні
            const car = CarModel.getCarById(req.params.id)
            // Рендеримо ту саму форму, але передаємо в неї дані відловлених даних авто по його id
            res.render('addCarForm', {car})
        } catch (error) {
            console.error('Error in Cars.getEditCarForm:', error);
        }
    }
    static updateCarData(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try {
            // Так само як при створенні нового елемента і додавання картинки, при завантаженні нової картинки потрібно створ. новий об'єкт разом із картинкою
            const car = {
                imageSrc: req.file.filename, ...req.body
            }
            // Викликаємо метод оновлення авто, передаємо його id та нові дані + картинка
            CarModel.updateCarInfo(req.params.id, car);
            // повертаємо користувача на головну сторінку
            res.redirect('/cars/home');
        } catch (error) {
            console.error('Error in Cars.updateCarData:', error);
        }
    }
    static deleteCar(req, res) {
        // Викликаємо метод видалення
        CarModel.deleteCarById(req.body.id)
        res.send(200, 'ok')
        res.redirect('/cars/home')
    }
    
}


export default CarsController;
import { body } from 'express-validator'

class ProdValidator {
    static prodValidationRules = [
        body('name').notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long').trim().escape(),
        body('price').isInt({ min: 0 }).withMessage('Price must be a positive integer'),
        body('description').optional().trim().escape(),
        body('owner').optional().trim().escape(),
    ];
    static productSchema = {

        price: {
            notEmpty: {
                errorMessage: 'Price is required',
            },
            toInt: true,
        },
        name: {
            notEmpty: {
                errorMessage: 'Name is required',
            },
            trim: true, // Видаляє пробіли на початку і в кінці 
            escape: true, // Екранує HTML символи 
        },
    }
}

export default ProdValidator
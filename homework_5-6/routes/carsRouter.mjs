import { Router } from 'express'
import CarsController from '../controllers/carsController.mjs'
import UploadManager from '../utils/UploadManager.mjs';
import { checkSchema, validationResult } from 'express-validator';

const router = Router()
// Ініціалізуйте `upload` за допомогою `UploadManager`
const upload = UploadManager.getUploadStorage(); 

router.get('/home', CarsController.getHomePage);
router.get('/about', CarsController.getAboutPage);

router.get('/addNewCar', CarsController.createAddingForm);
router.post('/addNewCar',
    upload.single('carImage'),
    checkSchema(CarsController.infoSchema), CarsController.addNewCarToList
);

router.get('/edit/:id', CarsController.getEditCarForm);
// При збереженні нового елемента разом із новою картинкою, також потрібно використовувати multer
router.post('/edit/:id',
    upload.single('carImage'),
    checkSchema(CarsController.infoSchema),
    CarsController.updateCarData
);

router.delete('/', CarsController.deleteCar);


export default router  
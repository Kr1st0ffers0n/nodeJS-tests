import DataFileManager from '../utils/DataFileManager.mjs'

class CarModel {
    static loadCarsList() {
        try {
            return DataFileManager.loadData()
        } catch (error) {
            throw new Error("Can`t load the data");
        }
    }
    static addCar(carItem) {
        try {
            const carItems = DataFileManager.loadData()
            const newCar = {
                id: `${new Date().getTime()}`, ...carItem
            };
            DataFileManager.addItem(newCar)
        } catch (error) {
            throw new Error(`Помилка при додаванні авто: ${error.message}`);
        }
    }
    static getCarById(id) {
        try {
            return DataFileManager.getItemById(id)
        } catch (error) {
            console.error('Can`t get car from file:', error);
        }
    }
    static updateCarInfo(id, newInfo) {
        try {
            DataFileManager.updateItemById(id, newInfo)
        } catch (error) {
            console.error('Can`t update info:', error);
        }
    }
    static deleteCarById(id) {
        try {
            DataFileManager.deleteItemById(id);
        } catch (error) {
            console.error('Can`t delete the car:', error);
        }
    }
}

export default CarModel
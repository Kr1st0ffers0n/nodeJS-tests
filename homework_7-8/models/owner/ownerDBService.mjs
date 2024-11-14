import Owner from './owner.mjs'
import mongoose from 'mongoose'

class OwnerDBService {
    static async getList(filters) {
        try {
            const data = await Owner.find({});
            return data;
        } catch (error) {
            console.error("Error fetching owners", error);
            return [];
        }
    }
}

export default OwnerDBService
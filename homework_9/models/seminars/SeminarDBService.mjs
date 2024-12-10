import Seminar from './Seminar.mjs';
import MongooseCRUDManager from '../MongooseCRUDManager.mjs';

class SeminarsDBService extends MongooseCRUDManager {
  async getList(filters = {}) {
    try {
      const seminars = await Seminar.find(filters).populate('responsibleStudent');
      return seminars;
    } catch (error) {
      console.error("Error fetching seminars list:", error);
      return [];
    }
  }

  async getSeminarById(id) {
    try {
      const seminar = await Seminar.findById(id).populate('responsibleStudent');
      return seminar;
    } catch (error) {
      console.error("Error fetching seminar by ID:", error);
      return null;
    }
  }

  async createSeminar(seminarData) {
    try {
      const seminar = new Seminar(seminarData);
      await seminar.save();
      return seminar;
    } catch (error) {
      console.error("Error creating seminar:", error);
      return null;
    }
  }

  async updateSeminar(id, seminarData) {
    try {
      const updatedSeminar = await Seminar.findByIdAndUpdate(id, seminarData, { new: true });
      return updatedSeminar;
    } catch (error) {
      console.error("Error updating seminar:", error);
      return null;
    }
  }

  async deleteSeminar(id) {
    try {
      await Seminar.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error("Error deleting seminar:", error);
      return false;
    }
  }
}

export default new SeminarsDBService(Seminar);

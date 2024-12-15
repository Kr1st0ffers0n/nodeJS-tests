import mongoose from 'mongoose';
const { Schema } = mongoose;

const seminarSchema = new Schema({
  topic: {
    type: String,
    required: true
  },
  responsibleStudent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',  
    required: true
  },
  duration: {
    type: Number, 
    required: true
  }
});

const Seminar = mongoose.model('Seminar', seminarSchema);
export default Seminar;

import mongoose from 'mongoose';
const { Schema } = mongoose;

const seminarSchema = new Schema({
  topic: {
    type: String,
    required: true
  },
  responsibleStudent: {
    type: Schema.Types.ObjectId,
    ref: 'Student',  // посилання на модель студента
    required: true
  },
  duration: {
    type: Number, // тривалість семінару в годинах
    required: true
  }
});

const Seminar = mongoose.model('Seminar', seminarSchema);
export default Seminar;

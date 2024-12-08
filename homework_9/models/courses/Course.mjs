import mongoose from 'mongoose';
const { Schema } = mongoose;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,  // тривалість курсу в годинах
    required: true,
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student',  // посилання на модель студента
    required: true
  }],
  seminars: [{
    type: Schema.Types.ObjectId,
    ref: 'Seminar',  // посилання на модель семінару
    required: false
  }]
});

const Course = mongoose.model('Course', courseSchema);
export default Course;

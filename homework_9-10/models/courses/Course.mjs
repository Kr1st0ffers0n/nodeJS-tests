import mongoose from 'mongoose';

const { Schema } = mongoose;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,  
    required: true,
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student',  
    required: true
  }],
  seminars: [{
    type: Schema.Types.ObjectId,
    ref: 'Seminar'},]
});

const Course = mongoose.model('Course', courseSchema);
export default Course;

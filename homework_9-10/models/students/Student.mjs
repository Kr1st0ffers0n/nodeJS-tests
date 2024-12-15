import mongoose from 'mongoose'
const { Schema } = mongoose

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 14, 
  },
  averageGrade: {
    type: Number,
    min: 0,
    max: 100,
  }
})

const Student = mongoose.model('Student', studentSchema)
export default Student

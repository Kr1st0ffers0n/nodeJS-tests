import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must be at most 50 characters long'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'guest'],
    default: 'guest', 
  },
  permissions: {
    type: Object,
    default: {}
  }
}, { timestamps: true })

userSchema.pre('save', function (next) {
  if (this.isModified('role')) {
    // Присвоєння властивостей залежно від ролі
    switch (this.role) {
      case 'admin':
        this.permissions = {
          users: {
            read: true,
            add: true,
            edit: true,
            delete: true,
          },
          products: {
            read: true,
            add: true,
            edit: true,
            delete: true,
          },
        };
        break;

      case 'manager':
        this.permissions = {
          users: {
            read: true,
            add: false,
            edit: true,
            delete: false,
          },
          products: {
            read: true,
            add: true,
            edit: true,
            delete: false,
          },
        };
        break;

      case 'guest':
        this.permissions = {
          users: {
            read: false,
            add: false,
            edit: false,
            delete: false,
          },
          products: {
            read: true,
            add: false,
            edit: false,
            delete: false,
          },
        };
        break;

      default:
        this.permissions = {}; // На випадок помилкового значення role
    }
  }
  next();
});



const Type = mongoose.model('Type', userSchema)
export default Type
